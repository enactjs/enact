/*
 * Ambient type declarations for the ilib modules used by @enact/i18n.
 *
 * ilib ships no TypeScript definitions, so the surface consumed by this
 * package is declared here. Extend these as more of the ilib API is used.
 */

declare module 'ilib' {
	interface ILibLoader {
		addPath(path: string): void;
	}

	interface ILib {
		getLocale(): string;
		setLocale(spec?: string | null): void;
		setLoaderCallback(loader: object): boolean;
		getLoader(): ILibLoader;
		// holds dynamically-loaded locale data; intentionally loose
		data: {[key: string]: any};
		_load?: {manifest?: unknown};
		_platform?: string;
	}

	const ilib: ILib;
	export default ilib;
}

declare module 'ilib/lib/Locale' {
	class Locale {
		constructor(spec?: string);
		getLanguage(): string | undefined;
		getScript(): string | undefined;
		getRegion(): string | undefined;
		getVariant(): string | undefined;
		getSpec(): string;
		toString(): string;
	}
	export default Locale;
}

declare module 'ilib/lib/CaseMapper' {
	export interface CaseMapperOptions {
		locale?: string;
		direction?: 'toupper' | 'tolower';
	}

	class CaseMapper {
		constructor(options?: CaseMapperOptions);
		map(str: string): string;
	}
	export default CaseMapper;
}

declare module 'ilib/lib/LocaleInfo' {
	import Locale from 'ilib/lib/Locale';

	export interface LocaleInfoOptions {
		locale?: string | Locale;
		sync?: boolean;
		loadParams?: object;
		onLoad?: (li: LocaleInfo) => void;
		[key: string]: unknown;
	}

	class LocaleInfo {
		constructor(locale?: string | Locale, options?: LocaleInfoOptions);
		static defaultInfo: object;
		getLocale(): Locale;
		getScript(): string;
	}
	export default LocaleInfo;
}

declare module 'ilib/lib/ScriptInfo' {
	export interface ScriptInfoOptions {
		sync?: boolean;
		loadParams?: object;
		onLoad?: (script: ScriptInfo) => void;
		[key: string]: unknown;
	}

	class ScriptInfo {
		constructor(script?: string, options?: ScriptInfoOptions);
		getScriptDirection(): 'ltr' | 'rtl';
	}
	export default ScriptInfo;
}

declare module 'ilib/lib/IString' {
	class IString {
		constructor(str?: string | IString);
		static loadPlurals(
			sync?: boolean,
			locale?: unknown,
			loadParams?: unknown,
			onLoad?: () => void
		): void;
		length: number;
		toString(): string;
	}
	export default IString;
}

declare module 'ilib/lib/ResBundle' {
	import IString from 'ilib/lib/IString';
	import Locale from 'ilib/lib/Locale';

	export interface ResBundleOptions {
		locale?: string | Locale;
		name?: string;
		type?: string;
		lengthen?: boolean;
		sync?: boolean;
		onLoad?: (bundle: ResBundle) => void;
		[key: string]: unknown;
	}

	class ResBundle {
		constructor(options?: ResBundleOptions);
		// string caches removed by clearResBundle()
		static strings?: unknown;
		static sysres?: unknown;
		getString(source?: string, key?: string): IString;
		getLocale(): Locale;
	}
	export default ResBundle;
}

declare module 'ilib/lib/Loader' {
	class Loader {
		constructor();
		addPath(path: string): void;
		addPaths?: string[];
	}
	export default Loader;
}

// Calendar date modules loaded for their side effects (see src/dates.ts)
declare module 'ilib/lib/*';
