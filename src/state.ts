import type { Lang } from './i18n';
import { HOURS, QUEUE_ORDER, type CustomerId, type QueueId, type QueueTab, type Segment } from './data';

export interface DashState {
  queue: QueueId[];
  tab: QueueTab;
  seg: Segment | 'all';
  cust: CustomerId | 'all';
  /** selected phase tile on the "Projects by phase" board */
  phase: number;
  dark: boolean;
  lang: Lang;
  drawer: boolean;
  /** which hour entries are ticked in the approval drawer */
  sel: boolean[];
}

export type DashAction =
  | { type: 'tab'; tab: QueueTab }
  | { type: 'resolve'; id: QueueId }
  | { type: 'reset' }
  | { type: 'seg'; seg: Segment | 'all' }
  | { type: 'customer'; cust: CustomerId | 'all' }
  | { type: 'phase'; phase: number }
  | { type: 'toggleTheme' }
  | { type: 'lang'; lang: Lang }
  | { type: 'openDrawer' }
  | { type: 'closeDrawer' }
  | { type: 'toggleEntry'; index: number }
  | { type: 'toggleAllEntries' }
  | { type: 'approveHours' };

const allSelected = () => HOURS.map(() => true);

export const initialState: DashState = {
  queue: QUEUE_ORDER.slice(),
  tab: 'all',
  seg: 'all',
  cust: 'all',
  phase: 2,
  dark: false,
  lang: 'en',
  drawer: false,
  sel: allSelected(),
};

export function reducer(s: DashState, a: DashAction): DashState {
  switch (a.type) {
    case 'tab': return { ...s, tab: a.tab };
    case 'resolve': return { ...s, queue: s.queue.filter(x => x !== a.id) };
    case 'reset': return { ...s, queue: QUEUE_ORDER.slice(), tab: 'all' };
    case 'seg': return { ...s, seg: a.seg };
    case 'customer': return { ...s, cust: a.cust };
    case 'phase': return { ...s, phase: Math.min(5, Math.max(1, a.phase)) };
    case 'toggleTheme': return { ...s, dark: !s.dark };
    case 'lang': return { ...s, lang: a.lang };
    case 'openDrawer': return { ...s, drawer: true, sel: allSelected() };
    case 'closeDrawer': return { ...s, drawer: false };
    case 'toggleEntry': return { ...s, sel: s.sel.map((v, j) => (j === a.index ? !v : v)) };
    case 'toggleAllEntries': {
      const all = s.sel.every(Boolean);
      return { ...s, sel: s.sel.map(() => !all) };
    }
    case 'approveHours':
      if (!s.sel.some(Boolean)) return s;
      return { ...s, drawer: false, queue: s.queue.filter(x => x !== 'q2') };
  }
}
