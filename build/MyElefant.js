"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const config_1 = require("./config");
class MyElefant {
    constructor(apiKey, campaignUuid) {
        this.campaignUuid = campaignUuid;
        this.token = null;
        this.headers = {
            Authorization: null,
            'Content-Type': 'application/json',
        };
        this.headers.Authorization = 'Basic ' + apiKey;
    }
    static buildClient(apikey, campaignUuid) {
        return new MyElefant(apikey, campaignUuid);
    }
    updateCampaignUuid(uuid) {
        this.campaignUuid = uuid;
    }
    async getToken() {
        try {
            const response = await axios_1.default.post(config_1.config.URL_TOKEN, {}, {
                headers: this.headers,
            });
            if (response.data.success) {
                this.token = response.data.access_token;
                this.headers.Authorization = 'Bearer ' + this.token;
            }
        }
        catch (reason) {
            console.error(reason.response.data);
        }
    }
    async send(params) {
        try {
            const result = await axios_1.default.post(config_1.config.URL_CAMPAIGN, {
                campaign_uuid: this.campaignUuid,
                contacts: params,
            }, { headers: this.headers });
            return result.data;
        }
        catch (reason) {
            return reason.response.data;
        }
    }
    async sendSms(messages) {
        const params = [];
        for (const message of messages) {
            params.push([message.phoneNumber, message.content]);
        }
        if (this.token === null) {
            await this.getToken();
        }
        return await this.send(params);
    }
}
exports.MyElefant = MyElefant;
