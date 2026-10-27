// Field and result-row primitives for the T3 client calculators. No hooks, no
// "use client": imported only from client components.

export const CALC_FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" };
export const INPUT =
  "block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20 sm:text-sm";
export const LABEL = "block text-sm font-medium text-navy mb-1";

/** Non-negative number from an input value; blank → 0. */
export const num = (v: string) => Math.max(0, Number(v || 0) || 0);

export function NumberField({
  id,
  label,
  hint,
  value,
  onChange,
  step = 1,
  min = 0,
  max,
}: {
  id: string;
  label: string;
  hint?: string;
  value: number;
  onChange: (n: number) => void;
  step?: number;
  min?: number;
  max?: number;
}) {
  return (
    <div>
      <label htmlFor={id} className={LABEL}>{label}</label>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(max !== undefined ? Math.min(max, num(e.target.value)) : num(e.target.value))}
        className={INPUT}
      />
      {hint && <p className="mt-1 text-xs text-warmgray">{hint}</p>}
    </div>
  );
}

export function SelectField<T extends string>({
  id,
  label,
  hint,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  hint?: string;
  value: T;
  onChange: (v: T) => void;
  options: readonly { value: T; label: string }[];
}) {
  return (
    <div>
      <label htmlFor={id} className={LABEL}>{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value as T)} className={INPUT}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {hint && <p className="mt-1 text-xs text-warmgray">{hint}</p>}
    </div>
  );
}

export function ResultRow({ label, value, bold, muted }: { label: React.ReactNode; value: string; bold?: boolean; muted?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 py-2 text-sm ${muted ? "text-warmgray" : "text-navy"}`}>
      <dt>{label}</dt>
      <dd className={`tabular-nums text-right ${bold ? "font-bold text-base" : "font-medium"}`}>{value}</dd>
    </div>
  );
}

export const RESULT_LIST = "divide-y divide-sandstone-dark/20 rounded-xl border border-sandstone-dark/20 bg-sandstone/40 px-5 py-2";
export const NOTE_OK = "rounded-lg border-l-4 border-eucalyptus bg-eucalyptus-light/30 p-3 text-sm text-navy";
export const NOTE_WARN = "rounded-lg border-l-4 border-ochre bg-sandstone p-3 text-sm text-navy";
