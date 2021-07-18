const { createImpostor, addStub, updateAllStubs } = require('../../mocks/mounteBankOps');
const axios = require('axios');

const impostorPort = 4540;
const userId1 = 'e21297d0-2746-4930-a12f-780fcd6f78e0';
const userId2 = '1528a3c8-9e87-43d9-beba-290c8af60b6f';

let testResponse;

describe('Update (Overwrite) all Stubs.', () => {

  beforeAll(async () => {
    await createImpostor(impostorPort, 'http');
  });

  test('After updating the Stubs, the response must contain new data.', async () => {
    const statusBeforeUpdate = 'Created';
    await addStub(impostorPort, getMock(userId1, statusBeforeUpdate));
    const impostorInfo = await (await addStub(impostorPort, getMock(userId2, statusBeforeUpdate))).impostorInfo;

    testResponse = await executeTestRequest(userId1);
    expect(testResponse.status).toBe(200);
    expect(testResponse.data.status).toBe(statusBeforeUpdate);
    testResponse = await executeTestRequest(userId2);
    expect(testResponse.status).toBe(200);
    expect(testResponse.data.status).toBe(statusBeforeUpdate);

    const statusAfterUpdate = 'Blocked';
    for (const stub of impostorInfo.stubs) {
      stub.responses[0].is.body.status = statusAfterUpdate;
    }
    const newStubs = { stubs: impostorInfo.stubs };
    await updateAllStubs(impostorPort, newStubs);
    
    testResponse = await executeTestRequest(userId1);
    expect(testResponse.status).toBe(200);
    expect(testResponse.data.status).toBe(statusAfterUpdate);
    testResponse = await executeTestRequest(userId2);
    expect(testResponse.status).toBe(200);
    expect(testResponse.data.status).toBe(statusAfterUpdate);
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

function getMock(userId, status) {
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
