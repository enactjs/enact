/**
 * Options for {@link spotlight.Spotlight.focus}.
 */
export interface FocusOptions {
	enterTo?: 'last-focused' | 'default-element' | 'topmost' | null;
	toOuterContainer?: boolean;
	preventScroll?: boolean;
}
