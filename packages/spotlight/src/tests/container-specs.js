import {
	addContainer,
	configureContainer,
	configureDefaults,
	containerAttribute,
	getAllContainerIds,
	getContainerConfig,
	getContainerDefaultElement,
	getContainerFocusTarget,
	getContainerLastFocusedElement,
	getContainerNavigableElements,
	getContainersForNode,
	getDefaultContainer,
	getLastContainer,
	getNavigableContainersForNode,
	getSpottableDescendants,
	isContainer,
	isNavigable,
	unmountContainer,
	removeContainer,
	removeAllContainers,
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
		node({[containerAttribute]: 'disabled-container', 'data-spotlight-container-disabled': true})
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
				spottable({id: 'secondContainerFirstSpottable'}),
				someSpottables(2),
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
	spottablesInDisabledContainer: container({
		[containerAttribute]: 'container',
		'data-spotlight-container-disabled': true,
		children: someSpottables(5)
	}),
	spottablesInNestedDisabledContainer: container({
		[containerAttribute]: 'container',
		'data-spotlight-container-disabled': true,
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
	}),
	emptySubcontainer: container({
		[containerAttribute]: 'container',
		children: join(
			container({
				[containerAttribute]: 'subcontainer'
			}),
			spottable({id: 'afterSubcontainer'}),
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
	removeAllContainers();
};

describe('container', () => {
	describe('#getSpottableDescendants', () => {
		beforeEach(setupContainers);
		afterEach(teardownContainers);

		test('should find spottables', testScenario(
			scenarios.onlySpottables,
			() => {
				const expected = 5;
				const actual = getSpottableDescendants(rootContainerId).length;

				expect(actual).toBe(expected);
			}
		));

		test('should find containers', testScenario(
			scenarios.onlyContainers,
			() => {
				const expected = 5;
				const actual = getSpottableDescendants(rootContainerId).length;

				expect(actual).toBe(expected);
			}
		));

		test('should find spottables and containers', testScenario(
			scenarios.spottableAndContainers,
			() => {
				const expected = 10;
				const actual = getSpottableDescendants(rootContainerId).length;

				expect(actual).toBe(expected);
			}
		));

		test('should only find spottables with non-spottable siblings', testScenario(
			scenarios.nonSpottableSiblings,
			() => {
				const expected = 5;
				const actual = getSpottableDescendants(rootContainerId).length;

				expect(actual).toBe(expected);
			}
		));

		test('should only find top-level containers', testScenario(
			scenarios.nestedContainers,
			() => {
				const expected = 1;
				const actual = getSpottableDescendants(rootContainerId).length;

				expect(actual).toBe(expected);
			}
		));

		test('should only find top-level containers and spottables', testScenario(
			scenarios.nestedContainersWithSpottables,
			() => {
				const expected = 6;
				const actual = getSpottableDescendants(rootContainerId).length;

				expect(actual).toBe(expected);
			}
		));

		test('should not find spottables in sibling containers', testScenario(
			scenarios.siblingContainers,
			() => {
				configureContainer('first');

				const expected = 5;
				const actual = getSpottableDescendants('first').length;

				expect(actual).toBe(expected);
			}
		));

		test('should not find spottables in descendant containers', testScenario(
			scenarios.complexTree,
			() => {
				configureContainer('first-container');

				const expected = 3;
				const actual = getSpottableDescendants('first-container').length;

				expect(actual).toBe(expected);
			}
		));

		test('should not find containers that are disabled', testScenario(
			scenarios.complexTree,
			() => {
				configureContainer('first-container');
				configureContainer('second-container');

				const expected = 3;
				const actual = getSpottableDescendants('second-container').length;

				expect(actual).toBe(expected);
			}
		));

		test('should not any spottables within a disabled container', testScenario(
			scenarios.spottablesInDisabledContainer,
			() => {
				configureContainer('container');

				const expected = 0;
				const actual = getSpottableDescendants('container').length;

				expect(actual).toBe(expected);
			}
		));

		test(
			'should not any spottables within a disabled ancestor container',
			testScenario(
				scenarios.spottablesInNestedDisabledContainer,
				() => {
					configureContainer('container');
					configureContainer('child');

					const expected = 0;
					const actual = getSpottableDescendants('child').length;

					expect(actual).toBe(expected);
				}
			)
		);

		test('should return spottables and containers in source order', testScenario(
			scenarios.mixedOrder,
			() => {
				const expected = ['c1', 's1', 'c2', 's2'];
				const actual = getSpottableDescendants(rootContainerId).map(n => n.getAttribute('name'));

				expect(actual).toEqual(expected);
			}
		));
	});

	describe('#getContainersForNode', () => {
		test(
			'should return the rootContainerId when no other containers exist',
			testScenario(
				scenarios.onlySpottables,
				(root) => {
					const expected = [rootContainerId];
					const actual = getContainersForNode(root.lastChild);

					expect(actual).toEqual(expected);
				}
			)
		);

		test('should return all ancestor container ids', testScenario(
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

				expect(actual).toEqual(expected);
			}
		));

		test('should return immediate container id as last in list', testScenario(
			scenarios.complexTree,
			(root) => {
				const childOfThird = root.querySelector('#child-of-third');
				const expected = 'third-container';
				const actual = getContainersForNode(childOfThird).pop();

				expect(actual).toEqual(expected);
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

		test('should return true for nodes that have the container attribute', () => {
			const div = document.createElement('div');
			div.setAttribute('data-spotlight-container', 'my-container');

			const expected = true;
			const actual = isContainer(div);

			expect(actual).toBe(expected);
		});

		test(
			'should return false for nodes that do not have the container attribute',
			() => {
				const div = document.createElement('div');

				const expected = false;
				const actual = isContainer(div);

				expect(actual).toBe(expected);
			}
		);

		test('should return true for a configured container id', () => {
			const expected = true;
			const actual = isContainer('test-container');

			expect(actual).toBe(expected);
		});

		test('should return false for a unconfigured container id', () => {
			const expected = false;
			const actual = isContainer('unconfigured-container');

			expect(actual).toBe(expected);
		});
	});

	describe('#getContainerFocusTarget', () => {
		beforeEach(setupContainers);
		afterEach(teardownContainers);

		test(
			'should return the last focused element when enterTo is "last-focused"',
			testScenario(
				scenarios.containerWithDefaultAndLastFocused,
				(root) => {
					configureContainer('container', {
						enterTo: 'last-focused',
						defaultElement: '.spottable-default'
					});

					setContainerLastFocusedElement(root.querySelector('#lastFocused'), ['container']);

					const expected = 'lastFocused';
					const actual = getContainerFocusTarget('container').id;

					expect(actual).toBe(expected);
				}
			)
		);

		test(
			'should return the default spottable element when enterTo is "last-focused" but no element has been focused',
			testScenario(
				scenarios.containerWithDefaultAndLastFocused,
				() => {
					configureContainer('container', {
						enterTo: 'last-focused',
						defaultElement: '.spottable-default'
					});

					const expected = 'spottableDefault';
					const actual = getContainerFocusTarget('container').id;

					expect(actual).toBe(expected);
				}
			)
		);

		test(
			'should return the first spottable element when enterTo is "last-focused" and defaultElement is not configured',
			testScenario(
				scenarios.containerWithDefaultAndLastFocused,
				() => {
					configureContainer('container', {
						enterTo: 'last-focused'
					});

					const expected = 'firstSpottable';
					const actual = getContainerFocusTarget('container').id;

					expect(actual).toBe(expected);
				}
			)
		);

		test(
			'should return the first spottable element when enterTo is "last-focused" and defaultElement is not found',
			testScenario(
				scenarios.containerWithDefaultAndLastFocused,
				() => {
					configureContainer('container', {
						enterTo: 'last-focused',
						// configured, but not found
						defaultElement: '[data-default-spottable]'
					});

					const expected = 'firstSpottable';
					const actual = getContainerFocusTarget('container').id;

					expect(actual).toBe(expected);
				}
			)
		);

		test(
			'should return the default spottable element when enterTo is "default-element"',
			testScenario(
				scenarios.containerWithDefaultAndLastFocused,
				() => {
					configureContainer('container', {
						enterTo: 'default-element',
						defaultElement: '.spottable-default'
					});

					const expected = 'spottableDefault';
					const actual = getContainerFocusTarget('container').id;

					expect(actual).toBe(expected);
				}
			)
		);

		test(
			'should return the default spottable element when enterTo is "default-element" and defaultElement contains an array of selectors',
			testScenario(
				scenarios.containerWithDefaultAndLastFocused,
				() => {
					configureContainer('container', {
						enterTo: 'default-element',
						defaultElement: ['.does-not-exist', '.spottable-default']
					});

					const expected = 'spottableDefault';
					const actual = getContainerFocusTarget('container').id;

					expect(actual).toBe(expected);
				}
			)
		);

		// FIXME: This is testing a previously supported feature (setting a node as defaultElement)
		// which was never documented and should be removed in a future release.
		test(
			'should return the default spottable element when enterTo is "default-element" and defaultElement contains an array of selectors wiht a node reference',
			testScenario(
				scenarios.containerWithDefaultAndLastFocused,
				(root) => {
					configureContainer('container', {
						enterTo: 'default-element',
						defaultElement: [root.querySelector('#lastFocused'), '.spottable-default']
					});

					const expected = 'lastFocused';
					const actual = getContainerFocusTarget('container').id;

					expect(actual).toBe(expected);
				}
			)
		);

		test(
			'should return the first spottable element when enterTo is "default-element" but defaultElement is not configured',
			testScenario(
				scenarios.containerWithDefaultAndLastFocused,
				() => {
					configureContainer('container', {
						enterTo: 'default-element'
					});

					const expected = 'firstSpottable';
					const actual = getContainerFocusTarget('container').id;

					expect(actual).toBe(expected);
				}
			)
		);

		test(
			'should return the first spottable element when enterTo is "default-element" but defaultElement is not found',
			testScenario(
				scenarios.containerWithDefaultAndLastFocused,
				() => {
					configureContainer('container', {
						enterTo: 'default-element',
						defaultElement: '[data-default-spottable]'
					});

					const expected = 'firstSpottable';
					const actual = getContainerFocusTarget('container').id;

					expect(actual).toBe(expected);
				}
			)
		);

		test(
			'should return the default element when enterTo is "default-element" and defaultElement is within a subcontainer',
			testScenario(
				scenarios.complexTree,
				() => {
					configureContainer('first-container', {
						enterTo: 'default-element',
						defaultElement: `[${containerAttribute}='second-container'] > .spottable`
					});
					configureContainer('second-container');

					const expected = 'second-container';
					const actual = getContainerFocusTarget('first-container').parentNode.dataset.spotlightId;

					expect(actual).toBe(expected);
				}
			)
		);

		test(
			'should return the first spottable element when enterTo is "default-element" and defaultElement is within a disabled subcontainer',
			testScenario(
				scenarios.complexTree,
				() => {
					configureContainer('second-container', {
						enterTo: 'default-element',
						defaultElement: `[${containerAttribute}='third-container'] > .spottable`
					});
					configureContainer('third-container');

					const expected = 'secondContainerFirstSpottable';
					const actual = getContainerFocusTarget('second-container').id;

					expect(actual).toBe(expected);
				}
			)
		);

		test(
			'should return the first spottable element when enterTo is not configured',
			testScenario(
				scenarios.containerWithDefaultAndLastFocused,
				() => {
					configureContainer('container');

					const expected = 'firstSpottable';
					const actual = getContainerFocusTarget('container').id;

					expect(actual).toBe(expected);
				}
			)
		);

		test(
			'should return the default element when enterTo is not configured and defaultElement is configured',
			testScenario(
				scenarios.containerWithDefaultAndLastFocused,
				() => {
					configureContainer('container', {
						defaultElement: '.spottable-default'
					});

					const expected = 'spottableDefault';
					const actual = getContainerFocusTarget('container').id;

					expect(actual).toBe(expected);
				}
			)
		);

		test('should cascade search into child containers with', testScenario(
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

				expect(actual).toBe(expected);
			}
		));

		test(
			'should cascade search into child containers when multiple containers have enterTo configured',
			testScenario(
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

					expect(actual).toBe(expected);
				}
			)
		);

		test('should skip empty subcontainers', testScenario(
			scenarios.emptySubcontainer,
			() => {
				configureContainer('container');
				configureContainer('subcontainer');

				const expected = 'afterSubcontainer';
				const actual = getContainerFocusTarget('container').id;

				expect(actual).toBe(expected);
			}
		));

		test('should return null for an unconfigured container', testScenario(
			scenarios.complexTree,
			() => {
				const expected = null;
				const actual = getContainerFocusTarget('first-container');

				expect(actual).toBe(expected);
			}
		));
	});

	describe('#isNavigable', () => {
		beforeEach(setupContainers);
		afterEach(teardownContainers);

		test('should return false a null node', () => {
			const expected = false;
			const actual = isNavigable(null, rootContainerId);

			expect(actual).toBe(expected);
		});

		test(
			'should return true for any node when not verifying selector and without a navigableFilter',
			testScenario(
				scenarios.nonSpottableSiblings,
				(root) => {
					const expected = true;
					const actual = isNavigable(root.querySelector('.other'), rootContainerId);

					expect(actual).toBe(expected);
				}
			)
		);

		test(
			'should return true for spottable children when verifying selector',
			testScenario(
				scenarios.onlySpottables,
				(root) => {
					const expected = true;
					const actual = isNavigable(root.querySelector('.spottable'), rootContainerId, true);

					expect(actual).toBe(expected);
				}
			)
		);

		test('should return true for containers', testScenario(
			scenarios.onlyContainers,
			(root) => {
				const expected = true;
				const actual = isNavigable(root.querySelector(`[${containerAttribute}]`), rootContainerId, true);

				expect(actual).toBe(expected);
			}
		));

		test('should filter the node with navigableFilter', testScenario(
			scenarios.spottableAndContainers,
			(root) => {
				configureContainer(rootContainerId, {
					// test filter which makes containers non-navigable
					navigableFilter: n => !isContainer(n)
				});

				const expected = false;
				const actual = isNavigable(root.querySelector(`[${containerAttribute}]`), rootContainerId, true);

				expect(actual).toBe(expected);
			}
		));
	});

	describe('#setContainerLastFocusedElement', () => {
		beforeEach(setupContainers);
		afterEach(teardownContainers);

		test('should update lastFocusedElement for a single container', testScenario(
			scenarios.onlySpottables,
			(root) => {
				const item = root.querySelectorAll('.spottable').item(3);

				setContainerLastFocusedElement(
					item,
					getContainersForNode(item)
				);

				const expected = item;
				const actual = getContainerConfig(rootContainerId).lastFocusedElement;

				expect(actual).toBe(expected);
			}
		));

		test(
			'should update lastFocusedElement to the node\'s container id when element is within a container with enterTo configured',
			testScenario(
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

					expect(actual).toBe(expected);
				}
			)
		);

		test(
			'should ignore sub-containers that does not have enterTo configured',
			testScenario(
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

					expect(actual).toBe(expected);
				}
			)
		);

		test(
			'should update lastFocusedElement to the first sub-container that has enterTo configured',
			testScenario(
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

					expect(actual).toBe(expected);
				}
			)
		);
	});

	describe('#unmountContainer', () => {
		beforeEach(setupContainers);
		afterEach(teardownContainers);

		test(
			'should return element when last focused is not within a subcontainer with enterTo',
			testScenario(
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

					expect(actual).toBe(expected);
				}
			)
		);

		test(
			'should return container when last focused is within a subcontainer with enterTo',
			testScenario(
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

					expect(actual).toBe(expected);
				}
			)
		);

		test(
			'should save the index of the node when lastFocusedPersist is undefined',
			testScenario(
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

					expect(actual).toBe(expected);
				}
			)
		);

		test(
			'should save a custom key for container-configured lastFocusedPersist',
			testScenario(
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

					expect(actual).toBe(expected);
				}
			)
		);

		test(
			'should save the container id as the key when a container with enterTo configured had the last focused item',
			testScenario(
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

					expect(actual).toBe(expected);
				}
			)
		);

		test(
			'should save the index as the key when last focused item is only within containers without enterTo configured',
			testScenario(
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

					expect(actual).toBe(expected);
				}
			)
		);

		test('should mark the container inactive', testScenario(
			scenarios.complexTree,
			() => {
				addContainer('first-container');
				unmountContainer('first-container');

				const expected = false;
				const actual = getContainerConfig('first-container').active;

				expect(actual).toBe(expected);
			}
		));
	});

	describe('#setLastContainerFromTarget', () => {
		beforeEach(setupContainers);
		afterEach(teardownContainers);

		test(
			'should be nearest restrict="self-only" container to current if target is not within it',
			testScenario(
				scenarios.complexTree,
				(root) => {
					configureContainer('first-container', {
						restrict: 'self-only'
					});
					const current = root.querySelector('[data-spotlight-id="first-container"] .spottable');
					const target = root.querySelector('.spottable');

					setLastContainerFromTarget(current, target);

					const expected = 'first-container';
					const actual = getLastContainer();

					expect(actual).toBe(expected);
				}
			)
		);

		test(
			'should be use nearest container to target if within current container',
			testScenario(
				scenarios.complexTree,
				(root) => {
					configureContainer('first-container', {
						restrict: 'none'
					});
					configureContainer('second-container', {
						restrict: 'none'
					});
					const current = root.querySelector('[data-spotlight-id="first-container"] .spottable');
					const target = root.querySelector('[data-spotlight-id="second-container"] .spottable');

					setLastContainerFromTarget(current, target);

					const expected = 'second-container';
					const actual = getLastContainer();

					expect(actual).toBe(expected);
				}
			)
		);

		test(
			'should target container if it is restrict="self-only" and contains current container',
			testScenario(
				scenarios.complexTree,
				(root) => {
					configureContainer('first-container', {
						restrict: 'self-only'
					});
					configureContainer('second-container', {
						restrict: 'none'
					});
					const current = root.querySelector('[data-spotlight-id="second-container"] .spottable');
					const target = root.querySelector('[data-spotlight-id="first-container"]');

					setLastContainerFromTarget(current, target);

					const expected = 'first-container';
					const actual = getLastContainer();

					expect(actual).toBe(expected);
				}
			)
		);
	});

	describe('#getDefaultContainer', () => {
		beforeEach(setupContainers);
		afterEach(teardownContainers);

		test('should return an empty string when container is inactive', testScenario(
			scenarios.complexTree,
			() => {
				unmountContainer(rootContainerId);

				const expected = '';
				const actual = getDefaultContainer();

				expect(actual).toBe(expected);
			}
		));
	});

	describe('#getLastContainer', () => {
		beforeEach(setupContainers);
		afterEach(teardownContainers);

		test('should return an empty string when container is inactive', testScenario(
			scenarios.complexTree,
			() => {
				addContainer('first-container');
				setLastContainer('first-container');
				unmountContainer('first-container');

				const expected = '';
				const actual = getLastContainer();

				expect(actual).toBe(expected);
			}
		));
	});

	describe('#getAllContainerIds', () => {
		beforeEach(setupContainers);
		afterEach(teardownContainers);

		test('should not include inacive containers', testScenario(
			scenarios.onlyContainers,
			(root) => {
				const {containerId} = root.querySelector('[data-spotlight-id]').dataset;

				addContainer(containerId);
				unmountContainer(containerId);

				const expected = -1;
				const actual = getAllContainerIds().indexOf(containerId);

				expect(actual).toBe(expected);
			}
		));
	});

	describe('#getContainerLastFocusedElement', () => {
		beforeEach(setupContainers);
		afterEach(teardownContainers);

		test('should return null for an invalid container', testScenario(
			scenarios.onlySpottables,
			() => {
				const expected = null;
				const actual = getContainerLastFocusedElement('does-not-exist');

				expect(actual).toBe(expected);
			}
		));
	});

	describe('#getContainerDefaultElement', () => {
		beforeEach(setupContainers);
		afterEach(teardownContainers);

		test('should return null for an invalid container', testScenario(
			scenarios.onlySpottables,
			() => {
				const expected = null;
				const actual = getContainerDefaultElement('does-not-exist');

				expect(actual).toBe(expected);
			}
		));
	});

	describe('#getNavigableContainersForNode', () => {
		beforeEach(setupContainers);
		afterEach(teardownContainers);

		test(
			'should include all containers when none are restrict="self-only"',
			testScenario(
				scenarios.complexTree,
				(root) => {
					const expected = [rootContainerId, 'first-container', 'second-container'];
					const actual = getNavigableContainersForNode(root.querySelector('#secondContainerFirstSpottable'));

					expect(actual).toEqual(expected);
				}
			)
		);

		test(
			'should include all containers within the first restrict="self-only" container (inclusive)',
			testScenario(
				scenarios.complexTree,
				(root) => {
					configureContainer('first-container', {restrict: 'self-only'});

					const expected = ['first-container', 'second-container'];
					const actual = getNavigableContainersForNode(root.querySelector('#secondContainerFirstSpottable'));

					expect(actual).toEqual(expected);
				}
			)
		);
	});

	describe('#getContainerNavigableElements', () => {
		beforeEach(setupContainers);
		afterEach(teardownContainers);

		test(
			'should return an empty array for an unconfigured container',
			testScenario(
				scenarios.complexTree,
				() => {
					const expected = [];
					const actual = getContainerNavigableElements('first-container');

					expect(actual).toEqual(expected);
				}
			)
		);

		test(
			'should return an empty array for a unmounted, configured container',
			testScenario(
				scenarios.onlySpottables,
				() => {
					configureContainer('first-container', {
						overflow: true
					});

					const expected = [];
					const actual = getContainerNavigableElements('first-container');

					expect(actual).toEqual(expected);
				}
			)
		)
	});
});
