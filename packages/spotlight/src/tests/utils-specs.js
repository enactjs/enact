import {
	getPointRect,
	getContainerRect,
	isStandardFocusable
} from '../utils';

import {
	node,
	testScenario
} from './utils';

const focusable = (props) => {
	if (!props) {
		props = {};
	}

	let nodeObject = {
		id: 'child',
		tabindex: 0
	};

	Object.keys(props).forEach(key => {
		nodeObject[key] = props[key];
	});

	return node(nodeObject);
};

const scenarios = {
	tabIndexMinusOne: node({id: 'child', tabindex: -1}),
	focusable: focusable(),
	button: focusable({tag: 'button'}),
	buttonWithDisabled: focusable({tag: 'button', valueOnlyAttribute: 'disabled'}),
	link: focusable({tag: 'a', href: 'www.enactjs.com'}),
	input: focusable({tag: 'input'})
};

describe('utils', () => {
	describe('#getPointRect', () => {
		test('should return an rect value calculated based on given position', () => {
			const expected = {
				left: 10,
				top: 20,
				width: 0,
				height: 0,
				right: 10,
				bottom: 20,
				center: {
					x: 10,
					y: 20,
					left: 10,
					right: 10,
					top: 20,
					bottom: 20
				}
			};
			const actual = getPointRect({x: 10, y:20});

			expect(actual).toEqual(expected);
		});
	});

	describe('#getContainerRect', () => {
		test('should return an viewPort rect value when container is document', () => {
			const innerWidth = window.innerWidth;
			const innerHeight = window.innerHeight;

			const actual = getContainerRect('spotlightRootDecorator');
			const expected = {
				left: 0,
				top: 0,
				width: innerWidth,
				height: innerHeight,
				right: innerWidth,
				bottom: innerHeight,
				center: {
					x: innerWidth / 2,
					y: innerHeight / 2,
					left: innerWidth / 2,
					right: innerWidth / 2,
					top: innerHeight / 2,
					bottom: innerHeight / 2
				}
			};
			expect(actual).toEqual(expected);
		});
	});

	describe('#isStandardFocusable', () => {
		beforeEach(() => {
			global.Element.prototype.getBoundingClientRect = jest.fn(() => {
				return {
					height: 100,
					width: 100
				};
			});
		});

		test('should return false if tabIndex < 0', testScenario(
			scenarios.tabIndexMinusOne,
			(root) => {
				const child = root.querySelector('#child');

				const expected = false;
				const actual = isStandardFocusable(child);

				expect(actual).toEqual(expected);
			}
		));

		test('should return false if hidden', testScenario(
			scenarios.focusable,
			(root) => {
				const child = root.querySelector('#child');
				child.getBoundingClientRect = jest.fn(() => {
					return {
						height: 0,
						width: 0
					};
				});

				const expected = false;
				const actual = isStandardFocusable(child);

				expect(actual).toEqual(expected);
			}
		));

		test('should return true if button tag', testScenario(
			scenarios.button,
			(root) => {
				const child = root.querySelector('#child');

				const expected = true;
				const actual = isStandardFocusable(child);

				expect(actual).toEqual(expected);
			}
		));

		test('should return false if button tag with disabled', testScenario(
			scenarios.buttonWithDisabled,
			(root) => {
				const child = root.querySelector('#child');

				const expected = false;
				const actual = isStandardFocusable(child);

				expect(actual).toEqual(expected);
			}
		));

		test('should return true if A tag with href', testScenario(
			scenarios.link,
			(root) => {
				const child = root.querySelector('#child');

				const expected = true;
				const actual = isStandardFocusable(child);

				expect(actual).toEqual(expected);
			}
		));

		test('should return true if input tag', testScenario(
			scenarios.input,
			(root) => {
				const child = root.querySelector('#child');

				const expected = true;
				const actual = isStandardFocusable(child);

				expect(actual).toEqual(expected);
			}
		));
	});
});
