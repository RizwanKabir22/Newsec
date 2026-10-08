import { createContext, useContext, useMemo, type ReactNode } from 'react';

export type Lang = 'en' | 'da';

/**
 * Danish translations, keyed by the English source text (gettext style). English is the source,
 * so a missing key falls back to English instead of showing a blank.
 * `{name}` placeholders are filled in by `t(key, { name })`.
 */
const DA: Record<string, string> = {
  // header + sidebar
  'Project Hub': 'Project Hub',
  'Search projects, people, documents…': 'Søg i projekter, personer, dokumenter…',
  'Search': 'Søg',
  'New project': 'Nyt projekt',
  'Switch to dark mode': 'Skift til mørk tilstand',
  'Switch to light mode': 'Skift til lys tilstand',
  'Language': 'Sprog',
  'Main navigation': 'Hovedmenu',
  'Overview': 'Overblik',
  'Projects': 'Projekter',
  'Time': 'Tid',
  'Tenders': 'Udbud',
  'Reports': 'Rapporter',
  'Library': 'Bibliotek',
  'Settings': 'Indstillinger',
  'Help & guidance': 'Hjælp og vejledning',

  // hero + portfolio
  'Wednesday 7 October · Week 41': 'Onsdag 7. oktober · Uge 41',
  'Good morning,': 'Godmorgen,',
  'things need you today.': 'opgaver venter på dig i dag.',
  '1 gate is blocked.': '1 gate er blokeret.',
  'Start with Ryesgade': 'Start med Ryesgade',
  'See my week': 'Se min uge',
  'Portfolio': 'Portefølje',
  'Week 41': 'Uge 41',
  'Budget under management': 'Budget under forvaltning',
  'DKK m': 'mio. kr.',
  'spent': 'brugt',
  'Forecast {v}': 'Prognose {v}',
  'Active projects': 'Aktive projekter',
  '+2 this month': '+2 denne måned',
  'Forecast vs budget': 'Prognose vs. budget',
  'Health': 'Status',
  '{n} projects': '{n} projekter',
  'On track': 'På sporet',
  'At risk': 'I risiko',
  'Blocked': 'Blokeret',

  // attention
  'Needs your attention': 'Kræver din opmærksomhed',
  'urgent': 'haster',
  'due today': 'i dag',
  'waiting': 'venter',
  'open': 'åbne',
  'Filter': 'Filter',
  'All': 'Alle',
  'Approvals': 'Godkendelser',
  'Gates': 'Gates',
  'Finance': 'Økonomi',
  'Safety': 'Sikkerhed',
  'Sorted by urgency': 'Sorteret efter hast',
  'Urgent': 'Haster',
  'Due today': 'I dag',
  'Waiting & upcoming': 'Venter og kommende',
  'Gate 2 blocked: 2 tasks missing': 'Gate 2 blokeret: 2 opgaver mangler',
  'Overdue 2d': '2 dage over',
  'Open': 'Åbn',
  'Permit to work expires Friday': 'Arbejdstilladelse udløber fredag',
  'Expires Fri': 'Udløber fre.',
  'Renew': 'Forny',
  'Approve 12.5h from Project Center': 'Godkend 12,5 t fra Project Center',
  '3 projects': '3 projekter',
  'Today': 'I dag',
  'Review': 'Gennemse',
  'Final invoice ready · Sydhavnsgade 11': 'Slutfaktura klar · Sydhavnsgade 11',
  'DKK 2.6m': '2,6 mio. kr.',
  'Send to BC': 'Send til BC',
  'Change order +DKK 185,000 awaiting customer': 'Ændringsordre +185.000 kr. afventer kunden',
  '4 days': '4 dage',
  'Resend link': 'Send link igen',
  'Request Gate 4 sign-off': 'Anmod om godkendelse af Gate 4',
  'Thu 8 Oct': 'Tor. 8. okt.',
  'Request': 'Anmod',
  'Monthly report for Nordhavn Ejendomme': 'Månedsrapport for Nordhavn Ejendomme',
  'Excel · auto': 'Excel · auto',
  'Fri': 'Fre.',
  'Change order': 'Ændringsordre',
  'Gate 4 sign-off': 'Gate 4-godkendelse',
  'Monthly report': 'Månedsrapport',
  'waiting on others': 'venter på andre',
  'View': 'Vis',
  'All caught up': 'Du er helt ajour',
  'New items appear here as soon as they arrive.': 'Nye opgaver vises her, så snart de kommer ind.',
  'View all': 'Vis alle',
  'of': 'af',
  'cleared today': 'klaret i dag',
  'Reset': 'Nulstil',
  'More actions': 'Flere handlinger',

  // gates
  'Gate reviews': 'Gatemøder',
  '4 in the next 14 days': '4 inden for 14 dage',
  'Tomorrow · 10:00': 'I morgen · 10.00',
  'Completion & Invoicing': 'Afslutning og fakturering',
  'Oct': 'Okt',
  'Handover docs complete': 'Afleveringsdokumenter klar',
  'Request sign-off': 'Anmod om godkendelse',
  'Next two weeks': 'Næste to uger',
  '7–20 Oct': '7.–20. okt.',
  'Later': 'Senere',
  'Tue': 'Tir.',
  'Thu': 'Tor.',
  'View all gate reviews': 'Se alle gatemøder',

  // time
  "This week's time": 'Ugens tid',
  'Week 41 · Mon–Fri': 'Uge 41 · man.–fre.',
  'h': 't',
  'Mon': 'Man',
  'Wed': 'Ons',
  'Draft ready': 'Kladde klar',
  'From calendar': 'Fra kalenderen',
  'Confirmed': 'Bekræftet',
  'Confirm {h}': 'Bekræft {h}',
  '{h} added': '{h} tilføjet',
  'Open daily AI breakdown': 'Åbn dagligt AI-overblik',
  'Open AI breakdown': 'Åbn AI-overblik',

  // cost
  'Cost overview': 'Omkostningsoverblik',
  '6 projects · DKK': '6 projekter · kr.',
  'Open in Power BI': 'Åbn i Power BI',
  'Export to Excel': 'Eksportér til Excel',
  'Budget': 'Budget',
  'Actual to date': 'Forbrug til dato',
  'Invoiced to date': 'Faktureret til dato',
  'Pending changes': 'Afventende ændringer',
  'm': 'mio.',
  'k': 't.kr.',
  '% fee': '% honorar',
  'Fixed price': 'Fast pris',
  'Time spent': 'Medgået tid',
  'Over budget': 'Over budget',
  'Actual': 'Faktisk',
  'Committed': 'Disponeret',
  'Forecast': 'Prognose',

  // correspondence
  'Correspondence': 'Korrespondance',
  '2 new today': '2 nye i dag',
  'Re: Change order 03': 'Sv: Ændringsordre 03',
  'Snag list, balconies 4–7': 'Mangelliste, altaner 4–7',
  'Contract questions': 'Spørgsmål til kontrakten',
  'Bid submitted': 'Tilbud afgivet',
  'Yesterday': 'I går',

  // projects by phase
  'Projects by phase': 'Projekter efter fase',
  '{n} active across 5 stage gates': '{n} aktive på tværs af 5 stage gates',
  'Customer': 'Kunde',
  'Segment': 'Segment',
  'All customers': 'Alle kunder',
  'Housing associations': 'Boligforeninger',
  'Private owners': 'Private ejere',
  'Apartment': 'Lejlighed',
  'Association': 'Forening',
  'Investment': 'Investering',
  'Phase {n}': 'Fase {n}',
  '{n} needs you': '{n} kræver dig',
  'Request & Pre-Analysis': 'Anmodning og forundersøgelse',
  'Design & Initiation': 'Design og opstart',
  'Construction': 'Udførelse',
  'Handover & Evaluation': 'Aflevering og evaluering',
  'Design': 'Design',
  'Completion': 'Afslutning',
  'Handover': 'Aflevering',
  'Phase {n} of 5 · closes at gate G{n}': 'Fase {n} af 5 · afsluttes ved gate G{n}',
  '1 project': '1 projekt',
  '{n} at risk': '{n} i risiko',
  'all on track': 'alle på sporet',
  'Open phase': 'Åbn fase',
  'Gate blocked': 'Gate blokeret',
  'Needs you': 'Kræver dig',
  'Stage gate': 'Stage gate',
  'Gate with a problem': 'Gate med problem',
  'No projects in this phase for the selected filters.': 'Ingen projekter i denne fase med de valgte filtre.',
  'Projects by phase. Use the left and right arrow keys to change phase.': 'Projekter efter fase. Brug venstre og højre piletast til at skifte fase.',
  'Office conversion': 'Kontorombygning',
  'Kitchen & bath': 'Køkken og bad',
  'Roof replacement': 'Tagudskiftning',
  'Refurbishment': 'Istandsættelse',
  'Energy retrofit': 'Energirenovering',
  'Window replacement': 'Vinduesudskiftning',
  'Facade renovation': 'Facaderenovering',
  'Pipe replacement': 'Rørudskiftning',
  'Retail fit-out': 'Butiksindretning',
  'Apartment renovation': 'Lejlighedsrenovering',
  'Ventilation': 'Ventilation',
  'Balconies': 'Altaner',
  'Office fit-out': 'Kontorindretning',
  'Courtyard': 'Gårdanlæg',

  // hours drawer
  'Time approval': 'Tidsgodkendelse',
  'Approve hours': 'Godkend timer',
  'Sofie Holm · Project Center · Week 41': 'Sofie Holm · Project Center · Uge 41',
  'Close': 'Luk',
  '{n} Chargeable': '{n} fakturerbare',
  '{n} Non-chargeable': '{n} ikke-fakturerbare',
  '{n} entries': '{n} registreringer',
  'Clear selection': 'Ryd valg',
  'Select all': 'Vælg alle',
  'Facade inspection · Chargeable': 'Facadeinspektion · Fakturerbar',
  'Board meeting prep · Chargeable': 'Forberedelse af bestyrelsesmøde · Fakturerbar',
  'Internal coordination · Non-chargeable': 'Intern koordinering · Ikke-fakturerbar',
  "2.5h of these were suggested by AI from Sofie's calendar and email.": '2,5 t af disse er foreslået af AI ud fra Sofies kalender og e-mail.',
  'Approved hours post to Business Central for project costing.': 'Godkendte timer bogføres i Business Central til projektøkonomi.',
  'Reject': 'Afvis',
  'Approve {h}': 'Godkend {h}',
  'Select entries': 'Vælg registreringer',
  // daily AI breakdown
  'AI daily breakdown': 'Dagligt AI-overblik',
  'Drafting…': 'Skriver udkast…',
  'Drafted by AI': 'Udkast fra AI',
  'Regenerate this day': 'Generér dagen igen',
  'Regenerate': 'Generér igen',
  'Drafting {day}…': 'Skriver {day}…',
  'Draft with AI': 'Skriv med AI',
  'Reading calendar · {n} events': 'Læser kalender · {n} begivenheder',
  'Your own time, drafted from your calendar, email and documents.': 'Din egen tid, skrevet ud fra din kalender, e-mail og dokumenter.',
  'Days': 'Dage',
  'Mon.short': 'Man', 'Tue.short': 'Tir', 'Wed.short': 'Ons', 'Thu.short': 'Tor', 'Fri.short': 'Fre',
  'Monday': 'Mandag', 'Tuesday': 'Tirsdag', 'Wednesday': 'Onsdag', 'Thursday': 'Torsdag', 'Friday': 'Fredag',
  'Chargeable split': 'Fordeling af fakturerbar tid',
  'Chargeable': 'Fakturerbar',
  'Non-chargeable': 'Ikke-fakturerbar',
  'Written off': 'Afskrevet',
  'Reading your calendar · {n} events': 'Læser din kalender · {n} begivenheder',
  'Scanning email · {n} threads': 'Gennemgår e-mail · {n} tråde',
  'Matching documents to projects · {n} files': 'Matcher dokumenter med projekter · {n} filer',
  'Splitting chargeable and internal time': 'Fordeler fakturerbar og intern tid',
  'Drafted {n} entries from {e} events, {m} emails and {d} documents': '{n} registreringer skrevet ud fra {e} begivenheder, {m} e-mails og {d} dokumenter',
  'Skip': 'Spring over',
  'Planned · {h}': 'Planlagt · {h}',
  '{h} logged': '{h} registreret',
  'Not drafted yet': 'Ikke skrevet endnu',
  'Today · drafting live': 'I dag · skrives løbende',
  'Draft · needs you': 'Udkast · kræver dig',
  'AI drafts {day} at 17:00 from {n} meetings, your email and documents.': 'AI skriver {day} kl. 17.00 ud fra {n} møder, din e-mail og dine dokumenter.',
  'drafted': 'i udkast',
  'chargeable': 'fakturerbar',
  'Reopen': 'Genåbn',
  'Confirm day': 'Bekræft dag',
  'Week 41 submitted to Business Central': 'Uge 41 sendt til Business Central',
  'logged': 'registreret',
  'awaiting you': 'venter på dig',
  'Confirm {days} to submit': 'Bekræft {days} for at indsende',
  'All days confirmed': 'Alle dage er bekræftet',
  'Submit week': 'Indsend uge',
  'Project': 'Projekt',
  'Hours': 'Timer',
  'Less': 'Færre',
  'More': 'Flere',
  'Written off · {h}': 'Afskrevet · {h}',
  'Undo': 'Fortryd',
  'Write off': 'Afskriv',
  'Internal (non-project)': 'Intern (ikke projekt)',
  'Site meeting · Calendar': 'Byggemøde · Kalender',
  'Email thread with Byg & Facade': 'E-mailtråd med Byg & Facade',
  'Edited tender doc': 'Redigeret udbudsmateriale',
  'Team stand-up · Teams': 'Team-stand-up · Teams',
  'Logged by you': 'Registreret af dig',
  'Board meeting · Calendar': 'Bestyrelsesmøde · Kalender',
  'Email thread with Lars Mikkelsen': 'E-mailtråd med Lars Mikkelsen',
  'Project admin · Teams': 'Projektadministration · Teams',
  'Handover docs · SharePoint': 'Afleveringsdokumenter · SharePoint',
  'Final invoice · Business Central': 'Slutfaktura · Business Central',
  'Call with VVS Partner Øst · Teams': 'Opkald med VVS Partner Øst · Teams',
};

