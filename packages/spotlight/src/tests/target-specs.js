import {
	configureContainer,
	configureDefaults,
	containerAttribute,
	getAllContainerIds,
	removeContainer,
	rootContainerId,
	setDefaultContainer
} from '../container';

import {
	getNavigableTarget,
	getTargetByContainer,
	getTargetByDirectionFromElement,
	getTargetByDirectionFromPosition,
	getTargetBySelector
} from '../target';

import {
	container,
	join,
	node,
	someSpottables,
	spottable,
	testScenario
} from './utils';

const nonSpottable = () => node({className: 'other'});

const position = (top, left) => `position: absolute; top: ${top}px; left: ${left}px; height: 10px; width: 10px;`;

const positionedSpottable = (id, top, left) => {
	return spottable({
		id,
		style: position(top, left)
	});
};

const grid = () => container({
	[containerAttribute]: 'grid',
	style: 'position: relative; height: 30px; width: 30px;',
	children: join(
		positionedSpottable('top-left', 0, 0),
		positionedSpottable('top-center', 0, 10),
		positionedSpottable('top-right', 0, 20),
		positionedSpottable('middle-left', 10, 0),
		positionedSpottable('middle-center', 10, 10),
		positionedSpottable('middle-right', 10, 20),
		positionedSpottable('bottom-left', 20, 0),
		positionedSpottable('bottom-center', 20, 10),
		positionedSpottable('bottom-right', 20, 20)
	)
});

const scenarios = {
	complexTree: join(
		spottable(nonSpottable()),
		container({[containerAttribute]: 'first-container', children: join(
			someSpottables(2),
			container({[containerAttribute]: 'second-container', children: join(
				someSpottables(3),
				container({
					[containerAttribute]: 'third-container',
					'data-spotlight-container-disabled': true,
					children: join(
						someSpottables(4),
						node({id: 'child-of-third'})
					)
				})
			)})
		)})
	),
	nonSpottableInContainer: join(
		spottable({id: 'in-root'}),
		container({[containerAttribute]: 'first', children: join(
			nonSpottable(),
			spottable({id: 'in-first'})
		)}),
		container({[containerAttribute]: 'second', children: join(
			nonSpottable(),
		)})
	),
	grid: join(
		spottable({id: 'before-grid', style: 'height: 10px'}),
		grid(),
		spottable({id: 'after-grid', style: 'height: 10px'}),
	),
	overlap: node({
		style: 'position: relative',
		children: join(
			grid(),
			spottable({
				id: 'over-middle-center',
				style: 'position: absolute; top: 12px; left: 15px; height: 1px; width: 1px;'
			})
		)
	}),
	overflow: join(
		spottable({id: 'outside-overflow'}),
		node({
			// allocate some empty space so that overflow items would be otherwise navigable
			style: 'height: 100px'
		}),
		container({
			[containerAttribute]: 'overflow-container',
			style: 'position: relative; height: 30px; width: 30px;',
			children: join(
				spottable({
					id: 'overflow-above',
					style: 'position: absolute; top: -10px; left: 0px; height: 10px; width: 10px;'
				}),
				spottable({
					id: 'overflow-below',
					style: 'position: absolute; top: 30px; left: 0px; height: 10px; width: 10px;'
				}),
				spottable({
					id: 'overflow-within',
					style: 'position: absolute; top: 0px; left: 0px; height: 10px; width: 10px;'
				})
			)
		})
	),
	overflowLargeSubContainer: join(
		spottable({id: 'outside-overflow'}),
		node({
			// allocate some empty space so that overflow items would be otherwise navigable
			style: 'height: 100px'
		}),
		container({
			[containerAttribute]: 'overflow-container',
			style: 'position: relative; height: 30px; width: 30px;',
			children: join(
				container({
					[containerAttribute]: 'inside',
					// subcontainer is taller than overflow-container
					style: 'position: absolute; top: -10px; left: 0px; height: 50px; width: 10px;',
					children: join(
						node({
							// allocate space to push following spottable into view
							style: 'height: 10px'
						}),
						spottable({
							id: 'in-large-container'
						})
					)
				}),
				spottable({
					id: 'below-large-container',
					style: 'position: absolute; top: 40px; left: 0px; height: 10px; width: 10px;'
				})
			)
		})
	),
	emptyContainer: join(
		positionedSpottable('above', 0, 10),
		container({
			[containerAttribute]: 'empty-container',
			style: position(10, 10)
		}),
		positionedSpottable('below', 30, 0),
	),
	emptyContainerOverlap: join(
		positionedSpottable('above', 5, 10),
		container({
			[containerAttribute]: 'empty-container',
			style: position(10, 10)
		}),
		positionedSpottable('below', 30, 0),
	)
};

