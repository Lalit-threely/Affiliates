import express from 'express';
import * as AffiliateController from '../controllers/affiliate';
import { isAuth } from '../middleware/isAuth';

const router = express.Router();

// Affiliate routes
router.post('/', AffiliateController.createAffiliate);
router.get('/', AffiliateController.getAllAffiliates);
router.get('/:id', AffiliateController.getAffiliateById);
router.put('/', isAuth, AffiliateController.updateAffiliate);
router.delete('/:id', AffiliateController.deleteAffiliate);
router.get('/validate-access-code/:access_code', AffiliateController.validateAccessCode);

export default router; 