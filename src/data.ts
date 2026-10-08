import type { IconName } from './icons';
import avatar2 from './assets/avatar-2.jpg';
import avatar3 from './assets/avatar-3.jpg';
import avatar5 from './assets/avatar-5.jpg';
import avatar6 from './assets/avatar-6.jpg';
import bld1 from './assets/bld-1.jpg';
import bld3 from './assets/bld-3.jpg';
import bld4 from './assets/bld-4.jpg';
import bld6 from './assets/bld-6.jpg';
import bld7 from './assets/bld-7.jpg';
import bld8 from './assets/bld-8.jpg';
import bld9 from './assets/bld-9.jpg';
import bld11 from './assets/bld-11.jpg';
import bld12 from './assets/bld-12.jpg';
import bld13 from './assets/bld-13.jpg';
import bld14 from './assets/bld-14.jpg';
import bld15 from './assets/bld-15.jpg';
import bld16 from './assets/bld-16.jpg';
import bld17 from './assets/bld-17.jpg';

export const OR = '#FF6000';
export const MINT = '#96CCC2';
export const BLUE = '#4F6CF5';
export const LILAC = '#C1AEEF';

/**
 * Colours that differ between the light and dark theme but are computed per item
 * (inline styles), so they live here rather than in CSS custom properties.
 */
export interface Palette {
  dark: boolean;
  /** primary ink / solid fill (navy in light, near-white in dark) */
  ink: string;
  /** text on a solid fill */
  onInk: string;
  /** raised surface (selected tile, chips, cards inside cards) */
  surf: string;
  /** ink at a given alpha */
  rg: (a: number | string) => string;
  hatch: string;
  /** orange used as text on the page background */
  orText: string;
  /** mint used as text on the page background */
  mintText: string;
}

export const palette = (dark: boolean): Palette => ({
  dark,
  ink: dark ? '#EEF1F7' : '#161C3B',
  onInk: dark ? '#161C3B' : '#fff',
  surf: dark ? '#232B52' : '#fff',
  rg: a => (dark ? 'rgba(238,241,247,' : 'rgba(22,28,59,') + a + ')',
  hatch: 'repeating-linear-gradient(-45deg,' + (dark ? 'rgba(255,255,255,.22)' : 'rgba(22,28,59,.18)') + ' 0 2px,transparent 2px 7px)',
  orText: dark ? '#FFA066' : '#C24A00',
  mintText: dark ? '#96CCC2' : '#2F6B60',
});

// ---------- projects ----------

export type Segment = 'apt' | 'assoc' | 'inv';
export type Health = 'green' | 'amber' | 'red';
export type CustomerId = 'nordhavn' | 'kronborg' | 'assoc' | 'private';

export interface Project {
  id: string;
  name: string;
  seg: Segment;
  phase: 1 | 2 | 3 | 4 | 5;
  health: Health;
  pct: number;
  blocked: boolean;
  customer: CustomerId;
  img: string;
  job: string;
}

export const SEGMENT_LABEL: Record<Segment, string> = { apt: 'Apartment', assoc: 'Association', inv: 'Investment' };

export const PROJECTS: Project[] = (
  [
    ['frb', 'Frederiksberg Allé 14', 'inv', 1, 'green', 5, 'kronborg', bld11, 'Office conversion'],
    ['vest', 'Vesterbrogade 9', 'apt', 1, 'green', 10, 'private', bld3, 'Kitchen & bath'],
    ['rye', 'A/B Ryesgade 30', 'assoc', 2, 'red', 28, 'assoc', bld1, 'Roof replacement', true],
    ['nor', 'Nørrebrogade 45, 3.tv', 'apt', 2, 'amber', 35, 'private', bld12, 'Refurbishment'],
    ['gkv', 'Gammel Kongevej 60', 'inv', 2, 'green', 40, 'nordhavn', bld7, 'Energy retrofit'],
    ['bisp', 'Bispebjerg Bakke 5', 'assoc', 2, 'green', 22, 'assoc', bld16, 'Window replacement'],
    ['strand', 'Strandvejen 112', 'inv', 3, 'amber', 64, 'nordhavn', bld9, 'Facade renovation'],
    ['ib', 'Islands Brygge 23', 'assoc', 3, 'amber', 68, 'assoc', bld6, 'Pipe replacement'],
    ['oster', 'Østerbrogade 72', 'inv', 3, 'green', 41, 'kronborg', bld8, 'Retail fit-out'],
    ['amb', 'Amagerbrogade 140', 'apt', 3, 'green', 55, 'private', bld14, 'Apartment renovation'],
    ['valby', 'Valby Langgade 88', 'inv', 4, 'green', 95, 'kronborg', bld4, 'Ventilation'],
    ['ams', 'Amager Strandvej 210', 'assoc', 4, 'red', 97, 'assoc', bld13, 'Balconies'],
    ['syd', 'Sydhavnsgade 11', 'inv', 5, 'green', 100, 'nordhavn', bld15, 'Office fit-out'],
    ['jag', 'Jagtvej 120', 'assoc', 5, 'green', 100, 'assoc', bld17, 'Courtyard'],
  ] as const
).map(([id, name, seg, phase, health, pct, customer, img, job, blocked]) => ({
  id, name, seg, phase, health, pct, customer, img, job, blocked: Boolean(blocked),
}));

