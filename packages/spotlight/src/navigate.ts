
import type {Direction} from '../types/Direction';
import type {NavigableConfig} from '../types/NavigableConfig';
import type {Position} from '../types/Position';
import type {Rect, RectCenter, RectEdges} from '../types/Rect';

const obliqueMinDistance = 1;
const straightMinDistance = 0;

type DistanceFunction = (rect: Rect) => number;

interface Priority {
	group: Rect[];
	distance: DistanceFunction[];
	difference: DistanceFunction[];
	minDistance: number;
	multiplier: number;
}

interface DestCandidate {
	distance: number;
	target: Rect;
}

type TargetEdge = 'left' | 'right' | 'top' | 'bottom';

type GroupIdFunction = (rect: Rect, destRect: Rect | RectCenter) => number;

/** Rect or center point; width/height are absent when a center is used for partitioning. */
type PartitionTarget = Rect | RectCenter;

interface DistanceFunctions {
	nearPlumbLineIsBetter: DistanceFunction;
	nearHorizonIsBetter: DistanceFunction;
	nearTargetBottomIsBetter: DistanceFunction;
	nearTargetLeftIsBetter: DistanceFunction;
	nearTargetRightIsBetter: DistanceFunction;
	nearTargetTopIsBetter: DistanceFunction;
	topIsBetter: DistanceFunction;
	bottomIsBetter: DistanceFunction;
	leftIsBetter: DistanceFunction;
	rightIsBetter: DistanceFunction;
}

const calcGroupId = ({x, y}: Position): number => y * 3 + x;

const calcNextGridPosition = (current: Rect, next: RectEdges): Position => {
	const center = current.center;
	let x: number, y: number;

	if (center.x < next.left) {
		x = 0;
	} else if (center.x <= next.right) {
		x = 1;
	} else {
		x = 2;
	}

	if (center.y < next.top) {
		y = 0;
	} else if (center.y <= next.bottom) {
		y = 1;
	} else {
		y = 2;
	}

	return {x, y};
};

const calcNextExtendedGridPosition = (current: Rect, next: Rect): Position => {
	let x: number, y: number;

	if (current.right <= next.left) {
		x = 0;
	} else if (current.left < next.right) {
		x = 1;
	} else {
		x = 2;
	}

	if (current.bottom <= next.top) {
		y = 0;
	} else if (current.top < next.bottom) {
		y = 1;
	} else {
		y = 2;
	}

	return {x, y};
};

function prioritize (priorities: Priority[], targetEdge: number): DestCandidate[] | null {
	const destGroup: DestCandidate[] = [];

	for (let index = 0; index < priorities.length; index++) {
		const destPriority = priorities[index];

		if (destPriority.group.length) {
			const destDistance = destPriority.distance;
			const destDifference = destPriority.difference;
			let distance = 0;
			let target: Rect;

			destPriority.group.sort(function (a: Rect, b: Rect) {
				for (let i = 0; i < destDistance.length; i++) {
					const calcDistance = destDistance[i];
					const delta = calcDistance(a) - calcDistance(b);
					if (delta) {
						return delta;
					}
				}
				return 0;
			});

			target = destPriority.group[0];
			for (let i = 0; i < destDifference.length; i++) {
				distance += destDifference[i](target);
			}

			destGroup.push({
				distance: Math.pow(destPriority.multiplier * (distance || destPriority.minDistance) / targetEdge, 2) + targetEdge,
				target
			});
		}
	}

	if (!destGroup.length) {
		return null;
	}

	destGroup.sort(function (a: DestCandidate, b: DestCandidate) {
		return a.distance - b.distance;
	});

	return destGroup;
}

