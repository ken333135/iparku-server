import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as moment from "moment";
import axios  from 'axios';

import { Carpark, CarparkPrivate } from '@prisma/client';

@Injectable()
export class CarparkService {
    constructor(private prisma: PrismaService) { }

    getCarparkById(car_park_no: string): Promise<Carpark> {

        return this.prisma.carpark.findUnique({ 
            where: { car_park_no: car_park_no }
        })

    }

    async getCarParkPrivate(x_coord: number, y_coord: number, radius: number): Promise<CarparkPrivate[]> {

        const radiusInDeg = radius;    
        const xMin = x_coord - radiusInDeg,
            xMax = x_coord + radiusInDeg,
            yMin = y_coord - radiusInDeg,
            yMax = y_coord + radiusInDeg;
    
        // Finds all carparks within radius
        const carparksPrivate = await this.prisma.carparkPrivate.findMany({
            where: {
                x_coord: {
                    gte: xMin,
                    lte: xMax
                },
                y_coord: {
                    gte: yMin,
                    lte: yMax
                },
            }
        })

        const carparksPrivateWithDistance: any[] = carparksPrivate.map(_carpark => {
            const newCarpark = {
                ..._carpark,
                distance: ( ( x_coord - _carpark.x_coord ) ** 2  + ( y_coord - _carpark.y_coord ) ** 2 ) ** 0.5
            }
            return newCarpark
        }).sort((a,b) => {

            if (b.distance - a.distance < 0 ) {
                return 1
            }
            if (b.distance - a.distance > 0 ) {
                return -1
            }
            return 0

        })

        return carparksPrivateWithDistance

    }

    async getCarPark(x_coord: number, y_coord: number, radius: number): Promise<Carpark[]> {

        const radiusInDeg = radius;    
        const xMin = x_coord - radiusInDeg,
            xMax = x_coord + radiusInDeg,
            yMin = y_coord - radiusInDeg,
            yMax = y_coord + radiusInDeg;

        // Finds all carparks within radius
        let carparks = await this.prisma.carpark.findMany({
            where: {
                x_coord: {
                    gte: xMin,
                    lte: xMax
                },
                y_coord: {
                    gte: yMin,
                    lte: yMax
                },
            },
            include: {
                rates: true
            }
        })

        let carparksWithDistance: any[] = carparks.map(_carpark => {
            const newCarpark = {
                ..._carpark,
                distance: ( ( x_coord - _carpark.x_coord ) ** 2  + ( y_coord - _carpark.y_coord ) ** 2 ) ** 0.5
            }
            return newCarpark
        }).sort((a,b) => {

            if (b.distance - a.distance < 0 ) {
                return 1
            }
            if (b.distance - a.distance > 0 ) {
                return -1
            }
            return 0

        })
        

        const postgresDateTime = moment().set('month', 0).set('date', 1).add(8, 'hour').toDate()

        /* Clean ratesn data for each lot */
        carparksWithDistance = carparksWithDistance.map(_carpark => {
            const rates = _carpark.rates
            /* if no rates then return */
            if (rates.length === 0) { return _carpark }
            /* find the correct rates if multiple rates present */
            const filteredRates = rates.filter(_rate => {
                return moment(_rate.from).isBefore(moment(postgresDateTime))
            }).sort((a,b) => {

                if (moment(b.from).isBefore(a.from)) {
                    return 1
                }
                if (moment(b.from).isAfter(a.from)) {
                    return -1
                }
                return 0
    
            })[0]
            
            _carpark.rates = filteredRates
            return _carpark
        })
        
        

        return carparksWithDistance

    }

    async getCarParkLotsByIds(car_park_nos: string[]) {

        // Check for data in postgres
        let lots = await this.prisma.lots.findMany({
            where: {
                car_park_no: { in: car_park_nos }
            }
        })

        const TEN_MIN = 10 * 60 * 1000;
        const now:any = new Date()
        const update_datetime:any = lots.length > 0 && new Date(lots[0].update_datetime)

        // If lots data not found or too outdated
        // Pull new data from API
        if (lots.length == 0 || (now - update_datetime > TEN_MIN )) {
            Logger.log("going to get avail data")
            await this.getCarparkAvailabilityData()
            await this.getCarparkPrivateAvailabilityData()
            lots = await this.prisma.lots.findMany({
                where: {
                    car_park_no: { in: car_park_nos }
                }
            })
        }

        return lots
    }

    async getCarparkRates(car_park_nos: string[]) {

        const now = moment().set('month',0).set('date',1).add(8, 'hour').toDate()
        
        // Get rates data
        const rates = await this.prisma.rate.findMany({
            where: {
                car_park_no: { in: car_park_nos },
                from: {
                    lte: now
                },
                // to: {
                //     gte: now
                // }
            },
    
        })

        return rates

    }