export interface Phase { n: 1 | 2 | 3 | 4 | 5; name: string; short: string; color: (p: Palette) => string }

export const PHASES: Phase[] = [
  { n: 1, name: 'Request & Pre-Analysis', short: 'Request', color: () => MINT },
  { n: 2, name: 'Design & Initiation', short: 'Design', color: () => BLUE },
  { n: 3, name: 'Construction', short: 'Construction', color: p => p.ink },
  { n: 4, name: 'Completion & Invoicing', short: 'Completion', color: () => LILAC },
  { n: 5, name: 'Handover & Evaluation', short: 'Handover', color: () => '#DDCDBC' },
];

/** Phase colours used by the gate calendar and "Later" list (Handover keeps the original orange there). */
export const gatePhaseColor = (n: number, p: Palette) => [MINT, BLUE, p.ink, LILAC, OR][n - 1];

export const CUSTOMERS: [CustomerId | 'all', string][] = [
  ['all', 'All customers'],
  ['nordhavn', 'Nordhavn Ejendomme'],
  ['kronborg', 'Kronborg Invest'],
  ['assoc', 'Housing associations'],
  ['private', 'Private owners'],
];

export const SEGMENT_TABS: [Segment | 'all', string][] = [
  ['all', 'All'], ['apt', 'Apartment'], ['assoc', 'Association'], ['inv', 'Investment'],
];

// ---------- attention queue ----------

export type QueueId = 'q1' | 'q9' | 'q2' | 'q7' | 'q3' | 'q5' | 'q8';
export type QueueTag = 'approvals' | 'gates' | 'finance' | 'safety' | 'reports';
export type QueueTab = 'all' | QueueTag;

export interface QueueItem {
  id: QueueId;
  icon: IconName;
  tags: QueueTag[];
  title: string;
  meta: string;
  st: string;
  act: string;
  /** 0 = urgent, 1 = due today, 2 = waiting & upcoming */
  group: 0 | 1 | 2;
  hot?: boolean;
  ok?: boolean;
  /** secondary ("glass") action button */
  glass?: boolean;
  /** short name used in the "waiting on others" summary row */
  waitName?: string;
}

export const QUEUE: Record<QueueId, QueueItem> = {
  q1: { id: 'q1', icon: 'Lock', hot: true, tags: ['gates'], title: 'Gate 2 blocked: 2 tasks missing', meta: 'A/B Ryesgade 30', st: 'Overdue 2d', act: 'Open', group: 0 },
  q9: { id: 'q9', icon: 'Shield', hot: true, tags: ['safety'], title: 'Permit to work expires Friday', meta: 'Strandvejen 112', st: 'Expires Fri', act: 'Renew', group: 0 },
  q2: { id: 'q2', icon: 'Clock', tags: ['approvals'], title: 'Approve 12.5h from Project Center', meta: '3 projects', st: 'Today', act: 'Review', group: 1 },
  q7: { id: 'q7', icon: 'Receipt', tags: ['finance'], title: 'Final invoice ready · Sydhavnsgade 11', meta: 'DKK 2.6m', st: 'Today', act: 'Send to BC', group: 1 },
  q3: { id: 'q3', icon: 'Receipt', tags: ['finance'], title: 'Change order +DKK 185,000 awaiting customer', meta: 'Strandvejen 112', st: '4 days', act: 'Resend link', glass: true, group: 2, waitName: 'Change order' },
  q5: { id: 'q5', icon: 'CircleCheck', ok: true, tags: ['gates'], title: 'Request Gate 4 sign-off', meta: 'Valby Langgade 88', st: 'Thu 8 Oct', act: 'Request', group: 2, waitName: 'Gate 4 sign-off' },
  q8: { id: 'q8', icon: 'FilePenLine', tags: ['reports'], title: 'Monthly report for Nordhavn Ejendomme', meta: 'Excel · auto', st: 'Fri', act: 'Review', glass: true, group: 2, waitName: 'Monthly report' },
};

