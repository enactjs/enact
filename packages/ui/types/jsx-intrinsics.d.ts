declare module 'react' {
	namespace JSX {
		interface IntrinsicElements {
			/** Slottable pseudo-element used by `Slottable`-decorated components (e.g. `LabeledIcon`)
			 * to mark which children belong in a named slot. Not a real DOM element. */
			icon: any;
		}
	}
}

export {};
