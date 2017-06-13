import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';

import {Panels, PanelsBase} from '../Panels';

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

	describe('computed', () => {
		describe('childProps', () => {
			it('should not add aria-owns when noCloseButton is true', () => {
				const id = 'id';
				const childProps = {};
				const props = {
					childProps,
					noCloseButton: true,
					id
				};

				const expected = childProps;
				const actual = PanelsBase.computed.childProps(props);

				expect(actual).to.equal(expected);
			});

			it('should not add aria-owns when id is not set', () => {
				const childProps = {};
				const props = {
					childProps,
					noCloseButton: false
				};

				const expected = childProps;
				const actual = PanelsBase.computed.childProps(props);

				expect(actual).to.equal(expected);
			});

			it('should add aria-owns', () => {
				const id = 'id';
				const childProps = {};
				const props = {
					childProps,
					noCloseButton: false,
					id
				};

				const expected = `${id}_close`;
				const actual = PanelsBase.computed.childProps(props)['aria-owns'];

				expect(actual).to.equal(expected);
			});

			it('should append aria-owns', () => {
				const id = 'id';
				const ariaOwns = ':allthethings:';
				const childProps = {
					'aria-owns': ariaOwns
				};
				const props = {
					childProps,
					noCloseButton: false,
					id
				};

				const expected = `${ariaOwns} ${id}_close`;
				const actual = PanelsBase.computed.childProps(props)['aria-owns'];

				expect(actual).to.equal(expected);
			});
		});
	});
});
