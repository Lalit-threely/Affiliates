import { Request, Response, NextFunction } from 'express';
import Affiliate, { AffiliateAttributes, AffiliateRole } from '../models/Affiliate';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { Model } from 'sequelize';
import { createAffiliateUser} from '../services/affiliate';
import { getDefaultTag } from '../utils/constants';
import httpStatus from 'http-status';

export const createAffiliate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const affiliateData: AffiliateAttributes = req.body;
    // const userData = req.session.user;
    const userData = {
      id:1234,
      name: 'Tria Admin',
      email: 'admin@tria.so',
      verified: true,
    };

    // Set default tag for role if not provided
    if (!affiliateData.tag) {
      affiliateData.tag = getDefaultTag(affiliateData.role as AffiliateRole);
    }

    const affiliate = await createAffiliateUser(affiliateData,userData);
    const { status } = affiliate.response;
    const { message, data } = affiliate.response;
    res.status(affiliate.statusCode).send({ status, message, data });
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
    const userData = req.session.user;
    const updateData = req.body;
    // Only allow updates to name and tria_name
    const allowedFields = ['name', 'tria_name'];
    const filteredUpdateData: Partial<AffiliateAttributes> = {};
    
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        filteredUpdateData[key as keyof AffiliateAttributes] = updateData[key];
      }
    });

    if (Object.keys(filteredUpdateData).length === 0) {
      res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
      return;
    }

    const affiliate = await Affiliate.findByPk(userData.id);
    if (!affiliate) {
      res.status(404).json({
        success: false,
        message: 'Affiliate not found'
      });
      return;
    }

    await affiliate.update(filteredUpdateData);
    
    // Update session with new name if it was changed
    if (filteredUpdateData.name) {
      req.session.user.name = filteredUpdateData.name;
    }

    res.status(200).json({
      success: true,
      data: affiliate,
      message: 'Profile updated successfully'
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
    const  access_code   = req.query.access_code  as string;

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

