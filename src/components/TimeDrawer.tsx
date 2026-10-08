import { memo, useEffect, useRef, useState, type Dispatch, type Ref } from 'react';
import { PROJECTS } from '../data';
import { useI18n } from '../i18n';
import {
  DAYS, INTERNAL, PLANNED, SRC_ICON, TODAY, WEEK_TARGET, dayEntries, daySummary, isLogged, loggedTotal, split,
  type Entry, type EntryPatch, type WeekAction, type WeekState,
} from '../week';
import { CountUp, Typewriter } from './gen';
import { Icon } from './Icon';

interface Props {
  week: WeekState;
  dispatch: Dispatch<WeekAction>;
  /** per day: has the AI already drafted it in this panel (kept across opens) */
  generated: boolean[];
  onGenerated: (day: number) => void;
  onRegenerate: (day: number) => void;
  onClose: () => void;
  scrimRef?: Ref<HTMLDivElement>;
  drawerRef?: Ref<HTMLDivElement>;
}

const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

/** What the AI "reads" for each day before it writes that day's entries. */
const SOURCES = [{ e: 4, m: 11, d: 3 }, { e: 3, m: 9, d: 2 }, { e: 5, m: 14, d: 4 }];
const logFor = (d: number): [string, number][] => [
  ['Reading calendar · {n} events', SOURCES[d].e],
  ['Scanning email · {n} threads', SOURCES[d].m],
  ['Matching documents to projects · {n} files', SOURCES[d].d],
];
const LOG_MS = 420, ENTRY_MS = 340, LOG_LINES = 3;
const FUTURE_MEETINGS = [0, 0, 0, 3, 2];
const PROJECT_OPTIONS = [...PROJECTS.map(p => p.name), INTERNAL];

/**
 * Daily AI breakdown. One day is shown at a time; the AI drafts a day the first time it is opened
 * (a few seconds), and drafted days come back instantly.
 */
