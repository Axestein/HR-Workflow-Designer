import { useCallback, useRef, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  type OnSelectionChangeParams,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useWorkflowStore } from '../../store/workflowStore';
import { useKeyboardShortcuts } from '../../hooks/useWorkflow';
import { StartNode, TaskNode, ApprovalNode, AutomatedNode, EndNode } from '../nodes/NodeTypes';
import type { WorkflowNodeData } from '../../types/workflow';

const nodeTypes = {
  startNode: StartNode,
  taskNode: TaskNode,
  approvalNode: ApprovalNode,
  automatedNode: AutomatedNode,
  endNode: EndNode,
};

interface Props {
  draggedType: WorkflowNodeData['type'] | null;
  onDragEnd: () => void;
}

export function WorkflowCanvas({ draggedType, onDragEnd }: Props) {
  const {
    nodes, edges,
    onNodesChange, onEdgesChange, onConnect,
    setSelectedNodeId, addNode,
  } = useWorkflowStore();

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  useKeyboardShortcuts();

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedType || !reactFlowInstance || !reactFlowWrapper.current) return;

    const bounds = reactFlowWrapper.current.getBoundingClientRect();
    const position = reactFlowInstance.screenToFlowPosition({
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top,
    });

    addNode(draggedType, position);
    onDragEnd();
  }, [draggedType, reactFlowInstance, addNode, onDragEnd]);

  const onSelectionChange = useCallback(({ nodes: selectedNodes }: OnSelectionChangeParams) => {
    if (selectedNodes.length === 1) {
      setSelectedNodeId(selectedNodes[0].id);
    }
  }, [setSelectedNodeId]);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  return (
    <div
      ref={reactFlowWrapper}
      style={{ flex: 1, position: 'relative' }}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <ReactFlow
        nodes={nodes as Node[]}
        edges={edges}
        onNodesChange={onNodesChange as any}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        onSelectionChange={onSelectionChange}
        onPaneClick={onPaneClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        deleteKeyCode={null}
        style={{ background: 'var(--bg-primary)' }}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: '#3b4262', strokeWidth: 2 },
        }}
        connectionLineStyle={{ stroke: 'var(--accent)', strokeWidth: 2 }}
        snapToGrid
        snapGrid={[16, 16]}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="#252832"
        />
        <Controls style={{ bottom: 16, left: 16 }} showInteractive={false} />
        <MiniMap
          style={{ bottom: 16, right: 16 }}
          nodeColor={(node) => {
            const data = node.data as WorkflowNodeData;
            const colors: Record<string, string> = {
              start: '#22c55e', task: '#3b82f6', approval: '#a855f7',
              automated: '#f97316', end: '#ef4444',
            };
            return colors[data?.type] || '#3b4262';
          }}
          maskColor="rgba(0,0,0,0.4)"
        />

        {nodes.length === 0 && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: 'var(--accent-dim)', border: '1px solid var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 12, fontSize: 24,
            }}>🔀</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>
              Canvas is empty
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Drag nodes from the left panel to get started
            </div>
          </div>
        )}
      </ReactFlow>

      {draggedType && (
        <div style={{
          position: 'absolute', inset: 0,
          border: '2px dashed var(--accent)', borderRadius: 2,
          pointerEvents: 'none', background: 'var(--accent-dim)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
        }}>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--accent)',
            borderRadius: 10, padding: '10px 20px',
            color: 'var(--accent)', fontSize: 13, fontWeight: 600,
          }}>
            Drop to place {draggedType} node
          </div>
        </div>
      )}
    </div>
  );
}
