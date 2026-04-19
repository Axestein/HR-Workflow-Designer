import { useEffect } from 'react';
import { useWorkflowStore } from '../store/workflowStore';
import { api } from '../api/mockApi';

export function useAutomations() {
  const { automations, setAutomations } = useWorkflowStore();

  useEffect(() => {
    api.getAutomations().then(setAutomations);
  }, [setAutomations]);

  return automations;
}

export function useSimulation() {
  const { nodes, edges, setSimulationResult, setIsSimulating, setIsSandboxOpen, isSimulating } = useWorkflowStore();

  const runSimulation = async () => {
    setIsSimulating(true);
    setIsSandboxOpen(true);
    setSimulationResult(null);
    try {
      const result = await api.simulate(nodes, edges);
      setSimulationResult(result);
    } finally {
      setIsSimulating(false);
    }
  };

  return { runSimulation, isSimulating };
}

export function useKeyboardShortcuts() {
  const { undo, redo, selectedNodeId, deleteNode } = useWorkflowStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeId) {
        const active = document.activeElement;
        if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT')) return;
        deleteNode(selectedNodeId);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo, selectedNodeId, deleteNode]);
}
