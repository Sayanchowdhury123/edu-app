const nodemailer = require("nodemailer")


const sendemail = async (to,subject,html) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    const mailoptions = {
        from: `"Edu platfrom" ${process.env.EMAIL_USER} `,
        to,
        subject,
        html
    }

    await transporter.sendMail(mailoptions)
}

module.exports = sendemail;