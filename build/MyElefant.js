"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyElefant = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("./config");
class MyElefant {
    /**
     * @param apikey Your apiKey from MyElefant
     * @param campaignUuid Your campaign_uuid from MyElefant
     */
    constructor(apiKey, campaignUuid) {
        this.campaignUuid = campaignUuid;
        this.token = '';
        this.headers = {
            Authorization: '',
            'Content-Type': 'application/json',
        };
        this.headers.Authorization = 'Basic ' + apiKey;
    }
    /**
     * Build a client
     * @param apikey Your apiKey from MyElefant
     * @param campaignUuid Your campaign_uuid from MyElefant
     */
    static buildClient(apikey, campaignUuid) {
        return new MyElefant(apikey, campaignUuid);
    }
    /**
     * Update the campaign uuid
     * @param uuid Your campaign uuid from MyElefant
     */
    updateCampaignUuid(uuid) {
        this.campaignUuid = uuid;
    }
    /**
     * Get token from the MyElefant api
     */
    async getToken() {
        try {
            const response = await axios_1.default.post(config_1.config.URL_TOKEN, {}, {
                headers: this.headers,
            });
            this.token = response.data.access_token;
            this.headers.Authorization = 'Bearer ' + this.token;
        }
        catch (reason) {
            throw new Error(JSON.stringify(reason.response.data));
        }
    }
    /**
     * Send messages to the MyElefant api
     * @param params [[string, string]] Array of the messages
     */
    async send(params) {
        try {
            const result = await axios_1.default.post(config_1.config.URL_CAMPAIGN, {
                campaign_uuid: this.campaignUuid,
                contacts: params,
            }, { headers: this.headers });
            return result.data;
        }
        catch (reason) {
            throw new Error(JSON.stringify(reason.response.data));
        }
    }
    /**
     * Main method to send the sms
     * @param messages [{phoneNumber, content}] Sms to send for the campaign
     */
    async sendSms(messages) {
        try {
            const params = [];
            for (const message of messages) {
                params.push([message.phoneNumber, message.content]);
            }
            if (this.token === '') {
                await this.getToken();
            }
            return await this.send(params);
        }
        catch (error) {
            return JSON.parse(error.message);
        }
    }
}
exports.MyElefant = MyElefant;
