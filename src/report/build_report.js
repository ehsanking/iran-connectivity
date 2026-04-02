function buildReport(target, levels, extra = {}) {
    const passedLevels = levels.filter((item) => item.ok).length;
    const totalLevels = levels.length;
    const failedLevels = totalLevels - passedLevels;

    return {
        schemaVersion: '1.0.0',
        generatedAt: new Date().toISOString(),
        target,
        pipeline: {
            levels,
            summary: {
                totalLevels,
                passedLevels,
                failedLevels,
                passRate: totalLevels > 0 ? Number(((passedLevels / totalLevels) * 100).toFixed(2)) : 0
            }
        },
        ...extra
    };
}

module.exports = {
    buildReport
};
