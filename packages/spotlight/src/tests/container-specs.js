import {
	configureContainer,
	containerAttribute,
	getContainersForNode,
	getSpottableDescendants,
	isContainer,
	removeContainer,
	rootContainerId
} from '../container';

import {
	container,
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
					children: join(
						someSpottables(4),
						node({id: 'child-of-third'})
					)
				})
			)})
		)})
	),
	spottablesInDisabledContainer: container({
		[containerAttribute]: 'container',
		'data-container-disabled': true,
		children: someSpottables(5)
	}),
	spottablesInNestedDisabledContainer: container({
		[containerAttribute]: 'container',
		'data-container-disabled': true,
		children: container({
			[containerAttribute]: 'child',
			children: someSpottables(5)
		})
	})
};

describe('container', () => {
	describe('#getSpottableDescendants', () => {
		it('should find spottables', testScenario(
			scenarios.onlySpottables,
			() => {
				const expected = 5;
				const actual = getSpottableDescendants(rootContainerId).length;

				expect(actual).to.equal(expected);
			}
		));

		it('should find containers', testScenario(
			scenarios.onlyContainers,
			() => {
				const expected = 5;
				const actual = getSpottableDescendants(rootContainerId).length;

				expect(actual).to.equal(expected);
			}
		));

		it('should find spottables and containers', testScenario(
			scenarios.spottableAndContainers,
			() => {
				const expected = 10;
				const actual = getSpottableDescendants(rootContainerId).length;

				expect(actual).to.equal(expected);
			}
		));

		it('should only find spottables with non-spottable siblings', testScenario(
			scenarios.nonSpottableSiblings,
			() => {
				const expected = 5;
				const actual = getSpottableDescendants(rootContainerId).length;

				expect(actual).to.equal(expected);
			}
		));

		it('should only find top-level containers', testScenario(
			scenarios.nestedContainers,
			() => {
				const expected = 1;
				const actual = getSpottableDescendants(rootContainerId).length;

				expect(actual).to.equal(expected);
			}
		));

		it('should only find top-level containers and spottables', testScenario(
			scenarios.nestedContainersWithSpottables,
			() => {
				const expected = 6;
				const actual = getSpottableDescendants(rootContainerId).length;

				expect(actual).to.equal(expected);
			}
		));

		it('should not find spottables in sibling containers', testScenario(
			scenarios.siblingContainers,
			() => {
				const expected = 5;
				const actual = getSpottableDescendants('first').length;

				expect(actual).to.equal(expected);
			}
		));

		it('should not find spottables in descendant containers', testScenario(
			scenarios.complexTree,
			() => {
				const expected = 3;
				const actual = getSpottableDescendants('first-container').length;

				expect(actual).to.equal(expected);
			}
		));

		it('should not find containers that are disabled', testScenario(
			scenarios.complexTree,
			() => {
				const expected = 3;
				const actual = getSpottableDescendants('second-container').length;

				expect(actual).to.equal(expected);
			}
		));

		it('should not any spottables within a disabled container', testScenario(
			scenarios.spottablesInDisabledContainer,
			() => {
				const expected = 0;
				const actual = getSpottableDescendants('container').length;

				expect(actual).to.equal(expected);
			}
		));

		it('should not any spottables within a disabled ancestor container', testScenario(
			scenarios.spottablesInNestedDisabledContainer,
			() => {
				const expected = 0;
				const actual = getSpottableDescendants('child').length;

				expect(actual).to.equal(expected);
			}
		));
	});

	describe('#getContainersForNode', () => {
		it('should return the rootContainerId when no other containers exist', testScenario(
			scenarios.onlySpottables,
			(root) => {
				const expected = [rootContainerId];
				const actual = getContainersForNode(root.lastChild);

				expect(actual).to.deep.equal(expected);
			}
		));

		it('should return all ancestor container ids', testScenario(
			scenarios.complexTree,
			(root) => {
				const childOfThird = root.querySelector('#child-of-third');
				const expected = [
					rootContainerId,
					'first-container',
					'second-container',
					'third-container'
				];
				const actual = getContainersForNode(childOfThird);

				expect(actual).to.deep.equal(expected);
			}
		));

		it('should return immediate container id as last in list', testScenario(
			scenarios.complexTree,
			(root) => {
				const childOfThird = root.querySelector('#child-of-third');
				const expected = 'third-container';
				const actual = getContainersForNode(childOfThird).pop();

				expect(actual).to.deep.equal(expected);
			}
		));
	});

	describe('#isContainer', () => {
		beforeEach(() => {
			configureContainer('test-container');
		});

		afterEach(() => {
			removeContainer('test-container');
		});

		it('should return true for nodes that have the container attribute', () => {
			const div = document.createElement('div');
			div.setAttribute(containerAttribute, 'my-container');

			const expected = true;
			const actual = isContainer(div);

			expect(actual).to.equal(expected);
		});

		it('should return false for nodes that do not have the container attribute', () => {
			const div = document.createElement('div');

			const expected = false;
			const actual = isContainer(div);

			expect(actual).to.equal(expected);
		});

		it('should return true for a configured container id', () => {
			const expected = true;
			const actual = isContainer('test-container');

			expect(actual).to.equal(expected);
		});

		it('should return false for a unconfigured container id', () => {
			const expected = false;
			const actual = isContainer('unconfigured-container');

			expect(actual).to.equal(expected);
		});
	});
});
