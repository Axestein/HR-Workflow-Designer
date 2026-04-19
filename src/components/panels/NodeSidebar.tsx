import { useState } from 'react';
import { Play, ClipboardList, CheckSquare, Zap, Flag, LayoutTemplate, FileJson, ChevronRight } from 'lucide-react';
import type { WorkflowNodeData } from '../../types/workflow';
import { WORKFLOW_TEMPLATES } from '../../data/templates';
import { useWorkflowStore } from '../../store/workflowStore';
import { JsonImportModal } from './JsonImportModal';

const NODE_PALETTE = [
  { type: 'start' as WorkflowNodeData['type'], label: 'Start Node', desc: 'Workflow entry point', icon: <Play size={15} />, color: 'var(--node-start)' },
  { type: 'task' as WorkflowNodeData['type'], label: 'Task Node', desc: 'Human task or action', icon: <ClipboardList size={15} />, color: 'var(--node-task)' },
  { type: 'approval' as WorkflowNodeData['type'], label: 'Approval Node', desc: 'Manager or HR approval', icon: <CheckSquare size={15} />, color: 'var(--node-approval)' },
  { type: 'automated' as WorkflowNodeData['type'], label: 'Automated Step', desc: 'System-triggered action', icon: <Zap size={15} />, color: 'var(--node-auto)' },
  { type: 'end' as WorkflowNodeData['type'], label: 'End Node', desc: 'Workflow completion', icon: <Flag size={15} />, color: 'var(--node-end)' },
];

interface Props {
  onDragStart: (type: WorkflowNodeData['type']) => void;
}

export function NodeSidebar({ onDragStart }: Props) {
  const { importWorkflow } = useWorkflowStore();
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [loadingTemplate, setLoadingTemplate] = useState<string | null>(null);

  const handleLoadTemplate = (template: typeof WORKFLOW_TEMPLATES[0]) => {
    setLoadingTemplate(template.label);
    // Serialize template into importWorkflow format
    const payload = JSON.stringify({
      nodes: template.nodes,
      edges: template.edges,
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
    });
    importWorkflow(payload);
    setTimeout(() => setLoadingTemplate(null), 600);
  };

  return (
    <>
      <div style={{
        width: 220,
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ padding: '14px 14px 10px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28,
              background: 'var(--accent-dim)',
              border: '1px solid var(--accent)',
              borderRadius: 7,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--accent)',
            }}>
              <LayoutTemplate size={13} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>Node Palette</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Drag onto canvas</div>
            </div>
          </div>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, padding: '12px' }}>

          {/* Node types */}
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
            Nodes
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 18 }}>
            {NODE_PALETTE.map(node => (
              <div
                key={node.type}
                draggable
                onDragStart={() => onDragStart(node.type)}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 9,
                  padding: '8px 10px',
                  cursor: 'grab',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 9,
                  transition: 'all 0.15s',
                  userSelect: 'none',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = node.color;
                  (e.currentTarget as HTMLElement).style.background = `${node.color}0a`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                  (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)';
                }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: 7,
                  background: `${node.color}18`, border: `1px solid ${node.color}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: node.color, flexShrink: 0,
                }}>
                  {node.icon}
                </div>
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-primary)' }}>{node.label}</div>
                  <div style={{ fontSize: 9.5, color: 'var(--text-muted)' }}>{node.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Templates */}
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
            Quick Templates
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 18 }}>
            {WORKFLOW_TEMPLATES.map(t => {
              const isLoading = loadingTemplate === t.label;
              return (
                <div
                  key={t.label}
                  onClick={() => handleLoadTemplate(t)}
                  style={{
                    background: isLoading ? 'rgba(249,115,22,0.08)' : 'var(--bg-card)',
                    border: `1px solid ${isLoading ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: 9,
                    padding: '9px 10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => {
                    if (!isLoading) {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)';
                      (e.currentTarget as HTMLElement).style.background = 'var(--accent-dim)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isLoading) {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                      (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)';
                    }
                  }}
                >
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{t.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11.5, fontWeight: 600, color: isLoading ? 'var(--accent)' : 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {isLoading ? 'Loading...' : t.label}
                    </div>
                    <div style={{ fontSize: 9.5, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.description}
                    </div>
                  </div>
                  {!isLoading && <ChevronRight size={11} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />}
                </div>
              );
            })}
          </div>

          {/* JSON Import */}
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
            JSON Import
          </div>
          <button
            onClick={() => setShowJsonModal(true)}
            style={{
              width: '100%',
              background: 'var(--bg-card)',
              border: '1px dashed var(--border-light)',
              borderRadius: 9,
              padding: '10px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 5,
              transition: 'all 0.15s',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)';
              (e.currentTarget as HTMLElement).style.background = 'var(--accent-dim)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-light)';
              (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)';
            }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'rgba(249,115,22,0.1)',
              border: '1px solid rgba(249,115,22,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--accent)',
            }}>
              <FileJson size={15} />
            </div>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-primary)' }}>
              Import JSON
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.4 }}>
              Paste or upload JSON to build nodes automatically
            </div>
          </button>
        </div>
      </div>

      {showJsonModal && <JsonImportModal onClose={() => setShowJsonModal(false)} />}
    </>
  );
}
