import {
	configureContainer,
	configureDefaults,
	containerAttribute,
	getAllContainerIds,
	getContainerConfig,
	getContainerFocusTarget,
	getContainersForNode,
	getLastContainer,
	getSpottableDescendants,
	isContainer,
	isNavigable,
	unmountContainer,
	removeContainer,
	rootContainerId,
	setContainerLastFocusedElement,
	setLastContainer,
	setLastContainerFromTarget
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
	mixedOrder: join(
		container({[containerAttribute]: 'first', name: 'c1'}),
		spottable({name: 's1'}),
		container({[containerAttribute]: 'second', name: 'c2'}),
		spottable({name: 's2'})
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
	}),
	containerWithDefaultAndLastFocused: container({
		[containerAttribute]: 'container',
		children: join(
			spottable({id: 'firstSpottable'}),
			someSpottables(5),
			node({id: 'spottableDefault', className: 'spottable spottable-default'}),
			spottable({id: 'lastFocused'})
		)
	}),
	nestedContainersWithDefaultAndLastFocused: container({
		[containerAttribute]: 'container',
		children: join(
			spottable({id: 'firstSpottable'}),
			someSpottables(5),
			container({
				[containerAttribute]: 'child',
				id: 'spottableDefault',
				className: 'spottable-default',
				children: join(
					spottable({id: 'firstChildSpottable'}),
					someSpottables(5),
					spottable({id: 'lastChildFocused'})
				)
			}),
			spottable({id: 'lastFocused'})
		)
	})
};

const setupContainers = () => {
	configureDefaults({
		selector: '.spottable'
	});
	configureContainer(rootContainerId);
	setLastContainer(rootContainerId);
};

const teardownContainers = () => {
	// clean up any containers we create for safe tests
	getAllContainerIds().forEach(removeContainer);
};

