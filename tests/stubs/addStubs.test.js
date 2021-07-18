const { createImpostor, addStub } = require('../../mocks/mounteBankOps');
const axios = require('axios');

const impostorPort = 4540;
const userId1 = 'e21297d0-2746-4930-a12f-780fcd6f78e0';
const userId2 = 'a2f54b51-e9be-44e7-adab-759809fa4ad8';

let testResponse;

describe('Add Stubs to Impostor', () => {

  beforeAll(async () => {
    await createImpostor(impostorPort, 'http');
  });

  test('Add two Stubs to the same Impostor.', async () => {
    testResponse = await executeTestRequest(userId1);
    expect(testResponse.status).toBe(400);

    await addStub(impostorPort, getMock(userId1));
    testResponse = await executeTestRequest(userId1);
    expect(testResponse.status).toBe(200);

    testResponse = await executeTestRequest(userId2);
    expect(testResponse.status).toBe(400);

    await addStub(impostorPort, getMock(userId2));
    testResponse = await executeTestRequest(userId2);
    expect(testResponse.status).toBe(200);
  });
});

async function executeTestRequest(userId) {
  const config = {
    validateStatus: false,
    method: 'GET',
    url: `${TEST_URL}:${impostorPort}/users/${userId}`
  };
  const response = await axios(config);
  return response;
}

function getMock(userId) {
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
          statusCode: 200,
          body: ''
        }
      }
    ]
  }
}
