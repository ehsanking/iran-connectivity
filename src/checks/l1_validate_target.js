const { isValidIPv4 } = require('./common');

async function run(target) {
    const ok = isValidIPv4(target);
    return {
        level: 'L1',
        name: 'target-format',
        ok,
        details: ok ? 'Target is a valid IPv4 address' : 'Target is not a valid IPv4 address'
    };
}

module.exports = { run };