    async getCarparkRate(car_park_no: string) {

        const now = moment().set('month',0).set('date',1).add(8, 'hour').toDate()
        
        // Get rates data
        const rate = await this.prisma.rate.findFirst({
            where: {
                car_park_no: car_park_no,
                from: {
                    lte: now
                },
            },
            orderBy: {
                from: 'desc'
            }
        })

        return rate

    }

    async getCarparkPrivateAvailabilityData(): Promise<any> {

        /* Get new Token */
        const token = await axios({
            method: 'get',
            url: 'https://www.ura.gov.sg/uraDataService/insertNewToken.action',
            headers: {
                'AccessKey': 'da02f9a0-5928-4075-93fb-d80ec54c5f71',
                'Token': '4G87fju3xMG-75fd75KeNfGH9Hnn94KsME04V2-1bUXa4@X-dM--9b73jw@T8dN2RXSGcW7qn70-T907rM5r904cX0hSk-h5UNx9'
            }
        })
        const result = token.data.Result

        /* Get available lots from URA */
        const dataResponse = await axios({
            method: 'get',
            url: 'https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Availability',
            headers: {
                'AccessKey': 'da02f9a0-5928-4075-93fb-d80ec54c5f71',
                'Token': result
            }
        })

        const getCarparkPrivateAvailabilityData = dataResponse.data.Result

        // If data exists
        if (getCarparkPrivateAvailabilityData) {

            const carparkListToDelete = getCarparkPrivateAvailabilityData.map(_c => _c.car_park_no)

            // delete all old data
            await this.prisma.lots.deleteMany({
                where: { 
                    car_park_no: { in: carparkListToDelete }
                }
            })

            const lots = getCarparkPrivateAvailabilityData.map(_data => {
                return {
                    car_park_no: _data.carparkNo,
                    // total_lots: parseInt(_data.carpark_info[0].total_lots),
                    lot_type: _data.lotType,
                    lots_available: parseInt(_data.lotsAvailable),
                    update_datetime: moment().toDate()
                }
            })

            // add new data
            await this.prisma.lots.createMany({ 
                data: lots
            })
        }

        return
    }

    async getCarparkAvailabilityData(): Promise<any> {

        // Check for data in postgres
       
        const carparkAvailability = await axios({
            method: 'get',
            url: 'https://api.data.gov.sg/v1/transport/carpark-availability',
        })

        // If data exists
        if (carparkAvailability.data.items[0].carpark_data[0]) {

            const carparkListToDelete = carparkAvailability.data.items[0].carpark_data.map(_data => _data.carpark_number )
            // delete all old data
            await this.prisma.lots.deleteMany({
                where: { 
                    car_park_no: { in: carparkListToDelete }
                }
            })

            Logger.log("after elete")
            const lots = carparkAvailability.data.items[0].carpark_data.map(_data => {
                return {
                    car_park_no: _data.carpark_number,
                    total_lots: parseInt(_data.carpark_info[0].total_lots),
                    lot_type: _data.carpark_info[0].lot_type,
                    lots_available: parseInt(_data.carpark_info[0].lots_available),
                    update_datetime: moment(_data.update_datetime).toDate()
                }
            })

            // Logger.log({lots})

            // add new data
            await this.prisma.lots.createMany({ 
                data: lots
            })
        }

        return

    }

    async getCarparksPredictedAvailability(car_park_nos: string[]): Promise<any> {

        const predictedAvailability = await Promise.all(car_park_nos.map(async car_park_no => {
            const availability = await this.getCarparkPredictedAvailability(car_park_no)
            return { 
                car_park_no: car_park_no,
                predictedAvailability: availability
            }
        }))

        const predictedDict = predictedAvailability.reduce((acc,cur) => {
            acc[cur.car_park_no] = cur.predictedAvailability
            return acc
        },{})

        return predictedDict

    }



    async getCarparkPredictedAvailability(car_park_no: string): Promise<any> {

        const bucket_name = 'carpark-api-buckets-2022'
        const key =  'conversion/conversion.csv'
        const hour = moment().hour()

        const data = {
            'accesskey': 'AKIA345RDVV2CUWRW2O3',
            'secretkey': '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', 
            'bucket':bucket_name,
            'key':key ,
            'car_park_no': car_park_no, 
            'hour': hour
        }

        const headers = {
            'Content-type': "application/json",
        }

        try {
            const predictedAvailability = await axios({
                method: 'post',
                url: "https://f9r60nazuk.execute-api.us-east-1.amazonaws.com/dev/predict",
                headers,
                data,
            })

            console.log({predictedAvailability: predictedAvailability.data})
            return predictedAvailability.data

        }
        catch(e) {
            return 9999
        }
   
    }



}