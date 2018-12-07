import React from 'react';
import {mount} from 'enzyme';

import {Panels, PanelsBase} from '../Panels';

const tap = (node) => {
	node.simulate('mousedown');
	node.simulate('mouseup');
};

describe('Panels Specs', () => {

	test(
		'should render application close button when \'noCloseButton\' is not specified',
		() => {
			const panels = mount(
				<Panels />
			);

			const applicationCloseButton = panels.find('IconButton');
			const expected = 1;
			const actual = applicationCloseButton.length;

			expect(actual).toBe(expected);
		}
	);

	test(
		'should not render application close button when \'noCloseButton\' is set to true',
		() => {
			const panels = mount(
				<Panels noCloseButton />
			);

			const applicationCloseButton = panels.find('IconButton');
			const expected = 0;
			const actual = applicationCloseButton.length;

			expect(actual).toBe(expected);
		}
	);

	test(
		'should call onApplicationClose when application close button is clicked',
		() => {
			const handleAppClose = jest.fn();
			const subject = mount(
				<Panels onApplicationClose={handleAppClose} />
			);

			tap(subject.find('IconButton'));

			const expected = 1;
			const actual = handleAppClose.mock.calls.length;

			expect(expected).toBe(actual);
		}
	);

	test(
		'should set application close button "aria-label" to closeButtonAriaLabel',
		() => {
			const label = 'custom close button label';
			const panels = mount(
				<Panels closeButtonAriaLabel={label} />
			);

			const expected = label;
			const actual = panels.find('IconButton').prop('aria-label');

			expect(actual).toBe(expected);
		}
	);

	describe('computed', () => {
		describe('childProps', () => {
			test('should not add aria-owns when noCloseButton is true', () => {
				const id = 'id';
				const childProps = {};
				const props = {
					childProps,
					noCloseButton: true,
					id
				};

				const expected = childProps;
				const actual = PanelsBase.computed.childProps(props);

				expect(actual).toBe(expected);
			});

			test('should not add aria-owns when id is not set', () => {
				const childProps = {};
				const props = {
					childProps,
					noCloseButton: false
				};

				const expected = childProps;
				const actual = PanelsBase.computed.childProps(props);

				expect(actual).toBe(expected);
			});

			test('should add aria-owns', () => {
				const id = 'id';
				const childProps = {};
				const props = {
					childProps,
					noCloseButton: false,
					id
				};

				const expected = `${id}_close`;
				const actual = PanelsBase.computed.childProps(props)['aria-owns'];

				expect(actual).toBe(expected);
			});

			test('should append aria-owns', () => {
				const id = 'id';
				const ariaOwns = ':allthethings:';
				const childProps = {
					'aria-owns': ariaOwns
				};
				const props = {
					childProps,
					noCloseButton: false,
					id
				};

				const expected = `${ariaOwns} ${id}_close`;
				const actual = PanelsBase.computed.childProps(props)['aria-owns'];

				expect(actual).toBe(expected);
			});
		});
	});
});
