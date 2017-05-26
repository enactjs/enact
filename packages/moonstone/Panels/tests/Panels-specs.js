import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';

import Panels, {PanelsBase} from '../Panels';
import css from '../Panels.less';

describe('Panels Specs', () => {

	it('should render application close button when \'noCloseButton\' is not specified', function () {
		const panels = mount(
			<Panels />
		);

		const applicationCloseButton = panels.find('IconButton');
		const expected = 1;
		const actual = applicationCloseButton.length;

		expect(actual).to.equal(expected);
	});

	it('should not render application close button when \'noCloseButton\' is set to true', function () {
		const panels = mount(
			<Panels noCloseButton />
		);

		const applicationCloseButton = panels.find('IconButton');
		const expected = 0;
		const actual = applicationCloseButton.length;

		expect(actual).to.equal(expected);
	});

	it('should call onApplicationClose when application close button is clicked', function () {
		const handleAppClose = sinon.spy();
		const subject = mount(
			<Panels onApplicationClose={handleAppClose} />
		);

		subject.find('IconButton').simulate('click');

		const expected = true;
		const actual = handleAppClose.calledOnce;

		expect(expected).to.equal(actual);
	});

});
