import '@testing-library/jest-dom';
import {act, fireEvent, render, screen} from '@testing-library/react';

import {Marquee, MarqueeBase, MarqueeController} from '../index.js';

const
	ltrText = 'This is some fine latin text.',
	rtlText = 'العربية - العراق',
	ltrArray = [
		'The first quick brown fox jumped over the first lazy dog. The bean bird flies at sundown.',
		'The second quick brown fox jumped over the second lazy dog. The bean bird flies at sundown.'
	];

const Controller = MarqueeController({marqueeOnFocus: true}, 'div');

beforeEach(() => {
	jest.useFakeTimers();
	global.Element.prototype.getBoundingClientRect = jest.fn(() => {
		return {
			width: 100,
			height: 50,
			top: 0,
			left: 0,
			bottom: 0,
			right: 0
		};
	});

	const observe = jest.fn();
	global.IntersectionObserver = class IntersectionObserver {
		constructor () {}

		disconnect () {
			return null;
		}

		observe () {
			return observe;
		}
	};
});

afterEach(() => {
	jest.useRealTimers();
});

describe('Marquee', () => {
	test('should determine the correct directionality of latin text on initial render', () => {
		render(<Marquee>{ltrText}</Marquee>);
		const marquee = screen.getByText(ltrText);

		const expected = 'ltr';

		expect(marquee).toHaveStyle({'direction': expected});
	});

	test('should determine the correct directionality of non-latin text on initial render', () => {
		render(<Marquee>{rtlText}</Marquee>);
		const marquee = screen.getByText(rtlText);

		const expected = 'rtl';

		expect(marquee).toHaveStyle({'direction': expected});
	});

	test('should force the directionality text if forceDirection is specified', () => {
		render(<Marquee forceDirection="ltr">{rtlText}</Marquee>);
		const marquee = screen.getByText(rtlText);

		const expected = 'ltr';

		expect(marquee).toHaveStyle({'direction': expected});
	});

	test('should switch directionality when the text content changes after initial render', () => {
		const {rerender} = render(<Marquee>{ltrText}</Marquee>);
		const marquee = screen.getByText(ltrText);

		rerender(<Marquee>{rtlText}</Marquee>);

		const expected = 'rtl';

		expect(marquee).toHaveStyle({'direction': expected});
	});

	test('should not switch directionality when the text content changes after initial render and the forceDirection property was already set', () => {
		const {rerender} = render(<Marquee forceDirection="ltr">{ltrText}</Marquee>);
		const marquee = screen.getByText(ltrText);

		rerender(<Marquee forceDirection="ltr">{rtlText}</Marquee>);

		const expected = 'ltr';

		expect(marquee).toHaveStyle({'direction': expected});
	});

	test('should override direction to RTL when forceDirection is set and locale is LTR', () => {
		render(<Marquee data-testid="marquee" forceDirection="rtl" locale="ltr" />);
		const marquee = screen.getByTestId('marquee').children.item(0).children.item(0);

		const expected = 'rtl';

		expect(marquee).toHaveStyle({'direction': expected});
	});

	test('should not override direction to RTL when forceDirection is "locale" and locale is LTR', () => {
		const {rerender} = render(<Marquee forceDirection="locale">{ltrText}</Marquee>);
		const marquee = screen.getByText(ltrText);

		const expected = 'ltr';

		expect(marquee).toHaveStyle({'direction': expected});

		rerender(<Marquee forceDirection="locale">{rtlText}</Marquee>);

		expect(marquee).toHaveStyle({'direction': expected});
	});

	test('should override direction to LTR when forceDirection is set and locale is RTL', () => {
		render(<Marquee data-testid="marquee" forceDirection="ltr" locale="rtl" />);
		const marquee = screen.getByTestId('marquee').children.item(0).children.item(0);

		const expected = 'ltr';

		expect(marquee).toHaveStyle({'direction': expected});
	});

	test('should have direction of RTL when forceDirection is RTL and locale is RTL', () => {
		render(<Marquee data-testid="marquee" forceDirection="rtl" locale="rtl" />);
		const marquee = screen.getByTestId('marquee').children.item(0).children.item(0);

		const expected = 'rtl';

		expect(marquee).toHaveStyle({'direction': expected});
	});

	test('should have direction of LTR when forceDirection is LTR and locale is LTR', () => {
		render(<Marquee data-testid="marquee" forceDirection="ltr" locale="ltr" />);
		const marquee = screen.getByTestId('marquee').children.item(0).children.item(0);

		const expected = 'ltr';

		expect(marquee).toHaveStyle({'direction': expected});
	});

	test('should convert percentage values of marqueeSpacing to absolute values', (done) => {
		render(<Marquee data-testid="marquee" marqueeOn="render" marqueeOnRenderDelay={10} marqueeSpacing="60%" />);

		act(() => jest.advanceTimersByTime(100));

		const expected = '60';
		const marquee = screen.getByTestId('marquee').children.item(0).children.item(0);

		expect(marquee).toHaveStyle({'--ui-marquee-spacing': expected});
		done();
	});

	test('should pass absolute values of marqueeSpacing', (done) => {
		render(<Marquee data-testid="marquee" marqueeOn="render" marqueeOnRenderDelay={10} marqueeSpacing={80} />);

		act(() => jest.advanceTimersByTime(100));

		const expected = '80';
		const marquee = screen.getByTestId('marquee').children.item(0).children.item(0);

		expect(marquee).toHaveStyle({'--ui-marquee-spacing': expected});
		done();
	});

	test('should warn when marquees are nested', () => {
		const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
		render(
			<Marquee marqueeOn="render" marqueeOnRenderDelay={10} marqueeSpacing={80} >
				<Marquee marqueeOn="render" marqueeOnRenderDelay={-10} marqueeSpacing={80} />
			</Marquee>
		);

		act(() => jest.advanceTimersByTime(100));

		expect(spy).toHaveBeenCalled();
	});

	test('should not animate when marquee is disabled', () => {
		render(<Marquee marqueeDisabled>{ltrText}</Marquee>);
		const marquee = screen.getByText(ltrText).parentElement;

		const expected = 'marquee';

		expect(marquee).not.toHaveClass(expected);
	});

	test('should start marquee on focus if `marqueeOn` is focus', () => {
		render(<Marquee marqueeOn="focus" marqueeDelay={10}>{ltrText}</Marquee>);
		const marquee = screen.getByText(ltrText);

		fireEvent.focus(marquee);

		act(() => jest.advanceTimersByTime(100));

		expect(marquee).toHaveStyle({'--ui-marquee-spacing': '50'});
	});

	test('should start marquee on hover if `marqueeOn` is hover', () => {
		render(<Marquee marqueeOn="hover" marqueeDelay={10}>{ltrText}</Marquee>);
		const marquee = screen.getByText(ltrText);

		fireEvent.mouseOver(marquee);

		act(() => jest.advanceTimersByTime(100));

		expect(marquee).toHaveStyle({'--ui-marquee-spacing': '50'});
	});

	test('should forward `blur` event', () => {
		const spy = jest.fn();
		render(<Marquee marqueeOn="focus" marqueeDelay={10} onBlur={spy}>{ltrText}</Marquee>);
		const marquee = screen.getByText(ltrText);

		fireEvent.focus(marquee);

		act(() => jest.advanceTimersByTime(100));

		fireEvent.blur(marquee.parentElement.parentElement);

		expect(spy).toHaveBeenCalled();
	});

	test('should forward `mouseleave` event', () => {
		const spy = jest.fn();
		render(<Marquee marqueeOn="hover" marqueeDelay={10} onMouseLeave={spy}>{ltrText}</Marquee>);
		const marquee = screen.getByText(ltrText);

		fireEvent.mouseOver(marquee);

		act(() => jest.advanceTimersByTime(100));

		fireEvent.mouseLeave(marquee);

		expect(spy).toHaveBeenCalled();
	});

	test('should creates and observes with ResizeObserver', () => {
		const originalResizeObserver = global.ResizeObserver;

		const observe = jest.fn();
		global.ResizeObserver = jest.fn(() => ({
			observe,
			disconnect: jest.fn()
		}));

		render(<Marquee>{ltrText}</Marquee>);

		act(() => jest.advanceTimersByTime(100));

		expect(global.ResizeObserver).toHaveBeenCalled();
		expect(observe).toHaveBeenCalled();

		global.ResizeObserver = originalResizeObserver;
	});
});

