/* eslint-disable react/jsx-no-bind */

import React from 'react';
import PropTypes from 'prop-types';
import kind from '@enact/core/kind';
import {mount} from 'enzyme';
import BreadcrumbDecorator from '../BreadcrumbDecorator';
import Panels from '../Panels';

describe('BreadcrumbDecorator', () => {

	const CustomBreadcrumb = kind({
		name: 'CustomBreadcrumb',

		propsTypes: {
			index: PropTypes.number,
			onSelect: PropTypes.func
		},

		render: ({index, onSelect}) => {	// eslint-disable-line enact/prop-types
			const handleSelect = () => onSelect({index});
			return <span onClick={handleSelect}>{index}</span>;
		}
	});

	const Panel = () => <div />;

	it('should wrap primitive breadcrumbs with Breadcrumb', function () {
		const SingleBreadcrumbPanels = BreadcrumbDecorator({
			max: 1
		}, Panels);

		const subject = mount(
			<SingleBreadcrumbPanels index={2} breadcrumbs={['1st', '2nd', '3rd']}>
				<Panel />
				<Panel />
				<Panel />
			</SingleBreadcrumbPanels>
		);

		const expected = '2nd';
		const actual = subject.find('Breadcrumb').text();

		expect(actual).to.equal(expected);
	});

	it('should support custom breadcrumbs', function () {
		const SingleBreadcrumbPanels = BreadcrumbDecorator({
			max: 1
		}, Panels);

		const breadcrumbs = [0, 1, 2].map(i => <CustomBreadcrumb index={i} />);

		const subject = mount(
			<SingleBreadcrumbPanels index={2} breadcrumbs={breadcrumbs}>
				<Panel />
				<Panel />
				<Panel />
			</SingleBreadcrumbPanels>
		);

		const expected = 1;
		const actual = subject.find('CustomBreadcrumb').length;

		expect(actual).to.equal(expected);
	});

	it('should generate {config.max} breadcrumbs', function () {
		const ThreeBreadcrumbPanels = BreadcrumbDecorator({
			max: 3
		}, Panels);

		const subject = mount(
			<ThreeBreadcrumbPanels index={3}>
				<Panel />
				<Panel />
				<Panel />
				<Panel />
			</ThreeBreadcrumbPanels>
		);

		const expected = 3;
		const actual = subject.find('Breadcrumb').length;

		expect(actual).to.equal(expected);
	});

	it('should add {config.className} to the root node', function () {
		const className = 'root-node';
		const StyledBreadcrumbPanels = BreadcrumbDecorator({
			className
		}, Panels);

		const subject = mount(
			<StyledBreadcrumbPanels>
				<Panel />
			</StyledBreadcrumbPanels>
		);

		const expected = true;
		const actual = subject.find('div').first().hasClass(className);

		expect(actual).to.equal(expected);
	});

	it('should not set aria-owns when no breadcrumbs are needed', function () {
		const ThreeBreadcrumbPanels = BreadcrumbDecorator({
			max: 3
		}, Panels);

		const subject = mount(
			<ThreeBreadcrumbPanels id="test" index={0} noCloseButton>
				<Panel />
				<Panel />
				<Panel />
				<Panel />
			</ThreeBreadcrumbPanels>
		);

		// eslint-disable-next-line
		const expected = undefined;
		const actual = subject.find(Panel).first().prop('aria-owns');

		expect(actual).to.equal(expected);
	});

	it('should set aria-owns on each Panel for the breadcrumbs', function () {
		const ThreeBreadcrumbPanels = BreadcrumbDecorator({
			max: 3
		}, Panels);

		const subject = mount(
			<ThreeBreadcrumbPanels id="test" index={3} noCloseButton>
				<Panel />
				<Panel />
				<Panel />
				<Panel />
			</ThreeBreadcrumbPanels>
		);

		// tests for {config.max} aria-owns entries in the format ${id}_bc_{$index}
		const expected = [0, 1, 2].map(n => `test_bc_${n}`).join(' ');
		const actual = subject.find(Panel).first().prop('aria-owns');

		expect(actual).to.equal(expected);
	});

	it('should set aria-owns on each Panel for the `max` breadcrumbs', function () {
		const ThreeBreadcrumbPanels = BreadcrumbDecorator({
			max: 1
		}, Panels);

		const subject = mount(
			<ThreeBreadcrumbPanels id="test" index={3} noCloseButton>
				<Panel />
				<Panel />
				<Panel />
				<Panel />
			</ThreeBreadcrumbPanels>
		);

		// tests for truncated {config.max} aria-owns entries in the format ${id}_bc_{$index}
		const expected = 'test_bc_2';
		const actual = subject.find(Panel).first().prop('aria-owns');

		expect(actual).to.equal(expected);
	});

	it('should append breadcrumb aria-owns to set aria-owns value in childProps', function () {
		const Component = BreadcrumbDecorator({
			max: 1
		}, Panels);

		const subject = mount(
			<Component id="test" noCloseButton index={1} childProps={{'aria-owns': ':allthethings:'}}>
				<Panel />
				<Panel />
			</Component>
		);

		const expected = ':allthethings: test_bc_0';
		const actual = subject.find(Panel).first().prop('aria-owns');

		expect(actual).to.equal(expected);
	});
});
