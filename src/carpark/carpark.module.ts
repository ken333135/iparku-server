import { Module } from '@nestjs/common';

import { CarparkController } from './carpark.controller';
import { CarparkService } from './carpark.service';
import { PrismaService } from '../prisma.service';

@Module({
    controllers: [CarparkController],
    providers: [CarparkService, PrismaService],
})
export class CarparkModule {} 
