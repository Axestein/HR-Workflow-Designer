import { X, Play, CheckCircle2, XCircle, AlertTriangle, Clock, Loader2 } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';
import { useSimulation } from '../../hooks/useWorkflow';
import type { SimulationStep } from '../../types/workflow';

const STATUS_CONFIG = {
  success: { icon: <CheckCircle2 size={13} />, color: '#22c55e', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)' },
  warning: { icon: <AlertTriangle size={13} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
  error: { icon: <XCircle size={13} />, color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)' },
};

const NODE_TYPE_COLORS: Record<string, string> = {
  start: 'var(--node-start)',
  task: 'var(--node-task)',
  approval: 'var(--node-approval)',
  automated: 'var(--node-auto)',
  end: 'var(--node-end)',
};

export function SandboxPanel() {
  const { simulationResult, isSandboxOpen, setIsSandboxOpen, isSimulating } = useWorkflowStore();
  const { runSimulation } = useSimulation();

  if (!isSandboxOpen) return null;

  return (
    <div className="slide-in" style={{
      position: 'absolute', right: 16, bottom: 16,
      width: 380, maxHeight: 'calc(100vh - 100px)',
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 14, display: 'flex', flexDirection: 'column',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)', zIndex: 100, overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'var(--bg-elevated)',
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 7,
          background: 'var(--accent-dim)', border: '1px solid var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)',
        }}>
          <Play size={12} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Workflow Sandbox</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Step-by-step execution simulation</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={runSimulation}
            disabled={isSimulating}
            style={{
              background: isSimulating ? 'rgba(249,115,22,0.1)' : 'var(--accent)',
              border: isSimulating ? '1px solid var(--accent)' : 'none',
              borderRadius: 7, padding: '5px 12px',
              cursor: isSimulating ? 'not-allowed' : 'pointer',
              color: isSimulating ? 'var(--accent)' : 'white',
              fontSize: 11, fontWeight: 600, fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 5,
            }}
          >
            {isSimulating
              ? <><Loader2 size={11} className="spin" /> Running...</>
              : <><Play size={11} /> Re-run</>
            }
          </button>
          <button
            onClick={() => setIsSandboxOpen(false)}
            style={{
              background: 'transparent', border: '1px solid var(--border)',
              borderRadius: 7, padding: 5, cursor: 'pointer',
              color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
            }}
          >
            <X size={13} />
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 14 }}>
        {isSimulating && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <Loader2 size={28} className="spin" style={{ color: 'var(--accent)', margin: '0 auto 12px', display: 'block' }} />
            <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Simulating workflow execution...</div>
          </div>
        )}

        {!isSimulating && simulationResult && (
          <>
            {/* Summary banner */}
            <div style={{
              padding: '10px 14px', borderRadius: 9,
              background: simulationResult.success ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)',
              border: `1px solid ${simulationResult.success ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
              marginBottom: 14, display: 'flex', alignItems: 'flex-start', gap: 8,
            }}>
              <div style={{ color: simulationResult.success ? '#22c55e' : '#ef4444', marginTop: 1 }}>
                {simulationResult.success ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: simulationResult.success ? '#22c55e' : '#ef4444', marginBottom: 2 }}>
                  {simulationResult.success ? 'Simulation Passed' : 'Simulation Failed'}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {simulationResult.summary}
                </div>
              </div>
            </div>

            {/* Errors */}
            {simulationResult.errors.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                  Validation Errors
                </div>
                {simulationResult.errors.map((err, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 8, alignItems: 'flex-start',
                    padding: '7px 10px',
                    background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)',
                    borderRadius: 7, marginBottom: 5, fontSize: 11, color: '#ef4444',
                  }}>
                    <XCircle size={11} style={{ flexShrink: 0, marginTop: 1 }} />
                    {err}
                  </div>
                ))}
              </div>
            )}

            {/* Execution steps */}
            {simulationResult.steps.length > 0 && (
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                  Execution Log ({simulationResult.steps.length} steps)
                </div>
                <div style={{ position: 'relative' }}>
                  {simulationResult.steps.length > 1 && (
                    <div style={{
                      position: 'absolute', left: 17, top: 28, bottom: 10,
                      width: 1, background: 'var(--border)',
                    }} />
                  )}
                  {simulationResult.steps.map((step, i) => (
                    <StepItem key={step.nodeId + i} step={step} index={i} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {!isSimulating && !simulationResult && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <Play size={28} style={{ color: 'var(--text-muted)', margin: '0 auto 12px', display: 'block' }} />
            <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Click Re-run to simulate the workflow</div>
          </div>
        )}
      </div>
    </div>
  );
}

function StepItem({ step, index }: { step: SimulationStep; index: number }) {
  const sc = STATUS_CONFIG[step.status];
  const nodeColor = NODE_TYPE_COLORS[step.nodeType] || 'var(--text-muted)';

  return (
    <div className="exec-step" style={{ animationDelay: `${index * 80}ms`, display: 'flex', gap: 10, marginBottom: 10 }}>
      <div style={{
        width: 24, height: 24, borderRadius: '50%',
        background: sc.bg, border: `1.5px solid ${sc.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: sc.color, flexShrink: 0, zIndex: 1,
      }}>
        {sc.icon}
      </div>
      <div style={{
        flex: 1, background: sc.bg, border: `1px solid ${sc.border}`,
        borderRadius: 8, padding: '7px 10px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: nodeColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {step.nodeType}
          </span>
          <span style={{ flex: 1, fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {step.title}
          </span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
          {step.message}
        </div>
        <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Clock size={9} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>
            {new Date(step.timestamp).toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
}
