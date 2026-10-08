/**
 * The PM's own week of time: AI-drafted entries per day plus anything logged by hand.
 * (Hours submitted by other people through Project Center live in the separate approval drawer.)
 */
import type { IconName } from './icons';

export type SrcKind = 'calendar' | 'email' | 'document' | 'teams' | 'erp' | 'manual';

export const SRC_ICON: Record<SrcKind, IconName> = {
  calendar: 'Calendar', email: 'Sms', document: 'FilePenLine', teams: 'Clock', erp: 'Receipt', manual: 'Clock',
};

export interface Entry {
  id: string;
  day: number;
  /** project name, or INTERNAL */
  project: string;
  h: number;
  src: SrcKind;
  /** why the AI suggested it (English source text, translated at render) */
  srcText: string;
  chargeable: boolean;
  writtenOff: boolean;
  /** drafted by AI (false = logged by hand) */
  ai: boolean;
}

export const INTERNAL = 'Internal (non-project)';
export const TODAY = 2;
export const WEEK_TARGET = 37;

export const DAYS = [
  { key: 'Mon', full: 'Monday', date: 5 },
  { key: 'Tue', full: 'Tuesday', date: 6 },
  { key: 'Wed', full: 'Wednesday', date: 7 },
  { key: 'Thu', full: 'Thursday', date: 8 },
  { key: 'Fri', full: 'Friday', date: 9 },
] as const;

/** Planned hours for days that haven't happened yet. */
export const PLANNED = [0, 0, 0, 7.5, 7.5];

const E = (id: string, day: number, project: string, h: number, src: SrcKind, srcText: string, chargeable = true, ai = true): Entry =>
  ({ id, day, project, h, src, srcText, chargeable, writtenOff: false, ai });

export const INITIAL_ENTRIES: Entry[] = [
  // Monday: drafted and already confirmed
  E('m1', 0, 'Strandvejen 112', 3, 'calendar', 'Site meeting · Calendar'),
  E('m2', 0, 'Amager Strandvej 210', 2, 'email', 'Email thread with Byg & Facade'),
  E('m3', 0, 'Gammel Kongevej 60', 2, 'document', 'Edited tender doc'),
  E('m4', 0, INTERNAL, 0.5, 'teams', 'Team stand-up · Teams', false),
  // Tuesday: 3.0h you logged yourself + 4.5h AI draft waiting for you
  E('t0', 1, 'Islands Brygge 23', 3, 'manual', 'Logged by you', true, false),
  E('t1', 1, 'A/B Ryesgade 30', 2.5, 'calendar', 'Board meeting · Calendar'),
  E('t2', 1, 'Strandvejen 112', 1.5, 'email', 'Email thread with Lars Mikkelsen'),
  E('t3', 1, INTERNAL, 0.5, 'teams', 'Project admin · Teams', false),
  // Wednesday (today): drafting live through the day
  E('w1', 2, 'Valby Langgade 88', 3, 'document', 'Handover docs · SharePoint'),
  E('w2', 2, 'Nørrebrogade 45, 3.tv', 2, 'document', 'Edited tender doc'),
  E('w3', 2, 'Sydhavnsgade 11', 1.5, 'erp', 'Final invoice · Business Central'),
  E('w4', 2, 'Islands Brygge 23', 1.5, 'teams', 'Call with VVS Partner Øst · Teams'),
];

export interface WeekState {
  entries: Entry[];
  /** per day: has the PM confirmed the day's AI draft */
  confirmed: boolean[];
  submitted: boolean;
}

export const initialWeek: WeekState = { entries: INITIAL_ENTRIES, confirmed: [true, false, false, false, false], submitted: false };

export type WeekAction =
  | { type: 'entry'; id: string; patch: Partial<Pick<Entry, 'project' | 'h' | 'chargeable' | 'writtenOff'>> }
  | { type: 'confirmDay'; day: number }
  | { type: 'reopenDay'; day: number }
  | { type: 'submitWeek' };

export type EntryPatch = Extract<WeekAction, { type: 'entry' }>['patch'];

export function weekReducer(s: WeekState, a: WeekAction): WeekState {
  switch (a.type) {
    case 'entry':
      return {
        ...s,
        entries: s.entries.map(e => {
          if (e.id !== a.id) return e;
          const next = { ...e, ...a.patch };
          // internal time and written-off time are never billed
          if (a.patch.project === INTERNAL || next.writtenOff) next.chargeable = false;
          if (a.patch.project && a.patch.project !== INTERNAL && e.project === INTERNAL && !next.writtenOff) next.chargeable = true;
          if (a.patch.writtenOff === false && next.project !== INTERNAL) next.chargeable = true;
          next.h = Math.min(12, Math.max(0.5, Math.round(next.h * 2) / 2));
          return next;
        }),
      };
    case 'confirmDay': return { ...s, confirmed: s.confirmed.map((c, i) => (i === a.day ? true : c)) };
    case 'reopenDay': return s.submitted ? s : { ...s, confirmed: s.confirmed.map((c, i) => (i === a.day ? false : c)) };
    case 'submitWeek': return { ...s, submitted: true };
  }
}

// ---------- selectors ----------

const sum = (es: Entry[]) => es.reduce((t, e) => t + e.h, 0);

/** An entry counts towards the week once its day is confirmed; hand-logged time and today's running draft always count. */
export const isLogged = (s: WeekState, e: Entry) => !e.ai || s.confirmed[e.day] || e.day === TODAY;

export const dayEntries = (s: WeekState, d: number) => s.entries.filter(e => e.day === d);
export const loggedTotal = (s: WeekState) => sum(s.entries.filter(e => isLogged(s, e)));
export const dayLogged = (s: WeekState, d: number) => sum(dayEntries(s, d).filter(e => isLogged(s, e)));
/** AI hours drafted for a day that still need the PM's confirmation (today counts as logged, so excluded). */
export const dayPending = (s: WeekState, d: number) => (s.confirmed[d] || d === TODAY ? 0 : sum(dayEntries(s, d).filter(e => e.ai)));

export function daySummary(entries: Entry[]) {
  const ai = entries.filter(e => e.ai);
  return { drafted: sum(ai), chargeable: sum(ai.filter(e => e.chargeable)) };
}

export function split(entries: Entry[]) {
  return {
    chargeable: sum(entries.filter(e => e.chargeable)),
    non: sum(entries.filter(e => !e.chargeable && !e.writtenOff)),
    writtenOff: sum(entries.filter(e => e.writtenOff)),
  };
}
