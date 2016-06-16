/* globals describe, it, expect */

import React from 'react';
import sinon from 'sinon';
import {mount} from 'enzyme';
import kind from '../kind';

describe('kind', () => {

	const Kind = kind({
		name: 'Kind',
		propTypes: {
			prop: React.PropTypes.number.isRequired,
			label: React.PropTypes.string
		},
		defaultProps: {
			label: 'Label'
		},
		styles: {
			classes: 'kind'
		},
		computed: {
			value: ({prop}) => prop + 1
		},
		render: ({ref, label, value, classes, ...rest}) => {
			delete rest.prop;
			return (
				<div {...rest} className={classes} title={label}>
					{value}
				</div>
			);
		}
	});

	it('Should assign name to displayName', function () {
		const expected = 'Kind';
		const actual = Kind.displayName;

		expect(actual).to.equal(expected);
	});

	it('Should require {prop} property', function () {
		const expected = true;
		const actual = Kind.propTypes.prop({}, 'prop', 'Kind') instanceof Error;

		expect(actual).to.equal(expected);
	});

	it('Should default {label} property', function () {
		const subject = <Kind prop={1} />;

		const expected = 'Label';
		const actual = subject.props.label;

		expect(actual).to.equal(expected);
	});

	it('Should default {label} property when explicitly undefined', function () {
		// Explicitly testing for undefined
		// eslint-disable-next-line no-undefined
		const subject = <Kind prop={1} label={undefined} />;

		const expected = 'Label';
		const actual = subject.props.label;

		expect(actual).to.equal(expected);
	});

	it('Should add classes defined in styles', function () {
		const subject = mount(
			<Kind prop={1} />
		);

		const expected = 'kind';
		const actual = subject.find('div').prop('className');

		expect(actual).to.equal(expected);
	});

	it('Should compute {value} property', function () {
		const subject = mount(
			<Kind prop={1} />
		);

		const expected = 2;
		const actual = subject.find('div').prop('children');

		expect(actual).to.equal(expected);
	});

});
