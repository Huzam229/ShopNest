import nodemailer from 'nodemailer';

export const sendMail = async (email, subject, body) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })
        const option = {
            from: `"Developer Shop_nest" <${process.env.EMAIL_USER}>`,
            to: email,
            subject,
            html: body
        }
        await transporter.sendMail(option);
        return { success: true, message: "Mail sent successfully" };
    } catch (error) {
        console.log(error);
        return { success: false, message: error.message };
    }
}