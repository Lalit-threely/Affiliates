import { EmailMessageType } from "../types";
import { addAffiliateTemplate } from "../utils/templates";
import handlebars from 'handlebars';
const postmark = require('postmark');

export async function sendMemberVerificationEmail(
    email: string,
    verificationLink: string,
    type: EmailMessageType,
    referredTo?: string,
    role?: string,
    referredBy?: string
  ) {
    try {
      const template = handlebars.compile(addAffiliateTemplate);
      const htmlToSend = template({
        verificationLink,
        role,
        referredBy,
        name: referredTo,
        isInvitation: type === 'invitation',
      });
      const client = new postmark.ServerClient(
        process.env.POSTMARK_API_KEY
      );
  
      await client.sendEmail({
        From: 'notifications@tria.so',
        To: email,
        MessageStream: 'outbound',
        Subject:
          type === 'invitation'
            ? "You're Invited to be an Affiliate"
            : 'Reset Your Password',
        HtmlBody: htmlToSend,
      });
    }catch (error) {
      console.error(`Error in sending verification mail to: ${email}`, error);
      throw error;
    }
  }