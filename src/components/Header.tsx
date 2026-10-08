import { memo } from 'react';
import logo from '../assets/newsec-logo.png';
import avatar from '../assets/avatar-4.jpg';
import { useI18n, type Lang } from '../i18n';
import { Icon } from './Icon';

interface Props { dark: boolean; onToggleTheme: () => void; lang: Lang; onLang: (lang: Lang) => void }

export const Header = memo(function Header({ dark, onToggleTheme, lang, onLang }: Props) {
  const { t } = useI18n();
  return (
    <header data-hdr="" className="hdr">
      <div className="hdr__brand">
        <img src={logo} alt="Newsec" />
        <span className="hdr__sep" />
        <span className="hdr__product">{t('Project Hub')}</span>
      </div>
      <label className="search ctl">
        <Icon name="Search" size={18} />
        <input id="dash-search" placeholder={t('Search projects, people, documents…')} aria-label={t('Search')} />
        <span className="kbd" aria-hidden="true"><span>⌘</span><span>K</span></span>
      </label>
      <div className="hdr__actions">
        <button className="theme ctl" data-nopress="" onClick={onToggleTheme} aria-label={t(dark ? 'Switch to light mode' : 'Switch to dark mode')} aria-pressed={dark}>
          <span className="theme__knob" />
          <span className="theme__ic theme__ic--sun"><Icon name="Sun" size={18} /></span>
          <span className="theme__ic theme__ic--moon"><Icon name="Moon" size={18} /></span>
        </button>
        <span className={'lang' + (lang === 'en' ? ' lang--en' : '')} data-nopress="" role="group" aria-label={t('Language')}>
          <span className="lang__ind" />
          {(['da', 'en'] as const).map(l => (
            <button key={l} className={lang === l ? 'lang--on' : undefined} aria-pressed={lang === l} lang={l}
              aria-label={l === 'da' ? 'Dansk' : 'English'} onClick={() => onLang(l)}>{l.toUpperCase()}</button>
          ))}
        </span>
        <span className="hdr__icon circle-btn ctl"><Icon name="Bell" size={18} /><span className="hdr__bell-dot" /></span>
        <span className="btn-new"><Icon name="Plus" size={18} />{t('New project')}</span>
        <img className="avatar" src={avatar} alt="Martin Jensen" />
      </div>
    </header>
  );
});
