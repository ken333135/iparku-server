import { Controller, 
    Get, Logger, Param, Query } from '@nestjs/common';
import { response } from 'express';
import { CarparkService } from './carpark.service';

@Controller('carpark')
export class CarparkController {
    constructor(private readonly carparkService: CarparkService) { }

    @Get()
    async findNearbyCarpark(
        @Query('x_coord') x_coord: string,
        @Query('y_coord') y_coord: string,
        @Query('radius') radius: string,
    ): Promise<any> {

        try {

            const parsed_x_coord = parseFloat(x_coord),
                parsed_y_coord = parseFloat(y_coord),
                parsed_radius = parseFloat(radius);

            let nearbyCarparks = await this.carparkService.getCarPark(
                parsed_x_coord,
                parsed_y_coord,
                parsed_radius
            )

            const car_park_nos = nearbyCarparks.map(_carpark => _carpark.car_park_no)

            /* Find available lots data */
            const avail = await this.carparkService.getCarParkLotsByIds(car_park_nos)
            const availDict = avail.reduce((acc,cur) => {
                acc[cur.car_park_no] = cur
                return acc
            },{})

            /* Append available lots data */
            nearbyCarparks = nearbyCarparks.map(_carpark => {

                const total_lots = availDict[_carpark.car_park_no]?.total_lots
                const lots_available = availDict[_carpark.car_park_no]?.lots_available

                const tempCarpark = {
                    ..._carpark,
                    total_lots,
                    lots_available
                }

                return tempCarpark
            })

            return nearbyCarparks
        }
        catch(e) {
            Logger.error(e)
        }
    }

    @Get('/lots/:car_park_no')
    async getLots(
        @Param('car_park_no') car_park_no: string
    ): Promise<any> {

        try {

            const lots = await this.carparkService.getCarParkLotsByIds([car_park_no])

            return lots

        }
        catch(e) {
            Logger.error(e)
        }
    }

}