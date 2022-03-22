import { Module } from '@nestjs/common';

import { ZipcodeController } from './zipcode.controller';
import { ZipcodeService } from './zipcode.service';
import { PrismaService } from '../prisma.service';

@Module({
    controllers: [ZipcodeController],
    providers: [ZipcodeService, PrismaService],
})
export class ZipcodeModule {} 
