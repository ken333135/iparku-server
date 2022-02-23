import { Controller, 
    Get, Logger, Query } from '@nestjs/common';
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

                
            Logger.log({
                x_coord,
                y_coord,
                radius,
                parsed_x_coord,
                parsed_y_coord,
                parsed_radius
            })

            const nearbyCarparks = await this.carparkService.getCarPark(
                parsed_x_coord,
                parsed_y_coord,
                parsed_radius
            )

            Logger.log({nearbyCarparks})

            const avail = await this.carparkService.getCarparkAvailabilityData()

            Logger.log(JSON.stringify(avail,null,2))

            return nearbyCarparks
        }
        catch(e) {
            Logger.error(e)
        }
    }

}