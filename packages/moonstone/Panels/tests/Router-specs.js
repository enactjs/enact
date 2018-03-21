/* globals console */
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
/* eslint-disable react/jsx-no-bind */

import React from 'react';
import {shallow, mount} from 'enzyme';
import {Router, Route} from '../Router';
import sinon from 'sinon';

describe('Router', () => {

	const View = () => <button />;

	// the internal representation of
	// <Router>
	// 	<Route path="app" component={View}>
	// 		<Route path="home" component={View} />
	// 		<Route path="settings" component={View} />
	// 	</Route>
	// 	<Route path="admin" component={View} />
	// </Router>
	const routes = {
		app: {
			$component: View,
			$props: {},
			home: {
				$component: View,
				$props: {}
			},
			settings: {
				$component: View,
				$props: {}
			}
		},
		admin: {
			$component: View,
			$props: {}
		}
	};

	it('should render a single component matching the {path}', function () {
		const subject = shallow(
			<Router routes={routes} path="/app" />
		);

		const expected = 1;
		const actual = subject.find(View).length;

		expect(actual).to.equal(expected);
	});

	it('should render an array of components matching the {path}', function () {
		const subject = shallow(
			<Router routes={routes} path="/app/home" />
		);

		const expected = 2;
		const actual = subject.find(View).length;

		expect(actual).to.equal(expected);
	});

	it('should render an array of components matching the {path} as an array', function () {
		const subject = shallow(
			<Router routes={routes} path={['app', 'home']} />
		);

		const expected = 2;
		const actual = subject.find(View).length;

		expect(actual).to.equal(expected);
	});

	it('should render no children if {path} does not exist in {routes}', function () {
		// Remove Global Spy and replace with a stub instead
		console.error.restore();
		sinon.stub(console, 'error');

		const subject = shallow(
			<Router routes={routes} path="/help" />
		);

		const expected = 0;
		const actual = subject.children().length;

		expect(actual).to.equal(expected);
	});

	it('should render children into {component}', function () {
		const component = (props) => (
			<div className="div1">
				<div className="div2">
					{props.children}
				</div>
			</div>
		);

		const subject = mount(
			<Router routes={routes} path="/app/settings" component={component} />
		);

		const expected = 2;
		const actual = subject.find('.div2').children().length;

		expect(actual).to.equal(expected);
	});

	it('should compile children into route object', function () {
		const subject = mount(
			<Router path="/app">
				<Route path="app" component={View}>
					<Route path="home" component={View} />
					<Route path="settings" component={View} />
				</Route>
				<Route path="admin" component={View} />
			</Router>
		);

		const expected = JSON.stringify(routes);
		const actual = JSON.stringify(subject.instance().routes);

		expect(actual).to.equal(expected);
	});

	it('should render an array of components matching the {path} using JSX routes', function () {
		const subject = mount(
			<Router path="/app/home">
				<Route path="app" component={View}>
					<Route path="home" component={View} />
					<Route path="settings" component={View} />
				</Route>
				<Route path="admin" component={View} />
			</Router>
		);

		const expected = 2;
		const actual = subject.find(View).length;

		expect(actual).to.equal(expected);
	});

	it('should render a different component when the routes change for the same {path}', function () {
		const subject = mount(
			<Router path="/app">
				<Route path="app" component={View}>
					<Route path="home" component={View} />
					<Route path="settings" component={View} />
				</Route>
				<Route path="admin" component={View} />
			</Router>
		);

		const NewView = () => <span />;

		subject.setProps({
			path: '/app',
			children: [
				<Route path="app" component={NewView} />
			]
		});
		subject.update();

		const expected = NewView;
		const actual = subject.childAt(0).childAt(0).type();

		expect(actual).to.equal(expected);
	});

	it('should render nothing for an invalid path', function () {
		// Remove Global Spy and replace with a stub instead
		console.error.restore();
		sinon.stub(console, 'error');

		const subject = mount(
			<Router path="/does/not/exist">
				<Route path="app" component={View}>
					<Route path="home" component={View} />
					<Route path="settings" component={View} />
				</Route>
				<Route path="admin" component={View} />
			</Router>
		);

		const expected = 0;
		const actual = subject.find('div').children().length;

		expect(actual).to.equal(expected);
	});

	it('should render nothing for a partially valid path', function () {
		// Remove Global Spy and replace with a stub instead
		console.error.restore();
		sinon.stub(console, 'error');

		const subject = mount(
			<Router path="/app/home/other">
				<Route path="app" component={View}>
					<Route path="home" component={View} />
					<Route path="settings" component={View} />
				</Route>
				<Route path="admin" component={View} />
			</Router>
		);

		const expected = 0;
		const actual = subject.find('div').children().length;

		expect(actual).to.equal(expected);
	});
});
