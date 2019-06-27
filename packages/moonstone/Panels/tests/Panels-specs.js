import React from 'react';
import {mount} from 'enzyme';

import {Panels, PanelsBase} from '../Panels';

const tap = (node) => {
	node.simulate('mousedown');
	node.simulate('mouseup');
};

// 2019-04-11 - Skipped tests here are avoiding a Hooks testing issue. At this time, enzyme does not
// properly test hooks, specifically the useCallback method.

describe('Panels Specs', () => {

	test.skip(
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

	test.skip(
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

	test.skip(
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

	test.skip(
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

	test.skip(
		'should set {autoFocus} on child to "default-element" on first render',
		() => {
			// eslint-disable-next-line enact/prop-types
			const Panel = ({autoFocus, id}) => <div id={id}>{autoFocus}</div>;
			const panels = mount(
				<Panels index={0}>
					<Panel id="p1" />
					<Panel id="p2" />
				</Panels>
			);

			const expected = 'default-element';
			const actual = panels.find('Panel').prop('autoFocus');

			expect(actual).toBe(expected);
		}
	);

	test.skip(
		'should set {autoFocus} on child to "default-element" when navigating to a higher index',
		() => {
			// eslint-disable-next-line enact/prop-types
			const Panel = ({autoFocus, id}) => <div id={id}>{autoFocus}</div>;
			const panels = mount(
				<Panels index={0}>
					<Panel id="p1" />
					<Panel id="p2" />
				</Panels>
			);

			panels.setProps({
				index: 1
			});

			const expected = 'default-element';
			const actual = panels.find('Panel').prop('autoFocus');

			expect(actual).toBe(expected);
		}
	);

	test.skip(
		'should not set {autoFocus} on child when navigating to a higher index when it has an autoFocus prop set',
		() => {
			// eslint-disable-next-line enact/prop-types
			const Panel = ({autoFocus, id}) => <div id={id}>{autoFocus}</div>;
			const panels = mount(
				<Panels index={0}>
					<Panel id="p1" />
					<Panel id="p2" autoFocus="last-focused" />
				</Panels>
			);

			panels.setProps({
				index: 1
			});

			const expected = 'last-focused';
			const actual = panels.find('Panel').prop('autoFocus');

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
