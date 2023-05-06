/**
 * 
 * @param {Egg.Application} app 
 */

const EggWechatApi = require("./lib/WechatApi");
const EggWechatOAuth = require("./lib/WechatOauth");

module.exports = app => {
    if (app.config.wechatSdk) {


        app.WechatApi = new EggWechatApi(app);
        app.WechatOauth = new EggWechatOAuth(app);
    }
};