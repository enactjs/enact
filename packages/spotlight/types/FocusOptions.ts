/**
 * Options for {@link spotlight.Spotlight.focus}.
 */
export interface FocusOptions {
	enterTo?: 'last-focused' | 'default-element' | null;
	toOuterContainer?: boolean;
	preventScroll?: boolean;
}
