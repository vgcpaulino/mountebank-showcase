const { createImpostor, addStub } = require('../../mocks/mounteBankOps');
const axios = require('axios');
const { validate : uuidValidate } = require('uuid');

const impostorPort = 4540;
const stubMethod = 'POST';
const stubPath = '/login';
const stubResponseStatus = 201;

let testResponse;
let token1, token2;

describe('Add Stubs with Decorate Behavior to Impostor', () => {

  beforeAll(async () => {
    await createImpostor(impostorPort, 'http');
    await addStub(impostorPort, getMock());
  });

  test('The response must have always a different UUID.', async () => {
    testResponse = await executeTestRequest();

    expect(testResponse.status).toBe(stubResponseStatus);
    expect(testResponse.data.cookieName).toBe('authToken');
    expect(uuidValidate(testResponse.data.token)).toBeTruthy();
    token1 = testResponse.data.token;

    testResponse = await executeTestRequest();
    expect(testResponse.status).toBe(stubResponseStatus);
    expect(testResponse.data.cookieName).toBe('authToken');
    expect(uuidValidate(testResponse.data.token)).toBeTruthy();
    token2 = testResponse.data.token;

    expect(token1).not.toBe(token2);
  });
});

async function executeTestRequest() {
  const config = {
    validateStatus: false,
    method: 'POST',
    url: `${TEST_URL}:${impostorPort}/login`
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
          body: {
            cookieName: 'authToken',
            token: '${KEY}'
          }
        },
        behaviors: [
          {
            decorate: `(config) => { const getToken = () => {const { randomUUID } = require("crypto"); return randomUUID(); }; config.response.body["token"] = getToken(); }`
          }

        ]
      }
    ]
  }
}
