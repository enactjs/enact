/* eslint-disable enact/display-name */

import React from 'react';
import {shallow, mount} from 'enzyme';
import sinon from 'sinon';

import hoc, {compose} from '../hoc';

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

	describe('compose', function () {
		it('should call each hoc only once', function () {
			const Component = () => <div />;
			const spy = sinon.spy(x => x);
			const hawk = compose(
				spy
			);

			hawk(Component);

			const expected = 'callCount: 1';
			const actual = `callCount: ${spy.callCount}`;

			expect(actual).to.equal(expected);
		});

		it('should pass the provided config options to each hoc', function () {
			const config = {a: 1};
			const Component = () => <div />;
			const spy = sinon.spy((x, y) => y);
			const hawk = compose(
				spy
			);

			hawk(config, Component);

			const expected = ['a'];
			const actual = Object.keys(spy.firstCall.args[0]);

			expect(actual).to.deep.equal(expected);
		});

		it('should skip non-function provided args', function () {
			const Component = () => <div />;
			const spy = sinon.spy((x, y) => y);
			const hawk = compose(
				null,
				undefined, // eslint-disable-line no-undefined
				true,
				false,
				'asdf',
				1,
				[],
				{},
				spy
			);

			hawk(Component);

			const expected = 'callCount: 1';
			const actual = `callCount: ${spy.callCount}`;

			expect(actual).to.equal(expected);
		});

		it('should skip function provided args that do not expect any arguments', function () {
			const Component = () => <div />;
			const spy = sinon.spy((x, y) => y);
			const hawk = compose(
				() => {},
				function () {},
				spy
			);

			hawk(Component);

			const expected = 'callCount: 1';
			const actual = `callCount: ${spy.callCount}`;

			expect(actual).to.equal(expected);
		});
	});
});