type Vars = Record<string, string | number>;

export interface I18n {
  lang: Lang;
  /** translate an English source string, filling `{placeholders}` */
  t: (s: string, vars?: Vars) => string;
  /** format a number with the language's decimal separator */
  num: (v: number, decimals?: number) => string;
  /** hours, e.g. "6.0h" / "6,0 t" */
  hrs: (v: number) => string;
  /** DKK millions, e.g. "24.1m" / "24,1 mio." */
  mio: (v: number) => string;
}

export function makeI18n(lang: Lang): I18n {
  const num = (v: number, d = 1) => (lang === 'da' ? v.toFixed(d).replace('.', ',') : v.toFixed(d));
  const t = (s: string, vars?: Vars) => {
    let out = lang === 'da' ? DA[s] ?? s : s;
    if (import.meta.env.DEV && lang === 'da' && !(s in DA)) console.warn('[i18n] missing Danish text for:', s);
    if (vars) for (const [k, v] of Object.entries(vars)) out = out.split(`{${k}}`).join(String(v));
    return out;
  };
  return {
    lang, t, num,
    hrs: v => (lang === 'da' ? `${num(v)} t` : `${num(v)}h`),
    mio: v => (lang === 'da' ? `${num(v)} mio.` : `${num(v)}m`),
  };
}

const Ctx = createContext<I18n>(makeI18n('en'));

export function I18nProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const value = useMemo(() => makeI18n(lang), [lang]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
