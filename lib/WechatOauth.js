const OAuth = require("wechat-oauth");
class WechatOauth {
	/**
	 * 
	 * @param {Egg.Application} app 
	 * @param {import("..").WechatOptions} _options 
	 */
	constructor(app, _options) {
		this.app = app;
		this.options = _options;
		this.OAUTH_TOKEN = "auth_token_";
		this.api = new OAuth(_options.appId, _options.appSecret, this.getToken.bind(this), this.setToken.bind(this));
	}
	/**
	 * 
	 * @param {String} openid 
	 * @param {Function} callback 
	 */
	async getToken(openid, callback) {
		try {
			let reply = await this.app.redis.get(`${this.OAUTH_TOKEN}${openid}`);
			let token = JSON.parse(reply);
			callback(null, token);
		} catch (error) {
			callback(error);
		}
	}
	/**
	 * 
	 * @param {String} openid 
	 * @param {Object} tokenData
	 * @param {Function} callback 
	 */
	async setToken(openid, token, callback) {
		try {
			let key = `${this.OAUTH_TOKEN}${openid}`;
			await this.app.redis.set(key, JSON.stringify(token));
			// await redisClient.expire(this.ACCESS_TOKEN, 7190);
			callback(null);
		} catch (error) {
			callback(error);
		}
	}
}
const WechatMap = {};
class EggWechatOAuth {
	/**
	 * 
	 * @param {Egg.Application} app 
	 */
	constructor(app) {
		this.app = app;
	}
	/**
	 * 
	 * @param {string | null} appId 
	 * @returns {OAuth}
	 */
	getIns(appId) {
		appId = appId || this.app.config.wechatSdk.defaultAppId;
		if (!WechatMap[appId]) {
			const options = this.app.config.wechatSdk[appId];
			if (options) {
				WechatMap[appId] = new WechatOauth(this.app, options);
			} else {
				return null;
			}
		}
		return WechatMap[appId].api;
	}
}
module.exports = EggWechatOAuth;