import {mount} from 'enzyme';
import React from 'react';

import Spottable from '../Spottable';

describe('Spottable', () => {

	test('should add the spottable class', () => {
		const Component = Spottable('div');

		const subject = mount(
			<Component />
		);

		const expected = 'spottable';
		const actual = subject.find('div').prop('className');

		expect(actual).toEqual(expected);
	});

	test('should add the spottable class to a {disabled} component', () => {
		const Component = Spottable('div');

		const subject = mount(
			<Component disabled />
		);

		const expected = 'spottable';
		const actual = subject.find('div').prop('className');

		expect(actual).toEqual(expected);
	});

	test('should not add the spottable class to a {spotlightDisabled} component', () => {
		const Component = Spottable('div');

		const subject = mount(
			<Component spotlightDisabled />
		);

		const expected = 'spottable';
		const actual = subject.find('div').prop('className');

		expect(actual).not.toEqual(expected);
	});

	test('should emit {onSpotlightDisappear} when unmounted while focused', () => {
		const spy = jest.fn();
		const Component = Spottable('div');

		const subject = mount(
			<Component onSpotlightDisappear={spy} />
		);

		subject.simulate('focus');
		subject.unmount();

		const expected = 1;
		const actual = spy.mock.calls.length;

		expect(actual).toEqual(expected);
	});

	describe('shouldComponentUpdate', () => {
		test('should re-render when a non-Spottable prop changes', () => {
			const spy = jest.fn((props) => <div {...props} />);
			const Component = Spottable(spy);

			const subject = mount(
				<Component />
			);

			subject.setProps({
				'data-id': '123'
			});

			const expected = 2;
			const actual = spy.mock.calls.length;

			expect(actual).toEqual(expected);
		});

		test('should re-render when {selectionKeys} changes', () => {
			const spy = jest.fn((props) => <div {...props} />);
			const Component = Spottable(spy);

			const subject = mount(
				<Component selectionKeys={[1, 2, 3]} />
			);

			subject.setProps({
				selectionKeys: [2, 1, 3]
			});

			const expected = 2;
			const actual = spy.mock.calls.length;

			expect(actual).toEqual(expected);
		});

		test('should not re-render when focused', () => {
			const spy = jest.fn((props) => <div {...props} />);
			const Component = Spottable(spy);

			const subject = mount(
				<Component />
			);

			subject.simulate('focus');

			const expected = 1;
			const actual = spy.mock.calls.length;

			expect(actual).toEqual(expected);
		});
	});
});
