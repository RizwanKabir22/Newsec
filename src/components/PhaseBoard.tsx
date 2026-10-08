import { memo, useMemo, type KeyboardEvent, type Ref } from 'react';
import { MINT, OR, PHASES, PROJECTS, SEGMENT_LABEL, SEGMENT_TABS, type CustomerId, type Palette, type Project, type Segment } from '../data';
import { useI18n, type I18n } from '../i18n';
import { CustomerMenu } from './CustomerMenu';

interface Props {
  p: Palette;
  seg: Segment | 'all';
  cust: CustomerId | 'all';
  phase: number;
  onSeg: (seg: Segment | 'all') => void;
  onCustomer: (c: CustomerId | 'all') => void;
  onPhase: (n: number) => void;
  ref?: Ref<HTMLElement>;
}

const TINT = (p: Palette) => [null, 'rgba(150,204,194,.18)', 'rgba(79,108,245,.08)', p.rg('.05'), 'rgba(193,174,239,.2)', p.dark ? 'rgba(221,205,188,.14)' : 'rgba(221,205,188,.3)'];
const GLOW = [
  null,
  'linear-gradient(180deg,rgba(150,204,194,.16) 0%,rgba(150,204,194,0) 55%)',
  'linear-gradient(180deg,rgba(79,108,245,.08) 0%,rgba(79,108,245,0) 55%)',
  'linear-gradient(180deg,rgba(22,28,59,.05) 0%,rgba(22,28,59,0) 55%)',
  'linear-gradient(180deg,rgba(193,174,239,.18) 0%,rgba(193,174,239,0) 55%)',
  'linear-gradient(180deg,rgba(221,205,188,.26) 0%,rgba(221,205,188,0) 55%)',
];

const why = (pr: Project) => (pr.blocked ? 'Gate blocked' : pr.health === 'red' ? 'Over budget' : '');

function status(pr: Project, p: Palette, t: I18n['t']) {
  const h = pr.health;
  return {
    label: t(h === 'green' ? 'On track' : h === 'amber' ? 'At risk' : why(pr)),
    bg: h === 'green' ? (p.dark ? 'rgba(150,204,194,.2)' : 'rgba(150,204,194,.24)') : h === 'amber' ? p.rg('.06') : p.dark ? 'rgba(255,96,0,.18)' : 'rgba(255,96,0,.12)',
    fg: h === 'green' ? p.mintText : h === 'amber' ? p.ink : p.orText,
    bar: h === 'red' ? OR : h === 'amber'
      ? (p.dark ? 'repeating-linear-gradient(-45deg,#EEF1F7 0 2px,rgba(238,241,247,.35) 2px 5px)' : 'repeating-linear-gradient(-45deg,#161C3B 0 2px,rgba(22,28,59,.35) 2px 5px)')
      : p.ink,
  };
}

