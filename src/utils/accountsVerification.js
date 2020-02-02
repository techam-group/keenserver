const { NODE_ENV, SG_API_KEY } = process.env;
const dev = NODE_ENV || 'development';
const nodemailer = require( 'nodemailer' );
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SG_API_KEY);

const templates = require('../constants/templates');

// Email Verification Service
class AccountsVerification {
  async sendMail( email, name, type, url ) {
    dev ? await this.mailTester( email, name, type, url ) : await this.mailer( email, name, type, url )
  }

  async mailTester( email, name, type, url ) {
    const data = {
      from: "Trace 💩 <developer@keencademics.com>",
      to: email,
      templateId: templates[type],
      dynamic_template_data: {
        name: name,
        account_verification_url:  url,
      }
    };

    await sgMail.send(data);
  }

  async mailer( email, name, type, url ) {
    const data = {
      from: "Trace 💩 <developer@keencademics.com>",
      to: email,
      templateId: templates[type],
      dynamic_template_data: {
        name: name,
        account_verification_url:  url,
      }
    };

    await sgMail.send(data);
  }
}

module.exports = AccountsVerification;
