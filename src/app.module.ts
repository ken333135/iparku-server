import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

/**
 * Modules
 */
import { ProductsModule } from './products/products.module';
import { CarparkModule } from './carpark/carpark.module';

/**
 * Services
 */
import { AppService } from './app.service';

@Module({
  imports: [ProductsModule, CarparkModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
