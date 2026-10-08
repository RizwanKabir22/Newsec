import { memo, useEffect, useRef } from 'react';
import appIcon from '../assets/app-icon.svg';
import { useI18n } from '../i18n';
import type { IconName } from '../icons';
import { Icon } from './Icon';

const TOP: [IconName, string][] = [['Category', 'Overview'], ['Building', 'Projects'], ['Clock', 'Time'], ['Tender', 'Tenders'], ['Chart', 'Reports'], ['Book', 'Library']];
const BOTTOM: [IconName, string][] = [['Setting', 'Settings'], ['Help', 'Help & guidance']];

/**
 * Icon rail that expands on hover. `open` is owned by the page so the card grid can make room for it
 * (the header stays where it is).
 */
export const Sidebar = memo(function Sidebar({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { t, hrs } = useI18n();
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  const enter = () => { clearTimeout(timer.current); timer.current = window.setTimeout(() => onOpenChange(true), 90); };
  const leave = () => { clearTimeout(timer.current); onOpenChange(false); };

  const item = ([icon, label]: [IconName, string]) => (
    <div key={label} className={'side__item' + (label === 'Overview' ? ' side__item--on' : '')} title={open ? undefined : t(label)}>
      <Icon name={icon} size={20} />
      <span className="side__lab">{t(label)}</span>
      {label === 'Time' && <><span className="side__badge">{hrs(23.5)}</span><span className="side__dot" /></>}
    </div>
  );

  return (
    <aside className={'side' + (open ? ' side--open' : '')} onMouseEnter={enter} onMouseLeave={leave} aria-label={t('Main navigation')}>
      <div className="side__brand">
        <img src={appIcon} alt="" />
        <div><span>Project Hub</span><span>Newsec</span></div>
      </div>
      {TOP.map(item)}
      <span className="side__fill" />
      {BOTTOM.map(item)}
    </aside>
  );
});
