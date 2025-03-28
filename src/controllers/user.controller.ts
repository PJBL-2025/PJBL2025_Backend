import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { BadRequestException, ErrorCode } from '../exceptions/http.exception';
import { UnprocessableEntry } from '../exceptions/validation.exception';
import bcrypt from 'bcryptjs';

const prismaClient = new PrismaClient();

export const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prismaClient.users.findMany({});

    res.json({ status: 'success', data: users });
  } catch (err) {
    next(err);
  }
};

export const getOneUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id);

    const user = await prismaClient.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return next(new BadRequestException('User does not exist', ErrorCode.USER_NOT_FOUND));
    }

    res.json({ status: 'success', data: user });
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id);
    const { name, username, password } = req.body;

    const user = await prismaClient.users.findFirst({
      where: {
        username,
        id: { not: userId },
      },
    });

    if (user) {
      return next(new BadRequestException('Username sudah ada', ErrorCode.USER_ALREADY_EXISTS));
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    await prismaClient.users.update({
      where: { id: userId },
      data: {
        name,
        username,
        password: hashPassword,
      },
    });

    res.json({ status: 'success', message: 'data user berhasil di edit' });
  } catch (err: any) {
    next(new UnprocessableEntry(err.cause?.issues || err.message, 'Unprossable Entry', ErrorCode.UNPROCESSABLE_ENTITY));
  }
};



