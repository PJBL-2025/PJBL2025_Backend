import { NextFunction, Request, Response } from 'express';
import { BadRequestException, ErrorCode } from '../exceptions/http.exception';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';
import { UnprocessableEntry } from '../exceptions/validation.exception';
import { prismaClient } from '../utils/db';

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, username, password } = req.body;

    const user = await prismaClient.users.findFirst({
      where: { username },
    });

    if (user) {
      return next(new BadRequestException('User Already Exist', ErrorCode.USER_ALREADY_EXISTS));
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await prismaClient.users.create({
      data: {
        name,
        username,
        password: hashPassword,
      },
    });

    const token = jwt.sign({ userId: newUser.id, role: newUser.role }, JWT_SECRET as string,);

    res.json({
      message: 'success',
      token: token,
    });
  } catch (err: any) {
    next(new UnprocessableEntry(err.cause?.issues || err.message, 'Unprocessable Entry', ErrorCode.UNPROCESSABLE_ENTITY));
  }
};

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    const user = await prismaClient.users.findFirst({
      where: { username },
    });

    if (!user) {
      return next(new BadRequestException('User not found', ErrorCode.USER_NOT_FOUND));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return next(new BadRequestException('Invalid Password', ErrorCode.INCORRECT_PASSWORD));
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET as string);
    res.json({
      message: 'success',
      token: token,
    });
  } catch (err: any) {
    next(new UnprocessableEntry(err.cause?.issues || err.message, 'Unprocessable Entry', ErrorCode.UNPROCESSABLE_ENTITY));
  }
};

export const signOut = async (req: Request, res: Response, next: NextFunction) => {
  try {

  } catch (err) {

  }
};