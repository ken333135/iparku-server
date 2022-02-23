import { Controller, Post, Body, Param, Get, Logger } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    // @Get()
    // getAllProducts(): any {
    //     Logger.log("IN HERE")
    //     return this.productsService.getProducts();
    // }

    // @Get(':id')
    // getProduct(@Param('id') prodId: string) {
    //     Logger.log({ prodId })
    //     // return this.productsService.getProduct(prodId)
    // }

    @Post()
    async addProduct(
        @Body('title') prodTitle: string,
        @Body('description') prodDescription: string,
        @Body('price') prodPrice: number,
    ): Promise<any> {

        try {
            const newProduct = await this.productsService.insertProduct(
                prodTitle,
                prodDescription,
                prodPrice,
            );
            return { newProduct };

        }
        catch(e){
            console.log({e})
        }
    }

    // @Patch(':id')
    // updateProduct(
    //     @Param('id') prodId: string,
    //     @Body('title') title: string,
    //     @Body('description') description: string,
    //     @Body('price') price: number,
    // ) {
    //     Logger.log({ prodId, title, description, price })
    //     this.productsService.updateProduct(prodId, description, title, price)
    //     return null
    // }

    // @Delete(':id')
    // deleteProduct(
    //     @Param('id') prodId: string
    // ) {
    //     this.productsService.deleteProduct(prodId);
    //     return null;
    // }
}
