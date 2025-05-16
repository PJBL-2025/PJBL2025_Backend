import { Request, Response, NextFunction } from "express";
import { prismaClient } from "../utils/db";
import { faker } from "@faker-js/faker";

export const getBanner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await prismaClient.products.findMany()

        const today = new Date()
        const dateSeed = parseInt(`${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`)
        faker.seed(dateSeed)

        const randomProduct = faker.helpers.arrayElements(product, 5)

        res.json({success: true, data: randomProduct})
    } catch (err) {
        next(err)
    }
}