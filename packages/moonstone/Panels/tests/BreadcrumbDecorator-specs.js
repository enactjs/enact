import React from 'react';
import kind from '@enact/core/kind';
import {mount} from 'enzyme';
import BreadcrumbDecorator from '../BreadcrumbDecorator';
import Panels from '../Panels';

describe('BreadcrumbDecorator', () => {

	const CustomBreadcrumb = kind({
		name: 'CustomBreadcrumb',

		propsTypes: {
			index: React.PropTypes.number,
			onSelect: React.PropTypes.func
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

});
