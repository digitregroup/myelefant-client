interface Message {
    phoneNumber: string;
    content: string;
}
interface MyElefantResponse {
    success: Boolean;
    contacts: {
        msisdn: string;
        url: string | null;
    }[];
}
declare type ArrayMessages = [string, string];
export declare class MyElefant {
    private campaignUuid;
    private token;
    private headers;
    static buildClient(apikey: string, campaignUuid: string): MyElefant;
    constructor(apiKey: string, campaignUuid: string | null);
    updateCampaignUuid(uuid: string): void;
    getToken(): Promise<void>;
    send(params: ArrayMessages[]): Promise<MyElefantResponse>;
    sendSms(messages: Message[]): Promise<MyElefantResponse>;
}
export {};
