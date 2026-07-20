export const ConflictResolver = {
    // 1. Last Write Wins (LWW)
    resolveLastWriteWins: (local, remote) => {
        const localTime = new Date(local.updatedAt || local.timestamp || 0).getTime();
        const remoteTime = new Date(remote.updatedAt || remote.timestamp || 0).getTime();
        return localTime >= remoteTime ? { ...local } : { ...remote };
    },

    // 2. Field-Level Merge
    resolveFieldLevelMerge: (local, remote) => {
        const merged = { ...remote, ...local };
        // Clean up metadata conflicts, keep remote ID/tenantId if necessary
        if (remote.id !== undefined) merged.id = remote.id;
        if (remote.tenantId !== undefined) merged.tenantId = remote.tenantId;
        return merged;
    },

    // 3. Version Comparison
    resolveVersionComparison: (local, remote) => {
        const localVersion = local.version || 0;
        const remoteVersion = remote.version || 0;
        return localVersion >= remoteVersion ? { ...local } : { ...remote };
    },

    // 4. Generate Conflict Timeline
    generateTimeline: (local, remote) => {
        return [
            {
                source: 'Remote Server',
                timestamp: remote.updatedAt || remote.timestamp || new Date().toISOString(),
                data: remote,
                label: 'النسخة المحفوظة على السيرفر'
            },
            {
                source: 'Local Device',
                timestamp: local.updatedAt || local.timestamp || new Date().toISOString(),
                data: local,
                label: 'النسخة المحلية المعدلة أوفلاين'
            }
        ];
    }
};

export default ConflictResolver;
