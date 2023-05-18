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
});
