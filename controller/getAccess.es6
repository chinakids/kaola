/**
 * [getAccess 验证权限]
 */
import setLog from './setLog';
import S from './../conf/setting'

let check = {
  access(power){
    return function*(next){
      if(this.session.userInfo.group.power === 'root' || JSON.parse(this.session.userInfo.group.power)[power]){
        yield next;
      }else{
        //日志记录
        setLog('权限',`系统拒绝${power}权限`,this);
        if(this.request.method === 'GET'){
          this.redirect('/'+S.ADMIN_DOMAIN+'/disallow')
        }else{
          this.body = {
            status: 'FAIL::当前用户不具备操作权限'
          }
        }
      }
    }
  },
  login(){
    return function*(next){
      if(this.session.login  && !this.session.locked){
        yield next;
      }else{
        if(!this.session.login){
          if(this.request.method === 'GET'){
            this.redirect('/'+S.ADMIN_DOMAIN+'/login')
          }else{
            this.body = {
              status: 'FAIL::该接口需要登录'
            }
          }
        }else if(this.session.locked){
          if(this.request.method === 'GET'){
            this.redirect('/'+S.ADMIN_DOMAIN+'/lock')
          }else{
            this.body = {
              status: 'FAIL::当前账号已被锁定'
            }
          }
        }
      }
    }
  },
  isAdmin(){
    return function*(next){
      if(this.session.userInfo.admin){
        yield next;
      }else{
        this.body = {
          status: 'FAIL::当前用户不具备操作权限'
        }
      }
    }
  }
}

export default check;
