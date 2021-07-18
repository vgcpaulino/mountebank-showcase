const { createImpostor, addStub } = require('../../mocks/mounteBankOps');
const axios = require('axios');

const impostorPort = 4540;
const userId = 'bd6cee73-e72c-4fc9-9c3b-f025041880c5';
const stubMethod = 'GET';
const stubPath = `/users/${userId}`;
const stubUrl = `${TEST_URL}:${impostorPort}`;
const stubResponseStatus = 200;
const stubResponseBody = { id: `${userId}`, status: 'Created' };

describe('Match by Method, Path, and Headers.', () => {

  beforeAll(async () => {
    await createImpostor(impostorPort, 'http');
    await addStub(impostorPort, getMock());
  });

  test('Match with when the request has the header and value.', async () => {
    config = {
      validateStatus: false,
      method: stubMethod,
      url: `${stubUrl}${stubPath}`,
      headers: {
        headerOne: 'valueOne',
        headerTwo: 'valueTwo'
      }
    };
    testResponse = await axios(config);

    expect(testResponse.status).toBe(stubResponseStatus);
    expect(testResponse.data).toMatchObject({ id: `${userId}`, status: 'Created' });
  });

  test('Does not match when the request has the header with different value.', async () => {
    config = {
      validateStatus: false,
      method: 'GET',
      url: `${stubUrl}${stubPath}`,
      headers: {
        headerOne: 'value'
      }
    };
    testResponse = await axios(config);

    expect(testResponse.status).toBe(400);
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
              headers: {
                headerOne: 'valueOne'
              }
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
          body: stubResponseBody
        }
      }
    ]
  }
}
