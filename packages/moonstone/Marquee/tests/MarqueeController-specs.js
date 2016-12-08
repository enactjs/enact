import React from 'react';
import {mount} from 'enzyme';
import {MarqueeController} from '../index.js';
import {Spottable} from '@enact/spotlight';

const SpottableDiv = Spottable('div');
const ControllerDiv = MarqueeController('div');

describe('Marquee Controller', () => {

	it('should receive focus from Spottable', function () {
		const subject = mount(
			<ControllerDiv>
				<SpottableDiv>Spot Here</SpottableDiv>
			</ControllerDiv>
		);

		subject.find('Spottable').simulate('focus');
		const expected = true;
		const actual = subject.state('isSpotted');
		expect(actual).to.equal(expected);
	});

	it('should receive blue from Spottable', function () {
		const subject = mount(
			<ControllerDiv>
				<SpottableDiv>Spot Here</SpottableDiv>
			</ControllerDiv>
		);

		subject.find('Spottable').simulate('focus');
		subject.find('Spottable').simulate('blur');

		const expected = false;
		const actual = subject.state('isSpotted');
		expect(actual).to.equal(expected);
	});

});
