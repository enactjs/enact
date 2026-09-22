const userAgent = process.env.npm_config_user_agent || '';

if (!userAgent.includes('pnpm')) {
	console.error('This repository uses pnpm. Enable it with `corepack enable`, then run `pnpm install` (see README).');
	process.exit(1);
}
