import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import Transition, {TransitionBase} from '../Transition';
import css from '../Transition.module.less';

describe('Transition Specs', () => {
	// NOTE: Feature not yet implemented
	test.skip('should apply author classes', function () {
		const className = 'classA classB';

		const ChildNode = (props) => <div {...props}>Body</div>;

		render(
			<Transition className={className}>
				<ChildNode />
			</Transition>
		);

		const expected = className;
		const actual = screen.getByText('Body');

		expect(actual).toHaveClass(expected);
	});

	// NOTE: Feature not yet implemented
	test.skip('should apply author styles', function () {
		const styles = {
			color: '#000000',
			backgroundColor: '#FFFFFF'
		};

		const ChildNode = (props) => <div {...props}>Body</div>;

		render(
			<Transition style={styles}>
				<ChildNode />
			</Transition>
		);

		const expected = styles;
		const actual = screen.getByText('Body');

		expect(actual).toHaveStyle(expected);
	});


	test('should apply \'shown\' class when visible', () => {
		render(
			<TransitionBase data-testid="transition" />
		);

		const expected = 'shown';
		const actual = screen.getByTestId('transition');

		expect(actual).toHaveClass(expected);
	});

	test('should apply \'hidden\' class when not visible', () => {
		render(
			<TransitionBase data-testid="transition" visible={false} />
		);

		const expected = 'hidden';
		const actual = screen.getByTestId('transition');

		expect(actual).toHaveClass(expected);
	});

	test('should apply \'shown\' class when visible with noAnimation', () => {
		render(
			<TransitionBase data-testid="transition" noAnimation />
		);

		const expected = 'shown';
		const actual = screen.getByTestId('transition');

		expect(actual).toHaveClass(expected);
	});

	test('should apply \'hidden\' class when not visible with noAnimation', () => {
		render(
			<TransitionBase data-testid="transition" noAnimation visible={false} />
		);

		const expected = 'hidden';
		const actual = screen.getByTestId('transition');

		expect(actual).toHaveClass(expected);
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
				render(
					<Transition {...propValue} data-testid="transition" visible>Body</Transition>
				);

				const expected = key;
				const actual = screen.getByTestId('transition');

				expect(actual).toHaveClass(expected);
			});
		});
	});
});