export const PhaseBoard = memo(function PhaseBoard({ p, seg, cust, phase, onSeg, onCustomer, onPhase, ref }: Props) {
  const { t, lang } = useI18n();
  const v = useMemo(() => {
    const byCustomer = PROJECTS.filter(pr => cust === 'all' || pr.customer === cust);
    const list = byCustomer.filter(pr => seg === 'all' || pr.seg === seg);
    const tint = TINT(p);
    // fix: in dark the selected tile used the same surface as the cards and barely stood out
    const selBg = p.dark ? '#2B3468' : p.surf;
    const phases = PHASES.map(ph => {
      const pr = list.filter(x => x.phase === ph.n), on = phase === ph.n;
      const g = pr.filter(x => x.health === 'green').length, a = pr.filter(x => x.health === 'amber').length, r = pr.filter(x => x.health === 'red').length;
      const mix = [
        { k: 'g', n: g, bg: MINT, sh: 'none' },
        { k: 'a', n: a, bg: p.surf, sh: 'inset 0 0 0 1.5px ' + p.ink },
        { k: 'r', n: r, bg: OR, sh: 'none' },
      ].filter(m => m.n);
      return {
        ...ph, on, count: pr.length, alert: r, thumbs: pr.slice(0, 3), more: pr.length - 3,
        mix: mix.length ? mix : [{ k: 'none', n: 1, bg: p.rg('.08'), sh: 'none' }],
        color: ph.color(p),
        railH: on ? '6px' : '3px',
        swRing: ph.n === 5 ? (p.dark ? 'inset 0 0 0 1px rgba(255,255,255,.14)' : 'inset 0 0 0 1px rgba(22,28,59,.12)') : 'none',
        gate: r ? OR : p.ink,
        gateHalo: r ? 'rgba(255,96,0,.2)' : p.dark ? '#1B2146' : '#fff',
        gateText: r ? p.orText : on ? p.ink : p.rg('.45'),
        ringC: on ? selBg : p.dark ? '#1F2649' : '#F4F5F9',
        tileBg: on ? selBg : tint[ph.n]!,
        tileSh: on
          ? (p.dark ? 'inset 0 1px 0 rgba(255,255,255,.10),0 0 0 1px rgba(124,146,255,.28),0 22px 50px rgba(0,0,0,.45)' : '0 0 0 1px rgba(22,28,59,.06),0 22px 50px rgba(22,28,59,.14)')
          : (p.dark ? 'inset 0 0 0 1px rgba(255,255,255,.05)' : 'inset 0 0 0 1px rgba(22,28,59,.03)'),
      };
    });
    const sel = list.filter(x => x.phase === phase).slice().sort((x, y) =>
      Number(y.health === 'red') - Number(x.health === 'red') || Number(y.health === 'amber') - Number(x.health === 'amber') || y.pct - x.pct);
    const sr = sel.filter(x => x.health === 'red').length, sa = sel.filter(x => x.health === 'amber').length;
    return {
      phases, sel, total: byCustomer.length,
      cols: PHASES.map(ph => (ph.n === phase ? '1.45fr' : '1fr')).join(' '),
      caretL: `calc(${(phase - 1) * 12}px + (100% - 48px) * ${((phase - 1 + 0.725) / 5.45).toFixed(4)})`,
      summary: (sel.length === 1 ? t('1 project') : t('{n} projects', { n: sel.length })) + ' · ' + (sr ? t('{n} needs you', { n: sr }) : sa ? t('{n} at risk', { n: sa }) : t('all on track')),
    };
  }, [p, seg, cust, phase, t]);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); onPhase(phase + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); onPhase(phase - 1); }
  };
  const name = PHASES[phase - 1].name;

  return (
    <section ref={ref} data-v2="" className="board" tabIndex={0} onKeyDown={onKey} aria-label={t('Projects by phase. Use the left and right arrow keys to change phase.')}>
      <div className="board__head">
        <div>
          <div className="board__title">{t('Projects by phase')}</div>
          <div className="board__sub">{t('{n} active across 5 stage gates', { n: v.total })}</div>
        </div>
        <div className="board__filters">
          <CustomerMenu p={p} value={cust} onChange={onCustomer} />
          <div className="segs" role="group" aria-label={t('Segment')}>
            <span className="segs__ind" style={{ transform: `translateX(${SEGMENT_TABS.findIndex(t => t[0] === seg) * 104}px)` }} />
            {SEGMENT_TABS.map(([id, label]) => (
              <button key={id} aria-pressed={seg === id} onClick={() => onSeg(id)} style={{ color: seg === id ? p.onInk : p.rg('.74') }}>{t(label)}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="phase-rows">
        <div className="phase-grid" style={{ gridTemplateColumns: v.cols }}>
          {v.phases.map(ph => (
            <div key={ph.n} className="rail">
              <span data-rail="" className="rail__line" style={{ height: ph.railH, background: ph.color, boxShadow: ph.swRing }} />
              <span data-gate="" className="rail__gate"><i style={{ background: ph.gate, boxShadow: `0 0 0 3px ${ph.gateHalo}` }} /></span>
              <span className="rail__g" style={{ color: ph.gateText }}><span>G{ph.n}</span></span>
            </div>
          ))}
        </div>
        <div className="phase-grid" style={{ gridTemplateColumns: v.cols }}>
          {v.phases.map(ph => (
            <button key={ph.n} data-ptile="" className="ptile" onClick={() => onPhase(ph.n)} aria-pressed={ph.on}
              aria-label={`${t('Phase {n}', { n: ph.n })}, ${t(ph.short)}: ${ph.count === 1 ? t('1 project') : t('{n} projects', { n: ph.count })}${ph.alert ? ', ' + t('{n} needs you', { n: ph.alert }) : ''}`}
              style={{ background: ph.tileBg, boxShadow: ph.tileSh }}>
              <span className="ptile__glow" style={{ background: GLOW[ph.n]!, opacity: ph.on ? (p.dark ? 0.6 : 1) : 0 }} />
              <div className="ptile__top">
                <span>{t('Phase {n}', { n: ph.n })}</span>
                {ph.alert > 0 && <span className="ptile__alert"><i data-pdot="" /><span>{t('{n} needs you', { n: ph.alert })}</span></span>}
              </div>
              <div className="ptile__mid">
                <div data-bcount="" className="ptile__count">{ph.count}</div>
                <div className="ptile__name">{t(ph.short)}</div>
              </div>
              <div className="ptile__bottom">
                <div className="ptile__mix">
                  {ph.mix.map(m => <span key={m.k} style={{ flex: `${m.n} 1 0`, background: m.bg, boxShadow: m.sh }} />)}
                </div>
                <div data-stack="" className="ptile__stack">
                  {ph.thumbs.map(t => (
                    <span key={t.id} data-thumb="" className="ptile__thumb" style={{ backgroundImage: `url(${t.img})`, boxShadow: `0 0 0 2.5px ${ph.ringC}` }} />
                  ))}
                  {ph.more > 0 && <span data-thumb="" className="ptile__more" style={{ boxShadow: `0 0 0 2.5px ${ph.ringC}` }}><span className="nw">+{ph.more}</span></span>}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="panel">
        <span className="panel__caret" style={{ left: v.caretL, background: PHASES[phase - 1].color(p) }} />
        {v.sel.length > 0 ? (
          <div className="panel__body">
            <div className="panel__head">
              <div>
                <div className="panel__title">{t(name)}</div>
                <div className="panel__sub">{t('Phase {n} of 5 · closes at gate G{n}', { n: phase }) + ' · '}<span className="nw">{v.summary}</span></div>
              </div>
              <span className="panel__open">{t('Open phase')}<span>→</span></span>
            </div>
            <div className="panel__grid">
              {v.sel.map(pr => {
                const st = status(pr, p, t);
                return (
                  <div key={pr.id} data-pc="" className="pc">
                    <span className="pc__img" style={{ backgroundImage: `url(${pr.img})` }} />
                    <div className="pc__body">
                      <div className="pc__top">
                        <span className="pc__name">{pr.name}</span>
                        <span className="pc__chip" style={{ background: st.bg, color: st.fg }}>{st.label}</span>
                      </div>
                      <div className="pc__sub">{t(SEGMENT_LABEL[pr.seg])} · {t(pr.job)}</div>
                      <div className="pc__prog">
                        <div className="pc__track"><div data-pbar="" style={{ width: pr.pct + '%', background: st.bar }} /></div>
                        <span className="pc__pct">{pr.pct}{lang === 'da' ? ' %' : '%'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="panel__empty">{t('No projects in this phase for the selected filters.')}</div>
        )}
      </div>

      <div className="board__legend">
        <span><span className="dot" style={{ background: MINT }} />{t('On track')}</span>
        <span><span className="dot" style={{ background: p.surf, boxShadow: `inset 0 0 0 2px ${p.ink}` }} />{t('At risk')}</span>
        <span><span className="dot" style={{ background: OR }} />{t('Needs you')}</span>
        <span className="fill" />
        <span><i className="dia" style={{ background: p.ink }} />{t('Stage gate')}</span>
        <span><i className="dia" style={{ background: OR }} />{t('Gate with a problem')}</span>
      </div>
    </section>
  );
});
