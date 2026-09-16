const {spawnSync} = require('child_process');

const script = process.argv[2];
const extra = process.argv.slice(3);
const args = ['-r', '--if-present', '--workspace-concurrency=1', 'run', script];

if (extra.length) {
	args.push('--', ...extra);
}

const result = spawnSync('pnpm', args, {stdio: 'inherit', shell: true});
process.exit(result.status === null ? 1 : result.status);
