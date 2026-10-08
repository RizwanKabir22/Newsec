import { memo, useMemo, type MouseEvent, type Ref } from 'react';
import { GROUP_LABEL, MINT, OR, QUEUE, QUEUE_ORDER, QUEUE_TABS, matchesTab, type QueueId, type QueueItem, type QueueTab } from '../data';
import type { IconName } from '../icons';
import { useI18n } from '../i18n';
import { Icon } from './Icon';

interface Props {
  queue: QueueId[];
  tab: QueueTab;
  onTab: (tab: QueueTab) => void;
  /** row action clicked; the row element is passed so it can animate out first */
  onAction: (id: QueueId, row: HTMLElement | null) => void;
  onReset: () => void;
  ref?: Ref<HTMLElement>;
}

function rowLook(i: QueueItem) {
  const g = i.group;
  return {
    strip: i.hot ? OR : i.ok ? MINT : 'rgba(255,255,255,.35)',
    chipBg: g === 0 ? OR : 'rgba(255,255,255,.16)',
    chipIc: (g === 0 ? 'TriangleAlert' : g === 1 ? 'Clock' : i.ok ? 'Calendar' : 'Timer') as IconName,
    tileBg: i.hot ? 'linear-gradient(145deg,#FF8A3D,#F25500)' : i.ok ? 'linear-gradient(145deg,#7CC2B5,#4E9E90)' : 'rgba(255,255,255,.18)',
    tileSh: i.hot ? '0 6px 16px rgba(255,96,0,.4)' : i.ok ? '0 6px 16px rgba(47,107,96,.35)' : 'inset 0 0 0 1px rgba(255,255,255,.2)',
  };
}

const Row = memo(function Row({ item, onAction }: { item: QueueItem; onAction: Props['onAction'] }) {
  const { t } = useI18n();
  const look = rowLook(item);
  const act = (e: MouseEvent<HTMLButtonElement>) => onAction(item.id, e.currentTarget.closest<HTMLElement>('[data-row]'));
  return (
    <div data-row="" className="row">
      <span data-strip="" className="row__strip" style={{ background: look.strip }} />
      <span data-tile="" className="row__tile" style={{ background: look.tileBg, boxShadow: look.tileSh }}><Icon name={item.icon} size={20} /></span>
      <div className="row__body">
        <div className="row__title">{t(item.title)}</div>
        <div className="row__meta"><Icon name="Building" size={13} /><span>{t(item.meta)}</span></div>
      </div>
      <span className="row__chip" style={{ background: look.chipBg }}><Icon name={look.chipIc} size={14} />{t(item.st)}</span>
      <div className="row__acts">
        <button className={'row__btn' + (item.glass ? ' row__btn--glass' : '')} onClick={act}>{t(item.act)}</button>
        <span className="row__more circle-btn" role="img" aria-label={t('More actions')}><Icon name="Ellipsis" size={18} /></span>
      </div>
    </div>
  );
});

export const Attention = memo(function Attention({ queue, tab, onTab, onAction, onReset, ref }: Props) {
  const { t } = useI18n();
  const v = useMemo(() => {
    const list = queue.filter(id => matchesTab(id, tab)).map(id => QUEUE[id]);
    const groups = ([0, 1] as const)
      .map(g => ({ g, label: GROUP_LABEL[g], items: list.filter(i => i.group === g) }))
      .filter(g => g.items.length);
    const waiting = list.filter(i => i.group === 2);
    const inGroup = (g: number) => queue.filter(q => QUEUE[q].group === g).length;
    const cleared = QUEUE_ORDER.length - queue.length;
    return {
      list, groups, waiting, cleared,
      nUrgent: inGroup(0), nToday: inGroup(1), nWaiting: inGroup(2),
      tabs: QUEUE_TABS.map(([id, label]) => ({ id, label, count: queue.filter(q => matchesTab(q, id)).length })),
    };
  }, [queue, tab]);

  const total = QUEUE_ORDER.length;

  return (
    <section ref={ref} data-reveal="" className="attn">
      <div className="attn__glow" />
      <div className="attn__head">
        <div className="attn__head-l">
          <span className="attn__icon"><Icon name="Flash" size={24} /></span>
          <div>
            <div className="attn__title">{t('Needs your attention')}</div>
            <div className="attn__summary">
              <span><span data-pulse="" className="pulse-dot" style={v.nUrgent ? undefined : { visibility: 'hidden' }} /><span>{v.nUrgent}</span>{t('urgent')}</span>
              <span>{v.nToday}{' ' + t('due today')}</span>
              <span>{v.nWaiting}{' ' + t('waiting')}</span>
            </div>
          </div>
        </div>
        <div className="attn__count"><span data-pop="" data-count="">{queue.length}</span><span>{t('open')}</span></div>
      </div>

      <div className="attn__bar">
        <div className="tabs-d" role="group" aria-label={t('Filter')}>
          {v.tabs.map(x => (
            <button key={x.id} aria-pressed={tab === x.id} onClick={() => onTab(x.id)}>{t(x.label)}<span>{x.count}</span></button>
          ))}
        </div>
        <span className="attn__sort">{t('Sorted by urgency')}</span>
      </div>

      <div className="attn__list">
        {v.groups.map(g => (
          <div key={g.g} className="attn__group">
            <div className="attn__ghead">
              <span className="eyebrow">{t(g.label)}</span>
              <span className="attn__gcount">{g.items.length}</span>
              <span className="attn__gline" />
            </div>
            {g.items.map(i => <Row key={i.id} item={i} onAction={onAction} />)}
          </div>
        ))}
        {v.waiting.length > 0 && (
          <div className="wait">
            <Icon name="Timer" size={18} />
            <span className="wait__text"><b>{v.waiting.length}{' ' + t('waiting on others')}</b><span>{' · ' + v.waiting.map(i => t(i.waitName!)).join(', ')}</span></span>
            <button>{t('View')}</button>
          </div>
        )}
        {v.list.length === 0 && (
          <div className="empty">
            <span className="empty__icon"><Icon name="Check" size={28} /></span>
            <b>{t('All caught up')}</b>
            <span>{t('New items appear here as soon as they arrive.')}</span>
          </div>
        )}
      </div>

      <div className="attn__foot">
        <span className="attn__all">{t('View all') + ' '}<span>{queue.length}</span><Icon name="ArrowRight" size={16} /></span>
        <div className="attn__progress">
          <div className="attn__track"><div style={{ width: `${(v.cleared / total) * 100}%` }} /></div>
          <span>{v.cleared}{' ' + t('of') + ' '}{total}{' ' + t('cleared today')}</span>
        </div>
        <button className="attn__reset" onClick={onReset}>{t('Reset')}</button>
      </div>
    </section>
  );
});
