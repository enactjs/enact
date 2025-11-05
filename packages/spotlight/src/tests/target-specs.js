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
			nonSpottable()
		)})
	),
	grid: join(
		spottable({id: 'before-grid', style: 'height: 10px'}),
		grid(),
		spottable({id: 'after-grid', style: 'height: 10px'})
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
		positionedSpottable('below', 30, 0)
	),
	emptyContainerOverlap: join(
		positionedSpottable('above', 5, 10),
		container({
			[containerAttribute]: 'empty-container',
			style: position(10, 10)
		}),
		positionedSpottable('below', 30, 0)
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

// NOTE: Skipping most tests because JSDOM does not support measurements
describe('target', () => {
	beforeEach(setupContainers);
	afterEach(teardownContainers);

	describe('#getNavigableTarget', () => {
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

		test('should return `default-element` when last focused is unset', testScenario(
			scenarios.grid,
			() => {
				configureContainer('grid', {
					enterTo: 'last-focused',
					defaultElement: '#middle-center'
				});

				const expected = 'middle-center';
				const actual = safeTarget(
					getTargetByContainer('grid'),
					t => t.id
				);

				expect(actual).toBe(expected);
			}
		));

		test('should return `default-element` when `last-focused` is requested but is unset', testScenario(
			scenarios.grid,
			() => {
				configureContainer('grid', {
					defaultElement: '#middle-center'
				});

				const expected = 'middle-center';
				const actual = safeTarget(
					getTargetByContainer('grid', 'last-focused'),
					t => t.id
				);

				expect(actual).toBe(expected);
			}
		));

		test('should return default element when configured for `last-focused` but requested `default-element`', testScenario(
			scenarios.grid,
			() => {
				configureContainer('grid', {
					enterTo: 'last-focused',
					lastFocusedElement: document.querySelector('#top-left'),
					defaultElement: '#middle-center'
				});

				const expected = 'middle-center';
				const actual = safeTarget(
					getTargetByContainer('grid', 'default-element'),
					t => t.id
				);

				expect(actual).toBe(expected);
			}
		));

		test('should return last focused element when configured for `default-element` but requested `last-focused`', testScenario(
			scenarios.grid,
			() => {
				configureContainer('grid', {
					enterTo: 'default-element',
					lastFocusedElement: document.querySelector('#top-left'),
					defaultElement: '#middle-center'
				});

				const expected = 'top-left';
				const actual = safeTarget(
					getTargetByContainer('grid', 'last-focused'),
					t => t.id
				);

				expect(actual).toBe(expected);
			}
		));
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

	describe('#getTargetByDirectionFromElement', () => {
		test('should find target within container by direction', testScenario(
			scenarios.grid,
			(root) => {
				configureContainer('grid');
				const center = root.querySelector('#middle-center');
				const topCenter = root.querySelector('#top-center');
				const bottomCenter = root.querySelector('#bottom-center');
				const middleLeft = root.querySelector('#middle-left');
				const middleRight = root.querySelector('#middle-right');

				center.getBoundingClientRect = () => ({top: 10, left: 10, width: 10, height: 10});
				topCenter.getBoundingClientRect = () => ({top: 0, left: 10, width: 10, height: 10});
				bottomCenter.getBoundingClientRect = () => ({top: 20, left: 10, width: 10, height: 10});
				middleLeft.getBoundingClientRect = () => ({top: 10, left: 0, width: 10, height: 10});
				middleRight.getBoundingClientRect = () => ({top: 10, left: 20, width: 10, height: 10});

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

		test.skip('should find target within container from floating element', testScenario(
			scenarios.overlap,
			(root) => {
				configureContainer('grid');

				const overlap = root.querySelector('#over-middle-center');
				const center = root.querySelector('#middle-center');

				center.getBoundingClientRect = () => ({top: 10, left: 10, width: 10, height: 10});
				overlap.getBoundingClientRect = () => ({top: 11,  left: 11, width: 3, height: 3});

				expect(safeTarget(
					getTargetByDirectionFromElement('top', overlap),
					t => t.id
				)).toBe('middle-center');
			}
		));

		test.skip(
			'should ignore targets outside the bounds of an overflow container',
			testScenario(
				scenarios.overflow,
				(root) => {
					configureContainer('overflow-container', {
						overflow: true
					});

					const element = root.querySelector('#outside-overflow');
					const overflowWithin = root.querySelector('#overflow-within');

					element.getBoundingClientRect = () => ({top: 10, left: 10, width: 0, height: 0});
					overflowWithin.getBoundingClientRect = () => ({top: 100,  left: 0, width: 10, height: 10});

					expect(safeTarget(
						getTargetByDirectionFromElement('down', element),
						t => t.id
					)).toBe('overflow-within');
				}
			)
		);

		test.skip(
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

		test.skip(
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

		test.skip('should respect enterTo="default-element" containers', testScenario(
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

		test.skip('should respect enterTo="last-focused" containers', testScenario(
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

		test.skip(
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

		test.skip(
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

		test.skip(
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

		test.skip('should ignore empty containers', testScenario(
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

		test.skip('should ignore overlapping empty containers', testScenario(
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

	describe('#getTargetByDirectionFromPosition', () => {
		test('should find target within container', testScenario(
			scenarios.grid,
			(root) => {
				configureContainer('grid');

				const middleCenter = root.querySelector('#middle-center');
				const topCenter = root.querySelector('#top-center');
				const bottomCenter = root.querySelector('#bottom-center');
				const middleLeft = root.querySelector('#middle-left');
				const middleRight = root.querySelector('#middle-right');

				middleCenter.getBoundingClientRect = () => ({top: 10, left: 10, width: 10, height: 10});
				topCenter.getBoundingClientRect = () => ({top: 0, left: 10, width: 10, height: 10});
				bottomCenter.getBoundingClientRect = () => ({top: 20, left: 10, width: 10, height: 10});
				middleLeft.getBoundingClientRect = () => ({top: 10, left: 0, width: 10, height: 10});
				middleRight.getBoundingClientRect = () => ({top: 10, left: 20, width: 10, height: 10});

				const centerRect = root.querySelector('#middle-center').getBoundingClientRect();

				const center = {
					x: centerRect.left + centerRect.width / 2,
					y: centerRect.top + centerRect.height / 2
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
			'should keep the same target when at bounds of container with restrict="self-only"',
			testScenario(
				scenarios.grid,
				(root) => {
					configureContainer('grid', {
						restrict: 'self-only'
					});

					const topCenter = root.querySelector('#top-center');

					topCenter.getBoundingClientRect = () => ({top: 0, left: 10, width: 10, height: 10});

					const rect = root.querySelector('#top-center').getBoundingClientRect();
					const topCenterOfGrid = {
						x: rect.left + rect.width / 2,
						y: rect.top
					};

					expect(safeTarget(
						getTargetByDirectionFromPosition('up', topCenterOfGrid, 'grid'),
						t => t.id
					)).toBe('top-left');
				}
			)
		);

		test.skip(
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

		test.skip('should cascade into unrestricted subcontainers', testScenario(
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

		test.skip('should ignore enterTo config of restricted subcontainers', testScenario(
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

		test.skip('should find target within container from floating element', testScenario(
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

		test.skip(
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

		test.skip(
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

		test.skip(
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

		test.skip('should ignore empty containers', testScenario(
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

		test.skip('should ignore overlapping empty containers', testScenario(
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

	describe('#directional visibility across containers', () => {
		test('should skip invisible target in another container and select a visible one', testScenario(
			scenarios.overflow,
			(root) => {
				configureContainer('overflow-container', {overflow: true});

				const overflowContainer = root.querySelector(`[${containerAttribute}='overflow-container']`);
				const outside = root.querySelector('#outside-overflow');
				const above = root.querySelector('#overflow-above');
				const within = root.querySelector('#overflow-within');
				const below = root.querySelector('#overflow-below');

				overflowContainer.getBoundingClientRect = () => ({top: 0, left: 0, bottom: 30, right: 30, width: 30, height: 30});
				outside.getBoundingClientRect = () => ({top: -20, left: 0, bottom: -10, right: 10, width: 10, height: 10});
				above.getBoundingClientRect = () => ({top: -10, left: 0, bottom: -5, right: 10, width: 10, height: 10});
				within.getBoundingClientRect = () => ({top: 0, left: 0, bottom: 10, right: 10, width: 10, height: 10});
				below.getBoundingClientRect = () => ({top: 30, left: 0, bottom: 40, right: 10, width: 10, height: 10});

				const {left, right, top, bottom} = outside.getBoundingClientRect();
				const x = (left + right) / 2;
				const y = (top + bottom) / 2;

				const expected = 'overflow-within';
				const actualFromPosition = safeTarget(
					getTargetByDirectionFromPosition('down', {x, y}, rootContainerId),
					t => t.id
				);
				// TODO: recheck
				// const actualFromElement = safeTarget(
				// 	getTargetByDirectionFromElement('down', outside),
				// 	t => t.id
				// );

				expect(actualFromPosition).toBe(expected);
				// TODO: recheck
				// expect(actualFromElement).toBe(expected);
			}
		));
	});
});
