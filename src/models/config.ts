import * as fs from 'fs';
import Log from "./log";

interface ISMTPConfig{
    host: string;
    port: number;
    email: string;
    username: string;
    password: string;
    secure: boolean;
}
export class SMTPConfig {
    public readonly host: string;
    public readonly port: number;
    public readonly email: string;
    public readonly username: string;
    public readonly password: string;
    public readonly secure: boolean;
    public constructor(obj:ISMTPConfig) {
        this.host = obj.host;
        this.port = obj.port;
        this.email = obj.email;
        this.username = obj.username;
        this.password = obj.password;
        this.secure = obj.secure;
    }
}
interface ISMTPServerConfig{
    host: string;
    port: number;
}
export class SMTPServerConfig{
    public readonly host: string;
    public readonly port: number;
    public constructor(obj:ISMTPServerConfig) {
        this.host = obj.host;
        this.port = obj.port;
        
    }

}
export interface IMailForwardConfig {

    sender: ISMTPConfig;
    server: ISMTPServerConfig;
    log: string;
}

class MailForwardConfig {


    public sender: SMTPConfig;
    public server: SMTPServerConfig;

    public constructor(filename: string) {
        if (fs.existsSync(filename)) {
            const content = fs.readFileSync(filename);
            const obj = JSON.parse(content.toString('utf8')) as IMailForwardConfig;
            this.sender = new SMTPConfig(obj.sender);
            this.server = new SMTPServerConfig(obj.server);
            Log.setLevel(Log.fromString(obj.log))
            console.info("config loaded successful")
        }
        else{
            const msg=`config file ${filename} does not exists`;
            throw new Error(msg)
        }
    }
}

export default MailForwardConfig;