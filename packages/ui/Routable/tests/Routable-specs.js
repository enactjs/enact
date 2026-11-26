import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {useState, useCallback} from 'react';

import Link from '../Link';
import Routable from '../Routable';
import Route from '../Route';

describe('Routable', () => {
	test('should render nothing for a partially valid path', async () => {
		const App = () => {
			return (
				<div>
					<Link path="./page2">Page 2</Link>
				</div>
			);
		};

		const Page2 = () => {
			return (
				<div data-testid="page2" />
			);
		};

		const Views = Routable({navigate: 'onNavigate'}, ({children}) => <div>{children}</div>);

		function Sample (props) {
			const [path, nav] = useState('/app');
			const handleNavigate = useCallback((ev) => nav(ev.path), [nav]);

			return (
				<Views {...props} path={path} onNavigate={handleNavigate}>
					<Route path="app" component={App}>
						<Route path="page2" component={Page2} />
					</Route>
				</Views>
			);
		}
		const user = userEvent.setup();

		render(<Sample />);
		const linkToSecondPage = screen.getByText('Page 2');

		// click once to navigate to new path
		await user.click(linkToSecondPage);

		let secondPage = screen.getByTestId('page2');
		expect(secondPage).toBeInTheDocument();

		// clicking again should use the same base path "/app" for the same result
		await user.click(linkToSecondPage);

		secondPage = screen.getByTestId('page2');
		expect(secondPage).toBeInTheDocument();
	});

	describe('navigating from the routed component', () => {
		const Views = Routable({navigate: 'onNavigate'}, ({children, onNavigate}) => (
			<div>
				<button onClick={() => onNavigate({index: 0, source: 'back'})}>back</button>
				{children}
			</div>
		));

		const renderViews = (path, handleNavigate) => render(
			<Views onNavigate={handleNavigate} path={path}>
				<Route path="app" component={() => <div>app</div>}>
					<Route path="page2" component={() => <div>page 2</div>} />
				</Route>
			</Views>
		);

		test('should add the path up to the navigated index to a string path', async () => {
			const handleNavigate = jest.fn();
			const user = userEvent.setup();
			renderViews('/app/page2', handleNavigate);

			await user.click(screen.getByText('back'));

			expect(handleNavigate).toHaveBeenCalledWith({index: 0, path: '/app', source: 'back'});
		});

		test('should add the path up to the navigated index to an array path', async () => {
			const handleNavigate = jest.fn();
			const user = userEvent.setup();
			renderViews(['app', 'page2'], handleNavigate);

			await user.click(screen.getByText('back'));

			expect(handleNavigate).toHaveBeenCalledWith({index: 0, path: ['app'], source: 'back'});
		});
	});
});

describe('Route', () => {
	let consoleWarnMock = null;
	let consoleErrorMock = null;

	beforeEach(() => {
		consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation();
		consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();
	});

	afterEach(() => {
		consoleWarnMock.mockRestore();
		consoleErrorMock.mockRestore();
	});

	test('should return an error if no props are provided to `Route`', async () => {
		render(<Route />);

		expect(consoleErrorMock).toHaveBeenCalled();
	});
});
