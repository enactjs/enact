/* globals Map */

import React from 'react';
import {shallow, mount} from 'enzyme';
import Transition from '../Transition';
import css from '../Transition.less';

describe('Transition Specs', () => {
	it('should apply author classes to root node', function () {
		const className = 'classA classB';

		const wrapped = shallow(
			<Transition className={className}>Body</Transition>
		);

		const expected = className;
		const actual = wrapped.prop('className');

		expect(actual).to.equal(expected);
	});

	it('should apply author styles to root node', function () {
		const styles = {
			color: '#000000',
			backgroundColor: '#FFFFFF'
		};

		const wrapped = shallow(
			<Transition style={styles}>Body</Transition>
		);

		const expected = styles;
		const actual = wrapped.prop('style');

		expect(actual).to.equal(expected);
	});

	it('should apply styles to inner wrapper when type == "clip"', function () {
		const clipStyles = {height: 0, overflow: 'hidden'};
		const wrapped = mount(
			<Transition type='clip'>Body</Transition>
		);

		const expected = clipStyles;
		const actual = wrapped.childAt(0).prop('style');

		expect(actual).to.deep.equal(expected);
	});

	// Tests for prop and className combinations
	const visibleCombinations = [
		[css.shown, true],
		[css.hidden, false]
	];

	const directionCombination = [
		[css.up, 'up'],
		[css.right, 'right'],
		[css.down, 'down'],
		[css.left, 'left']
	];

	const durationCombination = [
		[css.short, 'short'],
		[css.medium, 'medium'],
		[css.long, 'long']
	];

	const timingFunctionCombination = [
		[css['ease-in-out'], 'ease-in-out'],
		[css.ease, 'ease'],
		[css.linear, 'linear']
	];

	const propStyleCombination = [
		['visible', visibleCombinations],
		['duration', durationCombination],
		['direction', directionCombination],
		['timingFunction', timingFunctionCombination]
	];

	const propStyleMap = new Map(propStyleCombination);

	propStyleMap.forEach((val, prop) => {
		const combos = new Map(val);
		combos.forEach((value, key) => {
			it(`should apply classes for ${prop}={${value}}`, function () {
				const propValue = {
					[prop]: value
				};
				const wrapped = mount(
					<Transition {...propValue}>Body</Transition>
				);

				const expected = key;
				const actual = wrapped.childAt(0).prop('className');

				expect(actual).to.contain(expected);
			});
		});
	});
});
