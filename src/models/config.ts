import * as fs from 'fs';
import Log from "./log";

export interface ISMTPConfig {
    host: string;
    port: number;
    email: string;
    fromName?: string;
    username: string;
    password: string;
    secure: boolean;
}

export interface ISMTPServerConfig {
    host?: string;
    port: number;
}

export interface IMailForwardConfig {

    sender: ISMTPConfig;
    server: ISMTPServerConfig;
    log: string;
}

class MailForwardConfig {

    public static load(filename: string): IMailForwardConfig {
        if (fs.existsSync(filename)) {
            const content = fs.readFileSync(filename);
            const obj = JSON.parse(content.toString('utf8')) as IMailForwardConfig;
            Log.setLevel(Log.fromString(obj.log))
            console.info("config loaded successful")
            return obj;
        }
        else {
            const msg = `config file ${filename} does not exists`;
            throw new Error(msg)
        }
    }
}

export default MailForwardConfig;