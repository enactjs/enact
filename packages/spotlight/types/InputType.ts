/**
 * Spotlight input modality applied to the root container.
 */
export type InputType = 'key' | 'mouse' | 'touch';

export interface InputInfo {
	activated: boolean;
	applied: boolean;
}
