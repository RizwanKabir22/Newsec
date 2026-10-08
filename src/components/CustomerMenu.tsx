import { memo, useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { CUSTOMERS, PROJECTS, type CustomerId, type Palette } from '../data';
import { useI18n } from '../i18n';
import { Icon } from './Icon';

type Cust = CustomerId | 'all';

interface Props { p: Palette; value: Cust; onChange: (c: Cust) => void }

const COUNT: Record<string, number> = Object.fromEntries(
  CUSTOMERS.map(([id]) => [id, PROJECTS.filter(pr => id === 'all' || pr.customer === id).length]),
);

/** Pill-shaped trigger that opens a frosted listbox of customers (keyboard: arrows, Home/End, Enter, Escape). */
export const CustomerMenu = memo(function CustomerMenu({ p, value, onChange }: Props) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const opts = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const on = value !== 'all';
  const label = t(CUSTOMERS.find(c => c[0] === value)![1]);

  // close on outside click
  useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', down);
    return () => document.removeEventListener('pointerdown', down);
  }, [open]);

  // focus the selected option when the menu opens
  useEffect(() => {
    if (open) opts.current[CUSTOMERS.findIndex(c => c[0] === value)]?.focus({ preventScroll: true });
  }, [open, value]);

  const close = (refocus = true) => { setOpen(false); if (refocus) trigger.current?.focus({ preventScroll: true }); };
  const pick = (c: Cust) => { onChange(c); close(); };

  const onMenuKey = (e: KeyboardEvent) => {
    e.stopPropagation();
    const i = opts.current.findIndex(o => o === document.activeElement), n = CUSTOMERS.length;
    const go = (j: number) => { e.preventDefault(); opts.current[(j + n) % n]?.focus(); };
    if (e.key === 'ArrowDown') go(i + 1);
    else if (e.key === 'ArrowUp') go(i - 1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(n - 1);
    else if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'Tab') close(false);
  };

  return (
    <div ref={root} className="cmenu">
      <button ref={trigger} className="cust" aria-haspopup="listbox" aria-expanded={open} aria-controls={id}
        onClick={() => setOpen(o => !o)}
        onKeyDown={e => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); e.stopPropagation(); setOpen(true); } }}
        style={{ background: on ? p.ink : p.rg('.04'), color: on ? p.onInk : p.rg('.74') }}>
        <span>{t('Customer')}</span>{label}<span className={'cust__chev' + (open ? ' cust__chev--up' : '')}><Icon name="ArrowDown" size={14} /></span>
      </button>
      <div id={id} role="listbox" aria-label={t('Customer')} className={'menu' + (open ? ' menu--open' : '')} onKeyDown={onMenuKey} inert={!open}>
        {CUSTOMERS.map(([cid, name], i) => (
          <button key={cid} ref={el => { opts.current[i] = el; }} role="option" aria-selected={cid === value} className="menu__opt" onClick={() => pick(cid)}>
            <span className="menu__check">{cid === value && <Icon name="Check" size={16} />}</span>
            <span className="menu__label">{t(name)}</span>
            <span className="menu__count">{COUNT[cid]}</span>
          </button>
        ))}
      </div>
    </div>
  );
});
