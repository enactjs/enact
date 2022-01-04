import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';
import {Component} from 'react';

import ViewManager from '../';
import {MockArranger} from './test-utils';

describe('ViewManager', () => {
	// Suite-wide setup
	test('should render {component} as its child - <div/> by default', () => {
		render(
			<ViewManager data-testid="component">
				<span />
			</ViewManager>
		);

		const expected = 'DIV';
		const actual = screen.getByTestId('component').tagName;

		expect(actual).toBe(expected);
	});

	test('should render {component} as its child', () => {
		render(
			<ViewManager component="span" data-testid="component">
				<div />
			</ViewManager>
		);

		const expected = 'SPAN';
		const actual = screen.getByTestId('component').tagName;

		expect(actual).toBe(expected);
	});

	test('should render only 1 child view', () => {
		render(
			<ViewManager>
				<div>View 1</div>
				<div>View 2</div>
				<div>View 3</div>
				<div>View 4</div>
				<div>View 5</div>
			</ViewManager>
		);

		const expected = 1;
		const actual = screen.getAllByText(/View/).length;

		expect(actual).toBe(expected);
	});

	test('should render the child at {index}', () => {
		render(
			<ViewManager index={3}>
				<div>View 1</div>
				<div>View 2</div>
				<div>View 3</div>
				<div>View 4</div>
				<div>View 5</div>
			</ViewManager>
		);

		const actual = screen.getByText('View 4');

		expect(actual).toBeInTheDocument();
	});

	test('should have 1 child immediately after setting new {index} without an {arranger}', () => {
		const {rerender} = render(
			<ViewManager data-testid="viewManager" index={3}>
				<div>View 1</div>
				<div>View 2</div>
				<div>View 3</div>
				<div>View 4</div>
				<div>View 5</div>
			</ViewManager>
		);

		rerender(
			<ViewManager data-testid="viewManager" index={4}>
				<div>View 1</div>
				<div>View 2</div>
				<div>View 3</div>
				<div>View 4</div>
				<div>View 5</div>
			</ViewManager>
		);

		const expected = 1;
		const actual = screen.getByTestId('viewManager').children.length;

		expect(actual).toBe(expected);
	});

	test('should have 1 child immediately after setting new {index} with an {arranger} and {noAnimation} is false', () => {
		const {rerender} = render(
			<ViewManager arranger={MockArranger} data-testid="viewManager" index={3} noAnimation>
				<div>View 1</div>
				<div>View 2</div>
				<div>View 3</div>
				<div>View 4</div>
				<div>View 5</div>
			</ViewManager>
		);

		rerender(
			<ViewManager arranger={MockArranger} data-testid="viewManager" index={4} noAnimation>
				<div>View 1</div>
				<div>View 2</div>
				<div>View 3</div>
				<div>View 4</div>
				<div>View 5</div>
			</ViewManager>
		);

		const expected = 1;
		const actual = screen.getByTestId('viewManager').children.length;

		expect(actual).toBe(expected);
	});

	test('should have 2 children immediately after setting new {index} with an {arranger}', () => {
		const {rerender} = render(
			<ViewManager arranger={MockArranger} data-testid="viewManager" index={3}>
				<div>View 1</div>
				<div>View 2</div>
				<div>View 3</div>
				<div>View 4</div>
				<div>View 5</div>
			</ViewManager>
		);

		rerender(
			<ViewManager arranger={MockArranger} data-testid="viewManager" index={4}>
				<div>View 1</div>
				<div>View 2</div>
				<div>View 3</div>
				<div>View 4</div>
				<div>View 5</div>
			</ViewManager>
		);

		const expected = 2;
		const actual = screen.getByTestId('viewManager').children.length;

		expect(actual).toBe(expected);
	});

	test('should allow child props to update', () => {
		const content = 'updated';
		class ViewManagerTest extends Component {
			render () {
				return (
					<ViewManager>
						<div data-testid="view">{this.props.content}</div>
					</ViewManager>
				);
			}
		}

		const {rerender} = render(
			<ViewManagerTest content="original" />
		);

		rerender(<ViewManagerTest content={content} />);

		const expected = content;
		const actual = screen.getByTestId('view').textContent;

		expect(actual).toBe(expected);
	});

	test('should have 1 child {duration}ms after setting new {index}', (done) => {
		const duration = 50;
		const {rerender} = render(
			<ViewManager data-testid="viewManager" duration={duration} index={3}>
				<div>View 1</div>
				<div>View 2</div>
				<div>View 3</div>
				<div>View 4</div>
				<div>View 5</div>
			</ViewManager>
		);

		rerender(
			<ViewManager data-testid="viewManager" duration={duration} index={4}>
				<div>View 1</div>
				<div>View 2</div>
				<div>View 3</div>
				<div>View 4</div>
				<div>View 5</div>
			</ViewManager>
		);

		window.setTimeout(function () {
			const expected = 1;
			const actual = screen.getByTestId('viewManager').children.length;

			expect(actual).toBe(expected);
			done();
		}, duration + 10);
	});

	// TODO cannot read props of child components
	test.skip('should have size of 1 on TransitionGroup', () => {
		render(
			<ViewManager duration={0} index={0} noAnimation>
				<div className="view">View 1</div>
				<div className="view">View 2</div>
				<div className="view">View 3</div>
				<div className="view">View 4</div>
				<div className="view">View 5</div>
			</ViewManager>
		);

		// const expected = 1;
		// const actual = subject.find('TransitionGroup').prop('size');
		// expect(actual).toBe(expected);
	});

	// TODO cannot read props of child components
	test.skip('should update the View reverseTransition prop.', () => {
		const {rerender} = render(
			<ViewManager duration={0} index={0} noAnimation>
				<div className="view">View 1</div>
				<div className="view">View 2</div>
				<div className="view">View 3</div>
				<div className="view">View 4</div>
				<div className="view">View 5</div>
			</ViewManager>
		);

		rerender(
			<ViewManager duration={0} index={0} noAnimation reverseTransition>
				<div className="view">View 1</div>
				<div className="view">View 2</div>
				<div className="view">View 3</div>
				<div className="view">View 4</div>
				<div className="view">View 5</div>
			</ViewManager>
		);

		// const actual = subject.find('View').props().reverseTransition;
		// expect(actual).toBeTruthy();
	});

	// TODO cannot read props of child components
	test.skip('should update the View reverseTransition prop to true if it is updated with a smaller index prop.', () => {
		const {rerender} = render(
			<ViewManager arranger={MockArranger} duration={0} index={2}>
				<div>View 1</div>
				<div>View 2</div>
				<div>View 3</div>
				<div>View 4</div>
				<div>View 5</div>
			</ViewManager>
		);

		rerender(
			<ViewManager arranger={MockArranger} duration={0} index={1}>
				<div>View 1</div>
				<div>View 2</div>
				<div>View 3</div>
				<div>View 4</div>
				<div>View 5</div>
			</ViewManager>
		);

		// const actual = subject.find('View').at(0).props().reverseTransition;
		// expect(actual).toBeTruthy();
	});

	// TODO cannot read props of child components
	test.skip('should update the View reverseTransition prop to false even though it is updated with a smaller index prop.', () => {
		const {rerender} = render(
			<ViewManager arranger={MockArranger} duration={0} index={2}>
				<div>View 1</div>
				<div>View 2</div>
				<div>View 3</div>
			</ViewManager>
		);

		rerender(
			<ViewManager arranger={MockArranger} duration={0} index={1} reverseTransition={false}>
				<div>View 1</div>
				<div>View 2</div>
				<div>View 3</div>
			</ViewManager>
		);

		// const actual = subject.find('View').at(0).props().reverseTransition;
		// expect(actual).toBeFalsy();
	});

	test('should update the view when children are reordered', () => {
		const {rerender} = render(
			<ViewManager index={1}>
				<div key="view1">View 1</div>
				<div key="view2">View 2</div>
			</ViewManager>
		);

		expect(screen.getByText('View 2')).toBeInTheDocument();

		rerender(
			<ViewManager index={1}>
				<div key="view2">View 2</div>
				<div key="view1">View 1</div>
			</ViewManager>
		);

		expect(screen.getByText('View 1')).toBeInTheDocument();
	});

	test('should update the view when children are replaced', () => {
		const {rerender} = render(
			<ViewManager index={0} >
				<div key="view1">View 1</div>
			</ViewManager>
		);

		expect(screen.getByText('View 1')).toBeInTheDocument();

		rerender(
			<ViewManager index={0}>
				<div key="view2">View 2</div>
			</ViewManager>
		);

		expect(screen.getByText('View 2')).toBeInTheDocument();
	});

	test('should update the number of views when {start} updates', () => {
		const {rerender} = render(
			<ViewManager data-testid="viewManager" end={3} index={3} start={2}>
				<div key="view1">View 1</div>
				<div key="view2">View 2</div>
				<div key="view3">View 3</div>
				<div key="view4">View 4</div>
			</ViewManager>
		);

		const children = screen.getByTestId('viewManager').children;

		expect(children).toHaveLength(2);
		expect(children.item(0)).toHaveTextContent('View 3');

		rerender(
			<ViewManager data-testid="viewManager" end={3} index={3} start={1}>
				<div key="view1">View 1</div>
				<div key="view2">View 2</div>
				<div key="view3">View 3</div>
				<div key="view4">View 4</div>
			</ViewManager>
		);

		expect(children).toHaveLength(3);
		expect(children.item(0)).toHaveTextContent('View 2');
	});

	test('should update the active view when {start}, {end}, and {index} update', () => {
		const {rerender} = render(
			<ViewManager data-testid="viewManager" end={3} index={3} start={3}>
				<div key="view1">View 1</div>
				<div key="view2">View 2</div>
				<div key="view3">View 3</div>
				<div key="view4">View 4</div>
			</ViewManager>
		);
		const children = screen.getByTestId('viewManager').children;
		const expected = 1;

		expect(children).toHaveLength(expected);
		expect(screen.getByTestId('viewManager')).toHaveTextContent('View 4');

		rerender(
			<ViewManager data-testid="viewManager" end={2} index={2} start={2}>
				<div key="view1">View 1</div>
				<div key="view2">View 2</div>
				<div key="view3">View 3</div>
				<div key="view4">View 4</div>
			</ViewManager>
		);
		const newChildren = screen.getByTestId('viewManager').children;
		const newExpected = 1;

		expect(newChildren).toHaveLength(newExpected);
		expect(screen.getByTestId('viewManager')).toHaveTextContent('View 3');
	});

	test('should extend the view range when {index} is less than {start}', () => {
		render(
			<ViewManager data-testid="viewManager" end={3} index={1} start={2}>
				<div key="view1">View 1</div>
				<div key="view2">View 2</div>
				<div key="view3">View 3</div>
				<div key="view4">View 4</div>
			</ViewManager>
		);
		const children = screen.getByTestId('viewManager').children;
		const expected = 3;

		expect(children).toHaveLength(expected);
	});

	test('should extend the view range when {index} is greater than {end}', () => {
		render(
			<ViewManager end={2} index={3} start={1}>
				<div key="view1">View 1</div>
				<div key="view2">View 2</div>
				<div key="view3">View 3</div>
				<div key="view4">View 4</div>
			</ViewManager>
		);
		const children = screen.getAllByText(/View/);
		const expected = 3;

		expect(children).toHaveLength(expected);
	});

	test('should fire onTransition once per transition', () => {
		const spy = jest.fn();
		const {rerender} = render(
			<ViewManager index={0} noAnimation onTransition={spy}>
				<div key="view1">View 1</div>
				<div key="view2">View 2</div>
			</ViewManager>
		);

		spy.mockClear();

		rerender(
			<ViewManager index={1} onTransition={spy} noAnimation>
				<div key="view1">View 1</div>
				<div key="view2">View 2</div>
			</ViewManager>
		);
		const expected = 1;

		expect(spy).toHaveBeenCalledTimes(expected);
	});

	test('should not receive onTransition event on mount', () => {
		const spy = jest.fn();

		render(
			<ViewManager index={0} noAnimation onTransition={spy}>
				<div key="view1">View 1</div>
				<div key="view2">View 2</div>
			</ViewManager>
		);

		const expected = 0;

		expect(spy).toHaveBeenCalledTimes(expected);
	});

	test('should include the current index and previous index in onTransition event payload', () => {
		const spy = jest.fn();
		const {rerender} = render(
			<ViewManager index={0} noAnimation onTransition={spy}>
				<div key="view1">View 1</div>
				<div key="view2">View 2</div>
			</ViewManager>
		);

		spy.mockClear();

		rerender(
			<ViewManager index={1} onTransition={spy} noAnimation>
				<div key="view1">View 1</div>
				<div key="view2">View 2</div>
			</ViewManager>
		);

		expect(spy).toHaveBeenLastCalledWith({index: 1, previousIndex: 0});

		rerender(
			<ViewManager index={0} onTransition={spy} noAnimation>
				<div key="view1">View 1</div>
				<div key="view2">View 2</div>
			</ViewManager>
		);

		expect(spy).toHaveBeenLastCalledWith({index: 0, previousIndex: 1});
	});

	test('should fire onWillTransition once per transition', () => {
		const spy = jest.fn();
		const {rerender} = render(
			<ViewManager index={0} noAnimation onWillTransition={spy}>
				<div key="view1">View 1</div>
				<div key="view2">View 2</div>
			</ViewManager>
		);

		rerender(
			<ViewManager index={1} onWillTransition={spy} noAnimation>
				<div key="view1">View 1</div>
				<div key="view2">View 2</div>
			</ViewManager>
		);

		expect(spy).toHaveBeenCalledTimes(1);
	});

	test('should include the current index and previous index in onWillTransition event payload', () => {
		const spy = jest.fn();
		const {rerender} = render(
			<ViewManager index={0} noAnimation onWillTransition={spy}>
				<div key="view1">View 1</div>
				<div key="view2">View 2</div>
			</ViewManager>
		);

		rerender(
			<ViewManager index={1} onWillTransition={spy} noAnimation>
				<div key="view1">View 1</div>
				<div key="view2">View 2</div>
			</ViewManager>
		);

		expect(spy).toHaveBeenLastCalledWith({index: 1, previousIndex: 0});

		rerender(
			<ViewManager index={0} onWillTransition={spy} noAnimation>
				<div key="view1">View 1</div>
				<div key="view2">View 2</div>
			</ViewManager>
		);

		expect(spy).toHaveBeenLastCalledWith({index: 0, previousIndex: 1});
	});

	test('should pass `rtl` prop to arranger when `true`', () => {
		const spy = jest.spyOn(MockArranger, 'stay');
		render(
			<ViewManager arranger={MockArranger} index={0} rtl>
				<div key="view1">View 1</div>
				<div key="view2">View 2</div>
			</ViewManager>
		);

		const expected = {rtl: true};
		const actual = spy.mock.calls[0][0];

		expect(actual).toMatchObject(expected);

		spy.mockRestore();
	});

	test('should pass `rtl` prop to arranger when unset', () => {
		const spy = jest.spyOn(MockArranger, 'stay');
		render(
			<ViewManager arranger={MockArranger} index={0}>
				<div key="view1">View 1</div>
				<div key="view2">View 2</div>
			</ViewManager>
		);

		const expected = {rtl: false};
		const actual = spy.mock.calls[0][0];

		expect(actual).toMatchObject(expected);

		spy.mockRestore();
	});
});
