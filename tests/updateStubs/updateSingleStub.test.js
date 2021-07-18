const { createImpostor, addStub, updateSingleStub } = require('../../mocks/mounteBankOps');
const axios = require('axios');

const impostorPort = 4540;
const userId = 'e21297d0-2746-4930-a12f-780fcd6f78e0';

let testResponse;

describe('Update (Overwrite) a single Stub.', () => {

  beforeAll(async () => {
    await createImpostor(impostorPort, 'http');
  });

  test('After updating the Stub, the response must contain new data.', async () => {
    const stubIndex = await (await addStub(impostorPort, getMock('Created'))).stubIndex;
    
    testResponse = await executeTestRequest();
    expect(testResponse.status).toBe(200);
    expect(testResponse.data.status).toBe('Created');

    const newStub = { responses: getMock('Blocked').responses };
    await updateSingleStub(impostorPort, stubIndex, newStub);
    
    testResponse = await executeTestRequest();
    expect(testResponse.status).toBe(200);
    expect(testResponse.data.status).toBe('Blocked');
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
