import React from 'react';
import {shallow} from 'enzyme';
import Spottable from '../spottable';

describe('Spottable Specs', () => {

	it('should render a single spottable \<div\> tag', function () {
		const msg = 'Spottable Div';
		const SpottableDiv = Spottable('div');
		const div = shallow(
			<SpottableDiv>{msg}</SpottableDiv>
		);

		const divTag = div.find('div');
		const expected = 1;
		const actual = divTag.length;

		expect(actual).to.equal(expected);
	});

	it('Should pass the className value \'spottable\' to Wrapped', function () {
		const DivComponent = () => <div>spottable</div>;

		const SpottableDiv = Spottable(DivComponent);
		const wrapped = shallow(<SpottableDiv />);

		const expected = 'spottable';
		const actual = wrapped.find('DivComponent').prop('className');

		expect(actual).to.equal(expected);
	});

	it('Should pass the tabIndex value \'-1\' to Wrapped', function () {
		const DivComponent = () => <div>spottable</div>;

		const SpottableDiv = Spottable(DivComponent);
		const wrapped = shallow(<SpottableDiv />);

		const expected = -1;
		const actual = wrapped.find('DivComponent').prop('tabIndex');

		expect(actual).to.equal(expected);
	});

	it('Should pass decorated prop value \'true\' to Wrapped', function () {
		const DivComponent = () => <div>spottable</div>;

		const SpottableDiv = Spottable(DivComponent);
		const wrapped = shallow(<SpottableDiv decorated={true} />);

		const expected = true;
		const actual = wrapped.find('DivComponent').prop('data-spot-decorated');

		expect(actual).to.equal(expected);
	});

	it('Should pass key event handlers to Wrapped', function () {
		const DivComponent = () => <div>spottable</div>;

		const SpottableDiv = Spottable(DivComponent);
		const wrapped = shallow(<SpottableDiv />);

		const expectedKeyDown = 'onKeyDown';
		const expectedKeyPress = 'onKeyPress';
		const expectedKeyUp = 'onKeyUp';
		const actual = wrapped.find('DivComponent').props();
		const expectedType = 'function';

		expect(actual).to.have.property(expectedKeyDown).to.be.a(expectedType);
		expect(actual).to.have.property(expectedKeyPress).to.be.a(expectedType);
		expect(actual).to.have.property(expectedKeyUp).to.be.a(expectedType);
	});

	it('Should not pass key event handlers to Wrapped', function () {
		const DivComponent = () => <div>spottable</div>;

		const SpottableDiv = Spottable({emulateMouse: false}, DivComponent);
		const wrapped = shallow(<SpottableDiv />);

		const expectedKeyDown = 'onKeyDown';
		const expectedKeyPress = 'onKeyPress';
		const expectedKeyUp = 'onKeyUp';
		const actual = wrapped.find('DivComponent').props();
		const expectedType = 'function';

		expect(actual).to.not.have.property(expectedKeyDown);
		expect(actual).to.not.have.property(expectedKeyPress);
		expect(actual).to.not.have.property(expectedKeyUp);
	});
});