export const TimeDrawer = memo(function TimeDrawer({ week, dispatch, generated, onGenerated, onRegenerate, onClose, scrimRef, drawerRef }: Props) {
  const { t, num, hrs, lang } = useI18n();

  // open on the first day that still needs the PM (Tuesday in the demo)
  const [day, setDay] = useState(() => [0, 1, 2].find(i => !week.confirmed[i]) ?? TODAY);
  const [dir, setDir] = useState(0);
  const goDay = (d: number) => { if (d === day) return; setDir(Math.sign(d - day)); setDay(d); };

  // ---------- generation for the selected day ----------
  const aiIds = dayEntries(week, day).filter(e => e.ai).map(e => e.id);
  const N = aiIds.length;
  const needsGen = day <= TODAY && !generated[day];
  const [step, setStep] = useState(needsGen ? 0 : LOG_LINES);
  const [shown, setShown] = useState(needsGen ? 0 : N);
  // stays false until the last entry has finished typing
  const [done, setDone] = useState(!needsGen);
  const generating = needsGen && !done;
  const shownRef = useRef(shown); shownRef.current = shown;
  const body = useRef<HTMLDivElement>(null);

  useEffect(() => {
    body.current?.scrollTo({ top: 0 });
    if (!needsGen) { setStep(LOG_LINES); setShown(N); setDone(true); return; }
    if (reduced()) { setStep(LOG_LINES); setShown(N); setDone(true); onGenerated(day); return; }
    setStep(0); setShown(0); setDone(false);
    const timers: number[] = [];
    for (let i = 1; i <= LOG_LINES; i++) timers.push(window.setTimeout(() => setStep(i), i * LOG_MS));
    const t0 = LOG_LINES * LOG_MS + 120;
    for (let i = 1; i <= N; i++) timers.push(window.setTimeout(() => setShown(i), t0 + i * ENTRY_MS));
    let saved = false;
    timers.push(window.setTimeout(() => { saved = true; setDone(true); onGenerated(day); }, t0 + N * ENTRY_MS + 800));
    return () => {
      timers.forEach(clearTimeout);
      // everything was already on screen: keep the day as drafted even if the user moved on during the last bit of typing
      if (!saved && shownRef.current >= N) onGenerated(day);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day, needsGen]);

  const skip = () => { setStep(LOG_LINES); setShown(N); setDone(true); onGenerated(day); };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && (e.target as HTMLElement).closest?.('.td__days')) {
        e.preventDefault(); goDay(Math.min(4, Math.max(0, day + (e.key === 'ArrowRight' ? 1 : -1))));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // keep the entry being written in view
  useEffect(() => {
    if (!generating || shown === 0) return;
    body.current?.querySelector(`[data-entry="${aiIds[shown - 1]}"]`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown]);

  // ---------- week-level numbers ----------
  const total = loggedTotal(week);
  const sp = split(week.entries.filter(e => e.day <= TODAY));
  const spTotal = sp.chargeable + sp.non + sp.writtenOff || 1;
  const open = [0, 1, 2].filter(d => !week.confirmed[d]);
  const awaiting = [0, 1].reduce((s, d) => s + (!week.confirmed[d] ? daySummary(dayEntries(week, d)).drafted : 0), 0);
  const dayName = (d: number) => t(DAYS[d].full);
  const of37 = lang === 'da' ? `${WEEK_TARGET} t` : `${WEEK_TARGET}h`;

  // ---------- the selected day ----------
  const all = dayEntries(week, day);
  const visible = all.filter(e => !e.ai || aiIds.indexOf(e.id) < shown);
  const future = day > TODAY;
  const conf = week.confirmed[day];
  const editable = !conf && !week.submitted && !future;
  const sum = daySummary(visible);
  const src = SOURCES[day];

  return (
    <>
      <div ref={scrimRef} className="scrim" onClick={onClose} />
      <div ref={drawerRef} className="drawer drawer--wide td" role="dialog" aria-modal="true" aria-labelledby="td-title" aria-busy={generating}>
        <div className="td__head">
          <div className="td__eyebrow">
            <span className={'td__spark' + (generating ? ' td__spark--live' : '')}><Icon name="Sparkles" size={14} /></span>
            <span className="eyebrow">{t('AI daily breakdown')}</span>
            <span className={'td__status' + (generating ? ' td__status--live' : '')} aria-live="polite">
              {generating ? t('Drafting {day}…', { day: dayName(day) }) : t('Drafted by AI')}
            </span>
          </div>
          <div className="td__actions">
            <button className="td__regen" onClick={() => onRegenerate(day)} disabled={generating || !editable} title={t('Regenerate this day')}><Icon name="Sparkles" size={14} />{t('Regenerate')}</button>
            <button className="drawer__close" onClick={onClose} aria-label={t('Close')}>×</button>
          </div>
          <div id="td-title" className="td__title">
            {t('Week 41')} · <CountUp value={total} format={v => num(v)} /> <span className="td__of">{t('of')} {of37}</span>
          </div>
          <div className="drawer__sub">{t('Your own time, drafted from your calendar, email and documents.')}</div>
        </div>

        <div className="td__days" role="tablist" aria-label={t('Days')}>
          {DAYS.map((d, i) => {
            const h = i > TODAY ? 0 : dayEntries(week, i).reduce((s, e) => s + e.h, 0);
            const state = i > TODAY ? 'plan' : week.confirmed[i] ? 'ok' : i === TODAY ? 'live' : 'draft';
            const drafted = i > TODAY || generated[i];
            return (
              <button key={d.key} role="tab" aria-selected={day === i} tabIndex={day === i ? 0 : -1}
                className={'td__day' + (day === i ? ' td__day--on' : '') + (day === i && generating ? ' td__day--writing' : '')} onClick={() => goDay(i)}>
                <span className="td__day-top"><span>{lang === 'da' ? t(d.key + '.short') : d.key}</span><i className={'td__dot td__dot--' + state} /></span>
                <span className="td__day-row">
                  <span className="td__day-date">{d.date}</span>
                  <span className="td__day-h">{i > TODAY ? hrs(PLANNED[i]) : drafted ? hrs(h) : <span className="td__day-ai" title={t('Draft with AI')}><Icon name="Sparkles" size={12} /></span>}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="td__split" aria-label={t('Chargeable split')}>
          <div className="td__bar">
            <span className="td__bar-c" style={{ flexGrow: sp.chargeable / spTotal }} />
            <span className="td__bar-n" style={{ flexGrow: sp.non / spTotal }} />
            <span className="td__bar-w" style={{ flexGrow: sp.writtenOff / spTotal }} />
          </div>
          <div className="td__legend">
            <span><i className="td__bar-c" /><em>{t('Chargeable')}</em><b><CountUp value={sp.chargeable} format={hrs} /></b></span>
            <span><i className="td__bar-n" /><em>{t('Non-chargeable')}</em><b><CountUp value={sp.non} format={hrs} /></b></span>
            <span><i className="td__bar-w" /><em>{t('Written off')}</em><b><CountUp value={sp.writtenOff} format={hrs} /></b></span>
          </div>
        </div>

        <div ref={body} className="drawer__body td__body">
          <section key={day} className={'tdv' + (dir > 0 ? ' tdv--next' : dir < 0 ? ' tdv--prev' : '')}>
            <header className="tdd__head">
              <div>
                <div className="tdd__name">{dayName(day)} <span>{DAYS[day].date}. {lang === 'da' ? 'okt.' : 'Oct'}</span></div>
                <div className="tdd__sub">{future ? t('Planned · {h}', { h: hrs(PLANNED[day]) }) : t('{h} logged', { h: hrs(all.filter(e => isLogged(week, e)).reduce((s, e) => s + e.h, 0)) })}</div>
              </div>
              <span className={'tdd__chip tdd__chip--' + (future ? 'plan' : conf ? 'ok' : day === TODAY ? 'live' : 'draft')}>
                {future ? t('Not drafted yet') : conf ? <><Icon name="Check" size={12} />{t('Confirmed')}</> : day === TODAY ? <><i />{t('Today · drafting live')}</> : t('Draft · needs you')}
              </span>
            </header>

            {future ? (
              <div className="tdd__empty"><Icon name="Clock" size={16} /><span>{t('AI drafts {day} at 17:00 from {n} meetings, your email and documents.', { day: dayName(day), n: FUTURE_MEETINGS[day] })}</span></div>
            ) : (
              <>
                <div className={'td__log' + (generating ? '' : ' td__log--done')}>
                  {generating ? logFor(day).map(([key, n], i) => (
                    <div key={key} className={'td__log-row' + (i < step ? ' td__log-row--done' : i === step ? ' td__log-row--live' : '')}>
                      <span className="td__log-ic">{i < step ? <Icon name="Check" size={14} /> : <span className="td__spin" />}</span>
                      <span>{t(key, { n })}</span>
                    </div>
                  )) : (
                    <div className="td__log-row td__log-row--done">
                      <span className="td__log-ic"><Icon name="Sparkles" size={14} /></span>
                      <span>{t('Drafted {n} entries from {e} events, {m} emails and {d} documents', { n: N, e: src.e, m: src.m, d: src.d })}</span>
                    </div>
                  )}
                  {generating && <button className="td__skip" onClick={skip}>{t('Skip')}</button>}
                </div>

                <div className={'tdd__list' + (conf ? ' tdd__list--ok' : '')}>
                  {visible.map(e => <EntryRow key={e.id} e={e} editable={editable && e.ai} play={generating && e.ai} dispatch={dispatch} />)}
                  {generating && step >= LOG_LINES - 1 && shown < N && Array.from({ length: Math.min(2, N - shown) }, (_, k) => (
                    <div key={'sk' + k} className="tde tde--sk" aria-hidden="true"><span /><span /><span /></div>
                  ))}
                </div>

                {sum.drafted > 0 && (
                  <footer className="tdd__foot">
                    <span>
                      <b><CountUp value={sum.drafted} format={hrs} /></b> {t('drafted')} · <b><CountUp value={sum.chargeable} format={hrs} /></b> {t('chargeable')}
                    </span>
                    {conf ? (
                      !week.submitted && <button className="tdd__reopen" onClick={() => dispatch({ type: 'reopenDay', day })}>{t('Reopen')}</button>
                    ) : (
                      <button className="tdd__confirm" disabled={generating} onClick={() => dispatch({ type: 'confirmDay', day })}>
                        <Icon name="Check" size={14} />{t('Confirm day')}
                      </button>
                    )}
                  </footer>
                )}
              </>
            )}
          </section>
        </div>

        <div className="drawer__foot td__foot">
          {week.submitted ? (
            <div className="td__done"><span><Icon name="Check" size={16} /></span>{t('Week 41 submitted to Business Central')}</div>
          ) : (
            <>
              <div className="td__foot-l">
                <div><b>{hrs(total)}</b> {t('logged')}{awaiting > 0 && <> · <b>{hrs(awaiting)}</b> {t('awaiting you')}</>}</div>
                <div className="td__hint">{open.length ? t('Confirm {days} to submit', { days: open.map(dayName).join(lang === 'da' ? ' og ' : ' and ') }) : t('All days confirmed')}</div>
              </div>
              <button className="drawer__approve" disabled={open.length > 0} onClick={() => dispatch({ type: 'submitWeek' })}>{t('Submit week')}</button>
            </>
          )}
        </div>
      </div>
    </>
  );
});

const EntryRow = memo(function EntryRow({ e, editable, play, dispatch }: { e: Entry; editable: boolean; play: boolean; dispatch: Dispatch<WeekAction> }) {
  const { t, hrs } = useI18n();
  const set = (patch: EntryPatch) => dispatch({ type: 'entry', id: e.id, patch });
  const projectLabel = e.project === INTERNAL ? t(INTERNAL) : e.project;

  return (
    <div data-entry={e.id} className={'tde' + (play ? ' tde--in' : '') + (e.writtenOff ? ' tde--off' : '') + (!e.ai ? ' tde--manual' : '')}>
      <span className="tde__ic"><Icon name={SRC_ICON[e.src]} size={16} /></span>
      <div className="tde__main">
        {editable ? (
          <label className="tde__project">
            <select value={e.project} onChange={ev => set({ project: ev.target.value })} aria-label={t('Project')}>
              {PROJECT_OPTIONS.map(name => <option key={name} value={name}>{name === INTERNAL ? t(INTERNAL) : name}</option>)}
            </select>
            <span className="tde__project-v"><Typewriter text={projectLabel} play={play} cps={60} /></span>
            <Icon name="ArrowDown" size={12} />
          </label>
        ) : (
          <span className="tde__project tde__project--ro"><span className="tde__project-v">{projectLabel}</span></span>
        )}
        <div className="tde__src">
          <span className="tde__src-t"><Typewriter text={t(e.srcText)} play={play} delay={220} cps={42} /></span>
          {e.ai && <span className="tde__ai">AI</span>}
        </div>
      </div>
      {editable && !e.writtenOff ? (
        <span className="tde__hours" role="group" aria-label={t('Hours')}>
          <button onClick={() => set({ h: e.h - 0.5 })} disabled={e.h <= 0.5} aria-label={t('Less')}>−</button>
          <span className="tde__hours-v"><CountUp value={e.h} format={hrs} ms={play ? 700 : 260} /></span>
          <button onClick={() => set({ h: e.h + 0.5 })} disabled={e.h >= 12} aria-label={t('More')}>+</button>
        </span>
      ) : (
        <span className={'tde__hours tde__hours--ro' + (e.writtenOff ? ' tde__hours--off' : '')}>{hrs(e.h)}</span>
      )}
      <div className="tde__acts">
        {e.writtenOff ? (
          <>
            <span className="tde__offchip">{t('Written off · {h}', { h: hrs(e.h) })}</span>
            {editable && <button className="tde__link" onClick={() => set({ writtenOff: false })}>{t('Undo')}</button>}
          </>
        ) : editable ? (
          <>
            <button className={'tde__switch' + (e.chargeable ? ' tde__switch--on' : '')} role="switch" aria-checked={e.chargeable} disabled={e.project === INTERNAL}
              aria-label={t('Chargeable')} onClick={() => set({ chargeable: !e.chargeable })}>
              <span className="tde__knob" />
            </button>
            <span className="tde__switch-l">{t(e.chargeable ? 'Chargeable' : 'Non-chargeable')}</span>
            <button className="tde__link tde__link--off" onClick={() => set({ writtenOff: true })}>{t('Write off')}</button>
          </>
        ) : (
          <span className={'tde__tag' + (e.chargeable ? ' tde__tag--c' : '')}>{t(e.chargeable ? 'Chargeable' : 'Non-chargeable')}</span>
        )}
      </div>
    </div>
  );
});
