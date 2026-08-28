import hoc from '@enact/core/hoc';
import {forward} from '@enact/core/handle';
import {checkPropTypes} from '@enact/core/util';
import {Component} from 'react';

import {validateRangeOnce, validateSteppedOnce} from '../internal/validators';
import {Callback} from '../types';

import {calcProportion, hslToHex} from './utils';

import css from './Slider.module.less';

interface PositionDecoratorProps {
	colorPicker?: boolean,
	disabled?: boolean,
	max?: number,
	min?: number,
	onChange: Callback,
	orientation?: string,
	step?: number,
	value: number
}

const validateRange = validateRangeOnce((props: PositionDecoratorProps) => props, {'component': 'PositionDecorator'});
const validateStepValue = validateSteppedOnce((props: PositionDecoratorProps) => props, {'component': 'PositionDecorator'});
const validateStepMax = validateSteppedOnce((props: PositionDecoratorProps) => props, {'component': 'PositionDecorator', valueName: 'max'});

const positionDecoratorDefaultProps = {
	disabled: false,
	max: 100,
	min: 0,
	orientation: 'horizontal',
	step: 1
};

const PositionDecorator = hoc((config, Wrapped) => {
	return class extends Component<PositionDecoratorProps> {
		static displayName = 'PositionDecorator';

		static defaultProps = positionDecoratorDefaultProps;

		constructor (props: PositionDecoratorProps) {
			super(props);
			checkPropTypes(this, props);

			this.handleDown = this.handleDown.bind(this);
			this.handleDrag = this.handleDrag.bind(this);
			this.handleDragStart = this.handleDragStart.bind(this);
			this.bounds = {
				min: 0,
				max: 0,
				offsetX: 0,
				offsetY: 0
			};
			this.dragConfig = {
				global: true
			};
		}

		componentDidUpdate (prevProps: PositionDecoratorProps) {
			checkPropTypes(this, this.props, prevProps);
		}

		bounds: {offsetX: number, offsetY: number, min: number, max: number};
		dragConfig: {};

		// Merges optional props with defaultProps so TypeScript knows they are never undefined inside the class.
		private get safeProps () {
			return this.props as Readonly<PositionDecoratorProps> & typeof positionDecoratorDefaultProps;
		}

		emitChangeForPosition (x: number, y: number) {
			const {colorPicker, max, min, orientation, step} = this.safeProps;
			let position = x;
			let offset = this.bounds.offsetX;

			if (orientation === 'vertical') {
				position = y;
				offset = this.bounds.offsetY;
			}

			let proportion = calcProportion(this.bounds.min, this.bounds.max, position - offset);
			if (orientation === 'vertical') {
				proportion = 1 - proportion;
			}

			let value = (max - min) * proportion + min;

			// adjust value for stepping
			if (step) {
				const delta = (value - min) % step;
				if (delta < step / 2) {
					value -= delta;
				} else {
					value += step - delta;
				}

				// recalculate the proportion based on the stepped value
				proportion = calcProportion(min, max, value);
			}

			const onChangeObj = {
				color: {},
				type: 'onChange',
				value,
				proportion
			};

			if (colorPicker) {
				onChangeObj.color = {
					hex: hslToHex(value),
					hsl: `hsla(${value}, 100%, 50%, 1)`
				};
			}

			if (value !== this.props.value) {
				forward('onChange', onChangeObj, this.props);
			}
		}

		updateBounds (node: HTMLDivElement) {
			const {orientation} = this.props;

			const bounds = node.getBoundingClientRect();
			const computedStyle = window.getComputedStyle(node);

			if (orientation === 'horizontal') {
				this.bounds.min = bounds.left + parseInt(computedStyle.paddingLeft);
				this.bounds.max = bounds.right - parseInt(computedStyle.paddingRight);
			} else {
				this.bounds.min = bounds.top + parseInt(computedStyle.paddingTop);
				this.bounds.max = bounds.bottom - parseInt(computedStyle.paddingBottom);
			}
		}

		updateOffset (clientX: number, clientY: number, target: HTMLDivElement) {
			this.bounds.offsetX = 0;
			this.bounds.offsetY = 0;

			const knob = target.closest(`.${css.knob}`);
			if (knob) {
				const rect = knob.getBoundingClientRect();
				const centerX = rect.left + rect.width / 2;
				const centerY = rect.top + rect.height / 2;

				this.bounds.offsetX = clientX - centerX;
				this.bounds.offsetY = clientY - centerY;
			}
		}

		handleDown ({clientX, clientY, currentTarget, target}: {clientX: number, clientY: number, currentTarget: HTMLDivElement, target: HTMLDivElement}) {
			// bail early for emulated mousedown events from key presses
			if (typeof clientX === 'undefined' || typeof clientY === 'undefined') return;

			this.updateBounds(currentTarget);
			this.updateOffset(clientX, clientY, target);
			this.emitChangeForPosition(clientX, clientY);
		}

		handleDragStart (ev: PointerEvent) {
			forward('onDragStart', ev, this.props);
			this.emitChangeForPosition(ev.x, ev.y);
		}

		handleDrag (ev: PointerEvent) {
			forward('onDrag', ev, this.props);
			this.emitChangeForPosition(ev.x, ev.y);
		}

		render () {
			if (__DEV__) {
				const {min, value = min, max, step} = this.props;
				const props = {min, value: value || min, max, step};

				validateRange(props);
				validateStepValue(props);
				validateStepMax(props);
			}

			return (
				<Wrapped
					{...this.props}
					dragConfig={this.dragConfig}
					onDown={this.handleDown}
					onDragStart={this.handleDragStart}
					onDrag={this.handleDrag}
				/>
			);
		}
	};
});

export default PositionDecorator;
export {
	PositionDecorator
};
