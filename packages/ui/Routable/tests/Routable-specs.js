import {mount} from 'enzyme';
import React from 'react';

import Link from '../Link';
import Routable from '../Routable';
import Route from '../Route';

describe('Routable', () => {

	test('should render nothing for a partially valid path', function () {
		function App () {
			return (
				<div>
					<Link path="./page2">Page 2</Link>
				</div>
			);
		}

		function Page2 () {
			return (
				<div id="page2" />
			);
		}

		const Views = Routable({navigate: 'onNavigate'}, ({children}) => <div>{children}</div>);

		function Sample (props) {
			const [path, nav] = React.useState('/app');
			const handleNavigate = React.useCallback((ev) => nav(ev.path), [nav]);

			return (
				<Views {...props} path={path} onNavigate={handleNavigate}>
					<Route path="app" component={App}>
						<Route path="page2" component={Page2} />
					</Route>
				</Views>
			);
		}

		const subject = mount(<Sample />);

		const expected = 1;

		// click once to navigate to new path
		subject.find('a').simulate('click');

		let actual = subject.find('#page2').length;
		expect(actual).toBe(expected);

		// clicking again should use the same base path "/app" for the same result
		subject.find('a').simulate('click');

		actual = subject.find('#page2').length;
		expect(actual).toBe(expected);
	});
});
