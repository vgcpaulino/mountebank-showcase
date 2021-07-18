const { createImpostor, addStub } = require('../../mocks/mounteBankOps');
const axios = require('axios');

const impostorPort = 4540;
const userId = 'bd6cee73-e72c-4fc9-9c3b-f025041880c5';
const stubMethod = 'GET';
const stubPath = `/users/${userId}`;
const stubUrl = `${TEST_URL}:${impostorPort}`;
const stubResponseStatus = 200;
const stubResponseBody = { id: `${userId}`, status: 'Created' };
const stubRequestCookieName = 'authToken';
const stubRequestCookie = `${stubRequestCookieName}=60f35e1c-5cd3-46bc-b924-8cf23b5ae6f3`;
const stubWrongRequestCookie = `${stubRequestCookieName}=d30ceffc-8ba7-49f6-874e-b68356eea0cd`;

describe('Match by Method, Path, and Headers (Cookie).', () => {

  beforeAll(async () => {
    await createImpostor(impostorPort, 'http');
    await addStub(impostorPort, getMock(userId));
  });

  test('Match when the request has the cookie and value.', async () => {
    config = {
      validateStatus: false,
      method: stubMethod,
      url: `${stubUrl}${stubPath}`,
      headers: {
        Cookie: stubRequestCookie
      }
    };
    testResponse = await axios(config);

    expect(testResponse.status).toBe(stubResponseStatus);
    expect(testResponse.data).toMatchObject({ id: `${userId}`, status: 'Created' });
  });

  test('Does not match when the cookie has no value.', async () => {
    config = {
      validateStatus: false,
      method: stubMethod,
      url: `${stubUrl}${stubPath}`,
      headers: {
        Cookie: stubRequestCookieName
      }
    };
    testResponse = await axios(config);

    expect(testResponse.status).toBe(400);
    expect(testResponse.data).toBe('Bad Request')
  });

  test('Does not match when the cookie has a wrong value.', async () => {
    config = {
      validateStatus: false,
      method: stubMethod,
      url: `${stubUrl}${stubPath}`,
      headers: {
        Cookie: stubWrongRequestCookie
      }
    };
    testResponse = await axios(config);

    expect(testResponse.status).toBe(400);
    expect(testResponse.data).toBe('Bad Request')
  });

  test('Does not match when cookie has partial value.', async () => {
    config = {
      validateStatus: false,
      method: stubMethod,
      url: `${stubUrl}${stubPath}`,
      headers: {
        Cookie: stubRequestCookie.substring(0, stubRequestCookie.length -5)
      }
    };
    testResponse = await axios(config);

    expect(testResponse.status).toBe(400);
    expect(testResponse.data).toBe('Bad Request')
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
              path: stubPath
            },           
          },
          {
            contains: {
              headers: {
                Cookie: stubRequestCookie
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
