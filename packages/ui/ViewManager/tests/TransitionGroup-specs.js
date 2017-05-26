/* eslint-disable enact/prop-types */
import React from 'react';
import {shallow} from 'enzyme';
import TransitionGroup from '../TransitionGroup';
import css from '../TransitionGroup.less';
import ViewportCSS from '../../../moonstone/Panels/Panels.less';

describe('TransitionGroup', () => {
	it('should have transitioning class when transitioning is true and is Viewport', function () {
		const subject = shallow(
			<TransitionGroup className={ViewportCSS.viewport}>
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
			<TransitionGroup className={ViewportCSS.viewport}>
				<div>Item</div>
			</TransitionGroup>
		);

		subject.setState({transitioning: false});

		const expected = false;
		const actual = subject.hasClass(css.transitioning);

		expect(expected).to.equal(actual);
	});

	it('should not have transitioning class when transitioning is true and is not Viewport', function () {
		const subject = shallow(
			<TransitionGroup className="some-class">
				<div>Item</div>
			</TransitionGroup>
		);

		subject.setState({transitioning: true});

		const expected = false;
		const actual = subject.hasClass(css.transitioning);

		expect(expected).to.equal(actual);
	});
});
