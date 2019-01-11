/* globals console */
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
/* eslint-disable react/jsx-no-bind */

import React from 'react';
import {shallow, mount} from 'enzyme';
import {Router, Route} from '../Router';

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

	test('should render a single component matching the {path}', () => {
		const subject = shallow(
			<Router routes={routes} path="/app" />
		);

		const expected = 1;
		const actual = subject.find(View).length;

		expect(actual).toBe(expected);
	});

	test('should render an array of components matching the {path}', () => {
		const subject = shallow(
			<Router routes={routes} path="/app/home" />
		);

		const expected = 2;
		const actual = subject.find(View).length;

		expect(actual).toBe(expected);
	});

	test(
		'should render an array of components matching the {path} as an array',
		() => {
			const subject = shallow(
				<Router routes={routes} path={['app', 'home']} />
			);

			const expected = 2;
			const actual = subject.find(View).length;

			expect(actual).toBe(expected);
		}
	);

	test(
		'should render no children if {path} does not exist in {routes}',
		() => {
			// Modify the console spy to silence error output with
			// an empty mock implementation
			console.error.mockImplementation();

			const subject = shallow(
				<Router routes={routes} path="/help" />
			);

			const expected = 0;
			const actual = subject.children().length;

			expect(actual).toBe(expected);
		}
	);

	test('should render children into {component}', () => {
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

		expect(actual).toBe(expected);
	});

	test('should compile children into route object', () => {
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

		expect(actual).toBe(expected);
	});

	test(
		'should render an array of components matching the {path} using JSX routes',
		() => {
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

			expect(actual).toBe(expected);
		}
	);

	test(
		'should render a different component when the routes change for the same {path}',
		() => {
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

			expect(actual).toBe(expected);
		}
	);

	test('should render nothing for an invalid path', () => {
		// Modify the console spy to silence error output with
		// an empty mock implementation
		console.error.mockImplementation();

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

		expect(actual).toBe(expected);
	});

	test('should render nothing for a partially valid path', () => {
		// Modify the console spy to silence error output with
		// an empty mock implementation
		console.error.mockImplementation();

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

		expect(actual).toBe(expected);
	});
});
