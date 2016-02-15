/**
 * [bakDb 数据库备份/恢复]
 */

function bakDb(power){
  return function*(next){
    if(this.session.userInfo.group.power === 'root' || JSON.parse(this.session.userInfo.group.power)[power]){
      yield next;
    }else{
      if(this.request.method === 'GET'){
        this.redirect('./disAllow')
      }else{
        this.body = {
          status: 'FAIL::当前用户不具备操作权限'
        }
      }
    }
  }
}

export default bakDb;
