import { Play, Undo2, Redo2, Download, Upload, Trash2, GitBranch, Save } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';
import { useSimulation } from '../../hooks/useWorkflow';
import { useRef } from 'react';

export function Toolbar() {
  const { undo, redo, exportWorkflow, importWorkflow, clearWorkflow, nodes, edges, historyIndex, history } = useWorkflowStore();
  const { runSimulation, isSimulating } = useSimulation();
  const importRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const json = exportWorkflow();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workflow-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      importWorkflow(ev.target?.result as string);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <div style={{
      height: 52,
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: 0,
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 20 }}>
        <div style={{
          width: 30, height: 30,
          background: 'var(--accent)',
          borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <GitBranch size={15} color="white" />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>FlowForge</div>
          <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>HR Workflow Designer</div>
        </div>
      </div>

      <div style={{ width: 1, height: 28, background: 'var(--border)', margin: '0 12px' }} />

      {/* Undo/Redo */}
      <div style={{ display: 'flex', gap: 4 }}>
        <IconBtn onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)">
          <Undo2 size={14} />
        </IconBtn>
        <IconBtn onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Y)">
          <Redo2 size={14} />
        </IconBtn>
      </div>

      <div style={{ width: 1, height: 28, background: 'var(--border)', margin: '0 12px' }} />

      {/* Import/Export */}
      <div style={{ display: 'flex', gap: 4 }}>
        <IconBtn onClick={() => importRef.current?.click()} title="Import workflow JSON">
          <Upload size={14} />
        </IconBtn>
        <IconBtn onClick={handleExport} title="Export workflow JSON">
          <Download size={14} />
        </IconBtn>
        <input ref={importRef} type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
      </div>

      <div style={{ width: 1, height: 28, background: 'var(--border)', margin: '0 12px' }} />

      <IconBtn onClick={() => { if (confirm('Clear entire canvas?')) clearWorkflow(); }} title="Clear canvas" danger>
        <Trash2 size={14} />
      </IconBtn>

      {/* Stats */}
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', gap: 12, marginRight: 16 }}>
        <Stat label="Nodes" value={nodes.length} />
        <Stat label="Edges" value={edges.length} />
      </div>

      {/* Save indicator */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '4px 10px',
        background: 'rgba(34,197,94,0.08)',
        border: '1px solid rgba(34,197,94,0.2)',
        borderRadius: 6,
        marginRight: 12,
        fontSize: 10,
        color: '#22c55e',
        fontFamily: "'DM Mono', monospace",
      }}>
        <Save size={10} />
        Auto-saved
      </div>

      {/* Run button */}
      <button
        onClick={runSimulation}
        disabled={isSimulating}
        style={{
          background: isSimulating ? 'var(--accent-dim)' : 'var(--accent)',
          border: isSimulating ? '1px solid var(--accent)' : 'none',
          borderRadius: 8,
          padding: '7px 16px',
          color: isSimulating ? 'var(--accent)' : 'white',
          fontSize: 12,
          fontWeight: 700,
          cursor: isSimulating ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontFamily: 'inherit',
          transition: 'all 0.15s',
        }}
      >
        <Play size={12} fill={isSimulating ? 'var(--accent)' : 'white'} />
        {isSimulating ? 'Running...' : 'Run Simulation'}
      </button>
    </div>
  );
}

function IconBtn({
  children, onClick, disabled, title, danger
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  title?: string;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        background: 'transparent',
        border: '1px solid transparent',
        borderRadius: 7,
        padding: 7,
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: disabled ? 'var(--text-muted)' : danger ? '#ef4444' : 'var(--text-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.12s',
        opacity: disabled ? 0.4 : 1,
      }}
      onMouseEnter={e => {
        if (!disabled) {
          (e.currentTarget as HTMLElement).style.background = danger ? 'rgba(239,68,68,0.1)' : 'var(--bg-elevated)';
          (e.currentTarget as HTMLElement).style.borderColor = danger ? 'rgba(239,68,68,0.3)' : 'var(--border)';
        }
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.background = 'transparent';
        (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
      }}
    >
      {children}
    </button>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
    </div>
  );
}
