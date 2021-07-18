const { createImpostor, addStub } = require('../../mocks/mounteBankOps');
const axios = require('axios');

const impostorPort = 4540;
const userId = 'e21297d0-2746-4930-a12f-780fcd6f78e0';
const stubMethod = 'GET';
const stubPath = `/users/${userId}`;
const stubUrl = `${TEST_URL}:${impostorPort}`;
const stubResponseStatus = 200;
const stubResponseBody = { id: `${userId}`, status: 'Created' };

describe('Match by Method, and Path.', () => {

  beforeEach(async () => {
    await createImpostor(impostorPort, 'http');
    await addStub(impostorPort, getMock());
  });

  test('Match with same METHOD and PATH', async () => {
    config = {
      validateStatus: false,
      method: stubMethod,
      url: `${stubUrl}${stubPath}`,
    };
    
    testResponse = await axios(config);

    expect(testResponse.status).toBe(stubResponseStatus);
    expect(testResponse.data).toMatchObject(stubResponseBody);
  });

  test('Does not match when using different METHOD', async () => {
    config = {
      validateStatus: false,
      method: 'POST',
      url: `${stubUrl}${stubPath}`,
    };
    testResponse = await axios(config);

    expect(testResponse.status).toBe(400);
    expect(testResponse.data).toBe('Bad Request');
  });

  test('Does not match when using different PATH', async () => {
    config = {
      validateStatus: false,
      method: stubMethod,
      url: `${stubUrl}/123`,
    };
    testResponse = await axios(config);

    expect(testResponse.status).toBe(400);
    expect(testResponse.data).toBe('Bad Request');
  });

  test.skip('Does not match when using different BODY', async () => {
    config = {
      validateStatus: false,
      method: stubMethod,
      url: stubPath,
      data: 'xpto'
    };
    testResponse = await axios(config);

    expect(testResponse.status).toBe(400);
    expect(testResponse.data).toBe('Bad Request');
  });

});

function getMock() {
  return {
    predicates: [
      {
        and: [
          {
            equals: {
              method: stubMethod,
              path: stubPath,
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
            'content-type': 'application/json',
          },
          body: stubResponseBody,
        }
      }
    ]
  }
}
