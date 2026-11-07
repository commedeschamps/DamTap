import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync(new URL('../app/fonts.css', import.meta.url), 'utf8');
const layout = fs.readFileSync(new URL('../app/layout.tsx', import.meta.url), 'utf8');
const faces = css.match(/@font-face\s*\{[^}]+\}/g) ?? [];

test('font delivery uses real local variable WOFF2 assets with swap', () => {
  assert.equal(faces.length, 4);
  for (const face of faces) {
    const source = face.match(/url\((\/fonts\/[^)]+\.woff2)\)/)?.[1];
    assert.ok(source, 'Every font face must reference a repository asset');
    const bytes = fs.readFileSync(new URL(`../public${source}`, import.meta.url));
    assert.equal(bytes.subarray(0, 4).toString(), 'wOF2');
    assert.ok(bytes.length > 1000);
    assert.match(face, /font-display:\s*swap/);
    assert.match(face, /font-weight:\s*200 800/);
  }
});

test('font subsets cover Russian, Kazakh characters, Latin, and the tenge sign', () => {
  const covers = (codePoint) => faces.some(face => {
    const range = face.match(/unicode-range:\s*([^;]+)/)?.[1] ?? '';
    return range.split(',').some(part => {
      const match = part.trim().match(/^U\+([0-9A-F]+)(?:-([0-9A-F]+))?$/i);
      if (!match) return false;
      const first = parseInt(match[1], 16);
      const last = parseInt(match[2] ?? match[1], 16);
      return codePoint >= first && codePoint <= last;
    });
  });
  for (const character of ['A', 'я', 'Қ', 'ң', '₸']) assert.ok(covers(character.codePointAt(0)), character);
});

test('root font setup has no build-time font service dependency', () => {
  assert.doesNotMatch(layout + css, /next\/font\/google|fonts\.googleapis\.com|fonts\.gstatic\.com|@fontsource/);
  const dependencies = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8')).dependencies;
  assert.equal(dependencies['@fontsource-variable/manrope'], undefined);
  assert.match(layout, /rel="preload" href="\/fonts\/manrope-cyrillic-variable\.woff2"/);
  assert.match(layout, /rel="preload" href="\/fonts\/manrope-latin-variable\.woff2"/);
});
