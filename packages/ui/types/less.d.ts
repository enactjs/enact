/*
 * `.less`/`.module.less` files have no published types (they're project-specific CSS Modules,
 * transformed by the build's own loader)
 */

declare module '*.module.less' {
	const classNames: {[key: string]: string};
	export default classNames;
}

declare module '*.less' {
	const content: {[key: string]: string};
	export default content;
}
