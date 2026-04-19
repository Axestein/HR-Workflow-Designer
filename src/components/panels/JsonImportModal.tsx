import { useState, useRef } from 'react';
import { X, Upload, FileJson, CheckCircle2, XCircle, AlertTriangle, Copy, ChevronRight } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';

interface Props {
  onClose: () => void;
}

const EXAMPLE_JSON = `{
  "nodes": [
    {
      "id": "start-1",
      "type": "startNode",
      "position": { "x": 260, "y": 40 },
      "data": {
        "type": "start",
        "title": "My Workflow Start",
        "metadata": [{ "key": "team", "value": "HR" }]
      }
    },
    {
      "id": "task-1",
      "type": "taskNode",
      "position": { "x": 260, "y": 200 },
      "data": {
        "type": "task",
        "title": "Review Application",
        "description": "Review the submitted application",
        "assignee": "HR Manager",
        "dueDate": "",
        "customFields": []
      }
    },
    {
      "id": "end-1",
      "type": "endNode",
      "position": { "x": 260, "y": 360 },
      "data": {
        "type": "end",
        "endMessage": "Workflow complete!",
        "summaryFlag": true
      }
    }
  ],
  "edges": [
    { "id": "e1", "source": "start-1", "target": "task-1", "animated": true },
    { "id": "e2", "source": "task-1", "target": "end-1", "animated": true }
  ]
}`;

type ValidationState = 'idle' | 'valid' | 'invalid';

interface ValidationResult {
  state: ValidationState;
  message: string;
  nodeCount?: number;
  edgeCount?: number;
}

function validateWorkflowJSON(text: string): { result: ValidationResult; parsed: any } {
  if (!text.trim()) {
    return { result: { state: 'idle', message: '' }, parsed: null };
  }

  let parsed: any;
  try {
    parsed = JSON.parse(text);
  } catch (e: any) {
    return {
      result: { state: 'invalid', message: `Invalid JSON: ${e.message}` },
      parsed: null,
    };
  }

  if (!parsed.nodes || !Array.isArray(parsed.nodes)) {
    return {
      result: { state: 'invalid', message: 'Missing "nodes" array in JSON.' },
      parsed: null,
    };
  }
  if (!parsed.edges || !Array.isArray(parsed.edges)) {
    return {
      result: { state: 'invalid', message: 'Missing "edges" array in JSON.' },
      parsed: null,
    };
  }

  const validTypes = ['startNode', 'taskNode', 'approvalNode', 'automatedNode', 'endNode'];
  for (const node of parsed.nodes) {
    if (!node.id) return { result: { state: 'invalid', message: `Node missing "id" field.` }, parsed: null };
    if (!node.type || !validTypes.includes(node.type)) {
      return {
        result: {
          state: 'invalid',
          message: `Node "${node.id}" has invalid type "${node.type}". Valid types: ${validTypes.join(', ')}`,
        },
        parsed: null,
      };
    }
    if (!node.position || typeof node.position.x !== 'number' || typeof node.position.y !== 'number') {
      return {
        result: { state: 'invalid', message: `Node "${node.id}" missing valid position {x, y}.` },
        parsed: null,
      };
    }
    if (!node.data || !node.data.type) {
      return {
        result: { state: 'invalid', message: `Node "${node.id}" missing data.type field.` },
        parsed: null,
      };
    }
  }

  return {
    result: {
      state: 'valid',
      message: 'JSON is valid and ready to import.',
      nodeCount: parsed.nodes.length,
      edgeCount: parsed.edges.length,
    },
    parsed,
  };
}

