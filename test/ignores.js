import path from 'node:path';
import {fileURLToPath} from 'node:url';
import test from 'ava';
import {globby} from 'globby';
import xo from '../index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test('Should pickup "ignores" config', async t => {
	const cwd = path.join(__dirname, 'fixtures/nested-ignores');

	t.deepEqual(
		await globby(['**/*.js'], {cwd}),
		['a.js', 'b.js', 'child/a.js', 'child/b.js'],
		'Should has 4 js files.',
	);

	// Should not match
	// `a.js` (ignored by config in current directory)
	// `child/a.js` (ignored by config in current directory)
	// `child/b.js` (ignored by config in child directory)
	const result = await xo.lintFiles('.', {cwd});
	const files = result.results.map(({filePath}) => filePath);
	t.deepEqual(files, [path.join(cwd, 'b.js')], 'Should only report on `b.js`.');
});

test('Should ignore "ignores" config in parent', async t => {
	const cwd = path.join(__dirname, 'fixtures/nested-ignores/child');

	t.deepEqual(
		await globby(['**/*.js'], {cwd}),
		['a.js', 'b.js'],
		'Should has 2 js files.',
	);

	// Should only match `a.js` even it's ignored in parent
	const result = await xo.lintFiles('.', {cwd});
	const files = result.results.map(({filePath}) => filePath);
	t.deepEqual(files, [path.join(cwd, 'a.js')], 'Should only report on `a.js`.');
});
