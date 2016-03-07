import nodemailer from 'nodemailer'
import S from './../conf/setting'

let sendMail = (data) => {
  // 开启一个 SMTP 连接池
  let smtpTransport = nodemailer.createTransport('SMTP',{
    host: '', // 主机
    secureConnection: true, // 使用 SSL
    port: 465, // SMTP 端口
    auth: {
      user: '', // 账号
      pass: '' // 密码
    }
  });
  // 设置邮件内容
  let mailOptions = {
    from: 'Fred Foo <xxxxxxxx@xx.com>', // 发件地址
    to: '', // 收件列表
    subject: 'Hello world', // 标题
    html: '<b>thanks a for visiting!</b> 世界，你好！' // html 内容
  }
  // 发送邮件
  let p = new Promise((resolve, reject) => {
    smtpTransport.sendMail(mailOptions, (error, data) => {
      if(error){
        reject(error);
      }else{
        esolve(null, data);
      }
      smtpTransport.close(); // 如果没用，关闭连接池
    });
  });
  return p;
}

export default sendMail;