export function JsonImportModal({ onClose }: Props) {
  const { importWorkflow } = useWorkflowStore();
  const [text, setText] = useState('');
  const [validation, setValidation] = useState<ValidationResult>({ state: 'idle', message: '' });
  const [parsedData, setParsedData] = useState<any>(null);
  const [showExample, setShowExample] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (value: string) => {
    setText(value);
    const { result, parsed } = validateWorkflowJSON(value);
    setValidation(result);
    setParsedData(parsed);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      setText(content);
      const { result, parsed } = validateWorkflowJSON(content);
      setValidation(result);
      setParsedData(parsed);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleImport = () => {
    if (!parsedData) return;
    importWorkflow(JSON.stringify(parsedData));
    onClose();
  };

  const handleLoadExample = () => {
    handleTextChange(EXAMPLE_JSON);
    setShowExample(false);
  };

  const borderColor =
    validation.state === 'valid' ? 'rgba(34,197,94,0.5)'
    : validation.state === 'invalid' ? 'rgba(239,68,68,0.5)'
    : 'var(--border)';

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 200,
        }}
      />

      {/* Modal */}
      <div
        className="fade-up"
        style={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 580,
          maxHeight: '85vh',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          zIndex: 201,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '18px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'var(--bg-elevated)',
          flexShrink: 0,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 9,
            background: 'var(--accent-dim)', border: '1px solid var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--accent)', flexShrink: 0,
          }}>
            <FileJson size={17} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
              Import from JSON
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              Paste a workflow JSON or upload a .json file to generate nodes
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent', border: '1px solid var(--border)',
              borderRadius: 8, padding: 7, cursor: 'pointer',
              color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
            }}
          >
            <X size={14} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Action buttons row */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => fileRef.current?.click()}
              style={{
                flex: 1,
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 9, padding: '9px 14px',
                cursor: 'pointer', color: 'var(--text-secondary)',
                fontSize: 12, fontFamily: 'inherit', fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)';
                (e.currentTarget as HTMLElement).style.color = 'var(--accent)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
              }}
            >
              <Upload size={13} /> Upload .json File
            </button>
            <button
              onClick={() => setShowExample(!showExample)}
              style={{
                flex: 1,
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 9, padding: '9px 14px',
                cursor: 'pointer', color: 'var(--text-secondary)',
                fontSize: 12, fontFamily: 'inherit', fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)';
                (e.currentTarget as HTMLElement).style.color = 'var(--accent)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
              }}
            >
              <Copy size={13} /> {showExample ? 'Hide' : 'See'} Example JSON
            </button>
            <input ref={fileRef} type="file" accept=".json" onChange={handleFileUpload} style={{ display: 'none' }} />
          </div>

          {/* Example JSON */}
          {showExample && (
            <div className="fade-up" style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              overflow: 'hidden',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 12px',
                borderBottom: '1px solid var(--border)',
                background: 'var(--bg-elevated)',
              }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>
                  example-workflow.json
                </span>
                <button
                  onClick={handleLoadExample}
                  style={{
                    background: 'var(--accent-dim)', border: '1px solid var(--accent)',
                    borderRadius: 6, padding: '3px 10px',
                    cursor: 'pointer', color: 'var(--accent)',
                    fontSize: 11, fontFamily: 'inherit', fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}
                >
                  Use this <ChevronRight size={11} />
                </button>
              </div>
              <pre style={{
                padding: '10px 12px',
                fontSize: 10.5,
                color: 'var(--text-secondary)',
                fontFamily: "'DM Mono', monospace",
                overflowX: 'auto',
                maxHeight: 200,
                margin: 0,
                lineHeight: 1.6,
              }}>
                {EXAMPLE_JSON}
              </pre>
            </div>
          )}

          {/* Schema reference */}
          <div style={{
            background: 'rgba(249,115,22,0.04)',
            border: '1px solid rgba(249,115,22,0.2)',
            borderRadius: 9, padding: '10px 14px',
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              JSON Schema
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.7, fontFamily: "'DM Mono', monospace" }}>
              <div><span style={{ color: 'var(--accent)' }}>nodes[]</span> — id, type, position.x, position.y, data</div>
              <div><span style={{ color: 'var(--accent)' }}>data.type</span> — "start" | "task" | "approval" | "automated" | "end"</div>
              <div><span style={{ color: 'var(--accent)' }}>node.type</span> — "startNode" | "taskNode" | "approvalNode" | "automatedNode" | "endNode"</div>
              <div><span style={{ color: 'var(--accent)' }}>edges[]</span> — id, source (node id), target (node id)</div>
            </div>
          </div>

          {/* Text area */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 7 }}>
              Paste JSON
            </div>
            <textarea
              value={text}
              onChange={e => handleTextChange(e.target.value)}
              placeholder={`{\n  "nodes": [...],\n  "edges": [...]\n}`}
              spellCheck={false}
              style={{
                width: '100%',
                height: 200,
                background: 'var(--bg-secondary)',
                border: `1.5px solid ${borderColor}`,
                borderRadius: 10,
                padding: '12px 14px',
                color: 'var(--text-primary)',
                fontSize: 12,
                fontFamily: "'DM Mono', monospace",
                outline: 'none',
                resize: 'vertical',
                lineHeight: 1.6,
                transition: 'border-color 0.2s',
              }}
            />
          </div>

          {/* Validation feedback */}
          {validation.state !== 'idle' && (
            <div className="fade-up" style={{
              display: 'flex', alignItems: 'flex-start', gap: 9,
              padding: '10px 14px',
              borderRadius: 9,
              background: validation.state === 'valid' ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)',
              border: `1px solid ${validation.state === 'valid' ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
            }}>
              <div style={{ color: validation.state === 'valid' ? '#22c55e' : '#ef4444', marginTop: 1, flexShrink: 0 }}>
                {validation.state === 'valid'
                  ? <CheckCircle2 size={14} />
                  : <XCircle size={14} />
                }
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: validation.state === 'valid' ? '#22c55e' : '#ef4444', marginBottom: 2 }}>
                  {validation.state === 'valid' ? 'Valid Workflow JSON' : 'Validation Error'}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                  {validation.message}
                </div>
                {validation.state === 'valid' && (
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3, fontFamily: "'DM Mono', monospace" }}>
                    {validation.nodeCount} node{validation.nodeCount !== 1 ? 's' : ''} · {validation.edgeCount} edge{validation.edgeCount !== 1 ? 's' : ''} detected
                  </div>
                )}
              </div>
            </div>
          )}

          {text && validation.state === 'invalid' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)' }}>
              <AlertTriangle size={11} />
              Fix the JSON errors above before importing. Use the example to see the expected format.
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid var(--border)',
          display: 'flex', justifyContent: 'flex-end', gap: 8,
          background: 'var(--bg-elevated)',
          flexShrink: 0,
        }}>
          <button
            onClick={onClose}
            style={{
              background: 'transparent', border: '1px solid var(--border)',
              borderRadius: 8, padding: '8px 18px',
              cursor: 'pointer', color: 'var(--text-secondary)',
              fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={validation.state !== 'valid'}
            style={{
              background: validation.state === 'valid' ? 'var(--accent)' : 'var(--bg-elevated)',
              border: validation.state === 'valid' ? 'none' : '1px solid var(--border)',
              borderRadius: 8, padding: '8px 20px',
              cursor: validation.state === 'valid' ? 'pointer' : 'not-allowed',
              color: validation.state === 'valid' ? 'white' : 'var(--text-muted)',
              fontSize: 12, fontWeight: 700, fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 6,
              transition: 'all 0.15s',
            }}
          >
            <FileJson size={13} />
            Import & Build Canvas
          </button>
        </div>
      </div>
    </>
  );
}
