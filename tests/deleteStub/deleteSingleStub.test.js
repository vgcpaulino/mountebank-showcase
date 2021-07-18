const { createImpostor, addStub, deleteSingleStub } = require('../../mocks/mounteBankOps');
const axios = require('axios');

const impostorPort = 4540;
const userId = 'e21297d0-2746-4930-a12f-780fcd6f78e0';

let testResponse;

describe('Remove a single Stub.', () => {

  beforeAll(async () => {
    await createImpostor(impostorPort, 'http');
  });

  test('After deleting the Stub, the response must be the default.', async () => {
    const stubIndex = await (await addStub(impostorPort, getMock('Created'))).stubIndex;
    
    testResponse = await executeTestRequest();
    expect(testResponse.status).toBe(200);
    expect(testResponse.data.status).toBe('Created');

    await deleteSingleStub(impostorPort, stubIndex);
    
    testResponse = await executeTestRequest();
    expect(testResponse.status).toBe(400);
    expect(testResponse.data).toBe('Bad Request');
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

function getMock(status) {
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
          headers: {
            'content-type': 'application/json',
          },
          body: {
            id: userId,
            status: status
          }
        }
      }
    ]
  }
}
