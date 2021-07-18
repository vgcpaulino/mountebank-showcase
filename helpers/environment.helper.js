function getBaseMockProviderUrl() {
    // return runningOnDocker() ? 'http://mountebank:2525' : 'http://localhost:2525';
    return runningOnDocker() ? 'http://localhost:2525' : 'http://localhost:2525';
}

function getBaseTestUrl() {
    // return runningOnDocker() ? 'http://mountebank' : 'http://localhost';
    return runningOnDocker() ? 'http://localhost' : 'http://localhost';
}

function runningOnDocker() {
    return process.env.DOCKER_EXEC === 'true';
}

module.exports = {
    getBaseMockProviderUrl,
    getBaseTestUrl,
    runningOnDocker,
};
