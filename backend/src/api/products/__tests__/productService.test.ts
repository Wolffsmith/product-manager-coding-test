import { StatusCodes } from "http-status-codes";
import type { Mock } from "vitest";

import type { Product } from "@/api/products/productModel";
import { ProductRepository } from "@/api/products/productRepository";
import { ProductService } from "@/api/products/productService";

vi.mock("@/api/products/productRepository");

describe("productService", () => {
  let productServiceInstance: ProductService;
  let productRepositoryInstance: ProductRepository;

  const mockProducts: Product[] = [
    {
      id: 1,
      name: "Product 1",
      available: true,
    },
    {
      id: 2,
      name: "Product 2",
      available: false,
    },
  ];

  beforeEach(() => {
    productRepositoryInstance = new ProductRepository();
    productServiceInstance = new ProductService(productRepositoryInstance);
  });

  describe("findById", () => {
    it("returns a product for a valid ID", async () => {
      // Arrange
      const testId = 1;
      const mockProduct = mockProducts.find((product) => product.id === testId);
      (productRepositoryInstance.findByIdAsync as Mock).mockReturnValue(
        mockProduct
      );

      // Act
      const result = await productServiceInstance.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toEqual("Product found");
      expect(result.responseObject).toEqual(mockProduct);
    });

    it("returns a not found error for non-existent ID", async () => {
      // Arrange
      const testId = Number.MAX_SAFE_INTEGER;
      (productRepositoryInstance.findByIdAsync as Mock).mockReturnValue(null);

      // Act
      const result = await productServiceInstance.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).toEqual("Product not found");
      expect(result.responseObject).toBeNull();
    });

    it("handles errors for findByIdAsync", async () => {
      // Arrange
      const testId = 1;
      (productRepositoryInstance.findByIdAsync as Mock).mockImplementation(
        () => {
          throw new Error("An error occurred while finding product.");
        }
      );

      // Act
      const result = await productServiceInstance.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toEqual(
        "An error occurred while finding product."
      );
      expect(result.responseObject).toBe;
    });
  });

  describe("create", () => {
    it("creates a new product", async () => {
      // Arrange
      const newProduct: Product = {
        id: 3,
        name: "Product 3",
        available: true,
      };
      (productRepositoryInstance.createAsync as Mock).mockReturnValue(
        newProduct
      );

      // Act
      const result = await productServiceInstance.create(newProduct);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toEqual("Product created");
      expect(result.responseObject).toEqual(newProduct);
    });

    it("handles errors for createAsync", async () => {
      // Arrange
      const newProduct: Product = {
        id: 3,
        name: "Product 3",
        available: true,
      };
      (productRepositoryInstance.createAsync as Mock).mockImplementation(() => {
        throw new Error("An error occurred while creating product.");
      });

      // Act
      const result = await productServiceInstance.create(newProduct);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toEqual(
        "An error occurred while creating product."
      );
      expect(result.responseObject).toBeNull();
    });
  });

  describe("delete", () => {
    it("deletes a product for a valid ID", async () => {
      // Arrange
      const testId = 2;
      (productRepositoryInstance.findByIdAsync as Mock).mockReturnValue(
        mockProducts[1]
      );
      (productRepositoryInstance.deleteAsync as Mock).mockReturnValue(
        mockProducts[1]
      );

      // Act
      const result = await productServiceInstance.delete(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toEqual("Product deleted");
      expect(result.responseObject).toEqual({
        id: 2,
        name: "Product 2",
        available: false,
      });
    });

    it("returns Product is available, cannot delete", async () => {
      // Arrange
      const testId = 1;
      (productRepositoryInstance.findByIdAsync as Mock).mockReturnValue(
        mockProducts[0]
      );
      (productRepositoryInstance.deleteAsync as Mock).mockReturnValue(
        mockProducts[0]
      );

      // Act
      const result = await productServiceInstance.delete(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(result.success).toBeFalsy();
      expect(result.message).toEqual("Product is available, cannot delete");
      expect(result.responseObject).toBeNull();
    });
  });

  describe("getProducts", () => {
    it("returns products with no filters", async () => {
      // Arrange
      (productRepositoryInstance.findAllAsync as Mock).mockReturnValue(
        mockProducts
      );

      // Act
      const result = await productServiceInstance.getProducts({});

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toEqual("Products found");
      expect(result.responseObject).toEqual(mockProducts);
    });

    it("returns filtered products by search term", async () => {
      // Arrange
      const search = "Product 1";
      const filteredProducts = mockProducts.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
      (productRepositoryInstance.findAllAsync as Mock).mockReturnValue(
        mockProducts
      );

      // Act
      const result = await productServiceInstance.getProducts({ search });

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toEqual("Products found");
      expect(result.responseObject).toEqual(filteredProducts);
    });

    it("returns sorted products by name", async () => {
      // Arrange
      const sortBy = "name";
      const sortedProducts = [...mockProducts].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      (productRepositoryInstance.findAllAsync as Mock).mockReturnValue(
        mockProducts
      );

      // Act
      const result = await productServiceInstance.getProducts({ sortBy });

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toEqual("Products found");
      expect(result.responseObject).toEqual(sortedProducts);
    });

    it("returns sorted products by availability", async () => {
      // Arrange
      const sortBy = "available";
      const sortedProducts = [...mockProducts].sort((a, b) =>
        a.available === b.available ? 0 : a.available ? -1 : 1
      );
      (productRepositoryInstance.findAllAsync as Mock).mockReturnValue(
        mockProducts
      );

      // Act
      const result = await productServiceInstance.getProducts({ sortBy });

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toEqual("Products found");
      expect(result.responseObject).toEqual(sortedProducts);
    });

    it("returns no products found when no products match search term", async () => {
      // Arrange
      const search = "Non-existent Product";
      (productRepositoryInstance.findAllAsync as Mock).mockReturnValue(
        mockProducts
      );

      // Act
      const result = await productServiceInstance.getProducts({ search });

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).toEqual("No products found");
      expect(result.responseObject).toBeNull();
    });

    it("handles errors for findAllAsync", async () => {
      // Arrange
      (productRepositoryInstance.findAllAsync as Mock).mockImplementation(
        () => {
          throw new Error("An error occurred while retrieving products.");
        }
      );

      // Act
      const result = await productServiceInstance.getProducts({});

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toEqual(
        "An error occurred while retrieving products."
      );
      expect(result.responseObject).toBeNull();
    });
  });
});
