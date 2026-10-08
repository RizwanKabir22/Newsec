import { memo, useMemo } from 'react';
import { CAL_GATES, CAL_START, CAL_WEEKDAYS, LATER_GATES, OR, gatePhaseColor, type Palette } from '../data';
import { useI18n } from '../i18n';
import { Icon } from './Icon';

const WEEKDAYS_DA = ['O', 'T', 'F', 'L', 'S', 'M', 'T'];

const TRACK = [1, 2, 3, 4, 5].map(n => ({
  n,
  seg: n < 4 ? '#fff' : n === 4 ? OR : 'rgba(255,255,255,.28)',
  fw: n === 4 ? 700 : 500,
}));

const calendar = (p: Palette) => Array.from({ length: 14 }, (_, i) => {
  const n = CAL_START + i, g = CAL_GATES[n], today = i === 0, weekend = i % 7 === 3 || i % 7 === 4;
  return {
    n,
    dot: g ? (g === 4 ? OR : gatePhaseColor(g, p)) : 'transparent',
    bg: today ? p.ink : g === 4 ? 'rgba(255,96,0,.08)' : p.rg('.03'),
    ring: g === 4 ? `inset 0 0 0 1.5px ${OR}` : 'none',
    fg: today ? p.onInk : weekend ? p.rg('.38') : p.ink,
  };
});

export const Gates = memo(function Gates({ p }: { p: Palette }) {
  const { t, lang } = useI18n();
  const cal = useMemo(() => calendar(p), [p]);
  return (
    <section data-reveal="" className="card gates">
      <div className="card-head">
        <div className="card-head__l">
          <span className="card-icon"><Icon name="Calendar" size={22} /></span>
          <div><div className="card-title">{t('Gate reviews')}</div><div className="card-sub">{t('4 in the next 14 days')}</div></div>
        </div>
        <span className="card-arrow circle-btn"><Icon name="ArrowUpRight" size={18} /></span>
      </div>

      <div className="next-gate">
        <div className="next-gate__glow" />
        <div className="next-gate__top">
          <div>
            <div className="next-gate__when"><span data-pulse="" className="pulse-dot" /><span className="eyebrow">{t('Tomorrow · 10:00')}</span></div>
            <div className="next-gate__name">Gate 4 · Valby Langgade 88</div>
            <div className="next-gate__phase">{t('Completion & Invoicing')}</div>
          </div>
          <div className="next-gate__date"><div data-count="">8</div><div>{t('Oct')}</div></div>
        </div>
        <div className="track">
          {TRACK.map(t => (
            <div key={t.n}>
              <span data-seg="" className="track__seg" style={{ background: t.seg }} />
              <span className="track__label" style={{ fontWeight: t.fw }}>G{t.n}</span>
            </div>
          ))}
        </div>
        <div className="next-gate__foot">
          <span className="next-gate__ok"><Icon name="CircleCheck" size={16} />{t('Handover docs complete')}</span>
          <span className="next-gate__btn">{t('Request sign-off')}<Icon name="ArrowRight" size={14} /></span>
        </div>
      </div>

      <div className="cal-wrap">
        <div className="cal-wrap__head"><span className="eyebrow">{t('Next two weeks')}</span><span>{t('7–20 Oct')}</span></div>
        <div className="cal">
          {(lang === 'da' ? WEEKDAYS_DA : CAL_WEEKDAYS).map((d, i) => <span key={i} className={'cal__wd' + (i === 3 || i === 4 ? ' cal__wd--we' : '')}>{d}</span>)}
          {cal.map(d => (
            <div key={d.n} data-cal="" className="cal__day" style={{ background: d.bg, boxShadow: d.ring, color: d.fg }}>
              <span>{d.n}</span><span style={{ background: d.dot }} />
            </div>
          ))}
        </div>
      </div>

      <div className="later">
        <span className="eyebrow">{t('Later')}</span>
        {LATER_GATES.map(g => (
          <div key={g.day} className="later__row">
            <span>{t(g.wd)} {g.day}</span>
            <span>{`Gate ${g.g} · ${g.name}`}</span>
            <span><i style={{ background: gatePhaseColor(g.g, p) }} /><span>G{g.g}</span></span>
          </div>
        ))}
      </div>
      <span className="gates__all">{t('View all gate reviews')}<Icon name="ArrowRight" size={14} /></span>
    </section>
  );
});
