/* eslint-disable enact/prop-types */
import React from 'react';
import {shallow, mount} from 'enzyme';
import ViewManager, {SlideLeftArranger} from '../';

describe('ViewManager', () => {

	// Suite-wide setup

	test(
		'should render {component} as its child - <div/> by default',
		() => {
			const subject = mount(
				<ViewManager>
					<span />
				</ViewManager>
			);

			const expected = 1;
			const actual = subject.find('div').length;

			expect(actual).toBe(expected);
		}
	);

	test('should render {component} as its child', () => {
		const subject = mount(
			<ViewManager component="span">
				<div />
			</ViewManager>
		);

		const expected = 1;
		const actual = subject.find('span').length;

		expect(actual).toBe(expected);
	});

	test('should render only 1 child view', () => {
		const subject = mount(
			<ViewManager>
				<div className="view">View 1</div>
				<div className="view">View 2</div>
				<div className="view">View 3</div>
				<div className="view">View 4</div>
				<div className="view">View 5</div>
			</ViewManager>
		);

		const expected = 1;
		const actual = subject.find('.view').length;

		expect(actual).toBe(expected);
	});

	test('should render the child at {index}', () => {
		const subject = shallow(
			<ViewManager index={3}>
				<div className="view">View 1</div>
				<div className="view">View 2</div>
				<div className="view">View 3</div>
				<div className="view">View 4</div>
				<div className="view">View 5</div>
			</ViewManager>
		);

		const expected = 'View 4';
		const actual = subject.find('.view').text();

		expect(actual).toBe(expected);
	});

	test(
		'should have 1 child immediately after setting new {index} without an {arranger}',
		() => {
			const subject = mount(
				<ViewManager index={3}>
					<div className="view">View 1</div>
					<div className="view">View 2</div>
					<div className="view">View 3</div>
					<div className="view">View 4</div>
					<div className="view">View 5</div>
				</ViewManager>
			);

			subject.setProps({index: 4});

			const expected = 1;
			const actual = subject.find('.view').length;

			expect(actual).toBe(expected);
		}
	);

	test(
		'should have 1 child immediately after setting new {index} with an {arranger} and {noAnimation} is false',
		() => {
			const subject = mount(
				<ViewManager index={3} arranger={SlideLeftArranger} noAnimation>
					<div className="view">View 1</div>
					<div className="view">View 2</div>
					<div className="view">View 3</div>
					<div className="view">View 4</div>
					<div className="view">View 5</div>
				</ViewManager>
			);

			subject.setProps({index: 4});

			const expected = 1;
			const actual = subject.find('.view').length;

			expect(actual).toBe(expected);
		}
	);

	test(
		'should have 2 children immediately after setting new {index} with an {arranger}',
		() => {
			const subject = mount(
				<ViewManager index={3} arranger={SlideLeftArranger}>
					<div className="view">View 1</div>
					<div className="view">View 2</div>
					<div className="view">View 3</div>
					<div className="view">View 4</div>
					<div className="view">View 5</div>
				</ViewManager>
			);

			subject.setProps({index: 4});

			const expected = 2;
			const actual = subject.find('.view').length;

			expect(actual).toBe(expected);
		}
	);

	test('should allow child props to update', () => {
		const content = 'updated';
		class ViewManagerTest extends React.Component {
			render () {
				return (
					<ViewManager>
						<div className="view">{this.props.content}</div>
					</ViewManager>
				);
			}
		}

		const subject = mount(
			<ViewManagerTest content="original" />
		);

		subject.setProps({content});

		const expected = content;
		const actual = subject.find('.view').text();

		expect(actual).toBe(expected);
	});

	test.skip(
		'should have 1 child {duration}ms after setting new {index}',
		function (done) {
			const duration = 50;
			const subject = mount(
				<ViewManager index={3} duration={duration}>
					<div className="view">View 1</div>
					<div className="view">View 2</div>
					<div className="view">View 3</div>
					<div className="view">View 4</div>
					<div className="view">View 5</div>
				</ViewManager>
			);

			subject.setProps({index: 4});

			window.setTimeout(function () {
				const expected = 1;
				const actual = subject.find('.view').length;

				expect(actual).toBe(expected);
				done();
			}, duration + 10);
		}
	);

	test('should have size of 1 on TransitionGroup', done => {
		const subject = mount(
			<ViewManager noAnimation index={0} duration={0}>
				<div className="view">View 1</div>
				<div className="view">View 2</div>
				<div className="view">View 3</div>
				<div className="view">View 4</div>
				<div className="view">View 5</div>
			</ViewManager>
		);

		const expected = 1;
		const actual = subject.find('TransitionGroup').prop('size');
		expect(actual).toBe(expected);
		done();
	});

	test('should update the View reverseTransition prop.', done => {
		const subject = mount(
			<ViewManager noAnimation index={0} duration={0}>
				<div className="view">View 1</div>
				<div className="view">View 2</div>
				<div className="view">View 3</div>
				<div className="view">View 4</div>
				<div className="view">View 5</div>
			</ViewManager>
		);

		subject.setProps({reverseTransition: true});
		const actual = subject.find('View').props().reverseTransition;

		expect(actual).toBeTruthy();
		done();
	});

	test('should update the View reverseTransition prop to true if it is updated with a smaller index prop.', done => {
		const subject = mount(
			<ViewManager noAnimation index={2} duration={0}>
				<div className="view">View 1</div>
				<div className="view">View 2</div>
				<div className="view">View 3</div>
				<div className="view">View 4</div>
				<div className="view">View 5</div>
			</ViewManager>
		);

		subject.setProps({index: 1});
		const actual = subject.find('View').props().reverseTransition;

		expect(actual).toBeTruthy();
		done();
	});

	test('should update the View reverseTransition prop to false even though it is updated with a smaller index prop.', done => {
		const subject = mount(
			<ViewManager noAnimation index={2} duration={0}>
				<div className="view">View 1</div>
				<div className="view">View 2</div>
				<div className="view">View 3</div>
				<div className="view">View 4</div>
				<div className="view">View 5</div>
			</ViewManager>
		);

		subject.setProps({index: 1, reverseTransition: false});
		const actual = subject.find('View').props().reverseTransition;

		expect(actual).toBeFalsy();
		done();
	});
});
