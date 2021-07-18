const { getBaseMockProviderUrl, getBaseTestUrl } = require('../helpers/environment.helper');

global.MOCK_PROVIDER_URL = getBaseMockProviderUrl();
global.TEST_URL = getBaseTestUrl();