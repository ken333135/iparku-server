import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
const axios = require('axios');

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

    async getCarparkAvailabilityData(): Promise<any> {

        const carparkAvailability = await axios({
            method: 'get',
            url: 'https://api.data.gov.sg/v1/transport/carpark-availability',
        })

        return carparkAvailability.data

    }



}