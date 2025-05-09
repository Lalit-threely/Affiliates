import CodeEmailExpiration from "../models/CodeEmailExpiration";
import { encodeData, generateCode } from "../utils/helper/helperFunctions";
import { sendMemberVerificationEmail } from "./email";
import * as responseHandler from '../utils/helper/responseHandler';
import httpStatus from 'http-status';
import { userData } from "../types";
import Affiliate, { AffiliateCreationAttributes, AffiliateRole } from "../models/Affiliate";
import { sequelize } from "../models";
import { v4 as uuidv4 } from 'uuid';
import { getRoleName } from "../utils/constants";

export const createAffiliateUser = async (affiliateData: AffiliateCreationAttributes, userData: userData) => {
    const transaction = await sequelize.transaction();
    try {
      const email = affiliateData.email.toLowerCase();

      const existingEmailUserData = await Affiliate.findOne({
        where: {
          email: email,
        },
        transaction,
      });

      const existingEmailUser = existingEmailUserData?.get()
       // 3. Handle existing user scenarios
    if (existingEmailUser) {
      // Case: Existing user with null password (incomplete registration)
      if (existingEmailUser.password === null) {
        await Affiliate.update(
          {
            name: affiliateData.name,
            role: affiliateData.role,
            parent_id: userData.id,
            tag: affiliateData.tag,
          },
          {
            where: { id: existingEmailUser.id },
            transaction,
          }
        );

        await transaction.commit();
        return sendVerificationEmail(affiliateData, userData);
      }

      // Case: Existing active user
      await transaction.rollback();
      return responseHandler.returnError(
        httpStatus.BAD_REQUEST,
        'Email already registered'
      );
    }
      
      // First check - if user exists, return error
      // if (existingEmailUserData) {
      //   await transaction.rollback();
      //   return responseHandler.returnError(
      //     httpStatus.BAD_REQUEST,
      //     'Email already registered'
      //   );
      // }

      // Since we already checked the email doesn't exist, we can proceed to create a new user
      
      // 5. Create new user
      const newAffiliate = await Affiliate.create(
        {
          id: uuidv4(),
          name: affiliateData.name,
          email: email,
          access_code: generateCode(),
          parent_id: null,
          tag: affiliateData.tag,
          role: affiliateData.role,
        },
        { transaction }
      );
  
      await transaction.commit();
      return sendVerificationEmail(affiliateData, userData);
    } catch (error) {
      await transaction.rollback();
      console.error('User creation failed:', error);
      return responseHandler.returnError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'User registration failed'
      );
    }
  };

export const sendVerificationEmail = async (affiliateData: AffiliateCreationAttributes, userData: userData) => {
    try {
    const {email, name, role } = affiliateData;
    const emailCode = generateCode();
    const ttl = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days 

    await CodeEmailExpiration.destroy({ where: { email: email } });
    await CodeEmailExpiration.create({
      email: email,
      code: emailCode,
      expiration_time: ttl,
    });

    const encodedPayload = encodeData({ code: emailCode, email: email });

    const verificationLink = `${process.env.FRONTEND_URL}/auth/create-password?code=${encodedPayload}`;
    // Get role name from constants
    const roleName = getRoleName(role as AffiliateRole);

    await sendMemberVerificationEmail(
      email,
      verificationLink,
      'invitation',
      name,
      roleName,
      userData.name
    );

    return responseHandler.returnSuccess(
      httpStatus.CREATED,
      'Successfully Registered the account! Please Verify your email.'
    );
  } catch (e) {
    console.error(e);
    throw e;
  }
};