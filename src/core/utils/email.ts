import nodemailer from 'nodemailer';

// Define a type for the email options to ensure type safety.
interface MailOptions {
    email: string;
    subject: string;
    html: string;
}

export const sendMail = async (option: MailOptions): Promise<void> => {
    // Create a transporter with your email service details.
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        service: process.env.SERVICE,
        port: 587,
        secure: false, // For port 587, use 'false'
        auth: {
            user: process.env.APP_USERNAME,
            pass: process.env.APP_PASSWORD,
        },
    });

    //  Define mail options
    const mailOptions = {
        from: process.env.APP_USERNAME, // sender address
        to: option.email, // list of receivers
        subject: option.subject, // Subject line
        html: option.html, // html body
    };

    try {
        //  Send the email and await the result
        await transporter.sendMail(mailOptions);
        console.log(`Message sent to: ${option.email}`);
    } catch (error) {
        console.error("Error sending email:", error);
        // You can throw a custom error here if needed
        throw new Error("Failed to send email");
    }
};