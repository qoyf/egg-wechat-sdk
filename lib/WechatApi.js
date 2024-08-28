const WechatApiSdk = require('wechat-api');
WechatApiSdk.patch("getCurrentAutoreplyInfo", "https://api.weixin.qq.com/cgi-bin/get_current_autoreply_info", true);
WechatApiSdk.patch("getPhonenumber", "https://api.weixin.qq.com/wxa/business/getuserphonenumber", true);
class WechatApi {
	/**
	 * 
	 * @param {Egg.Application} app 
	 * @param {import("..").WechatOptions} _options 
	 */
	constructor(app, _options) {
		this.app = app;
		this.options = _options;
		this.access_token = null;
		this.weixin_ticketToken = {};
		this.ACCESS_TOKEN = "access_token_" + _options.appId;
		this.WEIXIN_TICKETTOKEN = "weixin_tickettoken_" + _options.appId;
		this.api = new WechatApiSdk(_options.appId, _options.appSecret, this.getToken.bind(this), this.setToken.bind(this));
		this.api.registerTicketHandle(this.getTicketToken.bind(this), this.saveTicketToken.bind(this));
	}
	async getToken(callback) {
		if (this.access_token) {
			callback(null, this.access_token);
		} else {
			try {
				const reply = await this.app.redis.get(this.ACCESS_TOKEN);
				this.access_token = JSON.parse(reply);
				callback(null, this.access_token);
			} catch (error) {
				callback(error);
			}


		}
	}
	async setToken(token, callback) {
		this.access_token = token;
		try {
			await this.app.redis.set(this.ACCESS_TOKEN, JSON.stringify(this.access_token));
			await this.app.redis.expire(this.ACCESS_TOKEN, 7190);
		} catch (error) {
			callback(error);
		}
	}


	async getTicketToken(type, callback) {

		if (this.weixin_ticketToken[type]) {
			callback(null, this.weixin_ticketToken[type]);
		} else {

			try {
				let reply = await this.app.redis.get(`${this.WEIXIN_TICKETTOKEN}type`);
				this.weixin_ticketToken[type] = JSON.parse(reply);
				callback(null, this.weixin_ticketToken[type]);
			} catch (error) {
				callback(error);
			}

		}

	}
	// saveTicketToken
	async saveTicketToken(type, _ticketToken, callback) {
		this.weixin_ticketToken[type] = _ticketToken;
		let key = `${this.WEIXIN_TICKETTOKEN}type`;
		try {
			await this.app.redis.set(key, JSON.stringify(this.weixin_ticketToken[type]));
			await this.app.redis.expire(key, 7190);
		} catch (error) {
			callback(error);
		}
	}
}
const WechatMap = {};
class EggWechatApi {
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
	 * @returns {WechatApiSdk}
	 */
	getIns(appId) {
		appId = appId || this.app.config.wechatSdk.defaultAppId;
		if (!WechatMap[appId]) {
			const options = this.app.config.wechatSdk[appId];
			if (options) {
				WechatMap[appId] = new WechatApi(this.app, options);
			} else {
				return null;
			}
		}
		return WechatMap[appId].api;
	}
}
module.exports = EggWechatApi;