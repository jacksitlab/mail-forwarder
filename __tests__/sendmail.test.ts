import MailService from '../src/services/mailService'

describe('My work', () => {
  test('works', () => {

    const mailer = new MailService({ host: 'localhost', port: 1025, email: "test@test.com", username: "testuser", password: "testpass", secure: false });
    mailer.sendMail("jack@jacks-it-lab.de","my subject","<p1>Hello World</p>",true).then((result)=>{

    }).catch((error)=>{
        fail(error);
    })
  })
})