function partition (rects: Rect[], targetRect: PartitionTarget, straightOverlapThreshold: number, getGroupId: GroupIdFunction): Rect[][] {
	// a matrix of elements where the center of the element in relation to targetRect is:
	const groups: Rect[][] = [
		[/* [0] => above/left */],  [/* [1] => above/within */],     [/* [2] => above/right */],
		[/* [3] => within/left */], [/* [4] => within */],           [/* [5] => within/right */],
		[/* [6] => below/left */],  [/* [7] => below and within */], [/* [8] => below/right */]
	];

	for (let i = 0; i < rects.length; i++) {
		const rect = rects[i];
		const groupId = getGroupId(rect, targetRect);
		groups[groupId].push(rect);

		if ('width' in targetRect && [0, 2, 6, 8].indexOf(groupId) !== -1) {
			const {width: targetWidth, height: targetHeight} = targetRect;

			if (rect.left <= targetRect.right - targetWidth * straightOverlapThreshold) {
				if (groupId === 2) {
					groups[1].push(rect);
				} else if (groupId === 8) {
					groups[7].push(rect);
				}
			}

			if (rect.right >= targetRect.left + targetWidth * straightOverlapThreshold) {
				if (groupId === 0) {
					groups[1].push(rect);
				} else if (groupId === 6) {
					groups[7].push(rect);
				}
			}

			if (rect.top <= targetRect.bottom - targetHeight * straightOverlapThreshold) {
				if (groupId === 6) {
					groups[3].push(rect);
				} else if (groupId === 8) {
					groups[5].push(rect);
				}
			}

			if (rect.bottom >= targetRect.top + targetHeight * straightOverlapThreshold) {
				if (groupId === 0) {
					groups[3].push(rect);
				} else if (groupId === 2) {
					groups[5].push(rect);
				}
			}
		}
	}

	return groups;
}

function generateDistancefunction (targetRect: Rect): DistanceFunctions {
	return {
		nearPlumbLineIsBetter: function (rect: Rect): number {
			let d: number;
			if (rect.center.x < targetRect.center.x) {
				d = targetRect.center.x - rect.right;
			} else {
				d = rect.left - targetRect.center.x;
			}
			return d < 0 ? 0 : d;
		},
		nearHorizonIsBetter: function (rect: Rect): number {
			let d: number;
			if (rect.center.y < targetRect.center.y) {
				d = targetRect.center.y - rect.bottom;
			} else {
				d = rect.top - targetRect.center.y;
			}
			return d < 0 ? 0 : d;
		},
		nearTargetBottomIsBetter: function (rect: Rect): number {
			let d: number;
			if (rect.center.y < targetRect.center.y) {
				d = targetRect.bottom - rect.top;
			} else {
				d = rect.top - targetRect.bottom;
			}
			return d < 0 ? 0 : d;
		},
		nearTargetLeftIsBetter: function (rect: Rect): number {
			let d: number;
			if (rect.center.x < targetRect.center.x) {
				d = targetRect.left - rect.right;
			} else {
				d = rect.left - targetRect.left;
			}
			return d < 0 ? 0 : d;
		},
		nearTargetRightIsBetter: function (rect: Rect): number {
			let d: number;
			if (rect.center.x < targetRect.center.x) {
				d = targetRect.right - rect.left;
			} else {
				d = rect.left - targetRect.right;
			}
			return d < 0 ? 0 : d;
		},
		nearTargetTopIsBetter: function (rect: Rect): number {
			let d: number;
			if (rect.center.y < targetRect.center.y) {
				d = targetRect.top - rect.bottom;
			} else {
				d = rect.top - targetRect.top;
			}
			return d < 0 ? 0 : d;
		},
		topIsBetter: function (rect: Rect): number {
			return rect.top;
		},
		bottomIsBetter: function (rect: Rect): number {
			return -1 * rect.bottom;
		},
		leftIsBetter: function (rect: Rect): number {
			return rect.left;
		},
		rightIsBetter: function (rect: Rect): number {
			return -1 * rect.right;
		}
	};
}

