import { create } from 'zustand';
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import type { WorkflowNodeData, AutomationAction, SimulationResult } from '../types/workflow';

type WFNode = Node<WorkflowNodeData>;

interface WorkflowHistory {
  nodes: WFNode[];
  edges: Edge[];
}

interface WorkflowStore {
  nodes: WFNode[];
  edges: Edge[];
  selectedNodeId: string | null;
  automations: AutomationAction[];
  simulationResult: SimulationResult | null;
  isSimulating: boolean;
  isSandboxOpen: boolean;
  history: WorkflowHistory[];
  historyIndex: number;

  onNodesChange: (changes: NodeChange<WFNode>[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (type: WorkflowNodeData['type'], position: { x: number; y: number }) => void;
  updateNodeData: (nodeId: string, data: Partial<WorkflowNodeData>) => void;
  deleteNode: (nodeId: string) => void;
  deleteEdge: (edgeId: string) => void;
  setSelectedNodeId: (id: string | null) => void;
  setAutomations: (automations: AutomationAction[]) => void;
  setSimulationResult: (result: SimulationResult | null) => void;
  setIsSimulating: (v: boolean) => void;
  setIsSandboxOpen: (v: boolean) => void;
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  exportWorkflow: () => string;
  importWorkflow: (json: string) => void;
  clearWorkflow: () => void;
}

const DEFAULT_NODES: WFNode[] = [
  {
    id: 'start-1',
    type: 'startNode',
    position: { x: 250, y: 60 },
    data: { type: 'start', title: 'Onboarding Start', metadata: [] },
  },
  {
    id: 'task-1',
    type: 'taskNode',
    position: { x: 250, y: 200 },
    data: { type: 'task', title: 'Collect Documents', description: 'Gather all required employee documents', assignee: 'HR Team', dueDate: '', customFields: [] },
  },
  {
    id: 'approval-1',
    type: 'approvalNode',
    position: { x: 250, y: 360 },
    data: { type: 'approval', title: 'Manager Approval', approverRole: 'Manager', autoApproveThreshold: 90 },
  },
  {
    id: 'auto-1',
    type: 'automatedNode',
    position: { x: 250, y: 520 },
    data: { type: 'automated', title: 'Send Welcome Email', actionId: 'send_email', actionParams: { to: 'employee@company.com', subject: 'Welcome aboard!' } },
  },
  {
    id: 'end-1',
    type: 'endNode',
    position: { x: 250, y: 680 },
    data: { type: 'end', endMessage: 'Onboarding complete! Employee is ready.', summaryFlag: true },
  },
];

const DEFAULT_EDGES: Edge[] = [
  { id: 'e1', source: 'start-1', target: 'task-1', animated: true },
  { id: 'e2', source: 'task-1', target: 'approval-1', animated: true },
  { id: 'e3', source: 'approval-1', target: 'auto-1', animated: true },
  { id: 'e4', source: 'auto-1', target: 'end-1', animated: true },
];

const getDefaultData = (type: WorkflowNodeData['type']): WorkflowNodeData => {
  switch (type) {
    case 'start': return { type: 'start', title: 'Start', metadata: [] };
    case 'task': return { type: 'task', title: 'New Task', description: '', assignee: '', dueDate: '', customFields: [] };
    case 'approval': return { type: 'approval', title: 'Approval Step', approverRole: 'Manager', autoApproveThreshold: 80 };
    case 'automated': return { type: 'automated', title: 'Automated Step', actionId: '', actionParams: {} };
    case 'end': return { type: 'end', endMessage: 'Workflow complete', summaryFlag: false };
  }
};

const nodeTypeMap: Record<WorkflowNodeData['type'], string> = {
  start: 'startNode',
  task: 'taskNode',
  approval: 'approvalNode',
  automated: 'automatedNode',
  end: 'endNode',
};

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  nodes: DEFAULT_NODES,
  edges: DEFAULT_EDGES,
  selectedNodeId: null,
  automations: [],
  simulationResult: null,
  isSimulating: false,
  isSandboxOpen: false,
  history: [],
  historyIndex: -1,

  onNodesChange: (changes) => {
    set(s => ({ nodes: applyNodeChanges(changes, s.nodes) as WFNode[] }));
  },

  onEdgesChange: (changes) => {
    set(s => ({ edges: applyEdgeChanges(changes, s.edges) }));
  },

  onConnect: (connection) => {
    get().pushHistory();
    set(s => ({
      edges: addEdge({ ...connection, animated: true, id: uuidv4() }, s.edges),
    }));
  },

  addNode: (type, position) => {
    get().pushHistory();
    const id = `${type}-${uuidv4().slice(0, 8)}`;
    const newNode: WFNode = {
      id,
      type: nodeTypeMap[type],
      position,
      data: getDefaultData(type),
    };
    set(s => ({ nodes: [...s.nodes, newNode], selectedNodeId: id }));
  },

  updateNodeData: (nodeId, data) => {
    set(s => ({
      nodes: s.nodes.map(n =>
        n.id === nodeId ? { ...n, data: { ...n.data, ...data } as WorkflowNodeData } : n
      ),
    }));
  },

  deleteNode: (nodeId) => {
    get().pushHistory();
    set(s => ({
      nodes: s.nodes.filter(n => n.id !== nodeId),
      edges: s.edges.filter(e => e.source !== nodeId && e.target !== nodeId),
      selectedNodeId: s.selectedNodeId === nodeId ? null : s.selectedNodeId,
    }));
  },

  deleteEdge: (edgeId) => {
    set(s => ({ edges: s.edges.filter(e => e.id !== edgeId) }));
  },

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  setAutomations: (automations) => set({ automations }),
  setSimulationResult: (result) => set({ simulationResult: result }),
  setIsSimulating: (v) => set({ isSimulating: v }),
  setIsSandboxOpen: (v) => set({ isSandboxOpen: v }),

  pushHistory: () => {
    const { nodes, edges, history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) });
    const clamped = newHistory.slice(-50);
    set({ history: clamped, historyIndex: clamped.length - 1 });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return;
    const prev = history[historyIndex - 1];
    set({ nodes: prev.nodes, edges: prev.edges, historyIndex: historyIndex - 1 });
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    const next = history[historyIndex + 1];
    set({ nodes: next.nodes, edges: next.edges, historyIndex: historyIndex + 1 });
  },

  exportWorkflow: () => {
    const { nodes, edges } = get();
    return JSON.stringify({ nodes, edges, version: '1.0.0', exportedAt: new Date().toISOString() }, null, 2);
  },

  importWorkflow: (json) => {
    try {
      const data = JSON.parse(json);
      if (data.nodes && data.edges) {
        get().pushHistory();
        set({ nodes: data.nodes as WFNode[], edges: data.edges as Edge[], selectedNodeId: null });
      }
    } catch {
      alert('Invalid workflow JSON');
    }
  },

  clearWorkflow: () => {
    get().pushHistory();
    set({ nodes: [], edges: [], selectedNodeId: null });
  },
}));
