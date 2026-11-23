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
	getDeepSpottableDescendants,
	getDefaultContainer,
	getLastContainer,
	getNavigableContainersForNode,
	getPositionTargetOnFocus,
	getSpottableDescendants,
	isContainer,
	isContainer5WayHoldable,
	isNavigable,
	notifyEnterContainer,
	notifyLeaveContainer,
	notifyLeaveContainerFail,
	unmountContainer,
	removeContainer,
	removeAllContainers,
	rootContainerId,
	setContainerLastFocusedElement,
	setDefaultContainer,
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
			spottable({id: 'afterSubcontainer'})
		)
	}),
	owned: join(
		spottable({id: 's1'}),
		node({id: 'n1'}),
		container({
			[containerAttribute]: 'container',
			'aria-owns': 's1 n1',
			children: spottable({id: 's2'})
		})
	),
	positionTargetOnFocusContainer: container({
		id: 'positionTargetContainer',
		[containerAttribute]: 'positionTargetContainer',
		children: join(
			container({
				[containerAttribute]: 'child',
				id: 'spottableDefault',
				className: 'spottable-default',
				children: join(
					spottable({id: 'firstChildSpottable'})
				)
			})
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

		test('should include owned nodes', testScenario(
			scenarios.owned,
			() => {
				configureContainer('container');

				// owned nodes follow internal nodes
				const expected = ['s2', 's1'];
				const actual = getSpottableDescendants('container').map(n => n.getAttribute('id'));

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
			'should return the default spottable element when enterTo is "default-element" and defaultElement contains an array of selectors with a node reference',
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

		test('should not include inactive containers', testScenario(
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
			'should return an empty array for an unmounted, configured container',
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
		);
	});

	describe('#getPositionTargetOnFocus', () => {
		beforeEach(setupContainers);
		afterEach(teardownContainers);

		test(
			'should return a container that has positionTargetOnFocus configured',
			testScenario(
				scenarios.positionTargetOnFocusContainer,
				(root) => {
					configureContainer('positionTargetContainer', {
						positionTargetOnFocus: true
					});
					configureContainer('child', {
						enterTo: 'last-focused'
					});

					const expected = root.querySelector('#positionTargetContainer');
					const actual = getPositionTargetOnFocus(root.querySelector('#firstChildSpottable'));

					expect(actual).toEqual(expected);
				}
			)
		);
	});
});

describe('container notifications and state', () => {
	afterEach(() => {
		removeAllContainers();
	});

	describe('#notifyLeaveContainer', () => {
		test('should notify only the containers that focus is leaving', () => {
			const handleLeaveFirst = jest.fn();
			const handleLeaveShared = jest.fn();
			addContainer('first', {onLeaveContainer: handleLeaveFirst});
			addContainer('shared', {onLeaveContainer: handleLeaveShared});
			const current = document.createElement('div');
			const next = document.createElement('div');

			notifyLeaveContainer('right', current, ['shared', 'first'], next, ['shared', 'second']);

			expect(handleLeaveFirst).toHaveBeenCalledWith({type: 'onLeaveContainer', direction: 'right', target: current, relatedTarget: next});
			expect(handleLeaveShared).not.toHaveBeenCalled();
		});
	});

	describe('#notifyLeaveContainerFail', () => {
		test('should notify every container of the element that focus could not leave', () => {
			const handleFailInner = jest.fn();
			const handleFailOuter = jest.fn();
			addContainer('inner', {onLeaveContainerFail: handleFailInner});
			addContainer('outer', {onLeaveContainerFail: handleFailOuter});
			const current = document.createElement('div');

			notifyLeaveContainerFail('up', current, ['outer', 'inner', 'unconfigured']);

			expect(handleFailInner).toHaveBeenCalledWith({type: 'onLeaveContainerFail', direction: 'up', target: current});
			expect(handleFailOuter).toHaveBeenCalledWith({type: 'onLeaveContainerFail', direction: 'up', target: current});
		});
	});

	describe('#notifyEnterContainer', () => {
		test('should notify only the containers that focus is entering', () => {
			const handleEnterSecond = jest.fn();
			const handleEnterShared = jest.fn();
			addContainer('second', {onEnterContainer: handleEnterSecond});
			addContainer('shared', {onEnterContainer: handleEnterShared});
			const previous = document.createElement('div');
			const current = document.createElement('div');

			notifyEnterContainer('right', previous, ['shared', 'first'], current, ['shared', 'second']);

			expect(handleEnterSecond).toHaveBeenCalledWith({type: 'onEnterContainer', direction: 'right', target: current, relatedTarget: previous});
			expect(handleEnterShared).not.toHaveBeenCalled();
		});
	});

	describe('#isContainer5WayHoldable', () => {
		test('should report whether a container continues 5-way hold', () => {
			addContainer('holding', {continue5WayHold: true});
			addContainer('notHolding', {});

			expect(isContainer5WayHoldable('holding')).toBe(true);
			expect(isContainer5WayHoldable('notHolding')).toBe(false);
			expect(isContainer5WayHoldable('missing')).toBe(false);
		});
	});

	describe('#setDefaultContainer', () => {
		afterEach(() => {
			setDefaultContainer();
		});

		test('should set an existing container as the default one', () => {
			addContainer('defaultContainer', {});

			setDefaultContainer('defaultContainer');

			expect(getDefaultContainer()).toBe('defaultContainer');
		});

		test('should throw for a container that does not exist', () => {
			expect(() => setDefaultContainer('missing')).toThrow('Container "missing" doesn\'t exist!');
		});

		test('should clear the default container when none is given', () => {
			addContainer('defaultContainer', {});
			setDefaultContainer('defaultContainer');

			setDefaultContainer();

			expect(getDefaultContainer()).toBe('');
		});
	});

	describe('#unmountContainer', () => {
		test('should restore the last focused element by its position after the container is mounted again', testScenario(
			scenarios.onlySpottables,
			(root) => {
				addContainer('remounted', {});
				root.setAttribute(containerAttribute, 'remounted');
				const spottables = root.querySelectorAll('.spottable');
				setContainerLastFocusedElement(spottables[2], ['remounted']);

				unmountContainer('remounted');
				expect(getContainerConfig('remounted').lastFocusedElement).toBeNull();

				// Restoring is deferred until spotlight asks the container for its focus target
				getContainerFocusTarget('remounted');

				expect(getContainerLastFocusedElement('remounted')).toBe(spottables[2]);
			}
		));

		test('should forget a default element that is a node but keep a selector', () => {
			const defaultNode = document.createElement('div');
			addContainer('nodeDefault', {defaultElement: defaultNode});
			addContainer('selectorDefault', {defaultElement: '.spottable'});

			unmountContainer('nodeDefault');
			unmountContainer('selectorDefault');

			expect(getContainerConfig('nodeDefault').defaultElement).toBeNull();
			expect(getContainerConfig('selectorDefault').defaultElement).toBe('.spottable');
		});
	});

	describe('#getDeepSpottableDescendants', () => {
		test('should skip the spottables of excluded containers', testScenario(
			scenarios.siblingContainers,
			(root) => {
				addContainer('outer', {});
				root.setAttribute(containerAttribute, 'outer');
				addContainer('first', {});
				addContainer('second', {});

				const all = getDeepSpottableDescendants('outer');
				const withoutFirst = getDeepSpottableDescendants('outer', ['first']);

				expect(all).toHaveLength(10);
				expect(withoutFirst).toHaveLength(5);
				expect(withoutFirst.every((el) => root.querySelector(`[${containerAttribute}="second"]`).contains(el))).toBe(true);
			}
		));
	});

	describe('#getContainerNavigableElements on an overflow container', () => {
		const setRect = (el, top) => {
			el.getBoundingClientRect = () => ({top, bottom: top + 10, left: 0, right: 10, width: 10, height: 10});
		};

		test('should only offer the elements that are fully visible in the container', testScenario(
			scenarios.onlySpottables,
			(root) => {
				addContainer('overflowing', {overflow: true});
				root.setAttribute(containerAttribute, 'overflowing');
				root.getBoundingClientRect = () => ({top: 0, bottom: 25, left: 0, right: 100, width: 100, height: 25});
				const spottables = [...root.querySelectorAll('.spottable')];
				spottables.forEach((el, index) => setRect(el, index * 10));

				const actual = getContainerNavigableElements('overflowing');

				// Only the first two (0-10 and 10-20) fit in the 25px tall container
				expect(actual).toEqual(spottables.slice(0, 2));
			}
		));

		test('should offer the topmost visible element first for `topmost`', testScenario(
			scenarios.onlySpottables,
			(root) => {
				addContainer('overflowing', {overflow: true});
				root.setAttribute(containerAttribute, 'overflowing');
				root.getBoundingClientRect = () => ({top: 0, bottom: 100, left: 0, right: 100, width: 100, height: 100});
				const spottables = [...root.querySelectorAll('.spottable')];
				// Positioned bottom to top
				spottables.forEach((el, index) => setRect(el, 80 - index * 20));

				const actual = getContainerNavigableElements('overflowing', 'topmost');

				expect(actual[0]).toBe(spottables[4]);
			}
		));
	});
});
