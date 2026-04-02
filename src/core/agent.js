const http = require('http');
const { runPipeline } = require('./pipeline');

function startAgentServer(options = {}) {
    const port = Number(options.port || 9090);
    const host = options.host || '127.0.0.1';

    const server = http.createServer(async (req, res) => {
        if (req.method === 'GET' && req.url === '/health') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: true }));
            return;
        }

        if (req.method === 'POST' && req.url === '/verify') {
            let body = '';
            req.on('data', (chunk) => {
                body += chunk;
            });
            req.on('end', async () => {
                try {
                    const payload = body ? JSON.parse(body) : {};
                    const target = payload.target;
                    const report = await runPipeline(target, {
                        timeoutSeconds: payload.timeoutSeconds,
                        extra: { agent: { host, port } }
                    });
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(report));
                } catch (error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ ok: false, error: error.message }));
                }
            });
            return;
        }

        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: 'Not found' }));
    });

    return new Promise((resolve) => {
        server.listen(port, host, () => resolve({ server, host, port }));
    });
}

module.exports = {
    startAgentServer
};
