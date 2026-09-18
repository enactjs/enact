const {spawnSync} = require('child_process');

const script = process.argv[2];
const extra = process.argv.slice(3).filter((arg, index) => !(index === 0 && arg === '--'));
const args = ['-r', '--if-present', '--workspace-concurrency=1', 'run', script, ...extra];

const result = spawnSync('pnpm', args, {stdio: 'inherit', shell: true});
process.exit(result.status === null ? 1 : result.status);
