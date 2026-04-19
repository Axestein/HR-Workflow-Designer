import { useWorkflowStore } from '../../store/workflowStore';
import { useAutomations } from '../../hooks/useWorkflow';
import { Field, Input, TextArea, Select, NumberInput, Toggle } from '../ui/FormControls';
import { KeyValueEditor } from '../ui/KeyValueEditor';
import type {
  StartNodeData, TaskNodeData, ApprovalNodeData,
  AutomatedNodeData, EndNodeData, WorkflowNodeData
} from '../../types/workflow';

interface FormProps {
  nodeId: string;
}

function useNodeData<T extends WorkflowNodeData>(nodeId: string) {
  const { nodes, updateNodeData } = useWorkflowStore();
  const node = nodes.find(n => n.id === nodeId);
  const data = node?.data as T | undefined;

  const update = (partial: Partial<T>) => {
    updateNodeData(nodeId, partial as Partial<WorkflowNodeData>);
  };

  return { data, update };
}

export function StartNodeForm({ nodeId }: FormProps) {
  const { data, update } = useNodeData<StartNodeData>(nodeId);
  if (!data) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Field label="Start Title" required>
        <Input value={data.title} onChange={v => update({ title: v })} placeholder="e.g. Employee Onboarding" />
      </Field>
      <KeyValueEditor
        pairs={data.metadata}
        onChange={pairs => update({ metadata: pairs })}
        label="Metadata"
      />
    </div>
  );
}

export function TaskNodeForm({ nodeId }: FormProps) {
  const { data, update } = useNodeData<TaskNodeData>(nodeId);
  if (!data) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Field label="Title" required>
        <Input value={data.title} onChange={v => update({ title: v })} placeholder="Task name" />
      </Field>
      <Field label="Description">
        <TextArea value={data.description} onChange={v => update({ description: v })} placeholder="Describe what needs to be done..." rows={2} />
      </Field>
      <Field label="Assignee">
        <Input value={data.assignee} onChange={v => update({ assignee: v })} placeholder="e.g. HR Team, John Doe" />
      </Field>
      <Field label="Due Date">
        <Input value={data.dueDate} onChange={v => update({ dueDate: v })} type="date" />
      </Field>
      <KeyValueEditor
        pairs={data.customFields}
        onChange={pairs => update({ customFields: pairs })}
      />
    </div>
  );
}

export function ApprovalNodeForm({ nodeId }: FormProps) {
  const { data, update } = useNodeData<ApprovalNodeData>(nodeId);
  if (!data) return null;

  const ROLES = ['Manager', 'HRBP', 'Director', 'VP of HR', 'C-Suite', 'Department Head'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Field label="Title">
        <Input value={data.title} onChange={v => update({ title: v })} placeholder="Approval step name" />
      </Field>
      <Field label="Approver Role">
        <Select value={data.approverRole} onChange={v => update({ approverRole: v })}>
          <option value="">Select role...</option>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          <option value="custom">Custom...</option>
        </Select>
      </Field>
      {data.approverRole === 'custom' && (
        <Field label="Custom Role">
          <Input value={data.approverRole} onChange={v => update({ approverRole: v })} placeholder="Enter custom role" />
        </Field>
      )}
      <Field label="Auto-Approve Threshold (%)">
        <NumberInput value={data.autoApproveThreshold} onChange={v => update({ autoApproveThreshold: v })} min={0} max={100} />
        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3, fontFamily: "'DM Mono', monospace" }}>
          Auto-approve when score ≥ {data.autoApproveThreshold}%
        </div>
      </Field>
    </div>
  );
}

export function AutomatedNodeForm({ nodeId }: FormProps) {
  const { data, update } = useNodeData<AutomatedNodeData>(nodeId);
  const automations = useAutomations();
  if (!data) return null;

  const selectedAction = automations.find(a => a.id === data.actionId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Field label="Title">
        <Input value={data.title} onChange={v => update({ title: v })} placeholder="Automated step name" />
      </Field>
      <Field label="Action">
        <Select
          value={data.actionId}
          onChange={v => {
            const action = automations.find(a => a.id === v);
            const params: Record<string, string> = {};
            action?.params.forEach(p => { params[p] = data.actionParams?.[p] || ''; });
            update({ actionId: v, actionParams: params });
          }}
        >
          <option value="">Select an action...</option>
          {automations.map(a => (
            <option key={a.id} value={a.id}>{a.label}</option>
          ))}
        </Select>
      </Field>

      {selectedAction && selectedAction.params.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
            Action Parameters
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {selectedAction.params.map(param => (
              <Field key={param} label={param}>
                <Input
                  value={data.actionParams?.[param] || ''}
                  onChange={v => update({ actionParams: { ...data.actionParams, [param]: v } })}
                  placeholder={`Enter ${param}...`}
                />
              </Field>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function EndNodeForm({ nodeId }: FormProps) {
  const { data, update } = useNodeData<EndNodeData>(nodeId);
  if (!data) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Field label="End Message">
        <TextArea value={data.endMessage} onChange={v => update({ endMessage: v })} placeholder="Workflow completion message..." rows={2} />
      </Field>
      <Toggle
        checked={data.summaryFlag}
        onChange={v => update({ summaryFlag: v })}
        label="Generate workflow summary on completion"
      />
    </div>
  );
}
