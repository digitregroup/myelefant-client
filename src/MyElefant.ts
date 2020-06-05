import axios from 'axios';
import { config } from './config';

/**
 * Headers used for the MyElefant api
 */
interface Headers {
  Authorization: string;
  'Content-Type': string;
}

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

type ArrayMessages = [string, string];

export class MyElefant {
  private token: string = '';

  private headers: Headers = {
    Authorization: '',
    'Content-Type': 'application/json',
  };

  /**
   * Build a client
   * @param apikey Your apiKey from MyElefant
   * @param campaignUuid Your campaign_uuid from MyElefant
   */
  static buildClient(apikey: string, campaignUuid: string) {
    return new MyElefant(apikey, campaignUuid);
  }

  /**
   * @param apikey Your apiKey from MyElefant
   * @param campaignUuid Your campaign_uuid from MyElefant
   */
  constructor(apiKey: string, private campaignUuid: string) {
    this.headers.Authorization = 'Basic ' + apiKey;
  }

  /**
   * Update the campaign uuid
   * @param uuid Your campaign uuid from MyElefant
   */
  updateCampaignUuid(uuid: string): void {
    this.campaignUuid = uuid;
  }

  /**
   * Get token from the MyElefant api
   */
  private async getToken() {
    try {
      const response = await axios.post(
        config.URL_TOKEN,
        {},
        {
          headers: this.headers,
        }
      );
      this.token = response.data.access_token;
      this.headers.Authorization = 'Bearer ' + this.token;
    } catch (reason) {
      throw new Error(JSON.stringify(reason.response.data));
    }
  }

  /**
   * Send messages to the MyElefant api
   * @param params [[string, string]] Array of the messages
   */
  private async send(params: Array<ArrayMessages>): Promise<MyElefantResponse> {
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
      throw new Error(JSON.stringify(reason.response.data));
    }
  }

  /**
   * Main method to send the sms
   * @param messages [{phoneNumber, content}] Sms to send for the campaign
   */
  async sendSms(messages: Message[]): Promise<MyElefantResponse> {
    try {
      const params: ArrayMessages[] = [];

      for (const message of messages) {
        params.push([message.phoneNumber, message.content]);
      }

      if (this.token === '') {
        await this.getToken();
      }
      return await this.send(params);
    } catch (error) {
      return JSON.parse(error.message);
    }
  }
}
