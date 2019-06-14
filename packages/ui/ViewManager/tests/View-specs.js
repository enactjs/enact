/* eslint-disable enact/prop-types */
import React from 'react';
import {mount} from 'enzyme';
import View from '../View';

import {MockArranger} from './test-utils';

describe('View', () => {

	test(
		'should render its child when neither enteringProp or childProps is specified',
		() => {
			const subject = mount(
				<View duration={1000}>
					<span />
				</View>
			);

			const expected = 1;
			const actual = subject.find('span').length;

			expect(actual).toBe(expected);
		}
	);

	test(
		'should pass the value of appearing to its child in enteringProp',
		() => {
			const subject = mount(
				<View duration={1000} enteringProp="data-entering">
					<span />
				</View>
			);

			const expected = true;
			const actual = subject.find('span').prop('data-entering');

			expect(actual).toBe(expected);
		}
	);

	test(
		'should pass enteringProp as false for an appearing view',
		() => {
			// Views visible on mount are "appearing" and shouldn't perform "entering" logic like
			// defering children rendering
			const subject = mount(
				<View duration={1000} enteringProp="data-entering" appearing>
					<span />
				</View>
			);

			const expected = false;
			const actual = subject.find('span').prop('data-entering');

			expect(actual).toBe(expected);
		}
	);

	describe('imperative API without arranger', () => {
		test(
			'should call callback immediately for "stay"',
			() => {
				const spy = jest.fn();
				const subject = mount(
					<View duration={16}>
						<span />
					</View>
				);

				subject.instance().componentWillStay(spy);

				const expected = true;
				const actual = spy.mock.calls.length === 1;

				expect(actual).toBe(expected);
			}
		);

		test(
			'should call callback immediately for "enter"',
			() => {
				const spy = jest.fn();
				const subject = mount(
					<View duration={16}>
						<span />
					</View>
				);

				subject.instance().componentWillEnter(spy);

				const expected = true;
				const actual = spy.mock.calls.length === 1;

				expect(actual).toBe(expected);
			}
		);

		test(
			'should call callback immediately for "leave"',
			() => {
				const spy = jest.fn();
				const subject = mount(
					<View duration={16}>
						<span />
					</View>
				);

				subject.instance().componentWillLeave(spy);

				const expected = true;
				const actual = spy.mock.calls.length === 1;

				expect(actual).toBe(expected);
			}
		);
	});

	describe('imperative API with arranger', () => {
		test(
			'should call callback for "stay"',
			(done) => {
				const subject = mount(
					<View duration={16} arranger={MockArranger}>
						<span />
					</View>
				);

				const spy = jest.fn(() => {
					const expected = true;
					const actual = spy.mock.calls.length === 1;

					expect(actual).toBe(expected);
					done();
				});

				subject.instance().componentWillStay(spy);
			}
		);

		test(
			'should call callback for "enter"',
			(done) => {
				const subject = mount(
					<View duration={16} arranger={MockArranger}>
						<span />
					</View>
				);

				const spy = jest.fn(() => {
					const expected = true;
					const actual = spy.mock.calls.length === 1;

					expect(actual).toBe(expected);
					done();
				});

				subject.instance().componentWillEnter(spy);
			}
		);

		test(
			'should call callback for "leave"',
			(done) => {
				const subject = mount(
					<View duration={16} arranger={MockArranger}>
						<span />
					</View>
				);

				const spy = jest.fn(() => {
					const expected = true;
					const actual = spy.mock.calls.length === 1;

					expect(actual).toBe(expected);
					done();
				});

				subject.instance().componentWillLeave(spy);
			}
		);

		test(
			'should call callback immediately when {noAnimation}',
			() => {
				const spy = jest.fn();
				const subject = mount(
					<View duration={16} arranger={MockArranger} noAnimation>
						<span />
					</View>
				);

				subject.instance().componentWillEnter(spy);

				const expected = true;
				const actual = spy.mock.calls.length === 1;

				expect(actual).toBe(expected);
			}
		);

		test(
			'should call callback immediately for "appear"',
			() => {
				const spy = jest.fn();
				const subject = mount(
					<View duration={16} arranger={MockArranger}>
						<span />
					</View>
				);

				subject.instance().componentWillAppear(spy);

				const expected = true;
				const actual = spy.mock.calls.length === 1;

				expect(actual).toBe(expected);
			}
		);
	});

	describe('arranger API', () => {
		const arrangerStruct = {
			from: expect.any(Number),
			reverse: expect.any(Boolean),
			to: expect.any(Number),
			duration: expect.any(Number),
			fill: expect.any(String),
			node: expect.any(Object)
		};

		test(
			'should pass the expected object to the arranger',
			() => {
				const arranger = {
					enter: jest.fn(() => ({}))
				};

				const subject = mount(
					<View duration={1000} arranger={arranger}>
						<span />
					</View>
				);

				subject.instance().componentWillEnter();
				expect(arranger.enter).toBeCalledWith(arrangerStruct);
			}
		);
	});

});
