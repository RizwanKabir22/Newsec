import { memo, type MouseEvent } from 'react';
import { BLUE, MINT, type Palette } from '../data';
import { useI18n } from '../i18n';
import { DAYS, PLANNED, TODAY, WEEK_TARGET, dayLogged, dayPending, loggedTotal, type WeekState } from '../week';
import { Icon } from './Icon';

const DAYS_DA: Record<string, string> = { Mon: 'Man', Tue: 'Tir', Wed: 'Ons', Thu: 'Tor', Fri: 'Fre' };

const px = (h: number) => Math.round((h / 9) * 96) + 'px';

interface Props { week: WeekState; onConfirm: () => void; onOpen: () => void; p: Palette }

/** Clicking anywhere on the card (or its arrow button) opens the daily AI breakdown. */
export const TimeCard = memo(function TimeCard({ week, onConfirm, onOpen, p }: Props) {
  const { t, num, hrs, lang } = useI18n();
  const pending = dayPending(week, 1);
  const confirmed = week.confirmed[1];
  const total = loggedTotal(week);

  const days = DAYS.map((d, i) => {
    const plan = i > TODAY, today = i === TODAY;
    const solid = plan ? PLANNED[i] : dayLogged(week, i);
    const draft = plan ? 0 : dayPending(week, i);
    return {
      key: d.key, label: lang === 'da' ? DAYS_DA[d.key] : d.key, draft,
      stack: px(solid + draft), draftH: px(draft),
      bg: plan ? p.hatch : today ? p.ink : p.rg('.18'),
      ring: plan ? 'inset 0 0 0 1px ' + p.rg('.16') : 'none',
      fw: today ? 700 : 500,
      fc: today ? p.ink : p.rg('.62'),
    };
  });

  const stop = (fn: () => void) => (e: MouseEvent) => { e.stopPropagation(); fn(); };

  return (
    <section data-reveal="" className="card time time--link" onClick={onOpen}>
      <div className="card-head card-head--sm">
        <div className="card-head__l">
          <span className="card-icon"><Icon name="Clock" size={19} /></span>
          <div><div className="card-title">{t("This week's time")}</div><div className="card-sub">{t('Week 41 · Mon–Fri')}</div></div>
        </div>
        <button className="card-arrow circle-btn card-arrow--btn" onClick={stop(onOpen)} aria-label={t('Open daily AI breakdown')}>
          <Icon name="ArrowUpRight" size={16} />
        </button>
      </div>

      <div className="time__total">
        <div className="time__num"><span data-count="">{num(total)}</span><span>{'/ ' + WEEK_TARGET + ' ' + t('h')}</span></div>
        <div className="time__week"><div style={{ width: Math.round((total / WEEK_TARGET) * 100) + '%' }} /></div>
      </div>

      <div className="days">
        {days.map(d => (
          <div key={d.key} className="day">
            <div className="day__col">
              <div data-bar="" className="day__bar" style={{ height: d.stack, boxShadow: d.ring }}>
                {d.draft > 0 && <span className="day__draft" style={{ height: d.draftH }} />}
                <span className="day__fill" style={{ background: d.bg }} />
              </div>
            </div>
            <span className="day__label" style={{ fontWeight: d.fw, color: d.fc }}>{d.label}</span>
          </div>
        ))}
      </div>

      <div className="draft">
        <div className="draft__row">
          <span className="draft__icon" style={{ background: confirmed ? MINT : BLUE }}><Icon name={confirmed ? 'Check' : 'Sparkles'} size={18} /></span>
          <div>
            <div className="draft__t1">{t(confirmed ? 'Confirmed' : 'Draft ready')}</div>
            <div className="draft__t2">{confirmed ? t('{h} added', { h: hrs(daySumAi(week)) }) : t('From calendar')}</div>
          </div>
        </div>
        <div className="draft__btns">
          {!confirmed && <button className="draft__confirm" onClick={stop(onConfirm)}>{t('Confirm {h}', { h: hrs(pending) })}</button>}
          <button className={'draft__ai' + (confirmed ? ' draft__ai--wide' : '')} onClick={stop(onOpen)} aria-label={t('Open AI breakdown')} title={t('Open AI breakdown')}>
            <Icon name="Sparkles" size={16} />{confirmed && <span>{t('Open AI breakdown')}</span>}
          </button>
        </div>
      </div>
    </section>
  );
});

const daySumAi = (w: WeekState) => w.entries.filter(e => e.day === 1 && e.ai).reduce((s, e) => s + e.h, 0);
