import { NextFunction, Request, Response } from 'express';
import { prismaClient } from '../utils/db';
import { UnprocessableEntry } from '../exceptions/validation.exception';
import { BadRequestException, ErrorCode } from '../exceptions/http.exception';

export const getAddressByUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.user_id);
    const address = await prismaClient.addresses.findMany({
      where: { user_id: userId },
    });

    if (!address || address.length === 0) {
      return res.status(404).send({ success: false, message: 'No address found with this user' });
    }

    res.json({ success: true, data: address });
  } catch (err: any) {
    next(new UnprocessableEntry(err.cause?.issues || err.message, 'Unprocessable Entry', ErrorCode.UNPROCESSABLE_ENTITY));
  }
};

export const createAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { address, zip_code, destination_code, receiver_area } = req.body;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const user_id = parseInt(req.params.user_id);

    const addressData = await prismaClient.addresses.create({
      data: {
        address,
        zip_code,
        destination_code,
        receiver_area,

        user: {
          connect: {
            id: user_id,
          },
        },
      },
    });

    res.json({ success: true, data: addressData });
  } catch (err: any) {
    next(new UnprocessableEntry(err.cause?.issues || err.message, 'Unprocessable Entry', ErrorCode.UNPROCESSABLE_ENTITY));
  }
};

export const updateAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const addressId = parseInt(req.params.id);
    const addressData = req.body;

    const userId = parseInt(req.params.user_id);

    const isAddress = await prismaClient.addresses.findFirst({
      where: { id: addressId, user_id: userId },
    });

    if (!isAddress) {
      return next(new BadRequestException('Address not found', ErrorCode.USER_NOT_FOUND));
    }

    const address = await prismaClient.addresses.update({
      where: { id: addressId },
      data: addressData,
    });

    res.json({ success: true, data: address });
  } catch (err: any) {
    next(new UnprocessableEntry(err.cause?.issues || err.message, 'Unpressable Entry', ErrorCode.UNPROCESSABLE_ENTITY));
  }
};

export const deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const addressId = parseInt(req.params.id);

    const userId = parseInt(req.params.user_id);

    const isAddress = await prismaClient.addresses.findFirst({
      where: { id: addressId, user_id: userId },
    });

    if (!isAddress) {
      return next(new BadRequestException('Address not found', ErrorCode.USER_NOT_FOUND));
    }

    await prismaClient.addresses.delete({
      where: { id: addressId },
    });

    res.json({ success: true, data: 'address deleted successfully.' });
  } catch (err: any) {
    next(new UnprocessableEntry(err.cause?.issues || err.message, 'Unpressable Entry', ErrorCode.UNPROCESSABLE_ENTITY));
  }
};
