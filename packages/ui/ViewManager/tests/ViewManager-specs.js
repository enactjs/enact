/* eslint-disable enact/prop-types */
import React from 'react';
import {shallow, mount} from 'enzyme';
import ViewManager, {SlideLeftArranger} from '../';

describe('ViewManager', () => {

	// Suite-wide setup

	it('should render {component} as its child - <div/> by default', function () {
		const subject = mount(
			<ViewManager>
				<span />
			</ViewManager>
		);

		const expected = 1;
		const actual = subject.find('div').length;

		expect(actual).to.equal(expected);
	});

	it('should render {component} as its child', function () {
		const subject = mount(
			<ViewManager component="span">
				<div />
			</ViewManager>
		);

		const expected = 1;
		const actual = subject.find('span').length;

		expect(actual).to.equal(expected);
	});

	it('should render only 1 child view', function () {
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

		expect(actual).to.equal(expected);
	});

	it('should render the child at {index}', function () {
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

		expect(actual).to.equal(expected);
	});

	it('should have 1 child immediately after setting new {index} without an {arranger}', function () {
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

		expect(actual).to.equal(expected);
	});

	it('should have 1 child immediately after setting new {index} with an {arranger} and {noAnimation} is false', function () {
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

		expect(actual).to.equal(expected);
	});

	it('should have 2 children immediately after setting new {index} with an {arranger}', function () {
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

		expect(actual).to.equal(expected);
	});

	it('should allow child props to update', function () {
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

		expect(actual).to.equal(expected);
	});

	it('should not allow child props to update', function () {
		const content = 'updated';
		class ViewManagerTest extends React.Component {
			render () {
				return (
					<ViewManager preventUpdate>
						<div className="view">{this.props.content}</div>
					</ViewManager>
				);
			}
		}

		const subject = mount(
			<ViewManagerTest content="original" />
		);

		subject.setProps({content});

		const expected = 'original';
		const actual = subject.find('.view').text();

		expect(actual).to.equal(expected);
	});

	it.skip('should have 1 child {duration}ms after setting new {index}', function (done) {
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

			expect(actual).to.equal(expected);
			done();
		}, duration + 10);
	});

});
