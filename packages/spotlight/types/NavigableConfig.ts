/**
 * Subset of container config consumed by the spatial navigation algorithm.
 */
export interface NavigableConfig {
	obliqueMultiplier: number;
	straightMultiplier: number;
	straightOnly: boolean;
	straightOverlapThreshold: number;
}
