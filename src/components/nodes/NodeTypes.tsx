import type { NodeProps } from '@xyflow/react';
import { Play, ClipboardList, CheckSquare, Zap, Flag } from 'lucide-react';
import { BaseNode, NodeTitle, NodeMeta } from './BaseNode';
import type { StartNodeData, TaskNodeData, ApprovalNodeData, AutomatedNodeData, EndNodeData } from '../../types/workflow';

export function StartNode({ id, data, selected }: NodeProps & { data: StartNodeData }) {
  return (
    <BaseNode id={id} color="var(--node-start)" icon={<Play size={13} />} label="Start" hasTarget={false} selected={selected}>
      <NodeTitle title={data.title} />
      {data.metadata.length > 0 && (
        <NodeMeta>{data.metadata.length} metadata key{data.metadata.length !== 1 ? 's' : ''}</NodeMeta>
      )}
    </BaseNode>
  );
}

export function TaskNode({ id, data, selected }: NodeProps & { data: TaskNodeData }) {
  return (
    <BaseNode id={id} color="var(--node-task)" icon={<ClipboardList size={13} />} label="Task" selected={selected}>
      <NodeTitle title={data.title} />
      <NodeMeta>
        {data.assignee ? `→ ${data.assignee}` : 'Unassigned'}
        {data.dueDate ? ` · ${data.dueDate}` : ''}
      </NodeMeta>
      {data.description && (
        <div style={{
          fontSize: 11,
          color: 'var(--text-secondary)',
          marginTop: 5,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: 180,
        }}>
          {data.description}
        </div>
      )}
    </BaseNode>
  );
}

export function ApprovalNode({ id, data, selected }: NodeProps & { data: ApprovalNodeData }) {
  return (
    <BaseNode id={id} color="var(--node-approval)" icon={<CheckSquare size={13} />} label="Approval" selected={selected}>
      <NodeTitle title={data.title} />
      <NodeMeta>
        {data.approverRole || 'No role set'} · threshold {data.autoApproveThreshold}%
      </NodeMeta>
    </BaseNode>
  );
}

export function AutomatedNode({ id, data, selected }: NodeProps & { data: AutomatedNodeData }) {
  return (
    <BaseNode id={id} color="var(--node-auto)" icon={<Zap size={13} />} label="Automated" selected={selected}>
      <NodeTitle title={data.title} />
      <NodeMeta>
        {data.actionId ? `⚡ ${data.actionId}` : 'No action set'}
        {Object.keys(data.actionParams || {}).length > 0 &&
          ` · ${Object.keys(data.actionParams).length} param${Object.keys(data.actionParams).length !== 1 ? 's' : ''}`}
      </NodeMeta>
    </BaseNode>
  );
}

export function EndNode({ id, data, selected }: NodeProps & { data: EndNodeData }) {
  return (
    <BaseNode id={id} color="var(--node-end)" icon={<Flag size={13} />} label="End" hasSource={false} selected={selected}>
      <NodeTitle title={data.endMessage || 'Workflow complete'} />
      {data.summaryFlag && <NodeMeta>📋 Summary enabled</NodeMeta>}
    </BaseNode>
  );
}
