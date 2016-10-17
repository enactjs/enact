/* eslint-disable react/display-name */

import React from 'react';
import {shallow, mount} from 'enzyme';
import hoc from '../hoc';

describe('hoc', () => {

	const defaultConfig = {
		color: 'blue'
	};

	const HoC = hoc(defaultConfig, (config, Wrapped) => {
		return (props) => <Wrapped {...props} {...config} />;
	});

	const NullHoC = hoc(null, (config, Wrapped) => {
		return () => <Wrapped {...config} />;
	});

	it('should support HoC factory function as first argument to hoc()', function () {
		const ImplicitNullHoC = hoc((config, Wrapped) => {
			return () => <Wrapped {...config} />;
		});
		const Component = ImplicitNullHoC('span');

		const subject = shallow(
			<Component />
		);

		const expected = 'span';
		const actual = subject.name();

		expect(actual).to.equal(expected);
	});


	it('should support DOM node name as first argument to HoC', function () {
		const Component = HoC('span');

		const subject = shallow(
			<Component />
		);

		const expected = 'span';
		const actual = subject.name();

		expect(actual).to.equal(expected);
	});

	it('should support React component as first argument to HoC', function () {
		function Thing () {
			return <div />;
		}
		const Component = HoC(Thing);

		const subject = shallow(
			<Component />
		);

		const expected = 'Thing';
		const actual = subject.name();

		expect(actual).to.equal(expected);
	});

	it('should use default config when instance config is omitted', function () {
		const Component = HoC('span');

		const subject = mount(
			<Component />
		);

		const expected = defaultConfig.color;
		const actual = subject.find('span').prop('color');

		expect(actual).to.equal(expected);
	});

	it('should overwrite default config with instance config', function () {
		const instanceConfig = {
			color: 'green'
		};
		const Component = HoC(instanceConfig, 'div');

		const subject = mount(
			<Component />
		);

		const expected = instanceConfig.color;
		const actual = subject.find('div').prop('color');

		expect(actual).to.equal(expected);
	});

	it('should allow construction without default or instance configs', function () {
		const Component = NullHoC('div');

		const subject = mount(
			<Component />
		);

		const expected = 1;
		const actual = subject.find('div').length;

		expect(actual).to.equal(expected);
	});

	it('should allow construction without default config', function () {
		const instanceConfig = {
			color: 'green'
		};
		const Component = NullHoC(instanceConfig, 'div');

		const subject = mount(
			<Component />
		);

		const expected = instanceConfig.color;
		const actual = subject.find('div').prop('color');

		expect(actual).to.equal(expected);
	});

	it('should import propTypes from Wrapped component', function () {
		const Component = () => null;
		Component.propTypes = {
			sourceProp: React.PropTypes.string
		};
		const HOC = hoc((config, Wrapped) => {
			const Comp = () => <Wrapped />;
			Comp.propTypes = {
				hocProp: React.PropTypes.string
			};

			return Comp;
		});

		const Subject = HOC(Component);

		const expected = {
			sourceProp: React.PropTypes.string,
			hocProp: React.PropTypes.string
		};
		const actual = Subject.propTypes;

		expect(actual).to.deep.equal(expected);
	});

	it('should overwrite propTypes from Wrapped component with HOC propTypes', function () {
		const Component = () => null;
		Component.propTypes = {
			sourceProp: React.PropTypes.string
		};
		const HOC = hoc((config, Wrapped) => {
			const Comp = () => <Wrapped />;
			Comp.propTypes = {
				hocProp: React.PropTypes.string,
				sourceProp: React.PropTypes.number
			};

			return Comp;
		});

		const Subject = HOC(Component);

		const expected = {
			sourceProp: React.PropTypes.number,
			hocProp: React.PropTypes.string
		};
		const actual = Subject.propTypes;

		expect(actual).to.deep.equal(expected);
	});

});
