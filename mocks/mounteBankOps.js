const axios = require('axios');
const { getBaseMockProviderUrl } = require('../helpers/environment.helper');
const MOCK_PROVIDER_URL = getBaseMockProviderUrl();

async function addStub(port, stub) {
    let body = {
        stub: {
            ...stub
        }
    }
    let config = {
        validateStatus: false,
        method: 'POST',
        url: `${MOCK_PROVIDER_URL}/imposters/${port}/stubs`,
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify(body),
    };
    const response = await axios(config);
    (response.status = 201) ? printMessage('Stub Created!') : printMessage('ERROR: Stub was NOT created!');

    const stubs = response.data.stubs;
    const lastStub = stubs[stubs.length -1];
    const stubLink = lastStub._links.self.href;
    const stubIndex = stubLink.substr(stubLink.lastIndexOf('/') + 1);
    return { stubIndex: stubIndex, impostorInfo: response.data }
}

async function createImpostor(port, protocol, defaultResponse = 400) {
    let body = {
        port: port,
        protocol: protocol,
        defaultResponse: {
            statusCode: defaultResponse,
            body: 'Bad Request'
        }
    };

    if (defaultResponse = null) {
        delete body.defaultResponse;
    }

    let config = {
        validateStatus: false,
        method: 'post',
        url: `${MOCK_PROVIDER_URL}/imposters`,
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify(body),
    };
    const response = await axios(config);
    (response.status = 201) ? printMessage('Impostor Created!') : printMessage('ERROR: Impostor was NOT created!');
}

async function deleteAllImpostors() {
    const config = {
        method: 'DELETE',
        url: `${MOCK_PROVIDER_URL}/imposters`,
    };
    const response = await axios(config);
    (response.status = 200) ? printMessage('All Impostors deleted!') : printMessage('ERROR: The impostors were not deleted!');
};

async function deleteSingleImpostor(port) {
    const config = {
        method: 'DELETE',
        url: `${MOCK_PROVIDER_URL}/imposters/${port}`,
    };
    const response = await axios(config);
    (response.status = 200) ? printMessage('A single Impostor was deleted!') : printMessage('ERROR: The impostor was not deleted!');
}

async function deleteSingleStub(port, stubIndex) {
    const config = {
        method: 'DELETE',
        url: `${MOCK_PROVIDER_URL}/imposters/${port}/stubs/${stubIndex}`,
    };
    const response = await axios(config);
    (response.status = 200) ? printMessage('A single Stub was deleted!') : printMessage('ERROR: The stub was not deleted!');
}

async function updateAllStubs(port, stubs) {
    const config = {
        method: 'PUT',
        url: `${MOCK_PROVIDER_URL}/imposters/${port}/stubs`,
        data: JSON.stringify(stubs),
    };
    const response = await axios(config);
    (response.status = 200) ? printMessage('Stub updated!') : printMessage('ERROR: The stub was not updated!');
}

async function updateSingleStub(port, stubIndex, stub) {
    const config = {
        method: 'PUT',
        url: `${MOCK_PROVIDER_URL}/imposters/${port}/stubs/${stubIndex}`,
        data: JSON.stringify(stub),
    };
    const response = await axios(config);
    (response.status = 200) ? printMessage('Stub updated!') : printMessage('ERROR: The stub was not updated!');
}

function printMessage(message) {
    // console.log(message);
}

module.exports = {
    addStub,
    createImpostor,
    deleteAllImpostors,
    deleteSingleImpostor,
    deleteSingleStub,
    updateAllStubs,
    updateSingleStub
}