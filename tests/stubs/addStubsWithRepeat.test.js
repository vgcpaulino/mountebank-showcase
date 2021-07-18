const { createImpostor, addStub } = require('../../mocks/mounteBankOps');
const axios = require('axios');

const impostorPort = 4540;
const userId = 'e21297d0-2746-4930-a12f-780fcd6f78e0';

let testResponse;

describe('Add Stub with Repeat to Impostor', () => {

  beforeAll(async () => {
    await createImpostor(impostorPort, 'http');
    await addStub(impostorPort, getMock(userId));
  });

  test('After repeat, the response must be the next response.', async () => {
    testResponse = await executeTestRequest();
    expect(testResponse.status).toBe(200);
    testResponse = await executeTestRequest();
    expect(testResponse.status).toBe(200);
    testResponse = await executeTestRequest();
    expect(testResponse.status).toBe(200);
    testResponse = await executeTestRequest();
    expect(testResponse.status).toBe(400);
  });
});

async function executeTestRequest() {
  const config = {
    validateStatus: false,
    method: 'GET',
    url: `${TEST_URL}:${impostorPort}/users/${userId}`
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
              method: 'GET',
              path: `/users/${userId}`
            }
          }
        ]
      }
    ],
    responses: [
      {
        is: {
          statusCode: 200
        },
        repeat: 3,
      },
      {
        is: {
          statusCode: 400
        },
      },
    ]
  }
}
