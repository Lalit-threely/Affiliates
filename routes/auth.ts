import express from 'express';
import * as authController from '../controllers/auth';


const router = express.Router();

router.post('/set-password', authController.setPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/verify-password', authController.verifyPassword);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authController.userSessionCheck);
router.get('/test-rate-limit', (req, res) => {
  res.send('succcess');
});

export default router;
