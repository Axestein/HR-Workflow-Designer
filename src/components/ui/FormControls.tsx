import type { ReactNode, ChangeEvent } from 'react';

interface FieldProps {
  label: string;
  required?: boolean;
  children: ReactNode;
}

export function Field({ label, required, children }: FieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--text-secondary)',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
      }}>
        {label}
        {required && <span style={{ color: 'var(--accent)', marginLeft: 3 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

interface InputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}

export function Input({ value, onChange, placeholder, type = 'text' }: InputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 7,
        padding: '7px 10px',
        color: 'var(--text-primary)',
        fontSize: 12,
        fontFamily: 'inherit',
        outline: 'none',
        transition: 'border-color 0.15s',
        width: '100%',
      }}
      onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
      onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
    />
  );
}

interface TextAreaProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}

export function TextArea({ value, onChange, placeholder, rows = 3 }: TextAreaProps) {
  return (
    <textarea
      value={value}
      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 7,
        padding: '7px 10px',
        color: 'var(--text-primary)',
        fontSize: 12,
        fontFamily: 'inherit',
        outline: 'none',
        resize: 'vertical',
        width: '100%',
        transition: 'border-color 0.15s',
      }}
      onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
      onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
    />
  );
}

interface SelectProps {
  value: string;
  onChange: (v: string) => void;
  children: ReactNode;
}

export function Select({ value, onChange, children }: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 7,
        padding: '7px 10px',
        color: 'var(--text-primary)',
        fontSize: 12,
        fontFamily: 'inherit',
        outline: 'none',
        width: '100%',
        cursor: 'pointer',
      }}
    >
      {children}
    </select>
  );
}

interface NumberInputProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}

export function NumberInput({ value, onChange, min = 0, max = 100 }: NumberInputProps) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value))}
      min={min}
      max={max}
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 7,
        padding: '7px 10px',
        color: 'var(--text-primary)',
        fontSize: 12,
        fontFamily: "'DM Mono', monospace",
        outline: 'none',
        width: '100%',
        transition: 'border-color 0.15s',
      }}
      onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
      onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
    />
  );
}

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => onChange(!checked)}>
      <div style={{
        width: 36,
        height: 20,
        borderRadius: 10,
        background: checked ? 'var(--accent)' : 'var(--border-light)',
        position: 'relative',
        transition: 'background 0.2s',
        flexShrink: 0,
      }}>
        <div style={{
          position: 'absolute',
          top: 3,
          left: checked ? 19 : 3,
          width: 14,
          height: 14,
          borderRadius: '50%',
          background: 'white',
          transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        }} />
      </div>
      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{label}</span>
    </div>
  );
}
