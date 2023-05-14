
// interface DataSources {
//     datasources: EggSequelizeMultitableOptions[];
//   }
// "name": "测试",
// "appid": "wxd0944fd71221c19c",
// "appsecret": "fe2574fdfce33dcaa5534d149b77c4a3",
// "token": "31427543139566790626",
import OAuth from "wechat-oauth";
import WechatApiSdk from "wechat-api";
import EggWechatApi from "./lib/WechatApi";
import EggWechatOAuth from "./lib/WechatOauth";

// "encodingAESKey": ""
interface WechatSdkOptions {
    name?: string,
    appId: string,
    appSecret: string,
    token?: string,
    encodingAESKey?: string
}

interface EggWechatSdkOptions {
    defaultAppId: string,
    [propname: string]: WechatSdkOptions,

}

declare module 'egg' {

    interface Application {
        WechatApi: EggWechatApi;
        WechatOauth: EggWechatOAuth;
    }
    // extend your config
    interface EggAppConfig {
        wechatSdk: EggWechatSdkOptions;
    }
}
