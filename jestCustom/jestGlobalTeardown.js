const { deleteAllImpostors } = require('../mocks/mounteBankOps');

module.exports = async () => {
    await deleteAllImpostors();

    mountebankProcess.stdin.end();
    mountebankProcess.stdout.destroy();
    mountebankProcess.stderr.destroy();
    setTimeout(function() { 
        mountebankProcess.kill();
    }, 5000);
};

