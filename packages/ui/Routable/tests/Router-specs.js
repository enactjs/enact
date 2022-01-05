/* eslint no-console: ["error", { allow: ["warn", "error"] }], react/jsx-no-bind: off */

import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import Route from '../Route';
import {Router, RouterBase} from '../Router';

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
		render(<RouterBase routes={routes} path="/app" />);
		const view = screen.getByRole('button');

		expect(view).toBeInTheDocument();
	});

	test('should render an array of components matching the {path}', () => {
		render(<RouterBase routes={routes} path="/app/home" />);
		const view = screen.getAllByRole('button');

		const expected = 2;

		expect(view.length).toBe(expected);
	});

	test('should render an array of components matching the {path} as an array', () => {
		render(<RouterBase routes={routes} path={['app', 'home']} />);
		const view = screen.getAllByRole('button');

		const expected = 2;

		expect(view.length).toBe(expected);
	});

	test('should render no children if {path} does not exist in {routes}', () => {
		// Modify the console spy to silence error output with
		// an empty mock implementation
		console.error.mockImplementation();

		render(<RouterBase routes={routes} path="/help" />);
		const view = screen.queryByRole('button');

		expect(view).toBeNull();
	});

	test('should render children into {component}', () => {
		const component = (props) => (
			<div data-testid="div1">
				<div data-testid="div2">
					{props.children}
				</div>
			</div>
		);

		render(<Router routes={routes} path="/app/settings" component={component} />);
		const secondDiv = screen.getByTestId('div2');

		const expected = 2;
		const actual = secondDiv.childElementCount;

		expect (actual).toBe(expected);
	});

	test('should render an array of components matching the {path} using JSX routes', () => {
		render(
			<Router path="/app/home">
				<Route path="app" component={View}>
					<Route path="home" component={View} />
					<Route path="settings" component={View} />
				</Route>
				<Route path="admin" component={View} />
			</Router>
		);
		const view = screen.getAllByRole('button');

		const expected = 2;
		const actual = view.length;

		expect(actual).toBe(expected);
	});

	test('should render a different component when the routes change for the same {path}', () => {
		const {rerender} = render(
			<Router path="/app">
				<Route path="app" component={View}>
					<Route path="home" component={View} />
					<Route path="settings" component={View} />
				</Route>
				<Route path="admin" component={View} />
			</Router>
		);

		const NewView = () => <span data-testid="span" />;

		rerender(
			<Router path="/app">
				<Route path="app" component={NewView}>
					<Route path="app" component={NewView} />
				</Route>
			</Router>
		);
		const view = screen.getByTestId('span');

		expect(view).toBeInTheDocument();
	});

	test('should render nothing for an invalid path', () => {
		// Modify the console spy to silence error output with
		// an empty mock implementation
		console.error.mockImplementation();

		render(
			<Router path="/does/not/exist">
				<Route path="app" component={View}>
					<Route path="home" component={View} />
					<Route path="settings" component={View} />
				</Route>
				<Route path="admin" component={View} />
			</Router>
		);
		const view = screen.queryByRole('button');

		expect(view).toBeNull();
	});

	test('should render nothing for a partially valid path', () => {
		// Modify the console spy to silence error output with
		// an empty mock implementation
		console.error.mockImplementation();

		render(
			<Router path="/app/home/other">
				<Route path="app" component={View}>
					<Route path="home" component={View} />
					<Route path="settings" component={View} />
				</Route>
				<Route path="admin" component={View} />
			</Router>
		);
		const view = screen.queryByRole('button');

		expect(view).toBeNull();
	});
});
