
function prioritize (priorities) {
	const destGroup = [];

	for (let index = 0; index < priorities.length; index++) {
		const destPriority = priorities[index];

		if (destPriority.group.length) {
			const destDistance = destPriority.distance;
			const destDifference = destPriority.difference;
			let difference = 0;
			let target;

			destPriority.group.sort(function (a, b) {
				for (let i = 0; i < destDistance.length; i++) {
					const distance = destDistance[i];
					const delta = distance(a) - distance(b);
					if (delta) {
						return delta;
					}
				}
				return 0;
			});

			target = destPriority.group[0];
			for (let i = 0; i < destDifference.length; i++) {
				difference += destDifference[i](target);
			}

			destGroup.push({difference, target});
		}
	}

	if (!destGroup.length) {
		return null;
	}

	destGroup.sort(function (a, b) {
		return a.difference - b.difference;
	});

	return destGroup;
}

function partition (rects, targetRect, straightOverlapThreshold, measureFromCenter) {
	// a matrix of elements where the center of the element in relation to targetRect is:
	const groups = [
		[/* [0] => above/left */],  [/* [1] => above/within */],     [/* [2] => above/right */],
		[/* [3] => within/left */], [/* [4] => within */],           [/* [5] => within/right */],
		[/* [6] => below/left */],  [/* [7] => below and within */], [/* [8] => below/right */]
	];

	for (let i = 0; i < rects.length; i++) {
		const rect = rects[i];
		let x, y, groupId;

		if (measureFromCenter) {
			const center = rect.center;

			if (center.x < targetRect.left) {
				x = 0;
			} else if (center.x <= targetRect.right) {
				x = 1;
			} else {
				x = 2;
			}

			if (center.y < targetRect.top) {
				y = 0;
			} else if (center.y <= targetRect.bottom) {
				y = 1;
			} else {
				y = 2;
			}
		} else {
			if (rect.right <= targetRect.left) {
				x = 0;
			} else if (rect.left < targetRect.right) {
				x = 1;
			} else {
				x = 2;
			}

			if (rect.bottom <= targetRect.top) {
				y = 0;
			} else if (rect.top < targetRect.bottom) {
				y = 1;
			} else {
				y = 2;
			}
		}

		groupId = y * 3 + x;
		groups[groupId].push(rect);

		if ([0, 2, 6, 8].indexOf(groupId) !== -1) {
			if (rect.left <= targetRect.right - targetRect.width * straightOverlapThreshold) {
				if (groupId === 2) {
					groups[1].push(rect);
				} else if (groupId === 8) {
					groups[7].push(rect);
				}
			}

			if (rect.right >= targetRect.left + targetRect.width * straightOverlapThreshold) {
				if (groupId === 0) {
					groups[1].push(rect);
				} else if (groupId === 6) {
					groups[7].push(rect);
				}
			}

			if (rect.top <= targetRect.bottom - targetRect.height * straightOverlapThreshold) {
				if (groupId === 6) {
					groups[3].push(rect);
				} else if (groupId === 8) {
					groups[5].push(rect);
				}
			}

			if (rect.bottom >= targetRect.top + targetRect.height * straightOverlapThreshold) {
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

function generateDistancefunction (targetRect) {
	return {
		nearPlumbLineIsBetter: function (rect) {
			let d;
			if (rect.center.x < targetRect.center.x) {
				d = targetRect.center.x - rect.right;
			} else {
				d = rect.left - targetRect.center.x;
			}
			return d < 0 ? 0 : d;
		},
		nearHorizonIsBetter: function (rect) {
			let d;
			if (rect.center.y < targetRect.center.y) {
				d = targetRect.center.y - rect.bottom;
			} else {
				d = rect.top - targetRect.center.y;
			}
			return d < 0 ? 0 : d;
		},
		nearTargetBottomIsBetter: function (rect) {
			let d;
			if (rect.center.y < targetRect.center.y) {
				d = targetRect.bottom - rect.top;
			} else {
				d = rect.top - targetRect.bottom;
			}
			return d < 0 ? 0 : d;
		},
		nearTargetLeftIsBetter: function (rect) {
			let d;
			if (rect.center.x < targetRect.center.x) {
				d = targetRect.left - rect.right;
			} else {
				d = rect.left - targetRect.left;
			}
			return d < 0 ? 0 : d;
		},
		nearTargetRightIsBetter: function (rect) {
			let d;
			if (rect.center.x < targetRect.center.x) {
				d = targetRect.right - rect.left;
			} else {
				d = rect.left - targetRect.right;
			}
			return d < 0 ? 0 : d;
		},
		nearTargetTopIsBetter: function (rect) {
			let d;
			if (rect.center.y < targetRect.center.y) {
				d = targetRect.top - rect.bottom;
			} else {
				d = rect.top - targetRect.top;
			}
			return d < 0 ? 0 : d;
		},
		topIsBetter: function (rect) {
			return rect.top;
		},
		bottomIsBetter: function (rect) {
			return -1 * rect.bottom;
		},
		leftIsBetter: function (rect) {
			return rect.left;
		},
		rightIsBetter: function (rect) {
			return -1 * rect.right;
		}
	};
}

function navigate (targetRect, direction, rects, config) {
	if (!targetRect || !direction || !rects || !rects.length) {
		return null;
	}

	let distanceFunction = generateDistancefunction(targetRect);

	let groups = partition(
		rects,
		targetRect,
		config.straightOverlapThreshold,
		false
	);

	let internalGroups = partition(
		groups[4],
		targetRect.center,
		config.straightOverlapThreshold,
		true
	);

	let priorities;

	switch (direction) {
		case 'left':
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
					]
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
					]
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
					]
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
					]
				}
			];
			break;
		case 'right':
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
					]
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
					]
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
					]
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
					]
				}
			];
			break;
		case 'up':
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
					]
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
					]
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
					]
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
					]
				}
			];
			break;
		case 'down':
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
					]
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
					]
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
					]
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
					]
				}
			];
			break;
		default:
			return null;
	}

	if (config.straightOnly) {
		priorities.splice(2, 2);
	}

	let destGroup = prioritize(priorities);
	if (!destGroup) {
		return null;
	}

	return destGroup[0].target.element;
}

export default navigate;
export {
	navigate
};
