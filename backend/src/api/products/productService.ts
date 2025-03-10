import { StatusCodes } from "http-status-codes";

import { Product } from "./productModel";
import { ProductRepository } from "@/api/products/productRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class ProductService {
  private productRepository: ProductRepository;

  constructor(repository: ProductRepository = new ProductRepository()) {
    this.productRepository = repository;
  }
  async findAll(): Promise<ServiceResponse<Product[] | null>> {
    try {
      const products = await this.productRepository.findAllAsync();
      if (!products || products.length === 0) {
        return ServiceResponse.failure(
          "No products found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<Product[]>("Products found", products);
    } catch (ex) {
      const errorMessage = `Error finding all products: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving products.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findById(id: number): Promise<ServiceResponse<Product | null>> {
    try {
      const product = await this.productRepository.findByIdAsync(id);
      if (!product) {
        return ServiceResponse.failure(
          "Product not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<Product>("Product found", product);
    } catch (ex) {
      const errorMessage = `Error finding product with id ${id}:, ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding product.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async search(query: string): Promise<ServiceResponse<Product[] | null>> {
    try {
      const products = await this.productRepository.searchAsync(query);
      if (!products || products.length === 0) {
        return ServiceResponse.failure(
          "No products found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<Product[]>("Products found", products);
    } catch (ex) {
      const errorMessage = `Error searching for products: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while searching for products.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async create(product: Product): Promise<ServiceResponse<Product | null>> {
    try {
      const newProduct = await this.productRepository.createAsync(product);
      return ServiceResponse.success<Product>("Product created", newProduct);
    } catch (ex) {
      const errorMessage = `Error creating product: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating product.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async delete(id: number): Promise<ServiceResponse<Product | null>> {
    try {
      const product = await this.productRepository.findByIdAsync(id);

      if (!product) {
        return ServiceResponse.failure(
          "Product not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }

      if (product.available) {
        return ServiceResponse.failure(
          "Product is available, cannot delete",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      const deletedProduct = await this.productRepository.deleteAsync(id);
      if (!deletedProduct) {
        return ServiceResponse.failure(
          "Product not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<Product>(
        "Product deleted",
        deletedProduct
      );
    } catch (ex) {
      const errorMessage = `Error deleting product with id ${id}: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while deleting product.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const productService = new ProductService();
