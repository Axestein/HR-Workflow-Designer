import type { Edge } from '@xyflow/react';
import type { WorkflowNodeData } from '../types/workflow';

type WFNode = {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: WorkflowNodeData;
};

export interface WorkflowTemplate {
  label: string;
  icon: string;
  description: string;
  nodes: WFNode[];
  edges: Edge[];
}

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    label: 'Employee Onboarding',
    icon: '👤',
    description: 'Full onboarding from doc collection to system setup',
    nodes: [
      {
        id: 't1-start',
        type: 'startNode',
        position: { x: 260, y: 40 },
        data: { type: 'start', title: 'Employee Onboarding', metadata: [{ key: 'department', value: 'Engineering' }, { key: 'startDate', value: '' }] },
      },
      {
        id: 't1-task1',
        type: 'taskNode',
        position: { x: 260, y: 180 },
        data: { type: 'task', title: 'Collect Documents', description: 'ID proof, offer letter, bank details, educational certificates', assignee: 'HR Coordinator', dueDate: '', customFields: [{ key: 'priority', value: 'high' }] },
      },
      {
        id: 't1-task2',
        type: 'taskNode',
        position: { x: 260, y: 330 },
        data: { type: 'task', title: 'IT Equipment Setup', description: 'Laptop, access cards, email, Slack, GitHub org invite', assignee: 'IT Team', dueDate: '', customFields: [] },
      },
      {
        id: 't1-approval',
        type: 'approvalNode',
        position: { x: 260, y: 480 },
        data: { type: 'approval', title: 'Manager Sign-off', approverRole: 'Manager', autoApproveThreshold: 85 },
      },
      {
        id: 't1-auto1',
        type: 'automatedNode',
        position: { x: 260, y: 630 },
        data: { type: 'automated', title: 'Send Welcome Email', actionId: 'send_email', actionParams: { to: 'new.employee@company.com', subject: 'Welcome to the team! 🎉', body: 'We are thrilled to have you on board.' } },
      },
      {
        id: 't1-auto2',
        type: 'automatedNode',
        position: { x: 260, y: 780 },
        data: { type: 'automated', title: 'Update HRIS Record', actionId: 'update_hris', actionParams: { employeeId: '', field: 'status', value: 'active' } },
      },
      {
        id: 't1-end',
        type: 'endNode',
        position: { x: 260, y: 930 },
        data: { type: 'end', endMessage: 'Onboarding complete! Employee is fully set up and ready to start.', summaryFlag: true },
      },
    ],
    edges: [
      { id: 'te1-1', source: 't1-start', target: 't1-task1', animated: true },
      { id: 'te1-2', source: 't1-task1', target: 't1-task2', animated: true },
      { id: 'te1-3', source: 't1-task2', target: 't1-approval', animated: true },
      { id: 'te1-4', source: 't1-approval', target: 't1-auto1', animated: true },
      { id: 'te1-5', source: 't1-auto1', target: 't1-auto2', animated: true },
      { id: 'te1-6', source: 't1-auto2', target: 't1-end', animated: true },
    ],
  },
  {
    label: 'Leave Approval',
    icon: '🏖️',
    description: 'Leave request → manager approval → calendar update',
    nodes: [
      {
        id: 't2-start',
        type: 'startNode',
        position: { x: 260, y: 40 },
        data: { type: 'start', title: 'Leave Request Initiated', metadata: [{ key: 'leaveType', value: 'Annual' }] },
      },
      {
        id: 't2-task1',
        type: 'taskNode',
        position: { x: 260, y: 180 },
        data: { type: 'task', title: 'Employee Submits Request', description: 'Fill in leave dates, type, and reason via HRIS portal', assignee: 'Employee', dueDate: '', customFields: [{ key: 'leaveDays', value: '' }] },
      },
      {
        id: 't2-approval1',
        type: 'approvalNode',
        position: { x: 260, y: 330 },
        data: { type: 'approval', title: 'Direct Manager Approval', approverRole: 'Manager', autoApproveThreshold: 100 },
      },
      {
        id: 't2-approval2',
        type: 'approvalNode',
        position: { x: 260, y: 480 },
        data: { type: 'approval', title: 'HR Business Partner Review', approverRole: 'HRBP', autoApproveThreshold: 90 },
      },
      {
        id: 't2-auto1',
        type: 'automatedNode',
        position: { x: 260, y: 630 },
        data: { type: 'automated', title: 'Update Leave Balance', actionId: 'update_hris', actionParams: { employeeId: '', field: 'leaveBalance', value: 'deduct' } },
      },
      {
        id: 't2-auto2',
        type: 'automatedNode',
        position: { x: 260, y: 780 },
        data: { type: 'automated', title: 'Notify Employee', actionId: 'send_email', actionParams: { to: 'employee@company.com', subject: 'Leave Request Approved', body: 'Your leave has been approved.' } },
      },
      {
        id: 't2-end',
        type: 'endNode',
        position: { x: 260, y: 930 },
        data: { type: 'end', endMessage: 'Leave approved and calendar updated.', summaryFlag: false },
      },
    ],
    edges: [
      { id: 'te2-1', source: 't2-start', target: 't2-task1', animated: true },
      { id: 'te2-2', source: 't2-task1', target: 't2-approval1', animated: true },
      { id: 'te2-3', source: 't2-approval1', target: 't2-approval2', animated: true },
      { id: 'te2-4', source: 't2-approval2', target: 't2-auto1', animated: true },
      { id: 'te2-5', source: 't2-auto1', target: 't2-auto2', animated: true },
      { id: 'te2-6', source: 't2-auto2', target: 't2-end', animated: true },
    ],
  },
  {
    label: 'Doc Verification',
    icon: '📄',
    description: 'Collect, verify, and archive employee documents',
    nodes: [
      {
        id: 't3-start',
        type: 'startNode',
        position: { x: 260, y: 40 },
        data: { type: 'start', title: 'Document Verification Flow', metadata: [{ key: 'docSet', value: 'Joining Kit' }] },
      },
      {
        id: 't3-task1',
        type: 'taskNode',
        position: { x: 260, y: 180 },
        data: { type: 'task', title: 'Collect Documents from Employee', description: 'Government ID, degree certificates, previous employment letters, PAN card', assignee: 'HR Coordinator', dueDate: '', customFields: [{ key: 'checklistVersion', value: 'v3' }] },
      },
      {
        id: 't3-task2',
        type: 'taskNode',
        position: { x: 260, y: 330 },
        data: { type: 'task', title: 'Initial Document Review', description: 'Check for completeness and legibility of all submitted documents', assignee: 'HR Team', dueDate: '', customFields: [] },
      },
      {
        id: 't3-approval',
        type: 'approvalNode',
        position: { x: 260, y: 480 },
        data: { type: 'approval', title: 'Compliance Sign-off', approverRole: 'Director', autoApproveThreshold: 95 },
      },
      {
        id: 't3-auto1',
        type: 'automatedNode',
        position: { x: 260, y: 630 },
        data: { type: 'automated', title: 'Generate Verification Report', actionId: 'generate_doc', actionParams: { template: 'doc-verification-v2', recipient: 'compliance@company.com' } },
      },
      {
        id: 't3-auto2',
        type: 'automatedNode',
        position: { x: 260, y: 780 },
        data: { type: 'automated', title: 'Notify Completion via Slack', actionId: 'send_slack', actionParams: { channel: '#hr-compliance', message: 'Document verification completed for new employee.' } },
      },
      {
        id: 't3-end',
        type: 'endNode',
        position: { x: 260, y: 930 },
        data: { type: 'end', endMessage: 'All documents verified and archived in HRIS. Compliance confirmed.', summaryFlag: true },
      },
    ],
    edges: [
      { id: 'te3-1', source: 't3-start', target: 't3-task1', animated: true },
      { id: 'te3-2', source: 't3-task1', target: 't3-task2', animated: true },
      { id: 'te3-3', source: 't3-task2', target: 't3-approval', animated: true },
      { id: 'te3-4', source: 't3-approval', target: 't3-auto1', animated: true },
      { id: 'te3-5', source: 't3-auto1', target: 't3-auto2', animated: true },
      { id: 'te3-6', source: 't3-auto2', target: 't3-end', animated: true },
    ],
  },
];
