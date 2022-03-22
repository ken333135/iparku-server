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
        
        // Sorts carpark by pythagorean distance desc 
        carparks = carparks.sort((a,b) => {

            const a_pythagorean_distance =  ( ( x_coord - a.x_coord ) ** 2  + ( y_coord - a.y_coord ) ** 2 ) ** 0.5 
            const b_pythagorean_distance =  ( ( x_coord - b.x_coord ) ** 2  + ( y_coord - b.y_coord ) ** 2 ) ** 0.5 

            if (b_pythagorean_distance - a_pythagorean_distance < 0) { 
                return 1
            }
            if (b_pythagorean_distance - a_pythagorean_distance > 0) { 
                return -1
            }
            return 0
        })  

        return carparks

    }

    async getCarParkLotsByIds(car_park_nos: string[]) {

        console.log({car_park_nos})

        // Check for data in postgres
        let lots = await this.prisma.lots.findMany({
            where: {
                car_park_no: { in: car_park_nos }
            }
        })

        Logger.log({lots})

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