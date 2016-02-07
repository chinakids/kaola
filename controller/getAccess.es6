/**
 * [getAccess 验证权限]
 */

function getAccess(self,power){
  if(self.session.userInfo.group.power === 'root' || JSON.parse(self.session.userInfo.group.power)[power]){
    return true;
  }else{
    return false;
  }
}

export default getAccess;
