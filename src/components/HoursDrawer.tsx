import { memo, useEffect, type Ref } from 'react';
import { HOURS } from '../data';
import { useI18n } from '../i18n';
import { Icon } from './Icon';

interface Props {
  sel: boolean[];
  onClose: () => void;
  onToggle: (index: number) => void;
  onToggleAll: () => void;
  onApprove: () => void;
  scrimRef?: Ref<HTMLDivElement>;
  drawerRef?: Ref<HTMLDivElement>;
}

export const HoursDrawer = memo(function HoursDrawer({ sel, onClose, onToggle, onToggleAll, onApprove, scrimRef, drawerRef }: Props) {
  const { t, num, hrs } = useI18n();
  const nSel = sel.filter(Boolean).length;
  const hours = HOURS.reduce((s, r, i) => s + (sel[i] ? r.h : 0), 0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <>
      <div ref={scrimRef} className="scrim" onClick={onClose} />
      <div ref={drawerRef} className="drawer" role="dialog" aria-modal="true" aria-labelledby="hours-title">
        <div className="drawer__head">
          <div>
            <div className="eyebrow">{t('Time approval')}</div>
            <div id="hours-title" className="drawer__title">{t('Approve hours')}</div>
            <div className="drawer__sub">{t('Sofie Holm · Project Center · Week 41')}</div>
          </div>
          <button className="drawer__close" onClick={onClose} aria-label={t('Close')}>×</button>
        </div>

        <div className="drawer__body">
          <div className="split">
            <span className="split__a">{t('{n} Chargeable', { n: num(10.5) })}</span>
            <span className="split__b">{t('{n} Non-chargeable', { n: num(2) })}</span>
          </div>
          <div className="drawer__entries">
            <span className="eyebrow">{t('{n} entries', { n: HOURS.length })}</span>
            <button onClick={onToggleAll}>{t(nSel === HOURS.length ? 'Clear selection' : 'Select all')}</button>
          </div>
          {HOURS.map((r, i) => (
            <div key={r.name} data-hrow="" className="hrow">
              <button className="hrow__cb" role="checkbox" aria-checked={sel[i]} aria-label={r.name} onClick={() => onToggle(i)}>
                <Icon name="Check" size={16} />
              </button>
              <div style={{ minWidth: 0 }}>
                <div className="hrow__name">{r.name}</div>
                <div className="hrow__meta">{t(r.meta)}</div>
              </div>
              <span className="hrow__h">{hrs(r.h)}</span>
            </div>
          ))}
          <div className="note note--ai"><Icon name="Sparkles" size={16} /><span>{t("2.5h of these were suggested by AI from Sofie's calendar and email.")}</span></div>
          <div className="note note--bc"><Icon name="Link" size={16} /><span>{t('Approved hours post to Business Central for project costing.')}</span></div>
        </div>

        <div className="drawer__foot">
          <button className="drawer__reject" onClick={onClose}>{t('Reject')}</button>
          <button className="drawer__approve" onClick={onApprove} style={{ opacity: nSel ? 1 : 0.4 }}>
            {nSel ? t('Approve {h}', { h: hrs(hours) }) : t('Select entries')}
          </button>
        </div>
      </div>
    </>
  );
});
