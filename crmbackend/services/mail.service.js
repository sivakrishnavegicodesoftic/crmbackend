const sgMail  = require('@sendgrid/mail');
const config  = require('../config/index');
const nodemailer = require('nodemailer');
// sgMail.setApiKey('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');

// const sendEmail = async (to, html) => {
//   try {
//     const msg = {
//       to,
//       from: 'sivakrishnavegi.lpu@gmail.com', // sender address Change to your verified sender
//       subject: 'verify your crm account', // Subject line
//       text: 'please do verify', // plain text body
//       html,
//     };
//     await sgMail.send(msg);
//     console.log(`Mail Has Been Sent To ${to}`)
//     return true;
//   } catch (e) {
//     console.error('Mail Service Error => ', e);
//     return false;
//   }
// };


//node mailer

const sendEmail = async (to,html) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'xxxxxxxx@gmail.com',
          pass: 'xxxxx'
        }
      });
      
      var mailOptions = {
        from: 'xxxxxxxxx@gmail.com',
        to,
        subject: 'Email verfication ',
        text: 'few steps !',
        html
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}


exports.sendEmail = sendEmail;