describe('MarqueeBase', () => {
	// Computed Property Tests
	test('should not include the animate class when animating is false', () => {
		render(<MarqueeBase data-testid="marquee" />);
		const marquee = screen.getByTestId('marquee').children.item(0);

		const expected = 'animate';

		expect(marquee).not.toHaveClass(expected);
	});

	test('should include the animate class when animating is true', () => {
		render(<MarqueeBase animating data-testid="marquee" />);
		const marquee = screen.getByTestId('marquee').children.item(0);

		const expected = 'animate';

		expect(marquee).toHaveClass(expected);
	});

	test('should not transition when animating is false', () => {
		render(<MarqueeBase data-testid="marquee" />);
		const marquee = screen.getByTestId('marquee').children.item(0);

		expect(marquee).not.toHaveStyle({'transition-duration': 'NaNs'});
	});

	test('should transition when animating is true', () => {
		render(<MarqueeBase animating data-testid="marquee" />);
		const marquee = screen.getByTestId('marquee').children.item(0);

		expect(marquee).toHaveStyle({'transition-duration': 'NaNs'});
	});

	test('should set RTL direction in LTR context when the text directionality is RTL', () => {
		render(
			<MarqueeBase data-testid="marquee" rtl />,
			{context: {rtl: false}}
		);
		const marquee = screen.getByTestId('marquee').children.item(0);

		const expected = 'rtl';

		expect(marquee).toHaveStyle({'direction': expected});
	});

	test('should set LTR direction in RTL when the text directionality is LTR', () => {
		render(
			<MarqueeBase data-testid="marquee" />,
			{context: {rtl: true}}
		);
		const marquee = screen.getByTestId('marquee').children.item(0);

		const expected = 'ltr';

		expect(marquee).toHaveStyle({'direction': expected});
	});

	test('should transition from the right with LTR text (a negative translate value)', () => {
		render(<MarqueeBase animating data-testid="marquee" distance={100} />);
		const marquee = screen.getByTestId('marquee').children.item(0);

		const expected = 'translateX(-100px)';

		expect(marquee).toHaveStyle({'transform': expected});
	});

	test('should transition from the left with RTL text (a positive translate value)', () => {
		render(<MarqueeBase animating data-testid="marquee" distance={100} rtl />);
		const marquee = screen.getByTestId('marquee').children.item(0);

		const expected = 'translateX(100px)';

		expect(marquee).toHaveStyle({'transform': expected});
	});

	test('should duplicate from content when promoted and a non-zero distance', () => {
		render(
			<MarqueeBase data-testid="marquee" distance={100} willAnimate>
				Text
			</MarqueeBase>
		);
		const marquee = screen.getByTestId('marquee');

		expect(marquee).toHaveTextContent('TextText');
	});

	test('should not duplicate from content when promoted and a zero distance', () => {
		render(
			<MarqueeBase distance={0} willAnimate>
				Text
			</MarqueeBase>
		);
		const marquee = screen.getByText('Text');

		expect(marquee).toBeInTheDocument();
	});

	test('should not duplicate from content when not promoted and a non-zero distance', () => {
		render(
			<MarqueeBase distance={100}>
				Text
			</MarqueeBase>
		);
		const marquee = screen.getByText('Text');

		expect(marquee).toBeInTheDocument();
	});

	test('should add aria-label with content when promoted and a non-zero distance', () => {
		const text = 'Text';
		render(
			<MarqueeBase data-testid="marquee" distance={100} willAnimate>
				{text}
			</MarqueeBase>
		);
		const marquee = screen.getByTestId('marquee');

		const expected = text;

		expect(marquee).toHaveAttribute('aria-label', expected);
	});

	test('should not override aria-label with content when promoted and a non-zero distance', () => {
		const aria = 'Custom';
		render(
			<MarqueeBase aria-label={aria} data-testid="marquee" distance={100} willAnimate >
				Text
			</MarqueeBase>
		);
		const marquee = screen.getByTestId('marquee');

		const expected = aria;

		expect(marquee).toHaveAttribute('aria-label', expected);
	});

	test('should concatenate string children when promoted and a non-zero distance', () => {
		render(
			<MarqueeBase data-testid="marquee" distance={100} willAnimate>
				This is {'A'} test
			</MarqueeBase>
		);
		const marquee = screen.getByTestId('marquee');

		const expected = 'This is  A  test';

		expect(marquee).toHaveAttribute('aria-label', expected);
	});

	test('should not concatenate non-string children when promoted and a non-zero distance', () => {
		render(
			<MarqueeBase data-testid="marquee" distance={100} willAnimate>
				Test
				<div>Hello</div>
				World
			</MarqueeBase>
		);
		const marquee = screen.getByTestId('marquee');

		const expected = 'Test World';

		expect(marquee).toHaveAttribute('aria-label', expected);
	});

	test('should not throw exception for null children when promoted and a non-zero distance - ENYO-6362', () => {
		const renderSubject = () => render(
			<MarqueeBase distance={100} willAnimate>
				{null}
			</MarqueeBase>
		);

		expect(renderSubject).not.toThrow();
	});
});

