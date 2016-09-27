import React from 'react';
import {shallow, mount} from 'enzyme';
import Spotlight from '../spotlight';
import {Spottable, spottableClass} from '../spottable';
import SpotlightContainerDecorator from '../container';
import {SpotlightFocusableDecorator, focusableClass} from '../focusable';

describe('Focusable Specs', () => {

	it('Should pass focus and blur event handlers to Wrapped', function () {
		Spotlight.initialize();

		const DivComponent = () => <div>focus</div>;

		const FocusableDiv = SpotlightFocusableDecorator(DivComponent);
		const wrapped = shallow(<FocusableDiv />);

		const expectedFocus = 'onFocus';
		const expectedBlur = 'onBlur';
		const expectedKeyDown = 'onKeyDown';
		const actual = wrapped.find('DivComponent').props();
		const expectedType = 'function';

		expect(actual).to.have.property(expectedFocus).to.be.a(expectedType);
		expect(actual).to.have.property(expectedBlur).to.be.a(expectedType);
		expect(actual).to.not.have.property(expectedKeyDown);
		Spotlight.terminate();
	});

	it('Should pass keydown event handlers to Wrapped', function () {
		Spotlight.initialize();

		const DivComponent = () => <div>focus</div>;

		const FocusableDiv = SpotlightFocusableDecorator({useEnterKey: true}, DivComponent);
		const wrapped = shallow(<FocusableDiv />);

		const expected = 'onKeyDown';
		const actual = wrapped.find('DivComponent').props();
		const expectedType = 'function';

		expect(actual).to.have.property(expected).to.be.a(expectedType);
		Spotlight.terminate();
	});

	it('Should add and remove the \'focused\' and \'spottable\' inner-outer className props on events', function () {
		Spotlight.initialize();

		const InnerDiv = ({onBlur}) => <div data-spot-decorated={true} onBlur={onBlur}>component</div>;
		const OuterDiv = ({children, onFocus}) => <div onFocus={onFocus} children={children} />;

		const InnerSpottableComponent = Spottable(InnerDiv);

		const FocusableDiv = ({onFocus, onBlur, spotlightDisabled}) => {
			return (
				<OuterDiv onFocus={onFocus} spotlightDisabled={spotlightDisabled}>
					<InnerSpottableComponent onBlur={onBlur} spotlightDisabled={!spotlightDisabled} className={'inner-class'} decorated />
				</OuterDiv>
			);
		}
		const FocusableComponent = SpotlightContainerDecorator(SpotlightFocusableDecorator(Spottable(FocusableDiv)));
		
		const wrapped = mount(<FocusableComponent />);
		wrapped.find('FocusableDiv').simulate('focus');

		const actualPreBlurInnerClass = wrapped.find('InnerDiv').prop('className');
		const actualPreBlurOuterClass = wrapped.find('FocusableDiv').prop('className');
		wrapped.find('InnerDiv').simulate('blur');

		const actualPostBlurInnerClass = wrapped.find('InnerDiv').prop('className');
		const actualPostBlurOuterClass = wrapped.find('FocusableDiv').prop('className');

		expect(actualPreBlurInnerClass).to.contain(spottableClass);
		expect(actualPreBlurOuterClass).to.contain(focusableClass).and.not.contain(spottableClass);
		expect(actualPostBlurInnerClass).to.not.contain(spottableClass);
		expect(actualPostBlurOuterClass).to.contain(spottableClass).and.not.contain(focusableClass);
		Spotlight.terminate();
	});
});
