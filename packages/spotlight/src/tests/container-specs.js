import {containerSelector, getSpottableDescendants} from '../container';

import {
	container,
	findContainer,
	node,
	someContainers,
	someNodes,
	someSpottables,
	someSpottablesAndContainers,
	spottable,
	testScenario,
	uniqueContainer
} from './utils';

const scenarios = {
	onlySpottables: someSpottables(5),
	onlyContainers: someContainers(5),
	spottableAndContainers: someSpottablesAndContainers(5),
	nonSpottableSiblings: someSpottables(5) + someNodes('class="other"'),
	nestedContainers: container(container(container())),
	nestedContainersWithSpottables: someSpottables(5) + container(someSpottables(5)),
	siblingContainers: container(someSpottables(5)) + container(someSpottables(5)),
	complexTree: spottable(node('arbitrary content')) + uniqueContainer('first-container',
		someSpottables(2) + uniqueContainer('second-container',
			someSpottables(3) + uniqueContainer('third-container',
				someSpottables(4)
			)
		)
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
				const actual = getSpottableDescendants(root.querySelector(containerSelector)).length;

				expect(actual).to.equal(expected);
			}
		));

		it('should not find spottables in descendant containers', testScenario(
			scenarios.complexTree,
			(root) => {
				const expected = 3;
				const actual = getSpottableDescendants(findContainer(root, 'first-container')).length;

				expect(actual).to.equal(expected);
			}
		));
	});
});
