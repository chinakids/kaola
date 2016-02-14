/**
 * [getUserInfo 用来处理用户信息]
 */
import usersModel from '../models/Users';

function * userInfo(next){
  if(this.session.login){
    let data = yield usersModel.getInfoByEmail(this.session.email);
    if(data.length <= 0){
      //置空登录状态
      this.session.login = false;
      this.session.email = '';
    }else{
      this.session.userInfo = data[0];
    }
    yield next;
  }else{
    yield next;
  }
}


export default userInfo;
