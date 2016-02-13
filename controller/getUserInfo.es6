/**
 * [getUserInfo 用来处理用户信息]
 */
import usersModel from '../models/Users';
import logger from '../utils/logger';

function * userInfo(next){
  console.log('获取用户信息')
  if(this.session.login){
    let data = yield usersModel.getInfoByEmail(this.session.email);
    if(data.length <= 0){
      //置空登录状态
      this.session.login = false;
      this.session.email = '';
    }else{
      //TODO 将信息挂载字session上 后期要对关键数据过滤
      this.session.userInfo = data[0];
    }
    yield next;
  }else{
    yield next;
  }
}


export default userInfo;
