import process from 'node:process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import test from 'ava';
import execa from 'execa';
import tempWrite from 'temp-write';
import xo from '../index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.chdir(__dirname);

const main = (arguments_, options) => execa(path.join(__dirname, '../cli.js'), arguments_, options);

const hasUnicornPlugin = config => config.plugins.includes('unicorn');
const hasPrintConfigGlobal = config => Object.keys(config.globals).includes('printConfig');

test('getConfig', async t => {
	const filepath = await tempWrite('console.log()\n', 'x.js');
	const options = {filePath: filepath, globals: ['printConfig']};
	const result = await xo.getConfig(options);
	t.true(hasUnicornPlugin(result) && hasPrintConfigGlobal(result));
});

test('print-config option', async t => {
	const filepath = await tempWrite('console.log()\n', 'x.js');
	const {stdout} = await main(['--global=printConfig', '--print-config', filepath]);
	const result = JSON.parse(stdout);
	t.true(hasUnicornPlugin(result) && hasPrintConfigGlobal(result));
});
