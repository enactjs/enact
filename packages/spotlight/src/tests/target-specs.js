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

const positionedSpottable = (id, top, left) => {
	return spottable({
		id,
		style: `position: absolute; top: ${top}px; left: ${left}px; height: 10px; width: 10px;`
	});
};

const scenarios = {
	complexTree: join(
		spottable(nonSpottable()),
		container({[containerAttribute]: 'first-container', children: join(
			someSpottables(2),
			container({[containerAttribute]: 'second-container', children: join(
				someSpottables(3),
				container({
					[containerAttribute]: 'third-container',
					'data-container-disabled': true,
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
		container({
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
		}),
		spottable({id: 'after-grid', style: 'height: 10px'}),
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

describe('target', () => {
	beforeEach(setupContainers);
	afterEach(teardownContainers);

	describe('#getNavigableTarget', () => {
		it('should find spottable parent', testScenario(
			scenarios.complexTree,
			(root) => {
				const other = root.querySelector('.other');

				const expected = other.parentNode;
				const actual = getNavigableTarget(other);

				expect(actual).to.equal(expected);
			}
		));

		it('should skip containers', testScenario(
			scenarios.nonSpottableInContainer,
			(root) => {
				configureContainer('first');
				const other = root.querySelector('.other');

				const expected = null;
				const actual = getNavigableTarget(other);

				expect(actual).to.equal(expected);
			}
		));

		it('should respect container-specific selector', testScenario(
			scenarios.nonSpottableInContainer,
			(root) => {
				// make '.other' a valid spottable element
				configureContainer('first', {
					selector: '.other'
				});
				const other = root.querySelector('.other');

				const expected = other;
				const actual = getNavigableTarget(other);

				expect(actual).to.equal(expected);
			}
		));
	});

	describe('#getTargetByContainer', () => {
		it('should find spottable element within provided container', testScenario(
			scenarios.complexTree,
			() => {
				configureContainer('first-container');

				const expected = 'spottable';
				const actual = safeTarget(
					getTargetByContainer('first-container'),
					t => t.className
				);

				expect(actual).to.equal(expected);
			}
		));

		it('should return null when container does not contain any spottable elements', testScenario(
			scenarios.nonSpottableInContainer,
			() => {
				configureContainer('first');
				configureContainer('second');

				const expected = null;
				const actual = getTargetByContainer('second');

				expect(actual).to.equal(expected);
			}
		));

		it('should find the first spottable in the root when no container specified', testScenario(
			scenarios.nonSpottableInContainer,
			() => {
				configureContainer('first');
				configureContainer('second');

				const expected = 'in-root';
				const actual = safeTarget(
					getTargetByContainer(),
					t => t.id
				);

				expect(actual).to.equal(expected);
			}
		));

		it('should find the first spottable in the default container when set and no container specified', testScenario(
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

				expect(actual).to.equal(expected);
			}
		));
	});

	describe('#getTargetBySelector', () => {
		it('should find spottable element within container when "@" prefix used', testScenario(
			scenarios.nonSpottableInContainer,
			() => {
				configureContainer('first');

				const expected = 'spottable';
				const actual = safeTarget(
					getTargetBySelector('@first'),
					t => t.className
				);

				expect(actual).to.equal(expected);
			}
		));

		it('should find spottable element within container when "@" prefix used', testScenario(
			scenarios.nonSpottableInContainer,
			() => {
				configureContainer('first');

				const expected = 'in-first';
				const actual = safeTarget(
					getTargetBySelector('#in-first'),
					t => t.id
				);

				expect(actual).to.equal(expected);
			}
		));

		it('should return null when the node exists but is not navigable within its container', testScenario(
			scenarios.nonSpottableInContainer,
			() => {
				configureContainer('first', {
					navigableFilter: () => false
				});

				const expected = null;
				const actual = getTargetBySelector('#in-first');

				expect(actual).to.equal(expected);
			}
		));

		it('should return null for an empty selectors', testScenario(
			scenarios.nonSpottableInContainer,
			() => {
				const expected = null;

				// eslint-disable-next-line no-undefined
				expect(getTargetBySelector(undefined)).to.equal(expected);
				expect(getTargetBySelector(null)).to.equal(expected);
				expect(getTargetBySelector('')).to.equal(expected);
			}
		));
	});

	describe('#getTargetByDirectionFromElement', () => {
		it('should find target within container by direction', testScenario(
			scenarios.grid,
			(root) => {
				configureContainer('grid');
				const center = root.querySelector('#middle-center');

				expect(safeTarget(
					getTargetByDirectionFromElement('up', center),
					t => t.id
				)).to.equal('top-center');

				expect(safeTarget(
					getTargetByDirectionFromElement('down', center),
					t => t.id
				)).to.equal('bottom-center');

				expect(safeTarget(
					getTargetByDirectionFromElement('left', center),
					t => t.id
				)).to.equal('middle-left');

				expect(safeTarget(
					getTargetByDirectionFromElement('right', center),
					t => t.id
				)).to.equal('middle-right');
			}
		));
	});

	describe('#getTargetByDirectionFromPosition', () => {
		it('should find target within container', testScenario(
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
				)).to.equal('top-center');

				expect(safeTarget(
					getTargetByDirectionFromPosition('down', center, 'grid'),
					t => t.id
				)).to.equal('bottom-center');

				expect(safeTarget(
					getTargetByDirectionFromPosition('left', center, 'grid'),
					t => t.id
				)).to.equal('middle-left');

				expect(safeTarget(
					getTargetByDirectionFromPosition('right', center, 'grid'),
					t => t.id
				)).to.equal('middle-right');
			}
		));

		it('should not find a target when at bounds of container with restrict="self-only"', testScenario(
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
				)).to.equal('NOT FOUND');
			}
		));

		it('should not find a target outside of container when restrict is not set', testScenario(
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
				)).to.equal('before-grid');
			}
		));
	});
});
