const { deleteAllImpostors } = require('../mocks/mounteBankOps');
const { getBaseMockProviderUrl } = require('../helpers/environment.helper');
const axios = require('axios');

const url = getBaseMockProviderUrl();

module.exports = async () => {
    const cp = require('child_process');
    global.mountebankProcess = cp.exec('npm run mb:start');

    const result = await executeHealthCheck(`${url}`, 60000, 1000);
    if (!result)
        throw new Error(`Health Check for the the Page under test did NOT work! (URL: ${url})`);
        
    await deleteAllImpostors();
};

async function executeHealthCheck(url, timeout, retryAfter) {
    const timeoutAt = Date.now() + timeout;
    while (timeoutAt >= Date.now()) {
        const result = await executeGetRequest(url);
        if (result) return true;
        await delay(retryAfter);
    }
    return false;
}

async function executeGetRequest(url) {
    try {
        const response = await axios.get(url);
        console.log(`Request to "${url}" response status: ${response.status}`);
        return true;
    } catch (error) {
        console.log(`Request to "${url}" failed with the following error code: ${error.code}`);
        return error.response != undefined;
    }
}

async function delay(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time);
    });
}
