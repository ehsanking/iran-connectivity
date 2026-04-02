const test = require('node:test');
const assert = require('node:assert/strict');

const IranConnectivityAnalyzer = require('../iran_connectivity');
const { TunnelRecommendationEngine } = require('../tunnel_recommendations');

test('connectivity score includes traceroute and low-loss mtr bonuses', () => {
    const analyzer = new IranConnectivityAnalyzer({ targetIp: '1.1.1.1' });
    const result = {
        sourcePing: true,
        sourcePort443: true,
        targetPing: true,
        port80: true,
        port443: true,
        port22: true,
        port53: true,
        tracerouteAvailable: true,
        tracerouteReachedTarget: true,
        mtrAvailable: true,
        mtrLossPercent: 1
    };

    const score = analyzer.calculateConnectivityScore(result);
    assert.equal(score, 110);
    assert.equal(result.targetReachability, 100);
});

test('connectivity score remains low when all checks fail', () => {
    const analyzer = new IranConnectivityAnalyzer({ targetIp: '1.1.1.1' });
    const result = {
        sourcePing: false,
        sourcePort443: false,
        targetPing: false,
        port80: false,
        port443: false,
        port22: false,
        port53: false,
        tracerouteAvailable: false,
        tracerouteReachedTarget: false,
        mtrAvailable: false,
        mtrLossPercent: null
    };

    const score = analyzer.calculateConnectivityScore(result);
    assert.equal(score, 0);
    assert.equal(result.targetReachability, 0);
});

test('recommendation engine returns at least one primary recommendation', () => {
    const engine = new TunnelRecommendationEngine();
    const mockResults = {
        summary: { totalTested: 5, successfulConnections: 2, failedConnections: 3, successRate: 40 },
        successfulConnections: [{}, {}],
        detailedResults: [
            { successfulConnections: [{ port80: true, port443: true, port22: true, port53: false }] }
        ]
    };

    const recs = engine.analyzeConnectivityResults(mockResults);
    assert.ok(recs.some((item) => item.type === 'primary'));
});
