import React from 'react';
import {shallow, mount} from 'enzyme';

import ilib from '../../ilib/lib/ilib.js';
import {updateLocale} from '../../locale';
import {contextTypes, I18nDecorator} from '../I18nDecorator';

describe('I18nDecorator', () => {

	// Suite-wide setup

	beforeEach(function () {
		updateLocale('en-US');
	});

	afterEach(function () {
		updateLocale();
	});

	it('should add rtl context parameter', function () {
		const Component = (props, context) => (
			<div>{'rtl' in context ? 'has rtl context' : 'does not have rtl context'}</div>
		);
		Component.contextTypes = contextTypes;

		const Wrapped = I18nDecorator(Component);
		const subject = mount(<Wrapped />);

		const expected = 'has rtl context';
		const actual = subject.text();

		expect(actual).to.equal(expected);
	});

	it('should add updateLocale context parameter', function () {
		const Component = (props, context) => (
			<div>{typeof context.updateLocale}</div>
		);
		Component.contextTypes = contextTypes;

		const Wrapped = I18nDecorator(Component);
		const subject = mount(<Wrapped />);

		const expected = 'function';
		const actual = subject.text();

		expect(actual).to.equal(expected);
	});

	it('should update the current locale when updateLocale is called', function () {
		const Component = (props, context) => {
			const handleClick = () => context.updateLocale('ar-SA');

			return (
				<button onClick={handleClick} />
			);
		};
		Component.contextTypes = contextTypes;

		const Wrapped = I18nDecorator(Component);
		const subject = mount(<Wrapped />);
		subject.find('button').simulate('click');

		const expected = 'ar-SA';
		const actual = ilib.getLocale();

		expect(actual).to.equal(expected);
	});

	it('should update the rtl context parameter when RTL changes', function () {
		const Component = (props, context) => {
			const handleClick = () => context.updateLocale('ar-SA');

			return (
				<button onClick={handleClick}>{context.rtl ? 'rtl' : 'ltr'}</button>
			);
		};
		Component.contextTypes = contextTypes;

		const Wrapped = I18nDecorator(Component);
		const subject = mount(<Wrapped />);
		const button = subject.find('button');

		button.simulate('click');
		subject.update();

		const expected = 'rtl';
		const actual = button.text();

		expect(actual).to.equal(expected);
	});

	it('should set locale via props', function () {
		const Component = (props) => (
			<div className={props.className} />
		);

		const Wrapped = I18nDecorator(Component);
		shallow(<Wrapped locale="ar-SA" />);

		const expected = 'ar-SA';
		const actual = ilib.getLocale();

		expect(actual).to.equal(expected);
	});

	it('should add locale classes to Wrapped', function () {
		const Component = (props) => (
			<div className={props.className} />
		);

		const Wrapped = I18nDecorator(Component);
		// explicitly setting locale so we get a known class list regardless of runtime locale
		const subject = shallow(<Wrapped locale="en-US" />);

		const expected = true;
		const actual =	subject.hasClass('enact-locale-en') &&
						subject.hasClass('enact-locale-en-US') &&
						subject.hasClass('enact-locale-US');

		expect(actual).to.equal(expected);
	});
});
