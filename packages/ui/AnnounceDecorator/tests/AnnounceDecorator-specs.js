import React from 'react';
import {shallow} from 'enzyme';
import AnnounceDecorator from '../AnnounceDecorator';

describe('AnnounceDecorator', () => {

	// no-op wrapper
	const Div = () => <div />;

	it('should pass a function in the announce prop', function () {
		const Component = AnnounceDecorator(Div);
		const subject = shallow(
			<Component />
		);

		const expected = 'function';
		const actual = typeof subject.prop('announce');

		expect(actual).to.equal(expected);
	});

	it('should allow prop to be configured for announce function', function () {
		const prop = '__NOTIFY__';
		const Component = AnnounceDecorator({prop}, Div);
		const subject = shallow(
			<Component />
		);

		const expected = 'function';
		const actual = typeof subject.prop(prop);

		expect(actual).to.equal(expected);

	});

});
