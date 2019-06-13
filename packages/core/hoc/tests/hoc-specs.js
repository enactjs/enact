/* eslint-disable enact/display-name */

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

	test(
		'should support HoC factory function as first argument to hoc()',
		() => {
			const ImplicitNullHoC = hoc((config, Wrapped) => {
				return () => <Wrapped {...config} />;
			});
			const Component = ImplicitNullHoC('span');

			const subject = shallow(
				<Component />
			);

			const expected = 'span';
			const actual = subject.name();

			expect(actual).toBe(expected);
		}
	);


	test('should support DOM node name as first argument to HoC', () => {
		const Component = HoC('span');

		const subject = shallow(
			<Component />
		);

		const expected = 'span';
		const actual = subject.name();

		expect(actual).toBe(expected);
	});

	test('should support React component as first argument to HoC', () => {
		function Thing () {
			return <div />;
		}
		const Component = HoC(Thing);

		const subject = shallow(
			<Component />
		);

		const expected = 'Thing';
		const actual = subject.name();

		expect(actual).toBe(expected);
	});

	test('should use default config when instance config is omitted', () => {
		const Component = HoC('span');

		const subject = mount(
			<Component />
		);

		const expected = defaultConfig.color;
		const actual = subject.find('span').prop('color');

		expect(actual).toBe(expected);
	});

	test('should overwrite default config with instance config', () => {
		const instanceConfig = {
			color: 'green'
		};
		const Component = HoC(instanceConfig, 'div');

		const subject = mount(
			<Component />
		);

		const expected = instanceConfig.color;
		const actual = subject.find('div').prop('color');

		expect(actual).toBe(expected);
	});

	test(
		'should allow construction without default or instance configs',
		() => {
			const Component = NullHoC('div');

			const subject = mount(
				<Component />
			);

			const expected = 1;
			const actual = subject.find('div').length;

			expect(actual).toBe(expected);
		}
	);

	test('should allow construction without default config', () => {
		const instanceConfig = {
			color: 'green'
		};
		const Component = NullHoC(instanceConfig, 'div');

		const subject = mount(
			<Component />
		);

		const expected = instanceConfig.color;
		const actual = subject.find('div').prop('color');

		expect(actual).toBe(expected);
	});

});
