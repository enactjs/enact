import React from 'react';
import sinon from 'sinon';
import {mount} from 'enzyme';
import IncrementSlider from '../IncrementSlider';
import css from '../IncrementSlider.less';

const tap = (node) => {
	node.simulate('mousedown');
	node.simulate('mouseup');
};
const decrement = (slider) => tap(slider.find('IconButton').first());
const increment = (slider) => tap(slider.find('IconButton').last());
const keyDown = (keyCode) => (node) => node.simulate('keydown', {keyCode});

const leftKeyDown = keyDown(37);
const rightKeyDown = keyDown(39);
const upKeyDown = keyDown(38);
const downKeyDown = keyDown(40);

const callCount = spy => {
	switch (spy.callCount) {
		case 0:
			return 'not called';
		case 1:
			return 'called once';
		default:
			return `called ${spy.callCount} times`;
	}
};

describe('IncrementSlider Specs', () => {
	test('should decrement value', () => {
		const handleChange = sinon.spy();
		const value = 50;
		const incrementSlider = mount(
			<IncrementSlider
				onChange={handleChange}
				value={value}
			/>
		);

		decrement(incrementSlider);

		const expected = value - 1;
		const actual = handleChange.args[0][0].value;

		expect(actual).toBe(expected);
	});

	test('should increment value', () => {
		const handleChange = sinon.spy();
		const value = 50;
		const incrementSlider = mount(
			<IncrementSlider
				onChange={handleChange}
				value={value}
			/>
		);

		increment(incrementSlider);

		const expected = value + 1;
		const actual = handleChange.args[0][0].value;

		expect(actual).toBe(expected);
	});

	test('should only call onChange once', () => {
		const handleChange = sinon.spy();
		const value = 50;
		const incrementSlider = mount(
			<IncrementSlider
				onChange={handleChange}
				value={value}
			/>
		);

		increment(incrementSlider);

		const expected = true;
		const actual = handleChange.calledOnce;

		expect(actual).toBe(expected);
	});

	test('should not call onChange on prop change', () => {
		const handleChange = sinon.spy();
		const value = 50;
		const incrementSlider = mount(
			<IncrementSlider
				onChange={handleChange}
				value={value}
			/>
		);

		incrementSlider.setProps({onChange: handleChange, value: value + 1});

		const expected = false;
		const actual = handleChange.called;

		expect(actual).toBe(expected);
	});

	test('should disable decrement button when value === min', () => {
		const incrementSlider = mount(
			<IncrementSlider
				value={0}
				min={0}
			/>
		);

		const expected = true;
		const actual = incrementSlider.find(`IconButton.${css.decrementButton}`).prop('disabled');

		expect(actual).toBe(expected);
	});

	test('should disable increment button when value === max', () => {
		const incrementSlider = mount(
			<IncrementSlider
				value={10}
				max={10}
			/>
		);

		const expected = true;
		const actual = incrementSlider.find(`IconButton.${css.incrementButton}`).prop('disabled');

		expect(actual).toBe(expected);
	});

	test('should use custom incrementIcon', () => {
		const icon = 'plus';
		const incrementSlider = mount(
			<IncrementSlider incrementIcon={icon} />
		);

		const expected = icon;
		const actual = incrementSlider.find(`.${css.incrementButton} Icon`).prop('children');

		expect(actual).toBe(expected);
	});

	test('should use custom decrementIcon', () => {
		const icon = 'minus';
		const incrementSlider = mount(
			<IncrementSlider decrementIcon={icon} />
		);

		const expected = icon;
		const actual = incrementSlider.find(`.${css.decrementButton} Icon`).prop('children');

		expect(actual).toBe(expected);
	});

	test(
		'should set decrementButton "aria-label" to value and hint string',
		() => {
			const incrementSlider = mount(
				<IncrementSlider value={10} />
			);

			const expected = '10 press ok button to decrease the value';
			const actual = incrementSlider.find(`IconButton.${css.decrementButton}`).prop('aria-label');

			expect(actual).toBe(expected);
		}
	);

	test(
		'should set decrementButton "aria-label" to decrementAriaLabel',
		() => {
			const label = 'decrement aria label';
			const incrementSlider = mount(
				<IncrementSlider value={10} decrementAriaLabel={label} />
			);

			const expected = `10 ${label}`;
			const actual = incrementSlider.find(`IconButton.${css.decrementButton}`).prop('aria-label');

			expect(actual).toBe(expected);
		}
	);

	test(
		'should not set decrementButton "aria-label" when decrementButton is disabled',
		() => {
			const incrementSlider = mount(
				<IncrementSlider disabled value={10} />
			);

			const expected = null;
			const actual = incrementSlider.find(`IconButton.${css.decrementButton}`).prop('aria-label');

			expect(actual).toBe(expected);
		}
	);

	test(
		'should set incrementButton "aria-label" to value and hint string',
		() => {
			const incrementSlider = mount(
				<IncrementSlider value={10} />
			);

			const expected = '10 press ok button to increase the value';
			const actual = incrementSlider.find(`IconButton.${css.incrementButton}`).prop('aria-label');

			expect(actual).toBe(expected);
		}
	);

	test(
		'should set incrementButton "aria-label" to incrementAriaLabel',
		() => {
			const label = 'increment aria label';
			const incrementSlider = mount(
				<IncrementSlider value={10} incrementAriaLabel={label} />
			);

			const expected = `10 ${label}`;
			const actual = incrementSlider.find(`IconButton.${css.incrementButton}`).prop('aria-label');

			expect(actual).toBe(expected);
		}
	);

	test(
		'should not set incrementButton "aria-label" when incrementButton is disabled',
		() => {
			const incrementSlider = mount(
				<IncrementSlider disabled value={10} />
			);

			const expected = null;
			const actual = incrementSlider.find(`IconButton.${css.incrementButton}`).prop('aria-label');

			expect(actual).toBe(expected);
		}
	);

	// test directional events from IncrementSliderButtons

	test(
		'should call onSpotlightLeft from the decrement button of horizontal IncrementSlider',
		() => {
			const handleSpotlight = sinon.spy();
			const incrementSlider = mount(
				<IncrementSlider onSpotlightLeft={handleSpotlight} />
			);

			leftKeyDown(incrementSlider.find(`IconButton.${css.decrementButton}`));

			const expected = 'called once';
			const actual = callCount(handleSpotlight);

			expect(actual).toBe(expected);
		}
	);

	test(
		'should call onSpotlightLeft from the decrement button of vertical IncrementSlider',
		() => {
			const handleSpotlight = sinon.spy();
			const incrementSlider = mount(
				<IncrementSlider orientation="vertical" onSpotlightLeft={handleSpotlight} />
			);

			leftKeyDown(incrementSlider.find(`IconButton.${css.decrementButton}`));

			const expected = 'called once';
			const actual = callCount(handleSpotlight);

			expect(actual).toBe(expected);
		}
	);

	test(
		'should call onSpotlightLeft from the increment button of vertical IncrementSlider',
		() => {
			const handleSpotlight = sinon.spy();
			const incrementSlider = mount(
				<IncrementSlider orientation="vertical" onSpotlightLeft={handleSpotlight} />
			);

			leftKeyDown(incrementSlider.find(`IconButton.${css.incrementButton}`));

			const expected = 'called once';
			const actual = callCount(handleSpotlight);

			expect(actual).toBe(expected);
		}
	);

	test(
		'should call onSpotlightRight from the increment button of horizontal IncrementSlider',
		() => {
			const handleSpotlight = sinon.spy();
			const incrementSlider = mount(
				<IncrementSlider onSpotlightRight={handleSpotlight} />
			);

			rightKeyDown(incrementSlider.find(`IconButton.${css.incrementButton}`));

			const expected = 'called once';
			const actual = callCount(handleSpotlight);

			expect(actual).toBe(expected);
		}
	);

	test(
		'should call onSpotlightRight from the increment button of vertical IncrementSlider',
		() => {
			const handleSpotlight = sinon.spy();
			const incrementSlider = mount(
				<IncrementSlider orientation="vertical" onSpotlightRight={handleSpotlight} />
			);

			rightKeyDown(incrementSlider.find(`IconButton.${css.incrementButton}`));

			const expected = 'called once';
			const actual = callCount(handleSpotlight);

			expect(actual).toBe(expected);
		}
	);

	test(
		'should call onSpotlightRight from the decrement button of vertical IncrementSlider',
		() => {
			const handleSpotlight = sinon.spy();
			const incrementSlider = mount(
				<IncrementSlider orientation="vertical" onSpotlightRight={handleSpotlight} />
			);

			rightKeyDown(incrementSlider.find(`IconButton.${css.decrementButton}`));

			const expected = 'called once';
			const actual = callCount(handleSpotlight);

			expect(actual).toBe(expected);
		}
	);

	test(
		'should call onSpotlightUp from the decrement button of horizontal IncrementSlider',
		() => {
			const handleSpotlight = sinon.spy();
			const incrementSlider = mount(
				<IncrementSlider onSpotlightUp={handleSpotlight} />
			);

			upKeyDown(incrementSlider.find(`IconButton.${css.decrementButton}`));

			const expected = 'called once';
			const actual = callCount(handleSpotlight);

			expect(actual).toBe(expected);
		}
	);

	test(
		'should call onSpotlightUp from the increment button of horizontal IncrementSlider',
		() => {
			const handleSpotlight = sinon.spy();
			const incrementSlider = mount(
				<IncrementSlider onSpotlightUp={handleSpotlight} />
			);

			upKeyDown(incrementSlider.find(`IconButton.${css.incrementButton}`));

			const expected = 'called once';
			const actual = callCount(handleSpotlight);

			expect(actual).toBe(expected);
		}
	);

	test(
		'should call onSpotlightUp from the increment button of vertical IncrementSlider',
		() => {
			const handleSpotlight = sinon.spy();
			const incrementSlider = mount(
				<IncrementSlider orientation="vertical" onSpotlightUp={handleSpotlight} />
			);

			upKeyDown(incrementSlider.find(`IconButton.${css.incrementButton}`));

			const expected = 'called once';
			const actual = callCount(handleSpotlight);

			expect(actual).toBe(expected);
		}
	);

	test(
		'should call onSpotlightDown from the increment button of horizontal IncrementSlider',
		() => {
			const handleSpotlight = sinon.spy();
			const incrementSlider = mount(
				<IncrementSlider onSpotlightDown={handleSpotlight} />
			);

			downKeyDown(incrementSlider.find(`IconButton.${css.incrementButton}`));

			const expected = 'called once';
			const actual = callCount(handleSpotlight);

			expect(actual).toBe(expected);
		}
	);

	test(
		'should call onSpotlightDown from the decrement button of horizontal IncrementSlider',
		() => {
			const handleSpotlight = sinon.spy();
			const incrementSlider = mount(
				<IncrementSlider orientation="vertical" onSpotlightDown={handleSpotlight} />
			);

			downKeyDown(incrementSlider.find(`IconButton.${css.decrementButton}`));

			const expected = 'called once';
			const actual = callCount(handleSpotlight);

			expect(actual).toBe(expected);
		}
	);

	test(
		'should call onSpotlightDown from the decrement button of vertical IncrementSlider',
		() => {
			const handleSpotlight = sinon.spy();
			const incrementSlider = mount(
				<IncrementSlider orientation="vertical" onSpotlightDown={handleSpotlight} />
			);

			downKeyDown(incrementSlider.find(`IconButton.${css.decrementButton}`));

			const expected = 'called once';
			const actual = callCount(handleSpotlight);

			expect(actual).toBe(expected);
		}
	);

	// test directional events at bounds of slider

	test(
		'should call onSpotlightLeft from slider of horizontal IncrementSlider when value is at min',
		() => {
			const handleSpotlight = sinon.spy();
			const incrementSlider = mount(
				<IncrementSlider min={0} value={0} onSpotlightLeft={handleSpotlight} />
			);

			leftKeyDown(incrementSlider.find(`Slider.${css.slider}`));

			const expected = 'called once';
			const actual = callCount(handleSpotlight);

			expect(actual).toBe(expected);
		}
	);

	test(
		'should call onSpotlightRight from slider of horizontal IncrementSlider when value is at max',
		() => {
			const handleSpotlight = sinon.spy();
			const incrementSlider = mount(
				<IncrementSlider max={100} value={100} onSpotlightRight={handleSpotlight} />
			);

			rightKeyDown(incrementSlider.find(`Slider.${css.slider}`));

			const expected = 'called once';
			const actual = callCount(handleSpotlight);

			expect(actual).toBe(expected);
		}
	);

	test(
		'should call onSpotlightDown from slider of vertical IncrementSlider when value is at min',
		() => {
			const handleSpotlight = sinon.spy();
			const incrementSlider = mount(
				<IncrementSlider min={0} value={0} orientation="vertical" onSpotlightDown={handleSpotlight} />
			);

			downKeyDown(incrementSlider.find(`Slider.${css.slider}`));

			const expected = 'called once';
			const actual = callCount(handleSpotlight);

			expect(actual).toBe(expected);
		}
	);

	test(
		'should call onSpotlightUp from slider of horizontal IncrementSlider when value is at max',
		() => {
			const handleSpotlight = sinon.spy();
			const incrementSlider = mount(
				<IncrementSlider max={100} value={100} orientation="vertical" onSpotlightUp={handleSpotlight} />
			);

			upKeyDown(incrementSlider.find(`Slider.${css.slider}`));

			const expected = 'called once';
			const actual = callCount(handleSpotlight);

			expect(actual).toBe(expected);
		}
	);

	test(
		'should set incrementButton "data-webos-voice-disabled" when voice control is disabled',
		() => {
			const incrementSlider = mount(
				<IncrementSlider data-webos-voice-disabled value={10} />
			);

			const expected = true;
			const actual = incrementSlider.find(`IconButton.${css.incrementButton}`).prop('data-webos-voice-disabled');

			expect(actual).toBe(expected);
		}
	);

	test(
		'should set decrementButton "data-webos-voice-disabled" when voice control is disabled',
		() => {
			const incrementSlider = mount(
				<IncrementSlider data-webos-voice-disabled value={10} />
			);

			const expected = true;
			const actual = incrementSlider.find(`IconButton.${css.decrementButton}`).prop('data-webos-voice-disabled');

			expect(actual).toBe(expected);
		}
	);

	test(
		'should set incrementButton "data-webos-voice-group-label" when voice group label is set',
		() => {
			const label = 'voice control group label';
			const incrementSlider = mount(
				<IncrementSlider data-webos-voice-group-label={label} value={10} />
			);

			const expected = label;
			const actual = incrementSlider.find(`IconButton.${css.incrementButton}`).prop('data-webos-voice-group-label');

			expect(actual).toBe(expected);
		}
	);

	test(
		'should set decrementButton "data-webos-voice-group-label" when voice group label is set',
		() => {
			const label = 'voice control group label';
			const incrementSlider = mount(
				<IncrementSlider data-webos-voice-group-label={label} value={10} />
			);

			const expected = label;
			const actual = incrementSlider.find(`IconButton.${css.decrementButton}`).prop('data-webos-voice-group-label');

			expect(actual).toBe(expected);
		}
	);
});
