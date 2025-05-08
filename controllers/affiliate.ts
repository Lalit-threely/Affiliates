import { Request, Response, NextFunction } from 'express';
import Affiliate, { AffiliateAttributes } from '../models/Affiliate';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { Model } from 'sequelize';

export const createAffiliate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const affiliateData: AffiliateAttributes = req.body;
    
    // Generate access code if not provided
    if (!affiliateData.access_code) {
      affiliateData.access_code = uuidv4().slice(0, 8);
    }

    // Hash password if provided
    if (affiliateData.password) {
      affiliateData.password = await bcrypt.hash(affiliateData.password, 10);
    }

    const affiliate = await Affiliate.create(affiliateData);
    res.status(201).json({
      success: true,
      data: affiliate,
      message: 'Affiliate created successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAffiliates = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const affiliates = await Affiliate.findAll({
      attributes: { exclude: ['password'] }
    });
    res.status(200).json({
      success: true,
      data: affiliates,
      message: 'Affiliates retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getAffiliateById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const affiliate = await Affiliate.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    if (!affiliate) {
      res.status(404).json({
        success: false,
        message: 'Affiliate not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: affiliate,
      message: 'Affiliate retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const updateAffiliate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Hash password if it's being updated
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const affiliate = await Affiliate.findByPk(id);
    if (!affiliate) {
      res.status(404).json({
        success: false,
        message: 'Affiliate not found'
      });
      return;
    }

    await affiliate.update(updateData);
    res.status(200).json({
      success: true,
      data: affiliate,
      message: 'Affiliate updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAffiliate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const affiliate = await Affiliate.findByPk(id);

    if (!affiliate) {
      res.status(404).json({
        success: false,
        message: 'Affiliate not found'
      });
      return;
    }

    await affiliate.destroy();
    res.status(200).json({
      success: true,
      message: 'Affiliate deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const validateAccessCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { access_code } = req.body;

    if (!access_code) {
      res.status(400).json({
        success: false,
        message: 'Access code is required'
      });
      return;
    }

    const affiliate = await Affiliate.findOne({
      where: { access_code },
      attributes: ['id', 'name', 'email', 'role', 'status']
    }) as Model<AffiliateAttributes>;

    if (!affiliate) {
      res.status(404).json({
        success: false,
        message: 'Invalid access code'
      });
      return;
    }

    const affiliateData = affiliate.get();
    if (affiliateData.status !== 'active') {
      res.status(403).json({
        success: false,
        message: 'Affiliate account is not active'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: affiliateData,
      message: 'Access code is valid'
    });
  } catch (error) {
    next(error);
  }
};

