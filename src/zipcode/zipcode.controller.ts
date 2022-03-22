import { Controller, 
    Get, Logger, Param,
    NotAcceptableException } from '@nestjs/common';
import { ZipcodeService } from './zipcode.service';

import { Zipcode } from '@prisma/client';

@Controller('zipcode')
export class ZipcodeController {
    constructor(private readonly zipcodeService: ZipcodeService) { }

    @Get(':zipcode')
    async findZipcode(
        @Param('zipcode') zipcode: string,
    ): Promise<Zipcode[]> {

        const zipcodes = await this.zipcodeService.getZipcode(zipcode)

        // If no zipcodes found in our database
        if (!zipcodes || zipcodes.length == 0) {
            throw new NotAcceptableException('Please input a Singapore Postal Code')
        }

        return zipcodes
   
    }

}