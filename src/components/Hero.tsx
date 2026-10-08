import { memo } from 'react';
import { useI18n } from '../i18n';
import { Icon } from './Icon';

const ARROW = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M14.43 5.93 20.5 12l-6.07 6.07M3.5 12h16.83" stroke="currentColor" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

export const Hero = memo(function Hero({ open, gateBlocked }: { open: number; gateBlocked: boolean }) {
  const { t } = useI18n();
  return (
    <section data-hero="" className="hero">
      <div className="hero__shade" />
      <div className="hero__inner">
        <div data-stagger="" className="hero__copy">
          <div className="hero__date">{t('Wednesday 7 October · Week 41')}</div>
          <div className="hero__greet">{t('Good morning,')}<br />Martin</div>
          <div className="hero__lede">
            {open}{' ' + t('things need you today.') + (gateBlocked ? ' ' : '')}{gateBlocked && <><span data-pulse="" className="pulse-dot" /><b>{t('1 gate is blocked.')}</b></>}
          </div>
          <div className="hero__ctas">
            <button className="apill">
              <span className="apill__fill" />
              <span className="apill__label">{t('Start with Ryesgade')}</span>
              <span className="apill__disc">
                <span className="apill__out">{ARROW}</span>
                <span className="apill__in">{ARROW}</span>
              </span>
            </button>
            <button className="gpill">
              <span className="gpill__shine" />
              <Icon name="Calendar" size={18} />
              <span>{t('See my week')}</span>
            </button>
          </div>
        </div>
        <Portfolio />
      </div>
    </section>
  );
});

const Portfolio = memo(function Portfolio() {
  const { t, num, mio, lang } = useI18n();
  const pct = (s: string) => (lang === 'da' ? s.replace('.', ',').replace('%', ' %') : s);
  return (
    <div data-glass="" className="glass">
      <div className="glass__sheen" />
      <div className="glass__body">
        <div className="glass__head">
          <div className="glass__title"><span>{t('Portfolio')}</span><span>{t('Week 41')}</span></div>
          <span className="glass__arrow circle-btn"><Icon name="ArrowUpRight" size={17} /></span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div className="glass__label">{t('Budget under management')}</div>
            <div className="glass__budget"><span data-count="">{num(48.6)}</span><span>{t('DKK m')}</span></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="spend"><span className="spend__actual" /><span className="spend__fc" /></div>
            <div className="spend-legend">
              <span className="nw"><b>{mio(24.1)}</b>{' ' + t('spent') + ' · ' + pct('50%')}</span>
              <span className="nw">{t('Forecast {v}', { v: mio(50.2) })}</span>
            </div>
          </div>
        </div>

        <div className="glass__tiles">
          <div className="glass__tile">
            <div className="glass__label">{t('Active projects')}</div>
            <div className="glass__tile-v">14<small>{t('+2 this month')}</small></div>
          </div>
          <div className="glass__tile">
            <div className="glass__label">{t('Forecast vs budget')}</div>
            <div className="glass__tile-v glass__tile-v--warn">{pct('+3.2%')}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="eyebrow" style={{ color: 'var(--mu, rgba(22,28,59,.6))' }}>{t('Health')}</span>
            <span className="nw" style={{ fontSize: 12, fontWeight: 500, color: 'var(--mu, rgba(22,28,59,.6))' }}>{t('{n} projects', { n: 14 })}</span>
          </div>
          <div className="health">
            <span data-hseg="" className="health__ok"><b>9</b>{t('On track')}</span>
            <span data-hseg="" className="health__risk"><i />{'3 ' + t('At risk')}</span>
            <span data-hseg="" className="health__block">{'2 ' + t('Blocked')}</span>
          </div>
        </div>
      </div>
    </div>
  );
});
