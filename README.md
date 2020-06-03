# MyElefant Client

MyElefant Client is a library for send sms througt MyElefant api.

## Installation

```bash
npm install @digitregroup/myelefant-client
```

## Usage

```javascript
const { MyElefant } = require('@digitregroup/myelefant-client');
const apiKey = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const campaignUuid = 'xxxxxxx-xxx-xxx-xxx-xxxxxxxxxx';


(async () => {

  const result = await MyElefant
    .buildClient(apiKey, campaignUuid)
    .sendSms([
      { phoneNumber: '33601010101', content: 'Test #1' },
      { phoneNumber: '33602020202', content: 'Test #2' },
    ]);

  console.log('Result:', result);

})()
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)