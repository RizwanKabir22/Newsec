import { useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react';
import { Attention } from './components/Attention';
import { CostCard } from './components/CostCard';
import { Gates } from './components/Gates';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HoursDrawer } from './components/HoursDrawer';
import { Mail } from './components/Mail';
import { PhaseBoard } from './components/PhaseBoard';
import { Sidebar } from './components/Sidebar';
import { TimeCard } from './components/TimeCard';
import { TimeDrawer } from './components/TimeDrawer';
import { palette, type CustomerId, type QueueId, type QueueTab, type Segment } from './data';
import { I18nProvider, type Lang } from './i18n';
import { Motion } from './motion';
import { initialState, reducer, type DashState } from './state';
import { initialWeek, weekReducer } from './week';

const THEME_KEY = 'project-hub-theme';
const LANG_KEY = 'project-hub-lang';

/** Light + English are the defaults; a viewer's own choices are remembered in this browser only. */
function withStoredPrefs(s: DashState): DashState {
  try {
    return { ...s, dark: localStorage.getItem(THEME_KEY) === 'dark', lang: localStorage.getItem(LANG_KEY) === 'da' ? 'da' : 'en' };
  } catch { return s; }
}

/** Run `fn` when `value` changes, skipping the first render. Layout timing so animations start before paint. */
function useChangeEffect<T>(value: T, fn: (prev: T) => void) {
  const prev = useRef(value);
  useLayoutEffect(() => {
    if (prev.current !== value) fn(prev.current);
    prev.current = value;
  });
}

export function App() {
  const [s, dispatch] = useReducer(reducer, initialState, withStoredPrefs);
  const rootRef = useRef<HTMLDivElement>(null);
  const attnRef = useRef<HTMLElement>(null);
  const boardRef = useRef<HTMLElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const p = useMemo(() => palette(s.dark), [s.dark]);
  const [navOpen, setNavOpen] = useState(false);
  const [week, dispatchWeek] = useReducer(weekReducer, initialWeek);
  // daily AI breakdown panel: plays its "drafting" sequence on first open and after Regenerate
  const [timeOpen, setTimeOpen] = useState(false);
  // which days the AI has drafted in the panel; Monday was drafted and confirmed earlier in the week
  const [generated, setGenerated] = useState([true, false, false, false, false]);
  const timeScrim = useRef<HTMLDivElement>(null);
  const timeDrawer = useRef<HTMLDivElement>(null);

  useEffect(() => (rootRef.current ? Motion.init(rootRef.current) : undefined), []);
  useEffect(() => (boardRef.current ? Motion.board(boardRef.current) : undefined), []);

  // Theme tokens live on <html> so the fixed drawer and the page background follow too.
  useLayoutEffect(() => {
    const el = document.documentElement;
    if (s.dark) el.setAttribute('data-dash-theme', 'dark'); else el.removeAttribute('data-dash-theme');
    try { localStorage.setItem(THEME_KEY, s.dark ? 'dark' : 'light'); } catch { /* storage unavailable */ }
  }, [s.dark]);

  useLayoutEffect(() => {
    document.documentElement.lang = s.lang;
    try { localStorage.setItem(LANG_KEY, s.lang); } catch { /* storage unavailable */ }
  }, [s.lang]);

  useChangeEffect(s.tab, () => Motion.rows(attnRef.current));
  useChangeEffect(s.queue.length, () => Motion.pop(attnRef.current?.querySelector('[data-pop]') ?? null));
  useChangeEffect(s.drawer, () => { if (s.drawer) Motion.drawer(scrimRef.current, drawerRef.current); });
  useChangeEffect(timeOpen, () => { if (timeOpen) Motion.drawer(timeScrim.current, timeDrawer.current); });
  useChangeEffect(s.phase, prev => Motion.boardSwap(boardRef.current, Math.sign(s.phase - prev)));
  useChangeEffect(s.seg, () => Motion.boardSwap(boardRef.current, 0));
  useChangeEffect(s.cust, () => Motion.boardSwap(boardRef.current, 0));

  const onTab = useCallback((tab: QueueTab) => dispatch({ type: 'tab', tab }), []);
  const onReset = useCallback(() => dispatch({ type: 'reset' }), []);
  const onAction = useCallback((id: QueueId, row: HTMLElement | null) => {
    // Hours approval opens the review drawer; everything else is cleared from the list.
    if (id === 'q2') dispatch({ type: 'openDrawer' });
    else Motion.leave(row, () => dispatch({ type: 'resolve', id }));
  }, []);
  const onConfirm = useCallback(() => dispatchWeek({ type: 'confirmDay', day: 1 }), []);
  const onOpenTime = useCallback(() => setTimeOpen(true), []);
  const onCloseTime = useCallback(() => setTimeOpen(false), []);
  const onGenerated = useCallback((d: number) => setGenerated(g => g.map((v, i) => (i === d ? true : v))), []);
  const onRegenerate = useCallback((d: number) => setGenerated(g => g.map((v, i) => (i === d ? false : v))), []);
  const onSeg = useCallback((seg: Segment | 'all') => dispatch({ type: 'seg', seg }), []);
  const onCustomer = useCallback((cust: CustomerId | 'all') => dispatch({ type: 'customer', cust }), []);
  const onPhase = useCallback((phase: number) => dispatch({ type: 'phase', phase }), []);
  const onToggleTheme = useCallback(() => dispatch({ type: 'toggleTheme' }), []);
  const onLang = useCallback((lang: Lang) => dispatch({ type: 'lang', lang }), []);
  const onClose = useCallback(() => dispatch({ type: 'closeDrawer' }), []);
  const onToggle = useCallback((index: number) => dispatch({ type: 'toggleEntry', index }), []);
  const onToggleAll = useCallback(() => dispatch({ type: 'toggleAllEntries' }), []);
  const onApprove = useCallback(() => dispatch({ type: 'approveHours' }), []);

  return (
    <I18nProvider lang={s.lang}>
      <div ref={rootRef} className="page" data-screen-label="Overview">
        <Sidebar open={navOpen} onOpenChange={setNavOpen} />
        <div className="main">
          <Header dark={s.dark} onToggleTheme={onToggleTheme} lang={s.lang} onLang={onLang} />
          <div className="body">
          <div className={'side-spacer' + (navOpen ? ' side-spacer--open' : '')} />
          <main className="grid">
            <Hero open={s.queue.length} gateBlocked={s.queue.includes('q1')} />
            <Attention ref={attnRef} queue={s.queue} tab={s.tab} onTab={onTab} onAction={onAction} onReset={onReset} />
            <Gates p={p} />
            <TimeCard p={p} week={week} onConfirm={onConfirm} onOpen={onOpenTime} />
            <CostCard p={p} />
            <Mail />
            <PhaseBoard ref={boardRef} p={p} seg={s.seg} cust={s.cust} phase={s.phase} onSeg={onSeg} onCustomer={onCustomer} onPhase={onPhase} />
          </main>
          </div>
        </div>
      </div>
      {timeOpen && (
        <TimeDrawer week={week} dispatch={dispatchWeek} generated={generated} onGenerated={onGenerated} onRegenerate={onRegenerate}
          onClose={onCloseTime} scrimRef={timeScrim} drawerRef={timeDrawer} />
      )}
      {s.drawer && (
        <HoursDrawer sel={s.sel} onClose={onClose} onToggle={onToggle} onToggleAll={onToggleAll} onApprove={onApprove} scrimRef={scrimRef} drawerRef={drawerRef} />
      )}
    </I18nProvider>
  );
}
