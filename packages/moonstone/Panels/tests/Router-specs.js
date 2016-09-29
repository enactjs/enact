/* eslint-disable react/prop-types */

import React from 'react';
import {shallow, mount} from 'enzyme';
import {Router, Route} from '../Router';

describe('Router', () => {

	// the internal representation of
	// <Router>
	// 	<Route path="app" component="button">
	// 		<Route path="home" component="button" />
	// 		<Route path="settings" component="button" />
	// 	</Route>
	// 	<Route path="admin" component="button" />
	// </Router>
	const routes = {
		app: {
			$component: 'button',
			$props: {},
			home: {
				$component: 'button',
				$props: {}
			},
			settings: {
				$component: 'button',
				$props: {}
			}
		},
		admin: {
			$component: 'button',
			$props: {}
		}
	};

	it('should render a single component matching the {path}', function () {
		const subject = shallow(
			<Router routes={routes} path="/app" />
		);

		const expected = 1;
		const actual = subject.find('button').length;

		expect(actual).to.equal(expected);
	});

	it('should render an array of components matching the {path}', function () {
		const subject = shallow(
			<Router routes={routes} path="/app/home" />
		);

		const expected = 2;
		const actual = subject.find('button').length;

		expect(actual).to.equal(expected);
	});

	it('should render an array of components matching the {path} as an array', function () {
		const subject = shallow(
			<Router routes={routes} path={['app', 'home']} />
		);

		const expected = 2;
		const actual = subject.find('button').length;

		expect(actual).to.equal(expected);
	});

	it('should render no children if {path} does not exist in {routes}', function () {
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
				<Route path="app" component="button">
					<Route path="home" component="button" />
					<Route path="settings" component="button" />
				</Route>
				<Route path="admin" component="button" />
			</Router>
		);

		const expected = JSON.stringify(routes);
		const actual = JSON.stringify(subject.get(0).routes);

		expect(actual).to.equal(expected);
	});

	it('should render an array of components matching the {path} using JSX routes', function () {
		const subject = mount(
			<Router path="/app/home">
				<Route path="app" component="button">
					<Route path="home" component="button" />
					<Route path="settings" component="button" />
				</Route>
				<Route path="admin" component="button" />
			</Router>
		);

		const expected = 2;
		const actual = subject.find('button').length;

		expect(actual).to.equal(expected);
	});

	it('should render a different component when the routes change for the same {path}', function () {
		const subject = mount(
			<Router path="/app">
				<Route path="app" component="button">
					<Route path="home" component="button" />
					<Route path="settings" component="button" />
				</Route>
				<Route path="admin" component="button" />
			</Router>
		);

		subject.setProps({
			path: '/app',
			children: [
				<Route path="app" component="span" />
			]
		});

		const expected = 'span';
		const actual = subject.childAt(0).type();

		expect(actual).to.equal(expected);
	});

	it('should render nothing for an invalid path', function () {
		const subject = mount(
			<Router path="/does/not/exist">
				<Route path="app" component="button">
					<Route path="home" component="button" />
					<Route path="settings" component="button" />
				</Route>
				<Route path="admin" component="button" />
			</Router>
		);

		const expected = 0;
		const actual = subject.find('div').children().length;

		expect(actual).to.equal(expected);
	});

	it('should render nothing for a partially valid path', function () {
		const subject = mount(
			<Router path="/app/home/other">
				<Route path="app" component="button">
					<Route path="home" component="button" />
					<Route path="settings" component="button" />
				</Route>
				<Route path="admin" component="button" />
			</Router>
		);

		const expected = 0;
		const actual = subject.find('div').children().length;

		expect(actual).to.equal(expected);
	});
});
