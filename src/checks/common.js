const net = require('net');
const dns = require('dns').promises;
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

function isValidIPv4(value) {
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(value);
}

async function runCommand(command, timeoutMs) {
    try {
        const { stdout, stderr } = await execAsync(command, { timeout: timeoutMs });
        return { ok: true, stdout: String(stdout || ''), stderr: String(stderr || '') };
    } catch (error) {
        return {
            ok: false,
            stdout: String(error.stdout || ''),
            stderr: String(error.stderr || ''),
            error: error.message
        };
    }
}

function checkTcpPort(host, port, timeoutMs) {
    return new Promise((resolve) => {
        const socket = net.createConnection({ host, port });
        let settled = false;

        const finalize = (ok, error = null) => {
            if (settled) return;
            settled = true;
            socket.destroy();
            resolve({ ok, error });
        };

        socket.setTimeout(timeoutMs);
        socket.on('connect', () => finalize(true));
        socket.on('timeout', () => finalize(false, 'timeout'));
        socket.on('error', (err) => finalize(false, err.message));
    });
}

async function resolveDns(target) {
    try {
        const result = await dns.lookup(target);
        return { ok: true, address: result.address };
    } catch (error) {
        return { ok: false, error: error.message };
    }
}

module.exports = {
    checkTcpPort,
    isValidIPv4,
    resolveDns,
    runCommand
};
