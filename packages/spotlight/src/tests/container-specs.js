import {containerAttribute, getSpottableDescendants} from '../container';

import {
	container,
	findContainer,
	join,
	node,
	someContainers,
	someNodes,
	someSpottables,
	someSpottablesAndContainers,
	spottable,
	testScenario
} from './utils';

const nonSpottable = () => node({className: 'other'});

const scenarios = {
	onlySpottables: someSpottables(5),
	onlyContainers: someContainers(5),
	spottableAndContainers: someSpottablesAndContainers(5),
	nonSpottableSiblings: join(
		someSpottables(5),
		someNodes(nonSpottable, 5)
	),
	nestedContainers: container(container(container())),
	disabledContainers: join(
		someSpottables(5),
		someContainers(5),
		node({[containerAttribute]: 'disabled-container', 'data-container-disabled': true})
	),
	nestedContainersWithSpottables: join(
		someSpottables(5),
		container({children: someSpottables(5)})
	),
	siblingContainers: join(
		container({[containerAttribute]: 'first', children: someSpottables(5)}),
		container({[containerAttribute]: 'second', children: someSpottables(5)})
	),
	complexTree: join(
		spottable(nonSpottable()),
		container({[containerAttribute]: 'first-container', children: join(
			someSpottables(2),
			container({[containerAttribute]: 'second-container', children: join(
				someSpottables(3),
				container({
					[containerAttribute]: 'third-container',
					'data-container-disabled': true,
					children: someSpottables(4)
				})
			)})
		)})
	)
};

describe('container', () => {
	describe('#getSpottableDescendants', () => {
		it('should find spottables', testScenario(
			scenarios.onlySpottables,
			(root) => {
				const expected = 5;
				const actual = getSpottableDescendants(root).length;

				expect(actual).to.equal(expected);
			}
		));

		it('should find containers', testScenario(
			scenarios.onlyContainers,
			(root) => {
				const expected = 5;
				const actual = getSpottableDescendants(root).length;

				expect(actual).to.equal(expected);
			}
		));

		it('should find spottables and containers', testScenario(
			scenarios.spottableAndContainers,
			(root) => {
				const expected = 10;
				const actual = getSpottableDescendants(root).length;

				expect(actual).to.equal(expected);
			}
		));

		it('should only find spottables with non-spottable siblings', testScenario(
			scenarios.nonSpottableSiblings,
			(root) => {
				const expected = 5;
				const actual = getSpottableDescendants(root).length;

				expect(actual).to.equal(expected);
			}
		));

		it('should only find top-level containers', testScenario(
			scenarios.nestedContainers,
			(root) => {
				const expected = 1;
				const actual = getSpottableDescendants(root).length;

				expect(actual).to.equal(expected);
			}
		));

		it('should only find top-level containers and spottables', testScenario(
			scenarios.nestedContainersWithSpottables,
			(root) => {
				const expected = 6;
				const actual = getSpottableDescendants(root).length;

				expect(actual).to.equal(expected);
			}
		));

		it('should not find spottables in sibling containers', testScenario(
			scenarios.siblingContainers,
			(root) => {
				const expected = 5;
				const actual = getSpottableDescendants(findContainer(root, 'first')).length;

				expect(actual).to.equal(expected);
			}
		));

		it('should not find spottables in descendant containers', testScenario(
			scenarios.complexTree,
			(root) => {
				const first = findContainer(root, 'first-container');

				const expected = 3;
				const actual = getSpottableDescendants(first).length;

				expect(actual).to.equal(expected);
			}
		));

		it('should not find containers that are disabled', testScenario(
			scenarios.complexTree,
			(root) => {
				const second = findContainer(root, 'second-container');

				const expected = 3;
				const actual = getSpottableDescendants(second).length;

				expect(actual).to.equal(expected);
			}
		));
	});
});
