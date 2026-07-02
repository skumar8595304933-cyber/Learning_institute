const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {

    try {

        let transporter = nodemailer.createTransport({

            host: process.env.MAIL_HOST,

            auth: {

                user: process.env.MAIL_USER,

                pass: process.env.MAIL_PASS

            }

        })

        let info = await transporter.sendMail({

            from: "StudyNotion || CodeHelp -by Babber",

            to: `${email}`,

            subject: `${title}`,

            html: `${body}`,

        });
        console.log("mail =", info);

        return info;

    }

    catch (err) {

        console.log("mail is not verified please try again", err.message)

    }

}

module.exports = mailSender

