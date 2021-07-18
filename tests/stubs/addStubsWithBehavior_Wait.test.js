const { createImpostor, addStub } = require('../../mocks/mounteBankOps');
const axios = require('axios');

const impostorPort = 4540;
const stubMethod = 'GET';
const stubResponseStatus = 200;

let testResponse;

describe('Add Stubs with Wait Behavior to Impostor', () => {

  beforeAll(async () => {
    await createImpostor(impostorPort, 'http');
  });

  test('The response must take the expected delay time.', async () => {
    const stubPath = '/movies1';
    const stubDelay = 1000;
    await addStub(impostorPort, getMock(stubPath, stubDelay));

    const beforeRequest = Date.now();
    testResponse = await executeTestRequest(stubPath);
    const afterRequest = Date.now();
    
    expect(testResponse.status).toBe(stubResponseStatus);
    expect(afterRequest-beforeRequest).toBeGreaterThan(stubDelay);
  });

  test('The response must take the expected delay time (interval).', async () => {
    const stubPath = '/movies2';
    const stubDelay = [1500, 2500] ;
    await addStub(impostorPort, getMock(stubPath, stubDelay));

    const beforeRequest = Date.now();
    testResponse = await executeTestRequest(stubPath);
    const afterRequest = Date.now();
    
    expect(testResponse.status).toBe(stubResponseStatus);
    expect(afterRequest-beforeRequest).toBeGreaterThan(stubDelay[0]);
    expect(afterRequest-beforeRequest).not.toBeGreaterThan(stubDelay[1] + 100);
  });
});

async function executeTestRequest(path) {
  const config = {
    validateStatus: false,
    method: stubMethod,
    url: `${TEST_URL}:${impostorPort}${path}`
  };
  const response = await axios(config);
  return response;
}

function getMock(path, delay) {
  let waitValue = '';
  if (typeof delay === 'number') {
    waitValue = delay;
  } else {
    waitValue = `function() { return Math.floor(Math.random() * (${delay[1]} - ${delay[0]}) + ${delay[0]}); }`;
  }

  return {
    predicates: [
      {
        and: [
          {
            equals: {
              method: stubMethod,
              path: path
            }
          }
        ]
      }
    ],
    responses: [
      {
        is: {
          statusCode: stubResponseStatus,
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
            wait: waitValue 
          }
        ]
      }
    ]
  }
}

function getMockInjection() {
  const mock = getMock();
  mock.predicates[0].and[0].equals.path = 
  mock.responses[0].behaviors[0].wait = 'function() { return Math.floor(Math.random() * 1500) + 2000; }" }';
  return mock;
}