import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import ts from 'typescript';
import { fileURLToPath, pathToFileURL } from 'node:url';
const testDirectory = path.dirname(fileURLToPath(import.meta.url));
// Compile the real pure modules into a temporary directory; no browser or framework mock.
const output = fs.mkdtempSync(path.join(os.tmpdir(), 'damtap-test-'));
for (const name of ['data/offers', 'lib/catalogue', 'lib/favorites', 'lib/demo-session']) {
  const source = fs.readFileSync(path.join(testDirectory, '..', `${name}.ts`), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS } }).outputText;
  fs.mkdirSync(path.dirname(path.join(output, `${name}.js`)), { recursive: true });
  fs.writeFileSync(path.join(output, `${name}.js`), compiled);
}
const { getOffers } = await import(pathToFileURL(path.join(output, 'data/offers.js')).href);
const { filterOffers, matchesOfferQuery, categoryCounts, catalogueReturnPath, PRICE_LIMIT } = await import(pathToFileURL(path.join(output, 'lib/catalogue.js')).href);
after(() => fs.rmSync(output, { recursive: true, force: true }));
const now = Date.parse('2026-11-06T12:00:00Z');
const offers = getOffers(now);
const base = { q: '', category: 'all', district: '', max: PRICE_LIMIT, sort: 'recommended', favorites: false, soon: false };

test('search, category, price and favorites intersect', () => {
  const result = filterOffers(offers, { ...base, q: '  КРУАССАН  ', category: 'bakery', max: 1500, favorites: true }, ['1', '2'], now);
  assert.deepEqual(result.map(offer => offer.id), ['1']);
  assert.equal(filterOffers(offers, { ...base, q: 'круассан', category: 'ready' }, [], now).length, 0);
});
test('district and sort use the full filtered result set', () => {
  const result = filterOffers(offers, { ...base, district: 'Есильский район', sort: 'price' }, [], now);
  assert.deepEqual(result.map(offer => offer.price), [750, 1000, 1300]);
});
test('soon means the next two hours and excludes expired or empty offers', () => {
  const fixtures = [...offers, { ...offers[0], id: 'expired', endsAt: new Date(now).toISOString() }, { ...offers[1], id: 'empty', quantityLeft: 0 }];
  const result = filterOffers(fixtures, { ...base, soon: true, sort: 'ending' }, [], now);
  assert.deepEqual(result.map(offer => offer.id), ['8', '4', '6']);
  assert.equal(filterOffers(offers, base, [], now + 6 * 3_600_000).length, 0);
});
test('malformed price extremes are bounded and empty categories stay empty', () => {
  assert.equal(filterOffers(offers, { ...base, max: -50 }, [], now).length, 0);
  assert.equal(filterOffers(offers, { ...base, max: 999999 }, [], now).length, offers.length);
  assert.equal(filterOffers(offers, { ...base, category: 'fruits' }, [], now).length, 0);
});
test('search suggestions remain selectable under retained constraints', () => {
  const filters = { ...base, max: 1500, favorites: true, district: 'Есильский район', q: 'старый запрос' };
  const favorites = ['1', '4', '5'];
  const candidates = filterOffers(offers, { ...filters, q: '' }, favorites, now);
  assert.deepEqual(candidates.map(offer => offer.id), ['1', '5']);
  assert.equal(candidates.filter(offer => matchesOfferQuery(offer, 'ролл')).length, 0);
  assert.equal(candidates.filter(offer => matchesOfferQuery(offer, '  АСТАНА  ')).length, 2);
  for (const candidate of candidates) {
    assert.ok(filterOffers(offers, { ...filters, q: candidate.title }, favorites, now).some(offer => offer.id === candidate.id));
  }
});
test('category availability changes with inventory instead of promising empty choices', () => {
  assert.deepEqual(categoryCounts(offers).filter(category => category.count > 0).map(category => [category.id, category.count]), [['ready', 5], ['bakery', 3]]);
  assert.equal(categoryCounts([]).every(category => category.count === 0), true);
});
const { demoSessionStart } = await import(pathToFileURL(path.join(output, 'lib/demo-session.js')).href);
test('demo deadlines persist across requests, including after expiration', () => {
  const initial = demoSessionStart(undefined, now);
  const later = now + 10 * 60_000;
  assert.deepEqual(getOffers(demoSessionStart(String(initial), later)), getOffers(initial));
  const expired = now + 24 * 3_600_000;
  assert.equal(demoSessionStart(String(initial), expired), initial);
  assert.equal(filterOffers(getOffers(initial), base, [], expired).length, 0);
  for (const invalid of ['', 'NaN', 'Infinity', '-1', '123', String(later)]) assert.equal(demoSessionStart(invalid, now), now);
});
test('detail return URL preserves filters but rejects foreign URLs and routes', () => {
  assert.equal(catalogueReturnPath('/offers?category=bakery&max=1500'), '/offers?category=bakery&max=1500');
  for (const input of ['https://evil.example/offers', '//evil.example/offers', '/offers/1', '/other', 'javascript:alert(1)', null]) {
    assert.equal(catalogueReturnPath(input), '/offers');
  }
});

const { readFavoriteIds, withFavoriteMembership } = await import(pathToFileURL(path.join(output, 'lib/favorites.js')).href);
test('favorite undo preserves unrelated changes and remains idempotent', () => {
  const addedFirst = withFavoriteMembership([], '1', true);
  const addedSecond = withFavoriteMembership(addedFirst, '2', true);
  assert.deepEqual(withFavoriteMembership(addedSecond, '1', false), ['2']);
  assert.deepEqual(withFavoriteMembership(addedSecond, '1', true), ['1', '2']);
  assert.deepEqual(readFavoriteIds('["1", "1", 12, null, "2"]'), ['1', '2']);
  assert.deepEqual(readFavoriteIds('broken'), []);
});
