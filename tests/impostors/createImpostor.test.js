const { createImpostor, deleteSingleImpostor } = require('../../mocks/mounteBankOps');
const axios = require('axios');

const impostorPort = 4540;
let testResponse;

describe('Create Impostors', () => {

  afterEach(async () => {
    await deleteSingleImpostor(impostorPort);
  })

  test('Create impostor with custom default response.', async () => {
    await createImpostor(impostorPort, 'http');
    testResponse = await executeTestRequest();
    expect(testResponse.status).toBe(400);
  });

  test('Create impostos without custom default response.', async () => {
    await createImpostor(impostorPort, 'http', null);
    testResponse = await executeTestRequest();
    expect(testResponse.status).toBe(200);
  });

});

async function executeTestRequest() {
  const config = {
    validateStatus: false,
    method: 'GET',
    url: `${TEST_URL}:${impostorPort}/test`
  };
  const response = await axios(config);
  return response;
}