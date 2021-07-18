/**************************************************************************************************
    File Name	: auth.js
    Description
        Singleton class for authrity

    Usage
        let jsonUserInfo =  await db.loginOrSignup(strWalletAddress);
        let strSecurityToken = auth.getSecurityToken( "id", jsonUserInfo.id );
        if( strSecurityToken === null )
            strSecurityToken = auth.insertSecurityToken(jsonUserInfo);
        return { token : strSecurityToken, userInfo : jsonUserInfo }

    Update History
        2021.07			BGKim		Create
**************************************************************************************************/

///////////////////////////////////////////////////////////////////////////////////////////////////
//                                  Required Modules                                             //
///////////////////////////////////////////////////////////////////////////////////////////////////
const uuidv4        = require('uuid').v4;


///////////////////////////////////////////////////////////////////////////////////////////////////
//                                  	Auth Class                                     			 //
///////////////////////////////////////////////////////////////////////////////////////////////////

function Auth()
{
    "use strict";

    /*
    // Security token 으로 접속한 사용자 인증을 유지하여 사용자 확인의 부하를 줄인다.
    // Key : security token
    // value :
        {
            lastAccessTime 	: date ( ms ),
            ...user infos
        }
    */
    this.tableSecurityToken = {};


    // 사용자 인증 만료 알고리즘
    // 사용자 만료의 작업은 주기적으로 작업을 한다.
    // 즉, 호출 시 마다 작업하는 것이 아니라 사용자 인증 만료 작업을 한 마지막 시간을 기준으로 만료 기간을 체크한다.
    // 마지막에 인증 만료를 검색한 시간
    this.miliSecondLastExpireCheckTime = 0;

    // 인증 만료 체크 주기
    this.miliSecondExpireCheckPeriod =  60 * 60 * 1000;

    // Security key 인증 만료 시간
    this.miliSecondExpireTime = 7 * 24 * 60 * 60 * 1000;
}


Auth.prototype.getExpireTime = function( strSecurityToken ) {
    "use strict";
    var nLastAccessTime = this.tableSecurityToken[strSecurityToken];
    return nLastAccessTime + this.miliSecondLastExpireCheckTime;
};

Auth.prototype._checkExpireTime = function() {
    "use strict";
    let nNow = Date.now();
    if(  nNow - this.miliSecondLastExpireCheckTime < this.miliSecondExpireCheckPeriod )
        return ;

    this.miliSecondLastExpireCheckTime = nNow;
    for ( let strSecurityToken in this.tableSecurityToken  ) {
        let nLastAccessTime = this.tableSecurityToken[strSecurityToken].lastAccessTime;
        if( this.miliSecondExpireTime < nNow - nLastAccessTime  )
            this._deleteSecurityToken( strSecurityToken  );
    }
};



Auth.prototype._deleteSecurityToken = function( strSecurityToken  ) {
    "use strict";
    delete this.tableSecurityToken[strSecurityToken];
};


Auth.prototype._containToken = function( strSecurityToken ) {
    "use strict";
    return strSecurityToken in this.tableSecurityToken;
};


Auth.prototype._insertSecurityTokenTable = function( strSecurityToken, jsonData ) {
    "use strict";
    jsonData.lastAccessTime = Date.now();
    this.tableSecurityToken[ strSecurityToken ] = jsonData;
};



// Ex) getSecurityToken("id", userInfo.id)
// Ex) getSecurityToken("email", userInfo.email)
Auth.prototype.getSecurityToken = function( strCompareProperty, compareValue ) {
    "use strict";
    this._checkExpireTime();
    for(let token in this.tableSecurityToken) {
        let info = this.tableSecurityToken[token];
        if( info[strCompareProperty] === compareValue ) {
            // Security token을 사용하면 마지막 접근 시간을 갱신한다
            info.lastAccessTime = Date.now();
            console.log("return exists token");
            return token;
        }
    }
    return null;
};

// 사용자 정보를 메모리에 올리고 토큰을 발급한다.
Auth.prototype.insertSecurityToken = function( jsonData ) {
    "use strict";
    const strSecurityToken = uuidv4();
    this._insertSecurityTokenTable( strSecurityToken, jsonData );
    return strSecurityToken;
};



Auth.prototype.isValidSecurityToken = function( strSecurityToken ){
    "use strict";
    this._checkExpireTime();
    return strSecurityToken in this.tableSecurityToken;
};



Auth.prototype.getUserInfo = function( strSecurityToken ) {
    "use strict";
    this._checkExpireTime();
    // Security token을 사용하면 마지막 접근 시간을 갱신한다
    var info = this.tableSecurityToken[ strSecurityToken ];
    if( info )
        info.lastAccessTime = Date.now();
    return info;
};



Auth.prototype.getUserInfoWithSecurityToken = function( strSecurityToken ) {
    "use strict";
    return this.getUserInfo(strSecurityToken);
};




///////////////////////////////////////////////////////////////////////////////////////////////////
//                                  Module Exports					                             //
///////////////////////////////////////////////////////////////////////////////////////////////////
const _auth = new Auth();
module.exports = _auth;
