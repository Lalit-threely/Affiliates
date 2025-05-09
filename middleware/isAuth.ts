import { Request, Response, NextFunction } from 'express';

export const isAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.session && req.session.user) {
    // Proceed if user is authenticated
    next();
  } else {
    // Redirect to login or send an unauthorized response
    res.status(401).json({ message: 'Unauthorized' });
  }
};
