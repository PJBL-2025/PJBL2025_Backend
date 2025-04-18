import { NextFunction, Request, Response } from 'express';
import { BadRequestException, ErrorCode } from '../exceptions/http.exception';
import { UnprocessableEntry } from '../exceptions/validation.exception';
import bcrypt from 'bcryptjs';
import { prismaClient } from '../utils/db';

export const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prismaClient.users.findMany({
      select: {
        name: true,
        username: true,
        address: true,
      },
    });

    res.json({ status: 'success', data: users });
  } catch (err) {
    next(err);
  }
};

export const getOneUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.user_id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await prismaClient.users.findUnique({
      where: { id: userId },
      select: {
        name: true,
        username: true,
        address: true,
      },
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
    const userId = parseInt(req.params.user_id);
    const { name, username, password } = req.body;

    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    if (username) {
      const user = await prismaClient.users.findFirst({
        where: { username },
      });

      if (user && user.id !== userId) {
        return next(new BadRequestException('Username sudah ada', ErrorCode.USER_ALREADY_EXISTS));
      }
    }
  
    let updatedData: any = { name, username };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedData.password = await bcrypt.hash(password, salt);
    }

    await prismaClient.users.update({
      where: { id: userId },
      data: updatedData,
    });

    res.json({ status: 'success', message: 'data user berhasil di edit' });
  } catch (err: any) {
    next(new UnprocessableEntry(err.cause?.issues || err.message, 'Unprossable Entry', ErrorCode.UNPROCESSABLE_ENTITY));
  }
};



