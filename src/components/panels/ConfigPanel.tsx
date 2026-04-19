import { X, Trash2, Play, ClipboardList, CheckSquare, Zap, Flag } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';
import { StartNodeForm, TaskNodeForm, ApprovalNodeForm, AutomatedNodeForm, EndNodeForm } from '../forms/NodeForms';
import type { WorkflowNodeData } from '../../types/workflow';

const NODE_CONFIG = {
  start: { label: 'Start Node', icon: <Play size={13} />, color: 'var(--node-start)' },
  task: { label: 'Task Node', icon: <ClipboardList size={13} />, color: 'var(--node-task)' },
  approval: { label: 'Approval Node', icon: <CheckSquare size={13} />, color: 'var(--node-approval)' },
  automated: { label: 'Automated Step', icon: <Zap size={13} />, color: 'var(--node-auto)' },
  end: { label: 'End Node', icon: <Flag size={13} />, color: 'var(--node-end)' },
};

export function ConfigPanel() {
  const { selectedNodeId, nodes, setSelectedNodeId, deleteNode } = useWorkflowStore();
  const node = nodes.find(n => n.id === selectedNodeId);

  if (!node) return null;

  const data = node.data as WorkflowNodeData;
  const config = NODE_CONFIG[data.type];

  return (
    <div
      className="slide-in"
      style={{
        width: 280,
        background: 'var(--bg-secondary)',
        borderLeft: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: `${config.color}08`,
      }}>
        <div style={{
          width: 30, height: 30,
          borderRadius: 7,
          background: `${config.color}18`,
          border: `1px solid ${config.color}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: config.color,
          flexShrink: 0,
        }}>
          {config.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{config.label}</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>{node.id}</div>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            onClick={() => deleteNode(node.id)}
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 6,
              padding: 5,
              cursor: 'pointer',
              color: '#ef4444',
              display: 'flex', alignItems: 'center',
            }}
            title="Delete node"
          >
            <Trash2 size={12} />
          </button>
          <button
            onClick={() => setSelectedNodeId(null)}
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              padding: 5,
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex', alignItems: 'center',
            }}
            title="Close"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {/* Form */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        <NodeFormRouter nodeId={node.id} type={data.type} />
      </div>

      {/* Footer hint */}
      <div style={{
        padding: '10px 16px',
        borderTop: '1px solid var(--border)',
        fontSize: 10,
        color: 'var(--text-muted)',
        fontFamily: "'DM Mono', monospace",
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <span>Del to remove</span>
        <span>Changes auto-saved</span>
      </div>
    </div>
  );
}

function NodeFormRouter({ nodeId, type }: { nodeId: string; type: WorkflowNodeData['type'] }) {
  switch (type) {
    case 'start': return <StartNodeForm nodeId={nodeId} />;
    case 'task': return <TaskNodeForm nodeId={nodeId} />;
    case 'approval': return <ApprovalNodeForm nodeId={nodeId} />;
    case 'automated': return <AutomatedNodeForm nodeId={nodeId} />;
    case 'end': return <EndNodeForm nodeId={nodeId} />;
    default: return null;
  }
}
