import { Plus, X } from 'lucide-react';
import type { KeyValuePair } from '../../types/workflow';
import { Input } from './FormControls';

interface Props {
  pairs: KeyValuePair[];
  onChange: (pairs: KeyValuePair[]) => void;
  label?: string;
}

export function KeyValueEditor({ pairs, onChange, label = 'Custom Fields' }: Props) {
  const add = () => onChange([...pairs, { key: '', value: '' }]);
  const remove = (i: number) => onChange(pairs.filter((_, idx) => idx !== i));
  const update = (i: number, field: 'key' | 'value', val: string) => {
    const updated = [...pairs];
    updated[i] = { ...updated[i], [field]: val };
    onChange(updated);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {label}
        </span>
        <button
          onClick={add}
          style={{
            background: 'var(--accent-dim)',
            border: '1px solid var(--accent)',
            borderRadius: 5,
            padding: '3px 8px',
            color: 'var(--accent)',
            fontSize: 11,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontFamily: 'inherit',
          }}
        >
          <Plus size={10} /> Add
        </button>
      </div>

      {pairs.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '12px',
          color: 'var(--text-muted)',
          fontSize: 11,
          border: '1px dashed var(--border)',
          borderRadius: 7,
          fontFamily: "'DM Mono', monospace",
        }}>
          No fields yet
        </div>
      )}

      {pairs.map((pair, i) => (
        <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'center' }}>
          <Input value={pair.key} onChange={v => update(i, 'key', v)} placeholder="key" />
          <Input value={pair.value} onChange={v => update(i, 'value', v)} placeholder="value" />
          <button
            onClick={() => remove(i)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: 4,
              borderRadius: 4,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}
