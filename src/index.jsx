/**
 * View factory for OpenBrowser Component
 * Includes Safe Agent with hot-reload watch daemon linked to data/mcp_commands.json
 */
async function View({ folderPath }) {
    const { useState, useEffect } = dc;

    // Polling Watch Daemon (Inline for safety)
    const Agent = {
        timer: null,
        start: (fPath, onReload) => {
            if (Agent.timer) clearInterval(Agent.timer);
            const cmdFile = fPath + '/data/mcp_commands.json';

            Agent.timer = setInterval(async () => {
                try {
                    const adapter = dc.app.vault.adapter;
                    if (!(await adapter.exists(cmdFile))) return;

                    const content = await adapter.read(cmdFile);
                    let cmd;
                    try { cmd = JSON.parse(content); } catch (e) { return; }

                    if (cmd && cmd.executed === false) {
                        if (cmd.action === 'reload') {
                            cmd.executed = true;
                            cmd.executedAt = new Date().toISOString();
                            await adapter.write(cmdFile, JSON.stringify(cmd, null, 2));
                            onReload();
                        }
                    }
                } catch (e) { console.error("[SafeAgent] Error", e); }
            }, 1000);
            return () => clearInterval(Agent.timer);
        }
    };

    function SafeView() {
        const [app, setApp] = useState(null);
        const [error, setError] = useState(null);
        const [key, setKey] = useState(0);

        // Start agent
        useEffect(() => {
            const stopAgent = Agent.start(folderPath, () => {
                if (dc.app.workspace.activeLeaf?.rebuildView) {
                    dc.app.workspace.activeLeaf.rebuildView();
                } else {
                    setKey(k => k + 1); // Soft reload
                }
            });
            return stopAgent;
        }, []);

        // Load Main Component safely
        useEffect(() => {
            const load = async () => {
                try {
                    const { App } = await dc.require(folderPath + '/src/App.jsx');
                    setApp({ App });
                    setError(null);
                } catch (e) {
                    console.error("Critical Load Error:", e);
                    setError(e);
                }
            };
            load();
        }, [key]);

        if (error) {
            return (
                <div style={{ padding: '40px', background: '#2d1b1b', color: '#ffaaaa', height: '100%', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>💥</div>
                    <h2 style={{ marginTop: 0, color: '#ff8888' }}>Component Crashed</h2>
                    <p style={{ maxWidth: '500px', lineHeight: '1.5', marginBottom: '24px', opacity: 0.8 }}>
                        The internal component failed to load. The <strong>Agent Console</strong> is still active and can be used to reload once fixes are applied.
                    </p>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', overflow: 'auto', width: '100%', maxWidth: '600px', textAlign: 'left', border: '1px solid #522' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#ffcccc' }}>{error.message}</div>
                        <div style={{ fontSize: '11px', opacity: 0.6 }}>{error.stack}</div>
                    </div>
                </div>
            );
        }

        if (!app) {
            return (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span>
                        Loading OpenBrowser...
                    </div>
                    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                </div>
            );
        }

        const { App } = app;
        return <App folderPath={folderPath} />;
    }

    return <SafeView />;
}

return { View };
