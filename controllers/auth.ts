import { Request, Response, NextFunction } from 'express';
import Affiliate from '../models/Affiliate';
import bcrypt from 'bcryptjs';
import CodeEmailExpiration from '../models/CodeEmailExpiration';
import { decodeData, encodeData, generateCode } from '../utils/helper/helperFunctions';
import { sendMemberVerificationEmail } from '../services/email';
import httpStatus from 'http-status';
// import ChangeLog from '../models/ChangeProfileLogs';

export const setPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code: encodeData, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res
        .status(400)
        .send({ success: false, message: 'Password does not match' });
    }
    const { email, code } = decodeData(encodeData) as { email: string, code: string };
    const codeData = await CodeEmailExpiration.findOne({
      where: { email, code },
    });
    if (!codeData) {
      return res.status(401).json({ success: false, message: 'Invalid Code' });
    }

    // Check if the code is expired
    const currentTime = new Date();
    if (currentTime > codeData.expiration_time) {
      return res
        .status(401)
        .json({ success: false, message: 'Code has expired' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await Affiliate.update(
      { password: hashedPassword, verified: true , status: 'active'},
      {
        where: { email },
      }
    );
    // Fetch the updated user details
    const userData = await Affiliate.findOne({
      where: { email },
      attributes: {
        exclude: [
          'password',
          'verified',
          'createdAt',
          'updatedAt',
          'deletedAt',
        ],
      },
    });
    const user = userData?.get();;
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }
    await CodeEmailExpiration.destroy({ where: { email } });

    // Store the user details in the session

    if (!req.session) {
      req.session = {};
    }
   
    req.session.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      access_code: user.access_code,
    };
    return res.status(200).send({
      success: true,
      message: 'Password Set Successfully',
      data: { ...user },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .send({ success: false, message: 'Email and password are required' });
    }
    const userData = await Affiliate.findOne({
      where: { email },
      attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
    });
    const user = userData?.get();
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }
    if(!user.password){
      return res
        .status(400)
        .json({ success: false, message: 'Password not set up' });
    }
    //@ts-ignore
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });
    }

    if (!req.session) {
      req.session = {};
    }

    // Store user details in the session
    req.session.user = {
      id: user.id,
      email: user.email,
      access_code: user.access_code,
      name: user.name,
      role: user.role,
      verified: user.verified,
    };

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { ...user, password: undefined },
    });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: 'Email is required' });
    }

    const userData = await Affiliate.findOne({ where: { email }});
    const user = userData?.get();
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    // Generate a verification code
    const emailCode = generateCode(); // Assume this generates a 6-digit code
    const ttl = new Date(Date.now() + 30 * 60 * 1000); // Code valid for 30 minutes

    // Check if an entry for the email already exists and delete it
    await CodeEmailExpiration.destroy({
      where: { email: user.email },
    });

    // Save the code in the CodeEmailExpiration table
    await CodeEmailExpiration.create({
      email: user.email,
      code: emailCode,
      expiration_time: ttl,
    });

    const encodedPayload = encodeData({ code: emailCode, email: user.email });

    const verificationLink = `${process.env.FRONTEND_URL}/auth/reset-password?code=${encodedPayload}`;
    await sendMemberVerificationEmail(
      user.email,
      verificationLink,
      'resetPassword',
      user.name
    );

    return res.status(200).json({
      success: true,
      message: 'Reset password link sent to your email',
    });
  } catch (err) {
    next(err);
  }
};

export const verifyPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code: encodeData, password } = req.body;

    if (!encodeData || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email, code, new password, and confirm password are required',
      });
    }
    const { email, code } = decodeData(encodeData) as { email: string, code: string };

    const codeData = await CodeEmailExpiration.findOne({
      where: { email, code },
    });
    if (!codeData) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid verification code' });
    }

    const currentTime = new Date();
    if (currentTime > codeData.expiration_time) {
      return res
        .status(401)
        .json({ success: false, message: 'Verification code has expired' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [updated] = await Affiliate.update(
      { password: hashedPassword, verified: true, status: 'active'},
      { where: { email } }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    await CodeEmailExpiration.destroy({ where: { email } });

    const userData = await Affiliate.findOne({
      where: { email },
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'],
      },
    });
    const user = userData?.get();

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    if (!req.session) {
      req.session = {};
    }

    // Store user details in the session
    req.session.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      verified: user.verified,  
    };

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully',
      data: { ...user, password: undefined },
    });
  } catch (err) {
    next(err);
  }
};
export const logout = async (req: Request, res: Response) => {
  req.session.destroy((err: any) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        message: 'Failed to logout',
      });
    }

    res.clearCookie('connect.sid', {
      domain: '.tria.so',
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
    });

    return res.json({
      status: 200,
      message: 'Logged out successfully',
    });
  });
};

// export const updateProfile = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const userData = req.session.user;
//     const updates: UpdateAffiliatePayload = req.body;
//     const updatableFields: (keyof UpdateAffiliatePayload)[] = [
//       'name',
//       'wallet_address',
//     ];
//     if (!userData) {
//       return res.status(httpStatus.UNAUTHORIZED).send('UNAUTHORIZED');
//     }
//     const Affiliate = await Affiliate.findOne({
//       where: { access_code: userData.access_code },
//       raw: true,
//     });

//     if (!Affiliate) {
//       throw new Error('User not found');
//     }

//     const changeLogs: {
//       user_id: string;
//       field: string;
//       old_value: string | null | undefined;
//       new_value: string;
//       updated_at: Date;
//     }[] = [];

//     for (const field of updatableFields) {
//       if (updates[field] !== undefined && updates[field] !== Affiliate[field]) {
//         changeLogs.push({
//           user_id: Affiliate.id.toString(), // Ensure user_id is a string
//           field,
//           old_value: Affiliate[field],
//           new_value: updates[field],
//           updated_at: new Date(),
//         });
//       }
//     }

//     // Update the Affiliate with the dynamic fields
//     await Affiliate.update(updates, {
//       where: {
//         email: Affiliate.email,
//       },
//     });

//     if (changeLogs.length > 0) {
//       await ChangeLog.bulkCreate(changeLogs);
//     }

//     return res.json({
//       status: 200,
//       message: 'User profile updated successfully',
//       data: changeLogs,
//     });
//   } catch (err) {
//     next(err);
//   }
// };
export const userSessionCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData = req.session.user;
    if (!userData) {
      return res.status(httpStatus.UNAUTHORIZED).send('UNAUTHORIZED');
    }
    return res.status(200).json({
      success: true,
      message: 'User Session Valid',
      data: { ...userData, path: '', parent_id: null, tag: null },
    });
  } catch (err) {
    next(err);
  }
};
