"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAccessCode = exports.deleteAffiliate = exports.updateAffiliate = exports.getAffiliateById = exports.getAllAffiliates = exports.createAffiliate = void 0;
const Affiliate_1 = __importDefault(require("../models/Affiliate"));
const uuid_1 = require("uuid");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const createAffiliate = async (req, res, next) => {
    try {
        const affiliateData = req.body;
        // Generate access code if not provided
        if (!affiliateData.access_code) {
            affiliateData.access_code = (0, uuid_1.v4)().slice(0, 8);
        }
        // Hash password if provided
        if (affiliateData.password) {
            affiliateData.password = await bcryptjs_1.default.hash(affiliateData.password, 10);
        }
        const affiliate = await Affiliate_1.default.create(affiliateData);
        res.status(201).json({
            success: true,
            data: affiliate,
            message: 'Affiliate created successfully'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createAffiliate = createAffiliate;
const getAllAffiliates = async (req, res, next) => {
    try {
        const affiliates = await Affiliate_1.default.findAll({
            attributes: { exclude: ['password'] }
        });
        res.status(200).json({
            success: true,
            data: affiliates,
            message: 'Affiliates retrieved successfully'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllAffiliates = getAllAffiliates;
const getAffiliateById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const affiliate = await Affiliate_1.default.findByPk(id, {
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
    }
    catch (error) {
        next(error);
    }
};
exports.getAffiliateById = getAffiliateById;
const updateAffiliate = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        // Hash password if it's being updated
        if (updateData.password) {
            updateData.password = await bcryptjs_1.default.hash(updateData.password, 10);
        }
        const affiliate = await Affiliate_1.default.findByPk(id);
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
    }
    catch (error) {
        next(error);
    }
};
exports.updateAffiliate = updateAffiliate;
const deleteAffiliate = async (req, res, next) => {
    try {
        const { id } = req.params;
        const affiliate = await Affiliate_1.default.findByPk(id);
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
    }
    catch (error) {
        next(error);
    }
};
exports.deleteAffiliate = deleteAffiliate;
const validateAccessCode = async (req, res, next) => {
    try {
        const { access_code } = req.body;
        if (!access_code) {
            res.status(400).json({
                success: false,
                message: 'Access code is required'
            });
            return;
        }
        const affiliate = await Affiliate_1.default.findOne({
            where: { access_code },
            attributes: ['id', 'name', 'email', 'role', 'status']
        });
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
    }
    catch (error) {
        next(error);
    }
};
exports.validateAccessCode = validateAccessCode;
//# sourceMappingURL=affiliate.js.map