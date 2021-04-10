import * as nodemailer from 'nodemailer';
import MailForwardConfig from './models/config';
import { logService } from './services/logService';
import MailServer from './services/mailServer';
import MailService from './services/mailService';

const LOG = logService.getLog('MailForwardServer');

class MailForwardServer {

    private config: MailForwardConfig;
    private mailService: MailService;
    private mailServer: MailServer;

    public constructor() {
        this.config = new MailForwardConfig("config.json");
        this.mailService = new MailService(this.config.sender);
        this.mailServer = new MailServer(this.config.server, );
    }
    public start() {
        this.mailServer.start();
        LOG.info("started");
    }


}


const server = new MailForwardServer()
server.start();