describe('container', () => {
	describe('#getSpottableDescendants', () => {
		beforeEach(setupContainers);
		afterEach(teardownContainers);

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
				configureContainer('first');

				const expected = 5;
				const actual = getSpottableDescendants('first').length;

				expect(actual).to.equal(expected);
			}
		));

		it('should not find spottables in descendant containers', testScenario(
			scenarios.complexTree,
			() => {
				configureContainer('first-container');

				const expected = 3;
				const actual = getSpottableDescendants('first-container').length;

				expect(actual).to.equal(expected);
			}
		));

		it('should not find containers that are disabled', testScenario(
			scenarios.complexTree,
			() => {
				configureContainer('first-container');
				configureContainer('second-container');

				const expected = 3;
				const actual = getSpottableDescendants('second-container').length;

				expect(actual).to.equal(expected);
			}
		));

		it('should not any spottables within a disabled container', testScenario(
			scenarios.spottablesInDisabledContainer,
			() => {
				configureContainer('container');

				const expected = 0;
				const actual = getSpottableDescendants('container').length;

				expect(actual).to.equal(expected);
			}
		));

		it('should not any spottables within a disabled ancestor container', testScenario(
			scenarios.spottablesInNestedDisabledContainer,
			() => {
				configureContainer('container');
				configureContainer('child');

				const expected = 0;
				const actual = getSpottableDescendants('child').length;

				expect(actual).to.equal(expected);
			}
		));

		it('should return spottables and containers in source order', testScenario(
			scenarios.mixedOrder,
			() => {
				const expected = ['c1', 's1', 'c2', 's2'];
				const actual = getSpottableDescendants(rootContainerId).map(n => n.getAttribute('name'));

				expect(actual).to.deep.equal(expected);
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

	describe('#getContainerFocusTarget', () => {
		beforeEach(setupContainers);
		afterEach(teardownContainers);

		it('should return the last focused element when enterTo is "last-focused"', testScenario(
			scenarios.containerWithDefaultAndLastFocused,
			(root) => {
				configureContainer('container', {
					enterTo: 'last-focused',
					defaultElement: '.spottable-default'
				});

				setContainerLastFocusedElement(root.querySelector('#lastFocused'), ['container']);

				const expected = 'lastFocused';
				const actual = getContainerFocusTarget('container').id;

				expect(actual).to.equal(expected);
			}
		));

		it('should return the default spottable element when enterTo is "last-focused" but no element has been focused', testScenario(
			scenarios.containerWithDefaultAndLastFocused,
			() => {
				configureContainer('container', {
					enterTo: 'last-focused',
					defaultElement: '.spottable-default'
				});

				const expected = 'spottableDefault';
				const actual = getContainerFocusTarget('container').id;

				expect(actual).to.equal(expected);
			}
		));

		it('should return the first spottable element when enterTo is "last-focused" and defaultElement is not configured', testScenario(
			scenarios.containerWithDefaultAndLastFocused,
			() => {
				configureContainer('container', {
					enterTo: 'last-focused'
				});

				const expected = 'firstSpottable';
				const actual = getContainerFocusTarget('container').id;

				expect(actual).to.equal(expected);
			}
		));

		it('should return the first spottable element when enterTo is "last-focused" and defaultElement is not found', testScenario(
			scenarios.containerWithDefaultAndLastFocused,
			() => {
				configureContainer('container', {
					enterTo: 'last-focused',
					// configured, but not found
					defaultElement: '[data-default-spottable]'
				});

				const expected = 'firstSpottable';
				const actual = getContainerFocusTarget('container').id;

				expect(actual).to.equal(expected);
			}
		));

		it('should return the default spottable element when enterTo is "default-element"', testScenario(
			scenarios.containerWithDefaultAndLastFocused,
			() => {
				configureContainer('container', {
					enterTo: 'default-element',
					defaultElement: '.spottable-default'
				});

				const expected = 'spottableDefault';
				const actual = getContainerFocusTarget('container').id;

				expect(actual).to.equal(expected);
			}
		));

		it('should return the first spottable element when enterTo is "default-element" but defaultElement is not configured', testScenario(
			scenarios.containerWithDefaultAndLastFocused,
			() => {
				configureContainer('container', {
					enterTo: 'default-element'
				});

				const expected = 'firstSpottable';
				const actual = getContainerFocusTarget('container').id;

				expect(actual).to.equal(expected);
			}
		));

		it('should return the first spottable element when enterTo is "default-element" but defaultElement is not found', testScenario(
			scenarios.containerWithDefaultAndLastFocused,
			() => {
				configureContainer('container', {
					enterTo: 'default-element',
					defaultElement: '[data-default-spottable]'
				});

				const expected = 'firstSpottable';
				const actual = getContainerFocusTarget('container').id;

				expect(actual).to.equal(expected);
			}
		));

		it('should return the first spottable element when enterTo is not configured', testScenario(
			scenarios.containerWithDefaultAndLastFocused,
			() => {
				configureContainer('container');

				const expected = 'firstSpottable';
				const actual = getContainerFocusTarget('container').id;

				expect(actual).to.equal(expected);
			}
		));

		it('should return the default element when enterTo is not configured and defaultElement is configured', testScenario(
			scenarios.containerWithDefaultAndLastFocused,
			() => {
				configureContainer('container', {
					defaultElement: '.spottable-default'
				});

				const expected = 'spottableDefault';
				const actual = getContainerFocusTarget('container').id;

				expect(actual).to.equal(expected);
			}
		));

		it('should cascade search into child containers with', testScenario(
			scenarios.nestedContainersWithDefaultAndLastFocused,
			(root) => {
				configureContainer('container', {
					defaultElement: '.spottable-default'
				});

				configureContainer('child', {
					enterTo: 'last-focused',
					defaultElement: '.spottable-default'
				});

				setContainerLastFocusedElement(root.querySelector('#lastChildFocused'), [rootContainerId, 'container', 'child']);

				const expected = 'lastChildFocused';
				const actual = getContainerFocusTarget('container').id;

				expect(actual).to.equal(expected);
			}
		));

		it('should cascade search into child containers when multiple containers have enterTo configured', testScenario(
			scenarios.nestedContainersWithDefaultAndLastFocused,
			(root) => {
				configureContainer('container', {
					enterTo: 'last-focused',
					defaultElement: '.spottable-default'
				});

				configureContainer('child', {
					enterTo: 'last-focused',
					defaultElement: '.spottable-default'
				});

				setContainerLastFocusedElement(root.querySelector('#lastChildFocused'), [rootContainerId, 'container', 'child']);

				const expected = 'lastChildFocused';
				const actual = getContainerFocusTarget('container').id;

				expect(actual).to.equal(expected);
			}
		));
	});

	describe('#isNavigable', () => {
		beforeEach(setupContainers);
		afterEach(teardownContainers);

		it('should return false a null node', () => {
			const expected = false;
			const actual = isNavigable(null, rootContainerId);

			expect(actual).to.equal(expected);
		});

		it('should return true for any node when not verifying selector and without a navigableFilter', testScenario(
			scenarios.nonSpottableSiblings,
			(root) => {
				const expected = true;
				const actual = isNavigable(root.querySelector('.other'), rootContainerId);

				expect(actual).to.equal(expected);
			}
		));

		it('should return true for spottable children when verifying selector', testScenario(
			scenarios.onlySpottables,
			(root) => {
				const expected = true;
				const actual = isNavigable(root.querySelector('.spottable'), rootContainerId, true);

				expect(actual).to.equal(expected);
			}
		));

		it('should return true for spottable children when verifying selector', testScenario(
			scenarios.onlySpottables,
			(root) => {
				const expected = true;
				const actual = isNavigable(root.querySelector('.spottable'), rootContainerId, true);

				expect(actual).to.equal(expected);
			}
		));

		it('should return true for containers', testScenario(
			scenarios.onlyContainers,
			(root) => {
				const expected = true;
				const actual = isNavigable(root.querySelector(`[${containerAttribute}]`), rootContainerId, true);

				expect(actual).to.equal(expected);
			}
		));

		it('should filter the node with navigableFilter', testScenario(
			scenarios.spottableAndContainers,
			(root) => {
				configureContainer(rootContainerId, {
					// test filter which makes containers non-navigable
					navigableFilter: n => !isContainer(n)
				});

				const expected = false;
				const actual = isNavigable(root.querySelector(`[${containerAttribute}]`), rootContainerId, true);

				expect(actual).to.equal(expected);
			}
		));
	});

	describe('#setContainerLastFocusedElement', () => {
		beforeEach(setupContainers);
		afterEach(teardownContainers);

		it('should update lastFocusedElement for a single container', testScenario(
			scenarios.onlySpottables,
			(root) => {
				const item = root.querySelectorAll('.spottable').item(3);

				setContainerLastFocusedElement(
					item,
					getContainersForNode(item)
				);

				const expected = item;
				const actual = getContainerConfig(rootContainerId).lastFocusedElement;

				expect(actual).to.equal(expected);
			}
		));

		it('should update lastFocusedElement to the node\'s container id when element is within a container with enterTo configured', testScenario(
			scenarios.complexTree,
			(root) => {
				const item = root
					.querySelectorAll(`[${containerAttribute}='first-container'] .spottable`)
					.item(0);
				configureContainer('first-container', {
					enterTo: 'last-focused'
				});

				setContainerLastFocusedElement(
					item,
					getContainersForNode(item)
				);

				const expected = 'first-container';
				const actual = getContainerConfig(rootContainerId).lastFocusedElement;

				expect(actual).to.equal(expected);
			}
		));

		it('should ignore sub-containers that does not have enterTo configured', testScenario(
			scenarios.complexTree,
			(root) => {
				const item = root
					.querySelectorAll(`[${containerAttribute}='second-container'] .spottable`)
					.item(0);

				setContainerLastFocusedElement(
					item,
					getContainersForNode(item)
				);

				const expected = item;
				const actual = getContainerConfig(rootContainerId).lastFocusedElement;

				expect(actual).to.equal(expected);
			}
		));

		it('should update lastFocusedElement to the first sub-container that has enterTo configured', testScenario(
			scenarios.complexTree,
			(root) => {
				const item = root
					.querySelectorAll(`[${containerAttribute}='second-container'] .spottable`)
					.item(0);
				configureContainer('second-container', {
					enterTo: 'last-focused'
				});

				setContainerLastFocusedElement(
					item,
					getContainersForNode(item)
				);

				const expected = 'second-container';
				const actual = getContainerConfig(rootContainerId).lastFocusedElement;

				expect(actual).to.equal(expected);
			}
		));
	});

	describe('#unmountContainer', () => {
		beforeEach(setupContainers);
		afterEach(teardownContainers);

		it('should return element when last focused is not within a subcontainer with enterTo', testScenario(
			scenarios.onlySpottables,
			(root) => {
				const index = 3;
				const item = root.querySelectorAll('.spottable').item(index);
				setContainerLastFocusedElement(
					item,
					getContainersForNode(item)
				);

				unmountContainer(rootContainerId);

				const expected = true;
				const actual = getContainerConfig(rootContainerId).lastFocusedKey.element;

				expect(actual).to.equal(expected);
			}
		));

		it('should return container when last focused is within a subcontainer with enterTo', testScenario(
			scenarios.complexTree,
			(root) => {
				const item = root
					.querySelectorAll(`[${containerAttribute}="first-container"] .spottable`)
					.item(1);
				configureContainer('first-container', {
					enterTo: 'last-focused'
				});
				setContainerLastFocusedElement(
					item,
					getContainersForNode(item)
				);

				unmountContainer(rootContainerId);

				const expected = true;
				const actual = getContainerConfig(rootContainerId).lastFocusedKey.container;

				expect(actual).to.equal(expected);
			}
		));

		it('should save the index of the node when lastFocusedPersist is undefined', testScenario(
			scenarios.onlySpottables,
			(root) => {
				const index = 3;
				const item = root.querySelectorAll('.spottable').item(index);
				setContainerLastFocusedElement(
					item,
					getContainersForNode(item)
				);

				unmountContainer(rootContainerId);

				const expected = index;
				const actual = getContainerConfig(rootContainerId).lastFocusedKey.key;

				expect(actual).to.equal(expected);
			}
		));

		it('should save a custom key for container-configured lastFocusedPersist', testScenario(
			scenarios.onlySpottables,
			(root) => {
				const index = 3;
				const item = root.querySelectorAll('.spottable').item(3);
				configureContainer(rootContainerId, {
					lastFocusedPersist: (n, all) => ({
						element: true,
						key: `item-${all.indexOf(n)}`
					})
				});
				setContainerLastFocusedElement(
					item,
					getContainersForNode(item)
				);

				unmountContainer(rootContainerId);

				const expected = `item-${index}`;
				const actual = getContainerConfig(rootContainerId).lastFocusedKey.key;

				expect(actual).to.equal(expected);
			}
		));

		it('should save the container id as the key when a container with enterTo configured had the last focused item', testScenario(
			scenarios.complexTree,
			(root) => {
				const item = root
					.querySelectorAll(`[${containerAttribute}="first-container"] .spottable`)
					.item(1);
				configureContainer('first-container', {
					enterTo: 'last-focused'
				});
				setContainerLastFocusedElement(
					item,
					getContainersForNode(item)
				);

				unmountContainer(rootContainerId);

				const expected = 'first-container';
				const actual = getContainerConfig(rootContainerId).lastFocusedKey.key;

				expect(actual).to.equal(expected);
			}
		));

		it('should save the index as the key when last focused item is only within containers without enterTo configured', testScenario(
			scenarios.complexTree,
			(root) => {
				const item = root
					.querySelectorAll(`[${containerAttribute}="second-container"] .spottable`)
					.item(1);
				setContainerLastFocusedElement(
					item,
					getContainersForNode(item)
				);

				unmountContainer(rootContainerId);

				const expected = 4;
				const actual = getContainerConfig(rootContainerId).lastFocusedKey.key;

				expect(actual).to.equal(expected);
			}
		));
	});

	describe('#setLastContainerFromTarget', () => {
		beforeEach(setupContainers);
		afterEach(teardownContainers);

		it('should be nearest restrict="self-only" container to current if target is not within it', testScenario(
			scenarios.complexTree,
			(root) => {
				configureContainer('first-container', {
					restrict: 'self-only'
				});
				const current = root.querySelector('[data-container-id="first-container"] .spottable');
				const target = root.querySelector('.spottable');

				setLastContainerFromTarget(current, target);

				const expected = 'first-container';
				const actual = getLastContainer();

				expect(actual).to.equal(expected);
			}
		));

		it('should be use nearest container to target if within current container', testScenario(
			scenarios.complexTree,
			(root) => {
				configureContainer('first-container', {
					restrict: 'none'
				});
				configureContainer('second-container', {
					restrict: 'none'
				});
				const current = root.querySelector('[data-container-id="first-container"] .spottable');
				const target = root.querySelector('[data-container-id="second-container"] .spottable');

				setLastContainerFromTarget(current, target);

				const expected = 'second-container';
				const actual = getLastContainer();

				expect(actual).to.equal(expected);
			}
		));

		it('should target container if it is restrict="self-only" and contains current container', testScenario(
			scenarios.complexTree,
			(root) => {
				configureContainer('first-container', {
					restrict: 'self-only'
				});
				configureContainer('second-container', {
					restrict: 'none'
				});
				const current = root.querySelector('[data-container-id="second-container"] .spottable');
				const target = root.querySelector('[data-container-id="first-container"]');

				setLastContainerFromTarget(current, target);

				const expected = 'first-container';
				const actual = getLastContainer();

				expect(actual).to.equal(expected);
			}
		));
	});
});
