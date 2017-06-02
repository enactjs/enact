/* eslint-disable enact/prop-types */
import React from 'react';
import {shallow} from 'enzyme';
import TransitionGroup from '../TransitionGroup';
import css from '../TransitionGroup.less';

describe('TransitionGroup', () => {
	it('should have transitioning class when transitioning is true and is Viewport', function () {
		const subject = shallow(
			<TransitionGroup>
				<div>Item</div>
			</TransitionGroup>
		);

		subject.setState({transitioning: true});

		const expected = true;
		const actual = subject.hasClass(css.transitioning);

		expect(expected).to.equal(actual);
	});

	it('should not have transitioning class when transitioning is true and is Viewport', function () {
		const subject = shallow(
			<TransitionGroup>
				<div>Item</div>
			</TransitionGroup>
		);

		subject.setState({transitioning: false});

		const expected = false;
		const actual = subject.hasClass(css.transitioning);

		expect(expected).to.equal(actual);
	});

});
