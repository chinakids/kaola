import nodemailer from 'nodemailer'
import S from './../conf/setting'
/**
 * [sendMail 邮件发送相关]
 * @param  {Object} data [发送相关参数]
 *   - @param  {Array} to [接收人]
 *   - @param  {String} subject [标题]
 *   - @param  {String} html [内容]
 * @return {Promise}     [Promise对象]
 */
let sendMail = (data) => {
  // 开启一个 SMTP 连接池
  let smtpTransport = nodemailer.createTransport('SMTP',{
    host: S.MAIL_HOST, // 主机
    secureConnection: S.MAIL_SSL, // 使用 SSL
    port: S.MAIL_PORT, // SMTP 端口
    auth: {
      user: S.MAIL_USERNAME, // 账号
      pass: S.MAIL_PASSWORD // 密码
    }
  });
  // 设置邮件内容
  let mailOptions = {
    from: `${S.MAIL_NICKNAME} <${S.MAIL_USERNAME}>`, // 发件地址
    to: data.to.join(','), // 收件列表
    subject: data.subject, // 标题
    html: data.html // html 内容
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