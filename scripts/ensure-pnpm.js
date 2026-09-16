const userAgent = process.env.npm_config_user_agent || '';

if (!userAgent.includes('pnpm')) {
	console.error('This repository uses pnpm. Run `pnpm install` (see README).');
	process.exit(1);
}
