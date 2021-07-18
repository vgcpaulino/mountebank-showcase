const { createImpostor, deleteAllImpostors, deleteSingleImpostor } = require('../../mocks/mounteBankOps');
const axios = require('axios');

const impostor1Port = 4540;
const impostor2Port = 4541;
let testResponse;

describe('Delete Impostors.', () => {

  beforeEach(async () => {
    await createImpostor(impostor1Port, 'http');
    await createImpostor(impostor2Port, 'http');
  });

  afterEach(async () => {
    await deleteAllImpostors();
  });

  test('Delete a single Impostor.', async () => {
    testResponse = await executeTestRequest(impostor1Port);
    expect(testResponse.status).toBe(400);

    testResponse = await executeTestRequest(impostor2Port);
    expect(testResponse.status).toBe(400);

    await deleteSingleImpostor(impostor2Port);

    testResponse = await executeTestRequest(impostor1Port);
    expect(testResponse.status).toBe(400);

    testResponse = await executeTestRequest(impostor2Port);
    expect(testResponse.status).toBe('ECONNREFUSED');
  });
  
  test('Delete all Impostors.', async () => {
    testResponse = await executeTestRequest(impostor1Port);
    expect(testResponse.status).toBe(400);

    testResponse = await executeTestRequest(impostor2Port);
    expect(testResponse.status).toBe(400);

    await deleteAllImpostors();

    testResponse = await executeTestRequest(impostor1Port);
    expect(testResponse.status).toBe('ECONNREFUSED');

    testResponse = await executeTestRequest(impostor2Port);
    expect(testResponse.status).toBe('ECONNREFUSED');
  });

});

async function executeTestRequest(impostorPort) {
  const config = {
    validateStatus: false,
    method: 'GET',
    url: `${TEST_URL}:${impostorPort}/test`
  };
  try {
    return await axios(config);
  } catch (error) {
    return { status: error.code };
  }
}