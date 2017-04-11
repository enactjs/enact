import {containerAttribute, containerSelector, getSpottableDescendants} from '../container';

import {
	container,
	findContainer,
	node,
	someContainers,
	someNodes,
	someSpottables,
	someSpottablesAndContainers,
	spottable,
	test,
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
	it('should find spottables', test(
		scenarios.onlySpottables,
		(root) => {
			const expected = 5;
			const actual = getSpottableDescendants(root).length;

			expect(actual).to.equal(expected);
		}
	));

	it('should find containers', test(
		scenarios.onlyContainers,
		(root) => {
			const expected = 5;
			const actual = getSpottableDescendants(root).length;

			expect(actual).to.equal(expected);
		}
	));

	it('should find spottables and containers', test(
		scenarios.spottableAndContainers,
		(root) => {
			const expected = 10;
			const actual = getSpottableDescendants(root).length;

			expect(actual).to.equal(expected);
		}
	));

	it('should only find spottables with non-spottable siblings', test(
		scenarios.nonSpottableSiblings,
		(root) => {
			const expected = 5;
			const actual = getSpottableDescendants(root).length;

			expect(actual).to.equal(expected);
		}
	));

	it('should only find top-level containers', test(
		scenarios.nestedContainers,
		(root) => {
			const expected = 1;
			const actual = getSpottableDescendants(root).length;

			expect(actual).to.equal(expected);
		}
	));

	it('should only find top-level containers and spottables', test(
		scenarios.nestedContainersWithSpottables,
		(root) => {
			const expected = 6;
			const actual = getSpottableDescendants(root).length;

			expect(actual).to.equal(expected);
		}
	));

	it('should not find spottables in sibling containers', test(
		scenarios.siblingContainers,
		(root) => {
			const expected = 5;
			const actual = getSpottableDescendants(root.querySelector(containerSelector)).length;

			expect(actual).to.equal(expected);
		}
	));

	it('should not find spottables in descendant containers', test(
		scenarios.complexTree,
		(root) => {
			const expected = 3;
			const actual = getSpottableDescendants(findContainer(root, 'first-container')).length;

			expect(actual).to.equal(expected);
		}
	));
});
