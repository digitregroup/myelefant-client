import axios from 'axios';
import { config } from './config';

interface Headers {
  Authorization: null | string;
  'Content-Type': string;
}

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

type ArrayMessages = [string, string];

export class MyElefant {
  private token: string | null = null;

  private headers: Headers = {
    Authorization: null,
    'Content-Type': 'application/json',
  };

  static buildClient(apikey: string, campaignUuid: string) {
    return new MyElefant(apikey, campaignUuid);
  }

  constructor(apiKey: string, private campaignUuid: string | null) {
    this.headers.Authorization = 'Basic ' + apiKey;
  }

  updateCampaignUuid(uuid: string): void {
    this.campaignUuid = uuid;
  }

  async getToken() {
    try {
      const response = await axios.post(
        config.URL_TOKEN,
        {},
        {
          headers: this.headers,
        }
      );
      if (response.data.success) {
        this.token = response.data.access_token;
        this.headers.Authorization = 'Bearer ' + this.token;
      }
    } catch (reason) {
      console.error(reason.response.data);
    }
  }

  async send(params: ArrayMessages[]): Promise<MyElefantResponse> {
    try {
      const result = await axios.post(
        config.URL_CAMPAIGN,
        {
          campaign_uuid: this.campaignUuid,
          contacts: params,
        },
        { headers: this.headers }
      );

      return result.data;
    } catch (reason) {
      return reason.response.data;
    }
  }

  async sendSms(messages: Message[]): Promise<MyElefantResponse> {
    const params: ArrayMessages[] = [];

    for (const message of messages) {
      params.push([message.phoneNumber, message.content]);
    }

    if (this.token === null) {
      await this.getToken();
    }

    return await this.send(params);
  }
}
