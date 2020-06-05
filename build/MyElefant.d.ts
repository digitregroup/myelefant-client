/**
 * Sms object, phone number and message content
 */
interface Message {
    phoneNumber: string;
    content: string;
}
/**
 * MyElefant response
 */
interface MyElefantResponse {
    success: boolean;
    contacts?: {
        msisdn: string;
        url: string | null;
    }[];
    errors?: {};
}
export declare class MyElefant {
    private campaignUuid;
    private token;
    private headers;
    /**
     * Build a client
     * @param apikey Your apiKey from MyElefant
     * @param campaignUuid Your campaign_uuid from MyElefant
     */
    static buildClient(apikey: string, campaignUuid: string): MyElefant;
    /**
     * @param apikey Your apiKey from MyElefant
     * @param campaignUuid Your campaign_uuid from MyElefant
     */
    constructor(apiKey: string, campaignUuid: string);
    /**
     * Update the campaign uuid
     * @param uuid Your campaign uuid from MyElefant
     */
    updateCampaignUuid(uuid: string): void;
    /**
     * Get token from the MyElefant api
     */
    private getToken;
    /**
     * Send messages to the MyElefant api
     * @param params [[string, string]] Array of the messages
     */
    private send;
    /**
     * Main method to send the sms
     * @param messages [{phoneNumber, content}] Sms to send for the campaign
     */
    sendSms(messages: Message[]): Promise<MyElefantResponse>;
}
export {};
