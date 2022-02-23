import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

import { Product } from '@prisma/client';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    insertProduct(title: string, description: string, price: number): Promise<Product> {

        return this.prisma.product.create({
            data: {
                title: title,
                description: description,
                price: price
            }
        });
    }

    // getProducts() {
    //     return [...this.products]
    // }

    // getProduct(productId: string) {
    //     const product = this.findProduct(productId)[0];
    //     return product
    // }

    // updateProduct(productId: string, productDescription: string, productTitle: string, productPrice: number) {
    //     const [product, productIndex] = this.findProduct(productId);
    //     const updatedProduct = { ...product };
    //     if (productTitle) {
    //         updatedProduct.title = productTitle
    //     }
    //     if (productDescription) {
    //         updatedProduct.description = productDescription
    //     }
    //     if (productPrice) {
    //         updatedProduct.price = productPrice
    //     }
    //     Logger.log({ updatedProduct, productIndex })
    //     this.products[productIndex] = updatedProduct

    // }

    // private findProduct(productId: string): [Product, number] {
    //     const productIndex = this.products.findIndex((prod) => prod.id == productId);
    //     const product = this.products[productIndex]
    //     if (!product) {
    //         throw new NotFoundException('Could not find product')
    //     }
    //     return [product, productIndex];
    // }

    // deleteProduct(productId: string) {
    //     const [_, productIndex] = this.findProduct(productId);
    //     this.products.splice(productIndex, 1);
    // }
}