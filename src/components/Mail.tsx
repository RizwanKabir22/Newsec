import { memo } from 'react';
import { MAIL } from '../data';
import { useI18n } from '../i18n';
import { Icon } from './Icon';

export const Mail = memo(function Mail() {
  const { t, lang } = useI18n();
  return (
    <section data-reveal="" className="card mail">
      <div className="card-head card-head--sm">
        <div className="card-head__l">
          <span className="card-icon"><Icon name="Sms" size={19} /></span>
          <div><div className="card-title">{t('Correspondence')}</div><div className="card-sub">{t('2 new today')}</div></div>
        </div>
        <span className="card-arrow circle-btn"><Icon name="ArrowUpRight" size={16} /></span>
      </div>
      <div className="mail__list">
        {MAIL.map(m => (
          <div key={m.from} className="mail__row">
            <span role="img" aria-label={m.from} className="mail__avatar" style={{ backgroundImage: `url(${m.avatar})` }} />
            <div className="mail__body">
              <div className="mail__top"><span className="mail__from ell">{m.from}</span><span className="mail__time">{lang === 'da' ? t(m.time).replace(':', '.') : m.time}</span></div>
              <span className="mail__subj ell">{t(m.subj)}</span>
              <span className="mail__proj"><Icon name="Link" size={12} /><span className="ell">{m.project}</span></span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});
