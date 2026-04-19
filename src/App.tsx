import { useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { Toolbar } from './components/panels/Toolbar';
import { NodeSidebar } from './components/panels/NodeSidebar';
import { WorkflowCanvas } from './components/panels/WorkflowCanvas';
import { ConfigPanel } from './components/panels/ConfigPanel';
import { SandboxPanel } from './components/panels/SandboxPanel';
import { useWorkflowStore } from './store/workflowStore';
import type { WorkflowNodeData } from './types/workflow';

function App() {
  const [draggedType, setDraggedType] = useState<WorkflowNodeData['type'] | null>(null);
  const { selectedNodeId } = useWorkflowStore();

  return (
    <ReactFlowProvider>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <Toolbar />
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
          <NodeSidebar onDragStart={(type) => setDraggedType(type)} />
          <WorkflowCanvas draggedType={draggedType} onDragEnd={() => setDraggedType(null)} />
          {selectedNodeId && <ConfigPanel />}
          <SandboxPanel />
        </div>
      </div>
    </ReactFlowProvider>
  );
}

export default App;
