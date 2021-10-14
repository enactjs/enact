/* eslint no-console: ["error", { allow: ["warn", "error"] }], react/jsx-no-bind: off */

import {shallow, mount} from 'enzyme';
import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';
import Route from '../Route';
import {Router, RouterBase} from '../Router';

describe('Router', () => {

	const View = () => <button data-testid="button" />;

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
		// const subject = shallow(
		// 	<RouterBase routes={routes} path="/app" />
		// );
		render(<RouterBase routes={routes} path="/app" />);
		const view = screen.getByTestId('button');

		expect(view).toBeInTheDocument();

		// const expected = 1;
		// const actual = subject.find(View).length;
		//
		// expect(actual).toBe(expected);
	});

	test('should render an array of components matching the {path}', () => {
		// const subject = shallow(
		// 	<RouterBase routes={routes} path="/app/home" />
		// );
		render(<RouterBase routes={routes} path="/app/home" />);
		const view = screen.getAllByTestId('button');

		const expected = 2;

		expect(view.length).toBe(expected);

		// const expected = 2;
		// const actual = subject.find(View).length;
		//
		// expect(actual).toBe(expected);
	});
	//
	test(
		'should render an array of components matching the {path} as an array',
		() => {
			// const subject = shallow(
			// 	<RouterBase routes={routes} path={['app', 'home']} />
			// );
			render(<RouterBase routes={routes} path={['app', 'home']} />);
			const view = screen.getAllByTestId('button');

			const expected = 2;

			expect(view.length).toBe(expected);

			// const expected = 2;
			// const actual = subject.find(View).length;
			//
			// expect(actual).toBe(expected);
		}
	);
	//
	test(
		'should render no children if {path} does not exist in {routes}',
		() => {
			// Modify the console spy to silence error output with
			// an empty mock implementation
			console.error.mockImplementation();

			// const subject = shallow(
			// 	<RouterBase routes={routes} path="/help" />
			// );
			render(<RouterBase routes={routes} path="/help" />);
			const view = screen.queryByTestId('button');

			expect(view).toBeNull();

			// const expected = 0;
			// const actual = subject.children().length;
			//
			// expect(actual).toBe(expected);
		}
	);
	//
	test('should render children into {component}', () => {
		const component = (props) => (
			<div data-testid="div1">
				<div data-testid="div2">
					{props.children}
				</div>
			</div>
		);

		// const subject = mount(
		// 	<Router routes={routes} path="/app/settings" component={component} />
		// );
		render(<Router routes={routes} path="/app/settings" component={component} />);
		const secondDiv = screen.getByTestId('div2');

		const expected = 2;
		const actual = secondDiv.childElementCount;

		expect (actual).toBe(expected);

		// const expected = 2;
		// const actual = subject.find('.div2').children().length;
		//
		// expect(actual).toBe(expected);
	});
	//
	test(
		'should render an array of components matching the {path} using JSX routes',
		() => {
			// const subject = mount(
			// 	<Router path="/app/home">
			// 		<Route path="app" component={View}>
			// 			<Route path="home" component={View} />
			// 			<Route path="settings" component={View} />
			// 		</Route>
			// 		<Route path="admin" component={View} />
			// 	</Router>
			// );
			render(
				<Router path="/app/home">
					<Route path="app" component={View}>
						<Route path="home" component={View} />
						<Route path="settings" component={View} />
					</Route>
					<Route path="admin" component={View} />
				</Router>
			);
			const view = screen.getAllByTestId('button');

			const expected = 2;
			const actual = view.length;

			expect(actual).toBe(expected);

			// const expected = 2;
			// const actual = subject.find(View).length;
			//
			// expect(actual).toBe(expected);
		}
	);
	//
	test(
		'should render a different component when the routes change for the same {path}',
		() => {
			// const subject = mount(
			// 	<Router path="/app">
			// 		<Route path="app" component={View}>
			// 			<Route path="home" component={View} />
			// 			<Route path="settings" component={View} />
			// 		</Route>
			// 		<Route path="admin" component={View} />
			// 	</Router>
			// );
			const {rerender} = render(
				<Router path="/app">
					<Route path="app" component={View}>
						<Route path="home" component={View} />
						<Route path="settings" component={View} />
					</Route>
					<Route path="admin" component={View} />
				</Router>
			);

			const NewView = () => <span data-testid="span"/>;

			rerender(
				<Router path="/app">
					<Route path="app" component={NewView}>
						<Route path="app" component={NewView} />
					</Route>
				</Router>
			);
			const view = screen.getByTestId('span');

			expect(view).toBeInTheDocument();

			// subject.setProps({
			// 	path: '/app',
			// 	children: [
			// 		<Route path="app" component={NewView} />
			// 	]
			// });

			// const expected = 1;
			// const actual = subject.find(NewView).length;
			//
			// expect(actual).toBe(expected);
		}
	);
	//
	test('should render nothing for an invalid path', () => {
		// Modify the console spy to silence error output with
		// an empty mock implementation
		console.error.mockImplementation();

		// const subject = mount(
		// 	<Router path="/does/not/exist">
		// 		<Route path="app" component={View}>
		// 			<Route path="home" component={View} />
		// 			<Route path="settings" component={View} />
		// 		</Route>
		// 		<Route path="admin" component={View} />
		// 	</Router>
		// );
		render(
			<Router path="/does/not/exist">
				<Route path="app" component={View}>
					<Route path="home" component={View} />
					<Route path="settings" component={View} />
				</Route>
				<Route path="admin" component={View} />
			</Router>
		);
		const view = screen.queryByTestId('button');

		expect(view).toBeNull();

		// const expected = 0;
		// const actual = subject.find('div').children().length;
		//
		// expect(actual).toBe(expected);
	});
	//
	test('should render nothing for a partially valid path', () => {
		// Modify the console spy to silence error output with
		// an empty mock implementation
		console.error.mockImplementation();

		// const subject = mount(
		// 	<Router path="/app/home/other">
		// 		<Route path="app" component={View}>
		// 			<Route path="home" component={View} />
		// 			<Route path="settings" component={View} />
		// 		</Route>
		// 		<Route path="admin" component={View} />
		// 	</Router>
		// );
		render(
			<Router path="/app/home/other">
				<Route path="app" component={View}>
					<Route path="home" component={View} />
					<Route path="settings" component={View} />
				</Route>
				<Route path="admin" component={View} />
			</Router>
		);
		const view = screen.queryByTestId('button');

		expect(view).toBeNull();

		// const expected = 0;
		// const actual = subject.find('div').children().length;
		//
		// expect(actual).toBe(expected);
	});
});
