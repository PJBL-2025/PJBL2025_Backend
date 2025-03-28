import { Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types/AuthRequest';

const prismaClient = new PrismaClient();

const authorize = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;

    const user = await prismaClient.users.findUnique({
      where: { id: decoded.userId },
      select: { id: true, username: true, role: true },
    });

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

const restrictToSelf = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if ( req.user?.role !== 'admin' && req.user?.id !== parseInt(req.params.id)) {
    return res.status(403).json({ message: 'Forbidden: You can only access your own account' });
  }
  next();
};

const adminAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admin access only' });
  }
  next();
};


export { authorize, restrictToSelf, adminAuth };
