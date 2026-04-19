import type { AutomationAction, SimulationResult, SimulationStep, WorkflowNodeData, NodeType } from '../types/workflow';
import type { Node, Edge } from '@xyflow/react';

const MOCK_AUTOMATIONS: AutomationAction[] = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject', 'body'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'send_slack', label: 'Send Slack Notification', params: ['channel', 'message'] },
  { id: 'create_ticket', label: 'Create JIRA Ticket', params: ['project', 'summary', 'priority'] },
  { id: 'update_hris', label: 'Update HRIS Record', params: ['employeeId', 'field', 'value'] },
  { id: 'trigger_webhook', label: 'Trigger Webhook', params: ['url', 'method', 'payload'] },
  { id: 'schedule_meeting', label: 'Schedule Meeting', params: ['attendees', 'title', 'duration'] },
];

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export const api = {
  async getAutomations(): Promise<AutomationAction[]> {
    await delay(300);
    return MOCK_AUTOMATIONS;
  },

  async simulate(nodes: Node[], edges: Edge[]): Promise<SimulationResult> {
    await delay(800);

    const steps: SimulationStep[] = [];
    const errors: string[] = [];

    const adjacency = new Map<string, string[]>();
    edges.forEach(e => {
      if (!adjacency.has(e.source)) adjacency.set(e.source, []);
      adjacency.get(e.source)!.push(e.target);
    });

    const wfNodes = nodes.map(n => ({ ...n, data: n.data as WorkflowNodeData }));

    const startNodes = wfNodes.filter(n => n.data.type === 'start');
    const endNodes = wfNodes.filter(n => n.data.type === 'end');

    if (startNodes.length === 0) errors.push('Missing Start Node — workflow must have exactly one start point.');
    if (startNodes.length > 1) errors.push('Multiple Start Nodes found — only one is allowed.');
    if (endNodes.length === 0) errors.push('Missing End Node — workflow must have a completion step.');

    const connectedIds = new Set([...edges.map(e => e.source), ...edges.map(e => e.target)]);
    wfNodes.forEach(n => {
      if (n.data.type !== 'start' && n.data.type !== 'end' && !connectedIds.has(n.id)) {
        const title = (n.data as any).title || n.id;
        errors.push(`Node "${title}" is disconnected from the workflow.`);
      }
    });

    // Cycle detection
    const visited = new Set<string>();
    const recStack = new Set<string>();
    let cycleFound = false;
    const hasCycle = (nodeId: string): boolean => {
      visited.add(nodeId);
      recStack.add(nodeId);
      for (const neighbor of (adjacency.get(nodeId) || [])) {
        if (!visited.has(neighbor) && hasCycle(neighbor)) return true;
        if (recStack.has(neighbor)) { cycleFound = true; return true; }
      }
      recStack.delete(nodeId);
      return false;
    };
    wfNodes.forEach(n => { if (!visited.has(n.id)) hasCycle(n.id); });
    if (cycleFound) errors.push('Cycle detected — ensure no circular paths exist.');

    // BFS traversal
    if (startNodes.length === 1) {
      const queue: string[] = [startNodes[0].id];
      const traversed = new Set<string>();
      let stepIdx = 0;

      while (queue.length > 0) {
        const currentId = queue.shift()!;
        if (traversed.has(currentId)) continue;
        traversed.add(currentId);

        const node = wfNodes.find(n => n.id === currentId);
        if (!node) continue;

        const data = node.data;
        const now = new Date();
        now.setSeconds(now.getSeconds() + stepIdx * 2);

        const step: SimulationStep = {
          nodeId: currentId,
          nodeType: data.type as NodeType,
          title: (data as any).title || data.endMessage || `${data.type} Node`,
          status: 'success',
          message: getStepMessage(data),
          timestamp: now.toISOString(),
        };

        if (data.type === 'task' && !(data as any).title) {
          step.status = 'warning'; step.message = 'Task node missing title.';
        }
        if (data.type === 'approval' && !(data as any).approverRole) {
          step.status = 'warning'; step.message = 'Approval node has no approver role defined.';
        }
        if (data.type === 'automated' && !(data as any).actionId) {
          step.status = 'error'; step.message = 'Automated step has no action configured.';
        }

        steps.push(step);
        stepIdx++;
        (adjacency.get(currentId) || []).forEach(n => queue.push(n));
      }
    }

    const hasErrors = errors.length > 0 || steps.some(s => s.status === 'error');
    const hasWarnings = steps.some(s => s.status === 'warning');

    return {
      success: !hasErrors,
      steps,
      errors,
      summary: hasErrors
        ? `Simulation failed with ${errors.length} error(s). Fix issues and retry.`
        : hasWarnings
        ? `Completed with ${steps.filter(s => s.status === 'warning').length} warning(s). Review before deploying.`
        : `Workflow executed successfully across ${steps.length} step(s). Ready to deploy!`,
    };
  },
};

function getStepMessage(data: WorkflowNodeData): string {
  switch (data.type) {
    case 'start': return `Workflow initiated: "${data.title}"`;
    case 'task': return `Task "${data.title}" assigned to ${data.assignee || 'unassigned'}${data.dueDate ? ` — due ${data.dueDate}` : ''}`;
    case 'approval': return `Awaiting approval from ${data.approverRole || 'approver'} (auto-approve ≥ ${data.autoApproveThreshold}%)`;
    case 'automated': return `Executing: ${data.actionId || 'unknown action'}`;
    case 'end': return data.endMessage || 'Workflow complete.';
  }
}
