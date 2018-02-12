import React from 'react';
import PropTypes from 'prop-types';
import {mount} from 'enzyme';
import Spinner from '../Spinner';
import css from '../Spinner.less';

describe('Spinner Specs', () => {
	const options = {
		context: {
			getFloatingLayer: () => document.getElementById('floatLayer')
		},
		childContextTypes: {
			getFloatingLayer: PropTypes.func
		}
	};

	it('should have centered class when centered prop equals true', function () {
		const spinner = mount(
			<Spinner component="div" centered>
				Loading...
			</Spinner>
		);

		const expected = true;
		const actual = spinner.find(`.${css.spinner}`).hasClass(css.centered);

		expect(actual).to.equal(expected);
	});

	it('should not have content class when Spinner has no children', function () {
		const spinner = mount(
			<Spinner component="div" />
		);

		const expected = false;
		const actual = spinner.find(`.${css.spinner}`).hasClass(css.content);

		expect(actual).to.equal(expected);
	});

	it('should have no scrim class when blockClickOn prop equals container', function () {
		const spinner = mount(
			<Spinner component="div" blockClickOn="container" />
		);

		const expected = false;
		const actual = spinner.find(`.${css.scrim}`).exists();

		expect(actual).to.equal(expected);
	});

	it('should have scrim class when blockClickOn prop equals container and when scrim prop equals true', function () {
		const spinner = mount(
			<Spinner component="div" blockClickOn="container" scrim />
		);

		const expected = true;
		const actual = spinner.find(`.${css.scrim}`).exists();

		expect(actual).to.equal(expected);
	});

	it('should have FloatingLayer when blockClickOn prop equals screen', function () {
		const div = document.createElement('div');
		div.setAttribute('id', 'floatLayer');
		document.body.appendChild(div);

		const spinner = mount(
			<Spinner component="div" blockClickOn="screen" />,
			options
		);

		const expected = true;
		const actual = spinner.find('FloatingLayer').exists();

		expect(actual).to.equal(expected);
	});
});
