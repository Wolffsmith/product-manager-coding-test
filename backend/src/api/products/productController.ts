import type { Request, RequestHandler, Response } from "express";

import { productService } from "@/api/products/productService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

class ProductController {
  public getProducts: RequestHandler = async (req: Request, res: Response) => {
    const { search, sortBy, available } = req.query;

    const serviceResponse = await productService.getProducts({
      search: search as string,
      sortBy: sortBy as string,
    });

    return handleServiceResponse(serviceResponse, res);
  };

  public getProduct: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await productService.findById(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public createProduct: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const { name, available, id } = req.body;

    if (!name || !available) {
      return res
        .status(400)
        .json({ message: "Name and available are required" });
    }

    const serviceResponse = await productService.create({
      id,
      name,
      available,
    });
    return handleServiceResponse(serviceResponse, res);
  };

  public deleteProduct: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await productService.delete(id);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const productController = new ProductController();
