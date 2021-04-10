export class SMTPConfig {
    public readonly host: string;
    public readonly port: number;
    public readonly email: string;
    public readonly username: string;
    public readonly password: string;
    public readonly secure: boolean;
    public constructor(host: string = "smtp.example.com", port: number = 465, email: string = "outgoing@example.com", username: string = "test", password: string = "test", secure: boolean = true) {
        this.host = host;
        this.port = port;
        this.email = email;
        this.username = username;
        this.password = password;
        this.secure = secure;
    }
}
export class SMTPServerConfig{
    public readonly host: string;
    public readonly port: number;
    public constructor(host: string = "localhost", port: number = 1025) {
        this.host = host;
        this.port = port;
        
    }

}
export interface IMailForwardConfig {

    sender: {
        host: string;
        port: number;

    }
}

class MailForwardConfig implements IMailForwardConfig {


    public sender: SMTPConfig;
    public server: SMTPServerConfig;

    public constructor(filename: string) {
        this.sender = new SMTPConfig()
        this.server = new SMTPServerConfig();
    }
}

export default MailForwardConfig;