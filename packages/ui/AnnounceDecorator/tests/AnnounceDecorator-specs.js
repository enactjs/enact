import React from 'react';
import {shallow} from 'enzyme';
import AnnounceDecorator from '../AnnounceDecorator';

describe('AnnounceDecorator', () => {

	// no-op wrapper
	const Div = () => <div />;

	test('should pass a function in the announce prop', () => {
		const Component = AnnounceDecorator(Div);
		const subject = shallow(
			<Component />
		);

		const expected = 'function';
		const actual = typeof subject.prop('announce');

		expect(actual).toBe(expected);
	});

	test('should allow prop to be configured for announce function', () => {
		const prop = '__NOTIFY__';
		const Component = AnnounceDecorator({prop}, Div);
		const subject = shallow(
			<Component />
		);

		const expected = 'function';
		const actual = typeof subject.prop(prop);

		expect(actual).toBe(expected);

	});

});
