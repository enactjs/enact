import React from 'react';
import {shallow, mount} from 'enzyme';
import Spotlight from '../spotlight';
import {Spottable} from '../spottable';
import {SpotlightContainerDecorator} from '../container';
import {SpotlightFocusableDecorator} from '../focusable';

describe('Focusable Specs', () => {

	it('Should pass focus event handlers to Wrapped', function () {
		Spotlight.initialize();

		const DivComponent = () => <div>focus</div>;

		const FocusableDiv = SpotlightFocusableDecorator(DivComponent);
		const wrapped = shallow(<FocusableDiv />);

		const expectedFocus = 'onFocus';
		const expectedBlur = 'onBlur';
		const actual = wrapped.find('DivComponent').props();
		const expectedType = 'function';

		expect(actual).to.have.property(expectedFocus).to.be.a(expectedType);
		expect(actual).to.have.property(expectedBlur).to.be.a(expectedType);
		Spotlight.terminate();
	});

	it('Should change the className value to \'focused\' on event', function () {
		Spotlight.initialize();

		const DivComponent = ({onFocus}) =>
			<div onFocus={onFocus}>focus</div>;

		const FocusableDiv = SpotlightFocusableDecorator(Spottable(DivComponent));
		const wrapped = mount(<FocusableDiv />);
		wrapped.find('DivComponent').simulate('focus');

		const expected = 'focused';
		const actual = wrapped.find('DivComponent').prop('className');

		expect(actual).to.equal(expected);
		Spotlight.terminate();
	});
});
