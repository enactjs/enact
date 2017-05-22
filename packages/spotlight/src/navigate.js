
function prioritize (priorities) {
	let destPriority = null;
	for (let i = 0; i < priorities.length; i++) {
		if (priorities[i].group.length) {
			destPriority = priorities[i];
			break;
		}
	}

	if (!destPriority) {
		return null;
	}

	const destDistance = destPriority.distance;

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

	return destPriority.group;
}

function partition (rects, targetRect, straightOverlapThreshold) {
	let groups = [[], [], [], [], [], [], [], [], []];

	for (let i = 0; i < rects.length; i++) {
		let rect = rects[i];
		let center = rect.center;
		let x, y, groupId;

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

		groupId = y * 3 + x;
		groups[groupId].push(rect);

		if ([0, 2, 6, 8].indexOf(groupId) !== -1) {
			let threshold = straightOverlapThreshold;

			if (rect.left <= targetRect.right - targetRect.width * threshold) {
				if (groupId === 2) {
					groups[1].push(rect);
				} else if (groupId === 8) {
					groups[7].push(rect);
				}
			}

			if (rect.right >= targetRect.left + targetRect.width * threshold) {
				if (groupId === 0) {
					groups[1].push(rect);
				} else if (groupId === 6) {
					groups[7].push(rect);
				}
			}

			if (rect.top <= targetRect.bottom - targetRect.height * threshold) {
				if (groupId === 6) {
					groups[3].push(rect);
				} else if (groupId === 8) {
					groups[5].push(rect);
				}
			}

			if (rect.bottom >= targetRect.top + targetRect.height * threshold) {
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
		nearTargetLeftIsBetter: function (rect) {
			let d;
			if (rect.center.x < targetRect.center.x) {
				d = targetRect.left - rect.right;
			} else {
				d = rect.left - targetRect.left;
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
		config.straightOverlapThreshold
	);

	let internalGroups = partition(
		groups[4],
		targetRect.center,
		config.straightOverlapThreshold
	);

	let priorities;

	switch (direction) {
		case 'left':
			priorities = [
				{
					group: internalGroups[0].concat(internalGroups[3]).concat(internalGroups[6]),
					distance: [
						distanceFunction.nearPlumbLineIsBetter,
						distanceFunction.topIsBetter
					]
				},
				{
					group: groups[3],
					distance: [
						distanceFunction.nearPlumbLineIsBetter,
						distanceFunction.topIsBetter
					]
				},
				{
					group: groups[0].concat(groups[6]),
					distance: [
						distanceFunction.nearHorizonIsBetter,
						distanceFunction.rightIsBetter,
						distanceFunction.nearTargetTopIsBetter
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
						distanceFunction.topIsBetter
					]
				},
				{
					group: groups[5],
					distance: [
						distanceFunction.nearPlumbLineIsBetter,
						distanceFunction.topIsBetter
					]
				},
				{
					group: groups[2].concat(groups[8]),
					distance: [
						distanceFunction.nearHorizonIsBetter,
						distanceFunction.leftIsBetter,
						distanceFunction.nearTargetTopIsBetter
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
						distanceFunction.leftIsBetter
					]
				},
				{
					group: groups[1],
					distance: [
						distanceFunction.nearHorizonIsBetter,
						distanceFunction.leftIsBetter
					]
				},
				{
					group: groups[0].concat(groups[2]),
					distance: [
						distanceFunction.nearPlumbLineIsBetter,
						distanceFunction.bottomIsBetter,
						distanceFunction.nearTargetLeftIsBetter
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
						distanceFunction.leftIsBetter
					]
				},
				{
					group: groups[7],
					distance: [
						distanceFunction.nearHorizonIsBetter,
						distanceFunction.leftIsBetter
					]
				},
				{
					group: groups[6].concat(groups[8]),
					distance: [
						distanceFunction.nearPlumbLineIsBetter,
						distanceFunction.topIsBetter,
						distanceFunction.nearTargetLeftIsBetter
					]
				}
			];
			break;
		default:
			return null;
	}

	if (config.straightOnly) {
		priorities.pop();
	}

	let destGroup = prioritize(priorities);
	if (!destGroup) {
		return null;
	}

	let dest = null;
	// if (config.rememberSource &&
	// 		config.previous &&
	// 		config.previous.destination === target &&
	// 		config.previous.reverse === direction) {
	// 	for (let j = 0; j < destGroup.length; j++) {
	// 		if (destGroup[j].element === config.previous.target) {
	// 			dest = destGroup[j].element;
	// 			break;
	// 		}
	// 	}
	// }

	if (!dest) {
		dest = destGroup[0].element;
	}

	return dest;
}

export default navigate;
export {
	navigate
};
