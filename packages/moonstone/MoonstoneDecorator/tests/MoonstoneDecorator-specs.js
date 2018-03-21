import React from 'react';
import {mount} from 'enzyme';
import MoonstoneDecorator from '../';
import Spotlight from '@enact/spotlight';

import css from '../MoonstoneDecorator.less';

describe('MoonstoneDecorator', () => {

	const AppRoot = (props) => <div data-app {...props} />;

	it('should add base moonstone classes to wrapped component', function () {
		const config = {ri: false, i18n: false, spotlight: false, float: false, overlay: false};
		const App = MoonstoneDecorator(config, AppRoot);
		const subject = mount(
			<App />
		);

		Spotlight.terminate();

		const appRoot = subject.find('[data-app]');

		const expected = true;
		const actual = appRoot.hasClass('moonstone') && appRoot.hasClass(css.bg);

		expect(actual).to.equal(expected);
	});

	it('should add author classes to wrapped component', function () {
		const config = {ri: false, i18n: false, spotlight: false, float: false, overlay: false};
		const App = MoonstoneDecorator(config, AppRoot);
		const subject = mount(
			<App className="author-class" />
		);

		Spotlight.terminate();

		const appRoot = subject.find('[data-app]');

		const expected = true;
		const actual = appRoot.hasClass('author-class');

		expect(actual).to.equal(expected);
	});

	it('should not add .moonstone class to wrapped component when float is enabled', function () {
		const config = {ri: false, i18n: false, spotlight: false, float: true, overlay: false};
		const App = MoonstoneDecorator(config, AppRoot);
		const subject = mount(
			<App />
		);

		Spotlight.terminate();

		const appRoot = subject.find('[data-app]');

		const expected = false;
		const actual = appRoot.hasClass('moonstone');

		expect(actual).to.equal(expected);
	});

	it('should not add .bg class to wrapped component when overlay is enabled', function () {
		const config = {ri: false, i18n: false, spotlight: false, float: false, overlay: true};
		const App = MoonstoneDecorator(config, AppRoot);
		const subject = mount(
			<App />
		);

		Spotlight.terminate();

		const appRoot = subject.find('[data-app]');

		const expected = false;
		const actual = appRoot.hasClass(css.bg);

		expect(actual).to.equal(expected);
	});

});
