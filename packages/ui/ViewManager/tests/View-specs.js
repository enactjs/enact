import '@testing-library/jest-dom';
import {act, render, screen} from '@testing-library/react';
import {createRef} from 'react';

import {MockArranger} from './test-utils';
import View from '../View';

describe('View', () => {
	test('should render its child when neither enteringProp or childProps is specified', () => {
		render(
			<View duration={1000}>
				<span data-testid="span" />
			</View>
		);

		const actual = screen.getByTestId('span');

		expect(actual).toBeInTheDocument();
	});

	test('should pass the value of entering to its child in enteringProp', () => {
		render(
			<View duration={1000} enteringProp="data-entering">
				<span data-testid="span" />
			</View>
		);

		const expected = 'true';
		const actual = screen.getByTestId('span');

		expect(actual).toHaveAttribute('data-entering', expected);
	});

	test('should pass enteringProp as false for an appearing view', () => {
		// Views visible on mount are "appearing" and shouldn't perform "entering" logic like
		// deferring children rendering
		render(
			<View appearing duration={1000} enteringProp="data-entering">
				<span data-testid="span" />
			</View>
		);

		const actual = screen.getByTestId('span');

		expect(actual).toHaveAttribute('data-entering', 'false');
	});

	describe('imperative API without arranger', () => {
		test('should call callback immediately for "stay"', () => {
			const spy = jest.fn();
			const ref = createRef();
			render(
				<View duration={16} ref={ref}>
					<span />
				</View>
			);
			act(() => ref.current.componentWillStay(spy));

			const expected = 1;

			expect(spy).toHaveBeenCalledTimes(expected);
		});

		test('should call callback immediately for "enter"', () => {
			const spy = jest.fn();
			const ref = createRef();
			render(
				<View duration={16} ref={ref}>
					<span />
				</View>
			);

			act(() => ref.current.componentWillEnter(spy));

			const expected = 1;

			expect(spy).toHaveBeenCalledTimes(expected);
		});

		test('should call callback immediately for "leave"', () => {
			const spy = jest.fn();
			const ref = createRef();
			render(
				<View duration={16} ref={ref}>
					<span />
				</View>
			);

			act(() => ref.current.componentWillLeave(spy));

			const expected = 1;

			expect(spy).toHaveBeenCalledTimes(expected);
		});

		test('should reset entering if a rendered panel re-enters', () => {
			jest.useFakeTimers();
			const spy = jest.fn();
			const ref = createRef();
			render(
				<View duration={16} enteringProp="data-entering" ref={ref}>
					<span data-testid="span" />
				</View>
			);

			act(() => ref.current.componentDidAppear(spy));
			const firstExpected = 'false';
			const firstSpan = screen.getByTestId('span');

			expect(firstSpan).toHaveAttribute('data-entering', firstExpected);

			act(() => ref.current.componentWillEnter(spy));
			const secondExpected = 'true';
			const secondSpan = screen.getByTestId('span');

			expect(secondSpan).toHaveAttribute('data-entering', secondExpected);
		});
	});

	describe('imperative API with arranger', () => {
		beforeEach(() => {
			jest.useFakeTimers();
		});

		afterEach(() => {
			jest.useRealTimers();
		});

		test('should call callback for "stay"', (done) => {
			const ref = createRef();
			const getParentRef = () => ({children: [{}]});
			render(
				<View arranger={MockArranger} duration={16} ref={ref} getParentRef={getParentRef}>
					<span />
				</View>
			);

			const spy = jest.fn(() => {
				const expected = 1;

				expect(spy).toHaveBeenCalledTimes(expected);
				done();
			});

			act(() => ref.current.componentWillStay(spy));
			jest.runAllTimers();
		});

		test('should call callback for "enter"', (done) => {
			const ref = createRef();
			const getParentRef = () => ({children: [{}]});
			render(
				<View arranger={MockArranger} duration={16} ref={ref} getParentRef={getParentRef}>
					<span />
				</View>
			);

			const spy = jest.fn(() => {
				const expected = 1;

				expect(spy).toHaveBeenCalledTimes(expected);
				done();
			});

			act(() => ref.current.componentWillEnter(spy));
			jest.runAllTimers();
		});

		test('should call callback for "leave"', (done) => {
			const ref = createRef();
			const getParentRef = () => ({children: [{}]});
			render(
				<View arranger={MockArranger} duration={16} ref={ref} getParentRef={getParentRef}>
					<span />
				</View>
			);

			const spy = jest.fn(() => {
				const expected = 1;

				expect(spy).toHaveBeenCalledTimes(expected);
				done();
			});

			act(() => ref.current.componentWillLeave(spy));
			jest.runAllTimers();
		});

		test('should call callback immediately when {noAnimation}', () => {
			const spy = jest.fn();
			const ref = createRef();
			const getParentRef = () => ({children: [{}]});
			render(
				<View arranger={MockArranger} duration={16} noAnimation ref={ref} getParentRef={getParentRef}>
					<span />
				</View>
			);

			act(() => ref.current.componentWillEnter(spy));

			const expected = 1;

			expect(spy).toHaveBeenCalledTimes(expected);
		});

		test('should call callback immediately for "appear"', () => {
			const spy = jest.fn();
			const ref = createRef();
			const getParentRef = () => ({children: [{}]});
			render(
				<View arranger={MockArranger} duration={16} ref={ref} getParentRef={getParentRef}>
					<span />
				</View>
			);

			act(() => ref.current.componentWillAppear(spy));

			const expected = 1;

			expect(spy).toHaveBeenCalledTimes(expected);
		});
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

		test('should pass the expected object to the arranger', () => {
			const arranger = {
				enter: jest.fn(() => ({}))
			};

			const ref = createRef();
			const getParentRef = () => ({children: [{}]});
			render(
				<View arranger={arranger} duration={1000} ref={ref} getParentRef={getParentRef}>
					<span />
				</View>
			);

			act(() => ref.current.componentWillEnter());
			expect(arranger.enter).toHaveBeenCalledWith(arrangerStruct);
		});
	});
});
