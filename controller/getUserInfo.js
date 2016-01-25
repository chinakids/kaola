/**
 * [getUserInfo 用来处理用户信息]
 */
import usersModel from '../models/Users';

function * userInfo(next){
  if(this.session.login){
    let promise = new Promise((resolve, reject) => {
      usersModel.getInfoByEmail(this.session.email,(err,data) => {
        if(err){
          logger('model',err);
          reject(err);
        }else{
          resolve(data)
        };
      });
    });
    yield promise.then((data) => {
      if(data.length <= 0){
        //置空登录状态
        this.session.login = false;
        this.session.email = '';
      }else{
        //TODO 将信息挂载字session上 后期要对关键数据过滤
        this.session.userInfo = data[0];
      }
    });
    yield next;
  }else{
    yield next;
  }
}


export default userInfo;
