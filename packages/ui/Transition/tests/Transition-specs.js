import React from 'react';
import {mount} from 'enzyme';
import Transition, {TransitionBase} from '../Transition';
import css from '../Transition.less';

describe('Transition Specs', () => {
	// NOTE: Feature not yet implemented
	test.skip('should apply author classes', function () {
		const className = 'classA classB';

		const ChildNode = (props) => <div {...props}>Body</div>;

		const wrapped = mount(
			<Transition className={className}>
				<ChildNode />
			</Transition>
		);

		const expected = className;
		const actual = wrapped.find('ChildNode').prop('className');

		expect(actual).toContain(expected);
	});

	// NOTE: Feature not yet implemented
	test.skip('should apply author styles', function () {
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

		expect(actual).toBe(expected);
	});


	test('should apply \'shown\' class when visible', () => {
		const subject = mount(
			<TransitionBase />
		);

		const expected = 'shown';
		const actual = subject.find('div').at(0).prop('className');

		expect(actual).toContain(expected);
	});

	test('should apply \'hidden\' class when not visible', () => {
		const subject = mount(
			<TransitionBase visible={false} />
		);

		const expected = 'hidden';
		const actual = subject.find('div').at(0).prop('className');

		expect(actual).toContain(expected);
	});

	test('should apply \'shown\' class when visible with noAnimation', () => {
		const subject = mount(
			<TransitionBase noAnimation />
		);

		const expected = 'shown';
		const actual = subject.find('div').at(0).prop('className');

		expect(actual).toContain(expected);
	});

	test('should apply \'hidden\' class when not visible with noAnimation', () => {
		const subject = mount(
			<TransitionBase visible={false} noAnimation />
		);

		const expected = 'hidden';
		const actual = subject.find('div').at(0).prop('className');

		expect(actual).toContain(expected);
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
			test(`should apply classes for ${prop}="${value}"`, () => {
				const propValue = {
					[prop]: value
				};
				const wrapped = mount(
					<Transition {...propValue} visible>Body</Transition>
				);

				const expected = key;
				const actual = wrapped.find('div').at(0).prop('className');

				expect(actual).toContain(expected);
			});
		});
	});
});
