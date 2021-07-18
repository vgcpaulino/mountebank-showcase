const { createImpostor, addStub, deleteAllImpostors } = require('../../mocks/mounteBankOps');
const axios = require('axios');

const impostorPort = 4540;
const stubMethod = 'GET';
const stubPath = '/movies';
const stubResponseStatus = 200;

let testResponse;

describe('Add Stubs with Copy (from BODY) Behavior to Impostor', () => {

  beforeEach(async () => {
    await createImpostor(impostorPort, 'http');
    await addStub(impostorPort, getMock());
  });

  test('The header must not contain the value when the body does not contain the expected value.', async () => {
    testResponse = await executeTestRequest();

    expect(testResponse.status).toBe(stubResponseStatus);
    expect(testResponse.headers['language']).toBe('${LanguageHeader}');
  });

  test('The header must contain the value when the body contains the expected value.', async () => {
    const body = { language: 'en-US'};
    testResponse = await executeTestRequest(body);

    expect(testResponse.status).toBe(stubResponseStatus);
    expect(testResponse.headers['language']).toBe(body.language);
  });

});

async function executeTestRequest(body) {
  const config = {
    validateStatus: false,
    method: stubMethod,
    url: `${TEST_URL}:${impostorPort}${stubPath}`,
    data: body
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
          ]
        },
        behaviors: [
          {
            copy: {
              from: 'body',
              into: '${LanguageHeader}',
              using: {
                method: 'jsonpath',
                selector: '$.language'
              }
            }
          }
        ]
      }
    ]
  }
}
