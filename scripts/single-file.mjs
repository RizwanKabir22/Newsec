// Folds dist/index.html and its one JS + one CSS bundle into dist/project-hub.html.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;
let html = readFileSync(join(dist, 'index.html'), 'utf8');

html = html.replace(/<link rel="stylesheet"[^>]*href="\.\/([^"]+\.css)"[^>]*>/, (_, f) =>
  `<style>${readFileSync(join(dist, f), 'utf8')}</style>`);
html = html.replace(/<script type="module"[^>]*src="\.\/([^"]+\.js)"[^>]*><\/script>/, (_, f) => {
  const js = readFileSync(join(dist, f), 'utf8').replace(/<\/script/gi, '<\\/script');
  return `<script type="module">${js}</script>`;
});
// The module script runs deferred-style only when external; inline modules also defer, so #root exists.
if (/src="\.\/assets\//.test(html) || /href="\.\/assets\//.test(html)) throw new Error('unresolved asset reference left in HTML');

writeFileSync(join(dist, 'project-hub.html'), html);
console.log(`dist/project-hub.html  ${(html.length / 1024).toFixed(0)} kB`);

// Artifact variant: the host wraps the page in its own <html>/<head>/<body>, so emit head + body contents only.
// The dashboard keeps its 1180px minimum width and scrolls sideways inside #root on narrow screens.
const head = /<head>([\s\S]*)<\/head>/.exec(html)[1].replace(/<meta charset[^>]*>|<meta name="viewport"[^>]*>/g, '');
const body = /<body>([\s\S]*)<\/body>/.exec(html)[1];
const fragment = head.trim() + '\n<style>html{color-scheme:light}#root{overflow-x:auto}</style>\n' + body.trim() + '\n';
writeFileSync(join(dist, 'artifact.html'), fragment);
console.log(`dist/artifact.html     ${(fragment.length / 1024).toFixed(0)} kB`);
