const { createImpostor, addStub } = require('../../mocks/mounteBankOps');
const axios = require('axios');

const impostorPort = 4540;
const stubMethod = 'GET';
const stubPath = '/movies';
const stubResponseStatus = 200;

let testResponse;

describe('Add Stubs with Copy (from Header) Behavior to Impostor', () => {

  beforeEach(async () => {
    await createImpostor(impostorPort, 'http');
    await addStub(impostorPort, getMock());
  });

  test('The header must not contain the value when the body does not contain the expected value.', async () => {
    testResponse = await executeTestRequest();

    expect(testResponse.status).toBe(stubResponseStatus);
    expect(testResponse.headers['language']).toBe('undefined');
  });

  test('The header must contain the value when the body contains the expected value.', async () => {
    const headers = { language: 'en-US' };
    testResponse = await executeTestRequest(headers);

    expect(testResponse.status).toBe(stubResponseStatus);
    expect(testResponse.headers['language']).toBe(headers.language);
  });

});

async function executeTestRequest(headers) {
  const config = {
    validateStatus: false,
    method: stubMethod,
    url: `${TEST_URL}:${impostorPort}${stubPath}`,
    headers: headers,
  };
  const response = await axios(config);
  return response;
}

function getMock() {
  return {
    predicates: [
      {
        and: [
          {
            equals: {
              method: stubMethod,
              path: stubPath
            }
          }
        ]
      }
    ],
    responses: [
      {
        is: {
          statusCode: stubResponseStatus,
          headers: {
            language: '${LanguageHeader}'
          },
          body: [
            'Movie 1',
            'Movie 2',
            'Movie 3',
            'Movie 4',
            'Movie 5',
          ],
        },
        behaviors: [
          {
            copy: {
              from: { 'headers': 'language' },
              into: '${LanguageHeader}',
              using: { 'method': 'regex', 'selector': '.+' }
            }
          }
        ]
      }
    ]
  }
}