const safeTarget = (n, fn) => n ? fn(n) : 'NOT FOUND';

const setupContainers = () => {
	configureDefaults({
		selector: '.spottable'
	});
	configureContainer(rootContainerId);
};

const teardownContainers = () => {
	// clean up any containers we create for safe tests
	getAllContainerIds().forEach(removeContainer);
	setDefaultContainer();
};

// NOTE: Skipping most tests because JSDOM does not support measurments
describe('target', () => {
	beforeEach(setupContainers);
	afterEach(teardownContainers);

	describe.skip('#getNavigableTarget', () => {
		test('should find spottable parent', testScenario(
			scenarios.complexTree,
			(root) => {
				const other = root.querySelector('.other');

				const expected = other.parentNode;
				const actual = getNavigableTarget(other);

				expect(actual).toBe(expected);
			}
		));

		test('should skip containers', testScenario(
			scenarios.nonSpottableInContainer,
			(root) => {
				configureContainer('first');
				const other = root.querySelector('.other');

				const expected = null;
				const actual = getNavigableTarget(other);

				expect(actual).toBe(expected);
			}
		));

		test('should respect container-specific selector', testScenario(
			scenarios.nonSpottableInContainer,
			(root) => {
				// make '.other' a valid spottable element
				configureContainer('first', {
					selector: '.other'
				});
				const other = root.querySelector('.other');

				const expected = other;
				const actual = getNavigableTarget(other);

				expect(actual).toBe(expected);
			}
		));

		test('should respect disabled containers', testScenario(
			scenarios.complexTree,
			(root) => {
				configureContainer('third-container');
				const other = root.querySelector(`[${containerAttribute}='third-container'] .spottable`);

				const expected = null;
				const actual = getNavigableTarget(other);

				expect(actual).toBe(expected);
			}
		));
	});

	describe('#getTargetByContainer', () => {
		test('should find spottable element within provided container', testScenario(
			scenarios.complexTree,
			() => {
				configureContainer('first-container');

				const expected = 'spottable';
				const actual = safeTarget(
					getTargetByContainer('first-container'),
					t => t.className
				);

				expect(actual).toBe(expected);
			}
		));

		test(
			'should return null when container does not contain any spottable elements',
			testScenario(
				scenarios.nonSpottableInContainer,
				() => {
					configureContainer('first');
					configureContainer('second');

					const expected = null;
					const actual = getTargetByContainer('second');

					expect(actual).toBe(expected);
				}
			)
		);

		test(
			'should find the first spottable in the root when no container specified',
			testScenario(
				scenarios.nonSpottableInContainer,
				() => {
					configureContainer('first');
					configureContainer('second');

					const expected = 'in-root';
					const actual = safeTarget(
						getTargetByContainer(),
						t => t.id
					);

					expect(actual).toBe(expected);
				}
			)
		);

		test(
			'should find the first spottable in the default container when set and no container specified',
			testScenario(
				scenarios.nonSpottableInContainer,
				() => {
					configureContainer('first');
					configureContainer('second');
					setDefaultContainer('first');

					const expected = 'spottable';
					const actual = safeTarget(
						getTargetByContainer(),
						t => t.className
					);

					expect(actual).toBe(expected);
				}
			)
		);
	});

	describe('#getTargetBySelector', () => {
		test(
			'should find spottable element within container when "@" prefix used',
			testScenario(
				scenarios.nonSpottableInContainer,
				() => {
					configureContainer('first');

					const expected = 'spottable';
					const actual = safeTarget(
						getTargetBySelector('@first'),
						t => t.className
					);

					expect(actual).toBe(expected);
				}
			)
		);

		test(
			'should find spottable element within container when "#" prefix used',
			testScenario(
				scenarios.nonSpottableInContainer,
				() => {
					configureContainer('first');

					const expected = 'in-first';
					const actual = safeTarget(
						getTargetBySelector('#in-first'),
						t => t.id
					);

					expect(actual).toBe(expected);
				}
			)
		);

		test(
			'should return null when the node exists but is not navigable within its container',
			testScenario(
				scenarios.nonSpottableInContainer,
				() => {
					configureContainer('first', {
						navigableFilter: () => false
					});

					const expected = null;
					const actual = getTargetBySelector('#in-first');

					expect(actual).toBe(expected);
				}
			)
		);

		test(
			'should return null when the node exists but does not match the container\'s selector',
			testScenario(
				scenarios.nonSpottableInContainer,
				() => {
					configureContainer('first');

					const expected = null;
					const actual = getTargetBySelector(`[${containerAttribute}='first'] .other`);

					expect(actual).toBe(expected);
				}
			)
		);

		test('should return null for an empty selectors', testScenario(
			scenarios.nonSpottableInContainer,
			() => {
				const expected = null;

				// eslint-disable-next-line no-undefined
				expect(getTargetBySelector(undefined)).toBe(expected);
				expect(getTargetBySelector(null)).toBe(expected);
				expect(getTargetBySelector('')).toBe(expected);
			}
		));
	});

	describe.skip('#getTargetByDirectionFromElement', () => {
		test('should find target within container by direction', testScenario(
			scenarios.grid,
			(root) => {
				configureContainer('grid');
				const center = root.querySelector('#middle-center');

				expect(safeTarget(
					getTargetByDirectionFromElement('up', center),
					t => t.id
				)).toBe('top-center');

				expect(safeTarget(
					getTargetByDirectionFromElement('down', center),
					t => t.id
				)).toBe('bottom-center');

				expect(safeTarget(
					getTargetByDirectionFromElement('left', center),
					t => t.id
				)).toBe('middle-left');

				expect(safeTarget(
					getTargetByDirectionFromElement('right', center),
					t => t.id
				)).toBe('middle-right');
			}
		));

		test('should find target within container from floating element', testScenario(
			scenarios.overlap,
			(root) => {
				configureContainer('grid', {
					enterTo: 'default-element',
					defaultElement: '#bottom-right'
				});

				const overlap = root.querySelector('#over-middle-center');

				expect(safeTarget(
					getTargetByDirectionFromElement('down', overlap),
					t => t.id
				)).toBe('middle-center');
			}
		));

		test(
			'should ignore targets outside the bounds of an overflow container',
			testScenario(
				scenarios.overflow,
				(root) => {
					configureContainer('overflow-container', {
						overflow: true
					});

					const element = root.querySelector('#outside-overflow');

					expect(safeTarget(
						getTargetByDirectionFromElement('down', element),
						t => t.id
					)).toBe('overflow-within');
				}
			)
		);

		test(
			'should find target within container larger than overflow container',
			testScenario(
				scenarios.overflowLargeSubContainer,
				(root) => {
					configureContainer('overflow-container', {
						overflow: true
					});
					configureContainer('inside', {
						enterTo: null
					});

					const element = root.querySelector('#outside-overflow');

					expect(safeTarget(
						getTargetByDirectionFromElement('down', element),
						t => t.id
					)).toBe('in-large-container');
				}
			)
		);

		test(
			'should find target out of bounds of overflow container from within container',
			testScenario(
				scenarios.overflow,
				(root) => {
					configureContainer('overflow-container', {
						overflow: true
					});

					const element = root.querySelector('#overflow-within');

					expect(safeTarget(
						getTargetByDirectionFromElement('down', element),
						t => t.id
					)).toBe('overflow-below');

					expect(safeTarget(
						getTargetByDirectionFromElement('up', element),
						t => t.id
					)).toBe('overflow-above');
				}
			)
		);

		test('should stop at restrict="self-only" boundaries', testScenario(
			scenarios.complexTree,
			(root) => {
				configureContainer('first-container', {
					restrict: 'none'
				});
				configureContainer('second-container', {
					restrict: 'self-only'
				});

				const element = root.querySelector(`[${containerAttribute}="second-container"] .spottable`);

				expect(safeTarget(
					getTargetByDirectionFromElement('up', element),
					t => t.id
				)).toBe('NOT FOUND');
			}
		));

		test('should respect enterTo="default-element" containers', testScenario(
			scenarios.grid,
			(root) => {
				configureContainer('grid', {
					restrict: 'none',
					enterTo: 'default-element',
					defaultElement: '#bottom-right'
				});

				const element = root.querySelector('#before-grid');

				expect(safeTarget(
					getTargetByDirectionFromElement('down', element),
					t => t.id
				)).toBe('bottom-right');
			}
		));

		test('should respect enterTo="last-focused" containers', testScenario(
			scenarios.grid,
			(root) => {
				configureContainer('grid', {
					restrict: 'none',
					enterTo: 'last-focused',
					lastFocusedKey: {
						container: false,
						element: true,
						key: 8
					}
				});

				const element = root.querySelector('#before-grid');

				expect(safeTarget(
					getTargetByDirectionFromElement('down', element),
					t => t.id
				)).toBe('bottom-right');
			}
		));

		test(
			'should follow the leaveFor config when no target is found within the container in the given direction',
			testScenario(
				scenarios.grid,
				(root) => {
					configureContainer('grid', {
						restrict: 'none',
						leaveFor: {
							up: '#after-grid'
						}
					});

					const element = root.querySelector('#top-center');

					expect(safeTarget(
						getTargetByDirectionFromElement('up', element),
						t => t.id
					)).toBe('after-grid');
				}
			)
		);

		test(
			'should not follow the leaveFor config when a target is found within the container in the given direction',
			testScenario(
				scenarios.grid,
				(root) => {
					configureContainer('grid', {
						restrict: 'none',
						leaveFor: {
							up: '#after-grid'
						}
					});

					const element = root.querySelector('#middle-center');

					expect(safeTarget(
						getTargetByDirectionFromElement('up', element),
						t => t.id
					)).toBe('top-center');
				}
			)
		);

		test(
			'should not follow the leaveFor config when the selector does not match an element',
			testScenario(
				scenarios.grid,
				(root) => {
					configureContainer('grid', {
						restrict: 'none',
						leaveFor: {
							up: '#does-not-exist'
						}
					});

					const element = root.querySelector('#top-center');

					expect(safeTarget(
						getTargetByDirectionFromElement('up', element),
						t => t.id
					)).toBe('before-grid');
				}
			)
		);

		test('should ignore empty containers', testScenario(
			scenarios.emptyContainer,
			(root) => {
				configureContainer('empty-container');
				const element = root.querySelector('#above');

				expect(safeTarget(
					getTargetByDirectionFromElement('down', element),
					t => t.id
				)).toBe('below');
			}
		));

		test('should ignore overlapping empty containers', testScenario(
			scenarios.emptyContainerOverlap,
			(root) => {
				configureContainer('empty-container');
				const element = root.querySelector('#above');

				expect(safeTarget(
					getTargetByDirectionFromElement('down', element),
					t => t.id
				)).toBe('below');
			}
		));
	});

	describe.skip('#getTargetByDirectionFromPosition', () => {
		test('should find target within container', testScenario(
			scenarios.grid,
			(root) => {
				configureContainer('grid');
				const rect = root.querySelector('#middle-center').getBoundingClientRect();
				const center = {
					x: rect.left + rect.width / 2,
					y: rect.top + rect.height / 2
				};

				expect(safeTarget(
					getTargetByDirectionFromPosition('up', center, 'grid'),
					t => t.id
				)).toBe('top-center');

				expect(safeTarget(
					getTargetByDirectionFromPosition('down', center, 'grid'),
					t => t.id
				)).toBe('bottom-center');

				expect(safeTarget(
					getTargetByDirectionFromPosition('left', center, 'grid'),
					t => t.id
				)).toBe('middle-left');

				expect(safeTarget(
					getTargetByDirectionFromPosition('right', center, 'grid'),
					t => t.id
				)).toBe('middle-right');
			}
		));

		test(
			'should not find a target when at bounds of container with restrict="self-only"',
			testScenario(
				scenarios.grid,
				(root) => {
					configureContainer('grid', {
						restrict: 'self-only'
					});
					const rect = root.querySelector('#top-center').getBoundingClientRect();
					const topCenterOfGrid = {
						x: rect.left + rect.width / 2,
						y: rect.top
					};

					expect(safeTarget(
						getTargetByDirectionFromPosition('up', topCenterOfGrid, 'grid'),
						t => t.id
					)).toBe('NOT FOUND');
				}
			)
		);

		test(
			'should not find a target outside of container when restrict is not set',
			testScenario(
				scenarios.grid,
				(root) => {
					configureContainer('grid', {
						restrict: 'none'
					});
					const rect = root.querySelector('#top-center').getBoundingClientRect();
					const topCenterOfGrid = {
						x: rect.left + rect.width / 2,
						y: rect.top
					};

					expect(safeTarget(
						getTargetByDirectionFromPosition('up', topCenterOfGrid, 'grid'),
						t => t.id
					)).toBe('before-grid');
				}
			)
		);

		test('should cascade into unrestricted subcontainers', testScenario(
			scenarios.grid,
			(root) => {
				configureContainer('grid', {
					restrict: 'none'
				});
				const rect = root.querySelector('#top-center').getBoundingClientRect();
				const aboveCenterOfGrid = {
					x: rect.left + rect.width / 2,
					y: rect.top - 1
				};

				expect(safeTarget(
					getTargetByDirectionFromPosition('down', aboveCenterOfGrid, rootContainerId),
					t => t.id
				)).toBe('top-center');
			}
		));

		test('should ignore enterTo config of restricted subcontainers', testScenario(
			scenarios.grid,
			(root) => {
				configureContainer('grid', {
					restrict: 'none',
					enterTo: 'default-element',
					defaultElement: '#bottom-right'
				});
				const rect = root.querySelector('#top-center').getBoundingClientRect();
				const aboveCenterOfGrid = {
					x: rect.left + rect.width / 2,
					y: rect.top - 1
				};

				expect(safeTarget(
					getTargetByDirectionFromPosition('down', aboveCenterOfGrid, rootContainerId),
					t => t.id
				)).toBe('top-center');
			}
		));

		test('should find target within container from floating element', testScenario(
			scenarios.overlap,
			(root) => {
				configureContainer('grid', {
					enterTo: 'default-element',
					defaultElement: '#bottom-right'
				});

				const overlap = root.querySelector('#over-middle-center');
				const {left: x, top: y} = overlap.getBoundingClientRect();

				expect(safeTarget(
					getTargetByDirectionFromPosition('down', {x, y}, rootContainerId),
					t => t.id
				)).toBe('middle-center');
			}
		));

		test(
			'should ignore targets outside the bounds of an overflow container',
			testScenario(
				scenarios.overflow,
				(root) => {
					configureContainer('overflow-container', {
						overflow: true
					});

					const element = root.querySelector('#outside-overflow');
					const {left: x, top: y} = element.getBoundingClientRect();

					expect(safeTarget(
						getTargetByDirectionFromPosition('down', {x, y}, rootContainerId),
						t => t.id
					)).toBe('overflow-within');
				}
			)
		);

		test(
			'should find target within container larger than overflow container',
			testScenario(
				scenarios.overflowLargeSubContainer,
				(root) => {
					configureContainer('overflow-container', {
						overflow: true
					});
					configureContainer('inside', {
						enterTo: null
					});

					const element = root.querySelector('#outside-overflow');
					const {left: x, top: y} = element.getBoundingClientRect();

					expect(safeTarget(
						getTargetByDirectionFromPosition('down', {x, y}, rootContainerId),
						t => t.id
					)).toBe('in-large-container');
				}
			)
		);

		test(
			'should find target out of bounds of overflow container from within container',
			testScenario(
				scenarios.overflow,
				(root) => {
					configureContainer('overflow-container', {
						overflow: true
					});

					const element = root.querySelector('#overflow-within');
					const {left, width, top, height} = element.getBoundingClientRect();
					const x = left + width / 2;
					const y = top + height / 2;

					expect(safeTarget(
						getTargetByDirectionFromPosition('down', {x, y: y + 1}, rootContainerId),
						t => t.id
					)).toBe('overflow-below');

					expect(safeTarget(
						getTargetByDirectionFromPosition('up', {x, y: y - 1}, rootContainerId),
						t => t.id
					)).toBe('overflow-above');
				}
			)
		);

		test('should ignore empty containers', testScenario(
			scenarios.emptyContainer,
			(root) => {
				configureContainer('empty-container');
				const element = root.querySelector('#above');

				const {left, width, top, height} = element.getBoundingClientRect();
				const x = left + width / 2;
				const y = top + height - 1; // just inside the bottom of 'above'

				expect(safeTarget(
					getTargetByDirectionFromPosition('down', {x, y}, rootContainerId),
					t => t.id
				)).toBe('below');
			}
		));

		test('should ignore overlapping empty containers', testScenario(
			scenarios.emptyContainer,
			(root) => {
				configureContainer('empty-container');
				const element = root.querySelector('#above');

				const {left, width, top, height} = element.getBoundingClientRect();
				const x = left + width / 2;
				const y = top + height + 1; // just inside the empty container

				expect(safeTarget(
					getTargetByDirectionFromPosition('down', {x, y}, rootContainerId),
					t => t.id
				)).toBe('below');
			}
		));
	});
});
