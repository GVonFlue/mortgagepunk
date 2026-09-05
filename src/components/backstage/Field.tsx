"use client";

// Client component: live character counting as you type.

import s from "./Backstage.module.css";

/**
 * Labelled input with a live character counter.
 *
 * The cap is the point. Every public layout was designed around a length, so
 * an uncapped field is how a dashboard quietly breaks a site. The counter
 * turns red past the limit and the input hard-stops there.
 */
export function Field({
  label, value, onChange, max, placeholder, help, type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  max?: number;
  placeholder?: string;
  help?: string;
  type?: string;
}) {
  const over = max ? value.length > max : false;
  return (
    <label className={s.field}>
      <span className={s.label}>
        {label}
        {max && (
          <span className={`${s.count} ${over ? s.countOver : ""}`}>
            {value.length}/{max}
          </span>
        )}
      </span>
      <input
        type={type}
        className={s.input}
        value={value}
        maxLength={max}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {help && <span className={s.help}>{help}</span>}
    </label>
  );
}

export function Area({
  label, value, onChange, max, placeholder, help,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  max?: number;
  placeholder?: string;
  help?: string;
}) {
  const over = max ? value.length > max : false;
  return (
    <label className={s.field}>
      <span className={s.label}>
        {label}
        {max && (
          <span className={`${s.count} ${over ? s.countOver : ""}`}>
            {value.length}/{max}
          </span>
        )}
      </span>
      <textarea
        className={s.textarea}
        value={value}
        maxLength={max}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {help && <span className={s.help}>{help}</span>}
    </label>
  );
}

export function Select({
  label, value, onChange, options, help,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  help?: string;
}) {
  return (
    <label className={s.field}>
      <span className={s.label}>{label}</span>
      <select className={s.select} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      {help && <span className={s.help}>{help}</span>}
    </label>
  );
}