/** Sorted by urgency. */
export const QUEUE_ORDER: QueueId[] = ['q1', 'q9', 'q2', 'q7', 'q3', 'q5', 'q8'];

export const QUEUE_TABS: [QueueTab, string][] = [
  ['all', 'All'], ['approvals', 'Approvals'], ['gates', 'Gates'], ['finance', 'Finance'], ['reports', 'Reports'], ['safety', 'Safety'],
];

export const GROUP_LABEL = ['Urgent', 'Due today', 'Waiting & upcoming'] as const;

export const matchesTab = (id: QueueId, tab: QueueTab) => tab === 'all' || QUEUE[id].tags.includes(tab);

// ---------- time ----------

export type DayKind = 'past' | 'today' | 'plan';
export const WEEK: { label: string; h: number; kind: DayKind; draft?: number }[] = [
  { label: 'Mon', h: 7.5, kind: 'past' },
  { label: 'Tue', h: 3.0, kind: 'past', draft: 4.5 },
  { label: 'Wed', h: 8.0, kind: 'today' },
  { label: 'Thu', h: 7.5, kind: 'plan' },
  { label: 'Fri', h: 7.5, kind: 'plan' },
];

// ---------- gates ----------

/** Next two weeks, starting today (Wed 7 Oct). Maps day of month to gate number. */
export const CAL_START = 7;
export const CAL_GATES: Record<number, number> = { 8: 4, 9: 3, 13: 2, 15: 1 };
export const CAL_WEEKDAYS = ['W', 'T', 'F', 'S', 'S', 'M', 'T'];

export const LATER_GATES = [
  { wd: 'Fri', day: 9, name: 'Islands Brygge 23', g: 3 },
  { wd: 'Tue', day: 13, name: 'Gammel Kongevej 60', g: 2 },
  { wd: 'Thu', day: 15, name: 'Frederiksberg Allé 14', g: 1 },
];

// ---------- cost ----------

export interface CostRow { name: string; price: string; budget: number; committed: number; actual: number; forecast: number }

export const COST: CostRow[] = [
  { name: 'Strandvejen 112', price: '% fee', budget: 12.4, committed: 10.8, actual: 7.9, forecast: 12.9 },
  { name: 'A/B Ryesgade 30', price: 'Fixed price', budget: 6.2, committed: 1.1, actual: 0.4, forecast: 6.2 },
  { name: 'Islands Brygge 23', price: 'Time spent', budget: 5.6, committed: 4.9, actual: 3.8, forecast: 5.8 },
  { name: 'Valby Langgade 88', price: 'Fixed price', budget: 4.1, committed: 4.0, actual: 3.9, forecast: 4.05 },
  { name: 'Amager Strandvej 210', price: '% fee', budget: 3.6, committed: 3.7, actual: 3.5, forecast: 3.9 },
  { name: 'Østerbrogade 72', price: 'Time spent', budget: 2.9, committed: 1.6, actual: 1.2, forecast: 2.85 },
];

// ---------- correspondence ----------

export const MAIL = [
  { from: 'Lars Mikkelsen', subj: 'Re: Change order 03', time: '09:42', project: 'Strandvejen 112', avatar: avatar2 },
  { from: 'Byg & Facade ApS', subj: 'Snag list, balconies 4–7', time: '08:15', project: 'Amager Strandvej 210', avatar: avatar6 },
  { from: 'Bestyrelsen', subj: 'Contract questions', time: 'Yesterday', project: 'A/B Ryesgade 30', avatar: avatar5 },
  { from: 'VVS Partner Øst', subj: 'Bid submitted', time: 'Yesterday', project: 'Nørrebrogade 45', avatar: avatar3 },
];

// ---------- hours approval ----------

export const HOURS = [
  { name: 'Strandvejen 112', meta: 'Facade inspection · Chargeable', h: 6 },
  { name: 'A/B Ryesgade 30', meta: 'Board meeting prep · Chargeable', h: 4.5 },
  { name: 'Valby Langgade 88', meta: 'Internal coordination · Non-chargeable', h: 2 },
];
