import { memo } from 'react';
import { COST, OR, type Palette } from '../data';
import { useI18n } from '../i18n';
import { Icon } from './Icon';

/** Bars are drawn on an 86% track so the forecast marker has room past the budget. */
const ROWS = COST.map(c => {
  const s = 86 / c.budget, over = c.forecast > c.budget, pct = (v: number, max: number) => Math.min(max, v * s).toFixed(1) + '%';
  return { ...c, over, comW: pct(c.committed, 100), actW: pct(c.actual, 100), fcL: pct(c.forecast, 99) };
});

const KPIS: [string, number, number, string, boolean?][] = [
  ['Budget', 48.6, 1, 'm'],
  ['Actual to date', 24.1, 1, 'm'],
  ['Invoiced to date', 19.8, 1, 'm'],
  ['Pending changes', 185, 0, 'k', true],
];

export const CostCard = memo(function CostCard({ p }: { p: Palette }) {
  const { t, num } = useI18n();
  return (
    <section data-reveal="" className="card cost">
      <div className="card-head">
        <div className="card-head__l">
          <span className="card-icon"><Icon name="Wallet" size={22} /></span>
          <div><div className="card-title">{t('Cost overview')}</div><div className="card-sub">{t('6 projects · DKK')}</div></div>
        </div>
        <div style={{ display: 'flex', gap: 8, flex: 'none' }}>
          <span className="btn-ghost"><Icon name="Chart" size={16} />{t('Open in Power BI')}</span>
          <span className="btn-soft"><Icon name="FileSpreadsheet" size={16} />{t('Export to Excel')}</span>
        </div>
      </div>

      <div className="kpis">
        {KPIS.map(([label, value, dec, unit, warn]) => (
          <div key={label} className={'kpi' + (warn ? ' kpi--warn' : '')}>
            <div>{t(label)}</div>
            <div data-count="">{num(value, dec)}<small>{t(unit)}</small></div>
          </div>
        ))}
      </div>

      <div className="cost__rows">
        {ROWS.map(c => (
          <div key={c.name} className="crow">
            <div className="crow__top">
              <div className="crow__name">
                <span>{c.name}</span>
                <div className="crow__tags">
                  <span className="tag">{t(c.price)}</span>
                  {c.over && <span className="tag tag--over">{t('Over budget')}</span>}
                </div>
              </div>
              <span className="crow__val"><b>{num(c.actual)}</b>/ <span>{num(c.budget)}</span>{t('m')}</span>
            </div>
            <div className="crow__bar">
              <span data-hbar="" className="crow__track" />
              <span data-hbar="" className="crow__com" style={{ width: c.comW }} />
              <span data-hbar="" className="crow__act" style={{ width: c.actW }} />
              <span className="crow__fc" style={{ left: c.fcL, background: c.over ? OR : p.ink }} />
            </div>
          </div>
        ))}
      </div>

      <div className="legend">
        <span><i className="legend__act" />{t('Actual')}</span>
        <span><i className="legend__com" />{t('Committed')}</span>
        <span><i className="legend__tick legend__act" />{t('Forecast')}</span>
        <span><i className="legend__tick" style={{ background: OR }} />{t('Over budget')}</span>
      </div>
    </section>
  );
});
