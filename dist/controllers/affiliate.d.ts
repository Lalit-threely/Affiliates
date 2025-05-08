import { Request, Response, NextFunction } from 'express';
export declare const createAffiliate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getAllAffiliates: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getAffiliateById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateAffiliate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteAffiliate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const validateAccessCode: (req: Request, res: Response, next: NextFunction) => Promise<void>;
