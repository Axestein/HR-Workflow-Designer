import { Handle, Position } from '@xyflow/react';
import { useWorkflowStore } from '../../store/workflowStore';
import { Trash2 } from 'lucide-react';

interface BaseNodeProps {
  id: string;
  children: React.ReactNode;
  color: string;
  icon: React.ReactNode;
  label: string;
  hasSource?: boolean;
  hasTarget?: boolean;
  selected?: boolean;
}

export function BaseNode({ id, children, color, icon, label, hasSource = true, hasTarget = true, selected }: BaseNodeProps) {
  const { setSelectedNodeId, deleteNode, selectedNodeId } = useWorkflowStore();
  const isSelected = selected || selectedNodeId === id;

  return (
    <div
      onClick={() => setSelectedNodeId(id)}
      style={{
        background: 'var(--bg-card)',
        border: `1.5px solid ${isSelected ? color : 'var(--border)'}`,
        borderRadius: 12,
        minWidth: 220,
        boxShadow: isSelected ? `0 0 0 3px ${color}22, 0 8px 32px rgba(0,0,0,0.4)` : '0 4px 16px rgba(0,0,0,0.3)',
        transition: 'all 0.15s ease',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'visible',
      }}
    >
      {hasTarget && (
        <Handle
          type="target"
          position={Position.Top}
          style={{ background: color, top: -5 }}
        />
      )}

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 14px',
        borderBottom: '1px solid var(--border)',
        background: `${color}12`,
        borderRadius: '10px 10px 0 0',
      }}>
        <div style={{
          width: 28, height: 28,
          borderRadius: 7,
          background: `${color}22`,
          border: `1px solid ${color}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color,
          flexShrink: 0,
        }}>
          {icon}
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: color, textTransform: 'uppercase', flex: 1 }}>
          {label}
        </span>
        {isSelected && (
          <button
            onClick={(e) => { e.stopPropagation(); deleteNode(id); }}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#ef4444',
              padding: 2,
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              opacity: 0.7,
            }}
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '10px 14px 12px' }}>
        {children}
      </div>

      {hasSource && (
        <Handle
          type="source"
          position={Position.Bottom}
          style={{ background: color, bottom: -5 }}
        />
      )}
    </div>
  );
}

export function NodeTitle({ title }: { title: string }) {
  return (
    <div style={{
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--text-primary)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      maxWidth: 180,
    }}>
      {title || 'Untitled'}
    </div>
  );
}

export function NodeMeta({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3, fontFamily: "'DM Mono', monospace" }}>
      {children}
    </div>
  );
}
