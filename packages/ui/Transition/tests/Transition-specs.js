import React from 'react';
import {mount} from 'enzyme';
import Transition from '../Transition';
import css from '../Transition.less';

describe('Transition Specs', () => {
	// NOTE: Feature not yet implemented
	it.skip('should apply author classes', function () {
		const className = 'classA classB';

		const ChildNode = (props) => <div {...props}>Body</div>;

		const wrapped = mount(
			<Transition className={className}>
				<ChildNode />
			</Transition>
		);

		const expected = className;
		const actual = wrapped.find('ChildNode').prop('className');

		expect(actual).to.contain(expected);
	});

	// NOTE: Feature not yet implemented
	it.skip('should apply author styles', function () {
		const styles = {
			color: '#000000',
			backgroundColor: '#FFFFFF'
		};

		const ChildNode = (props) => <div {...props}>Body</div>;

		const wrapped = mount(
			<Transition style={styles}>
				<ChildNode />
			</Transition>
		);

		const expected = styles;
		const actual = wrapped.find('ChildNode').prop('style');

		expect(actual).to.equal(expected);
	});

	// Tests for prop and className combinations
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
		[css.ease, 'ease'],
		[css['ease-in'], 'ease-in'],
		[css['ease-out'], 'ease-out'],
		[css['ease-in-out'], 'ease-in-out'],
		[css['ease-in-quart'], 'ease-in-quart'],
		[css['ease-out-quart'], 'ease-out-quart'],
		[css.linear, 'linear']
	];

	const propStyleCombination = [
		['duration', durationCombination],
		['direction', directionCombination],
		['timingFunction', timingFunctionCombination]
	];

	propStyleCombination.forEach(([prop, val]) => {
		val.forEach(([key, value]) => {
			it(`should apply classes for ${prop}="${value}"`, function () {
				const propValue = {
					[prop]: value
				};
				const wrapped = mount(
					<Transition {...propValue} visible>Body</Transition>
				);

				const expected = key;
				const actual = wrapped.find('div').at(0).prop('className');

				expect(actual).to.contain(expected);
			});
		});
	});
});
