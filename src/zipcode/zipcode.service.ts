import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

import { Zipcode } from '@prisma/client';

@Injectable()
export class ZipcodeService {
    constructor(private prisma: PrismaService) { }

    getZipcode(zipcode: string): Promise<Zipcode[]> {

        return this.prisma.zipcode.findMany({ 
            where: { postal: zipcode }
        })

    }


}