describe('MarqueeController', () => {
	test('should start marquee on all children on render if `marqueeOn` is render', () => {
		render(
			<Controller>
				{ltrArray.map((children, index) => (
					<Marquee
						key={index}
						marqueeDelay={10}
						marqueeOn="render"
						marqueeOnRenderDelay={10}
					>
						{children}
					</Marquee>
				))}
			</Controller>
		);

		act(() => jest.advanceTimersByTime(100));

		const marquee1 = screen.getByText(ltrArray[0]);
		const marquee2 = screen.getByText(ltrArray[1]);

		expect(marquee1).toHaveStyle({'--ui-marquee-spacing': '50'});
		expect(marquee2).toHaveStyle({'--ui-marquee-spacing': '50'});
	});

	test('should start marquee on all children when one is focused and `marqueeOn` is focus', () => {
		render(
			<Controller>
				{ltrArray.map((children, index) => (
					<Marquee
						key={index}
						marqueeDelay={10}
						marqueeOn="focus"
					>
						{children}
					</Marquee>
				))}
			</Controller>
		);

		act(() => jest.advanceTimersByTime(100));

		const marquee1 = screen.getByText(ltrArray[0]);
		const marquee2 = screen.getByText(ltrArray[1]);

		fireEvent.focus(marquee1);

		act(() => jest.advanceTimersByTime(100));

		expect(marquee1).toHaveStyle({'--ui-marquee-spacing': '50'});
		expect(marquee2).toHaveStyle({'--ui-marquee-spacing': '50'});
	});

	test('should start marquee on all children when one is hovered and `marqueeOn` is hover', () => {
		render(
			<Controller>
				{ltrArray.map((children, index) => (
					<Marquee
						key={index}
						marqueeDelay={10}
						marqueeOn="hover"
					>
						{children}
					</Marquee>
				))}
			</Controller>
		);

		act(() => jest.advanceTimersByTime(100));

		const marquee1 = screen.getByText(ltrArray[0]);
		const marquee2 = screen.getByText(ltrArray[1]);

		fireEvent.mouseOver(marquee1);

		act(() => jest.advanceTimersByTime(100));

		expect(marquee1).toHaveStyle({'--ui-marquee-spacing': '50'});
		expect(marquee2).toHaveStyle({'--ui-marquee-spacing': '50'});
	});

	test('should forward `blur` event when one of the children is blurred and `marqueeOn` is focus', () => {
		const spy = jest.fn();
		render(
			<Controller onBlur={spy}>
				{ltrArray.map((children, index) => (
					<Marquee
						key={index}
						marqueeDelay={10}
						marqueeOn="focus"
					>
						{children}
					</Marquee>
				))}
			</Controller>
		);

		const marquee1 = screen.getByText(ltrArray[0]);
		const marquee2 = screen.getByText(ltrArray[1]);

		fireEvent.focus(marquee1);
		fireEvent.blur(marquee1);

		fireEvent.focus(marquee2);
		fireEvent.blur(marquee2);

		expect(spy).toHaveBeenCalledTimes(2);
	});

	test('should forward `mouseleave` event when one of the children is unhovered and `marqueeOn` is hover', () => {
		const spy = jest.fn();
		render(
			<Controller onMouseLeave={spy}>
				{ltrArray.map((children, index) => (
					<Marquee
						key={index}
						marqueeDelay={10}
						marqueeOn="hover"
					>
						{children}
					</Marquee>
				))}
			</Controller>
		);

		const marquee1 = screen.getByText(ltrArray[0]);
		const marquee2 = screen.getByText(ltrArray[1]);

		fireEvent.mouseOver(marquee1);
		fireEvent.mouseLeave(marquee1);

		fireEvent.mouseOver(marquee2);
		fireEvent.mouseLeave(marquee2);

		expect(spy).toHaveBeenCalledTimes(2);
	});

	test('should set a minimum value for reset delay when `marqueeDelay` is less than 40', () => {
		render(
			<Controller>
				<Marquee
					marqueeDelay={0}
					marqueeOn="render"
				>
					{ltrArray[0]}
				</Marquee>
			</Controller>
		);

		const marquee1 = screen.getByText(ltrArray[0]);

		marquee1.getBoundingClientRect = jest.fn(() => {
			return {
				width: 50,
				height: 50,
				top: 0,
				left: 0,
				bottom: 0,
				right: 0
			};
		});

		fireEvent.focus(marquee1);
		act(() => jest.advanceTimersByTime(10));

		fireEvent.transitionEnd(marquee1);

		act(() => jest.advanceTimersByTime(10));
		expect(marquee1).toHaveStyle({'transform': 'translateX(0)'});

		act(() => jest.advanceTimersByTime(40));
		expect(marquee1).toHaveStyle({'transform': 'translateX(-125px)'});
	});

});