function navigate (targetRect: Rect | null, direction: Direction | null, rects: Rect[] | null, config: NavigableConfig | null, partitionRect: Rect = targetRect as Rect): Element | null {
	if (!targetRect || !direction || !rects || !rects.length || !config) {
		return null;
	}

	const distanceFunction = generateDistancefunction(targetRect);
	const {obliqueMultiplier, straightMultiplier, straightOnly, straightOverlapThreshold} = config;

	const groups = partition(
		rects,
		partitionRect,
		straightOverlapThreshold,
		(rect, destRect) => (
			calcGroupId(
				direction === 'up' || direction === 'down' ? calcNextExtendedGridPosition(rect, destRect as Rect) : calcNextGridPosition(rect, destRect)
			)
		)
	);

	const internalGroups = partition(
		groups[4],
		targetRect.center,
		straightOverlapThreshold,
		(rect, destRect) => calcGroupId(calcNextGridPosition(rect, destRect))
	);

	let priorities: Priority[], targetEdge: TargetEdge;

	switch (direction) {
		case 'left':
			targetEdge = direction;
			priorities = [
				{
					group: internalGroups[0].concat(internalGroups[3]).concat(internalGroups[6]),
					distance: [
						distanceFunction.nearPlumbLineIsBetter,
						distanceFunction.nearHorizonIsBetter,
						distanceFunction.topIsBetter
					],
					difference: [
						distanceFunction.nearTargetLeftIsBetter
					],
					minDistance: straightMinDistance,
					multiplier: straightMultiplier
				},
				{
					group: groups[3],
					distance: [
						distanceFunction.nearPlumbLineIsBetter,
						distanceFunction.nearHorizonIsBetter,
						distanceFunction.topIsBetter
					],
					difference: [
						distanceFunction.nearTargetLeftIsBetter
					],
					minDistance: straightMinDistance,
					multiplier: straightMultiplier
				},
				{
					group: groups[0],
					distance: [
						distanceFunction.nearHorizonIsBetter,
						distanceFunction.rightIsBetter,
						distanceFunction.nearTargetTopIsBetter
					],
					difference: [
						distanceFunction.nearTargetLeftIsBetter,
						distanceFunction.nearTargetTopIsBetter
					],
					minDistance: obliqueMinDistance,
					multiplier: obliqueMultiplier
				},
				{
					group: groups[6],
					distance: [
						distanceFunction.nearHorizonIsBetter,
						distanceFunction.rightIsBetter,
						distanceFunction.nearTargetTopIsBetter
					],
					difference: [
						distanceFunction.nearTargetLeftIsBetter,
						distanceFunction.nearTargetBottomIsBetter
					],
					minDistance: obliqueMinDistance,
					multiplier: obliqueMultiplier
				}
			];
			break;
		case 'right':
			targetEdge = direction;
			priorities = [
				{
					group: internalGroups[2].concat(internalGroups[5]).concat(internalGroups[8]),
					distance: [
						distanceFunction.nearPlumbLineIsBetter,
						distanceFunction.nearHorizonIsBetter,
						distanceFunction.topIsBetter
					],
					difference: [
						distanceFunction.nearTargetRightIsBetter
					],
					minDistance: straightMinDistance,
					multiplier: straightMultiplier
				},
				{
					group: groups[5],
					distance: [
						distanceFunction.nearPlumbLineIsBetter,
						distanceFunction.nearHorizonIsBetter,
						distanceFunction.topIsBetter
					],
					difference: [
						distanceFunction.nearTargetRightIsBetter
					],
					minDistance: straightMinDistance,
					multiplier: straightMultiplier
				},
				{
					group: groups[2],
					distance: [
						distanceFunction.nearHorizonIsBetter,
						distanceFunction.leftIsBetter,
						distanceFunction.nearTargetTopIsBetter
					],
					difference: [
						distanceFunction.nearTargetRightIsBetter,
						distanceFunction.nearTargetTopIsBetter
					],
					minDistance: obliqueMinDistance,
					multiplier: obliqueMultiplier
				},
				{
					group: groups[8],
					distance: [
						distanceFunction.nearHorizonIsBetter,
						distanceFunction.leftIsBetter,
						distanceFunction.nearTargetTopIsBetter
					],
					difference: [
						distanceFunction.nearTargetRightIsBetter,
						distanceFunction.nearTargetBottomIsBetter
					],
					minDistance: obliqueMinDistance,
					multiplier: obliqueMultiplier
				}
			];
			break;
		case 'up':
			targetEdge = 'top';
			priorities = [
				{
					group: internalGroups[0].concat(internalGroups[1]).concat(internalGroups[2]),
					distance: [
						distanceFunction.nearHorizonIsBetter,
						distanceFunction.nearPlumbLineIsBetter,
						distanceFunction.leftIsBetter
					],
					difference: [
						distanceFunction.nearTargetTopIsBetter
					],
					minDistance: straightMinDistance,
					multiplier: straightMultiplier
				},
				{
					group: groups[1],
					distance: [
						distanceFunction.nearHorizonIsBetter,
						distanceFunction.nearPlumbLineIsBetter,
						distanceFunction.leftIsBetter
					],
					difference: [
						distanceFunction.nearTargetTopIsBetter
					],
					minDistance: straightMinDistance,
					multiplier: straightMultiplier
				},
				{
					group: groups[0],
					distance: [
						distanceFunction.nearPlumbLineIsBetter,
						distanceFunction.bottomIsBetter,
						distanceFunction.nearTargetLeftIsBetter
					],
					difference: [
						distanceFunction.nearTargetTopIsBetter,
						distanceFunction.nearTargetLeftIsBetter
					],
					minDistance: obliqueMinDistance,
					multiplier: obliqueMultiplier
				},
				{
					group: groups[2],
					distance: [
						distanceFunction.nearPlumbLineIsBetter,
						distanceFunction.bottomIsBetter,
						distanceFunction.nearTargetLeftIsBetter
					],
					difference: [
						distanceFunction.nearTargetTopIsBetter,
						distanceFunction.nearTargetRightIsBetter
					],
					minDistance: obliqueMinDistance,
					multiplier: obliqueMultiplier
				}
			];
			break;
		case 'down':
			targetEdge = 'bottom';
			priorities = [
				{
					group: internalGroups[6].concat(internalGroups[7]).concat(internalGroups[8]),
					distance: [
						distanceFunction.nearHorizonIsBetter,
						distanceFunction.nearPlumbLineIsBetter,
						distanceFunction.leftIsBetter
					],
					difference: [
						distanceFunction.nearTargetBottomIsBetter
					],
					minDistance: straightMinDistance,
					multiplier: straightMultiplier
				},
				{
					group: groups[7],
					distance: [
						distanceFunction.nearHorizonIsBetter,
						distanceFunction.nearPlumbLineIsBetter,
						distanceFunction.leftIsBetter
					],
					difference: [
						distanceFunction.nearTargetBottomIsBetter
					],
					minDistance: straightMinDistance,
					multiplier: straightMultiplier
				},
				{
					group: groups[6],
					distance: [
						distanceFunction.nearPlumbLineIsBetter,
						distanceFunction.topIsBetter,
						distanceFunction.nearTargetLeftIsBetter
					],
					difference: [
						distanceFunction.nearTargetBottomIsBetter,
						distanceFunction.nearTargetLeftIsBetter
					],
					minDistance: obliqueMinDistance,
					multiplier: obliqueMultiplier
				},
				{
					group: groups[8],
					distance: [
						distanceFunction.nearPlumbLineIsBetter,
						distanceFunction.topIsBetter,
						distanceFunction.nearTargetLeftIsBetter
					],
					difference: [
						distanceFunction.nearTargetBottomIsBetter,
						distanceFunction.nearTargetRightIsBetter
					],
					minDistance: obliqueMinDistance,
					multiplier: obliqueMultiplier
				}
			];
			break;
		default:
			return null;
	}

	if (straightOnly) {
		priorities.splice(2, 2);
	}

	const destGroup = prioritize(priorities, targetRect[targetEdge]);
	if (!destGroup) {
		return null;
	}

	return destGroup[0].target.element ?? null;
}

export default navigate;
export {
	navigate
};
