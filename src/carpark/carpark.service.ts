import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as moment from "moment";
import axios  from 'axios';

import { Carpark } from '@prisma/client';

@Injectable()
export class CarparkService {
    constructor(private prisma: PrismaService) { }

    getCarparkById(car_park_no: string): Promise<Carpark> {

        return this.prisma.carpark.findUnique({ 
            where: { car_park_no: car_park_no }
        })

    }

    async getCarPark(x_coord: number, y_coord: number, radius: number): Promise<Carpark[]> {

        const radiusInDeg = radius;    
        const xMin = x_coord - radiusInDeg,
            xMax = x_coord + radiusInDeg,
            yMin = y_coord - radiusInDeg,
            yMax = y_coord + radiusInDeg;

        Logger.log({
            xMin, xMax, yMin, yMax
        })

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

    async getCarparkAvailabilityData(): Promise<any> {

        // Check for data in postgres
       
        const carparkAvailability = await axios({
            method: 'get',
            url: 'https://api.data.gov.sg/v1/transport/carpark-availability',
        })

        if (carparkAvailability) {
            // Logger.log({ data: carparkAvailability.data.items })
            // Logger.log({ data: carparkAvailability.data.items[0].carpark_data[0] })
        }

        // If data exists
        if (carparkAvailability.data.items[0].carpark_data[0]) {
            // delete all old data
            await this.prisma.lots.deleteMany({
                where: {}
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



}