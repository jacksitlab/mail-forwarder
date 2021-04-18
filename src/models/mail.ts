import Mail = require("nodemailer/lib/mailer");

export interface IMail{
    to:string | Mail.Address | (string | Mail.Address)[];
    cc?:string;
    bcc?:string;
    subject:string;
    content:string;
    isHtml:boolean;
    
}