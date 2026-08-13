/**
 * Extended selector accepted by spotlight container configuration.
 *
 * - a valid CSS selector string for `querySelectorAll`
 * - a `NodeList` or an array containing DOM elements
 * - a single DOM element
 * - a string `"@<containerId>"` to indicate the specified container
 * - a string `"@"` to indicate the default container
 */
export type ExtSelector =
	| string
	| Element
	| Element[]
	| NodeListOf<Element>
	| null
	| undefined;
