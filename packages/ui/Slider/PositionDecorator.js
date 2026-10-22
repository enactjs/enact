import hoc from '@enact/core/hoc';
import {forward} from '@enact/core/handle';
import {checkPropTypes, setDefaultProps} from '@enact/core/util';
import {useCallback, useEffect, useMemo, useRef} from 'react';
import PropTypes from 'prop-types';

import {validateRangeOnce, validateSteppedOnce} from '../internal/validators';

import {calcProportion, hslToHex} from './utils';

import css from './Slider.module.less';

const validateRange = validateRangeOnce((props) => props, {'component': 'PositionDecorator'});
const validateStepValue = validateSteppedOnce((props) => props, {'component': 'PositionDecorator'});
const validateStepMax = validateSteppedOnce((props) => props, {'component': 'PositionDecorator', valueName: 'max'});

const positionDecoratorDefaultProps = {
	disabled: false,
	max: 100,
	min: 0,
	orientation: 'horizontal',
	step: 1
};

const PositionDecorator = hoc((config, Wrapped) => {
	// eslint-disable-next-line no-shadow
	const PositionDecorator = (componentProps) => {
		const props = useMemo(() => setDefaultProps(componentProps, positionDecoratorDefaultProps), [componentProps]);
		const dragConfig = useMemo(() => ({global: true}), []);

		const bounds = useRef({});

		const emitChangeForPosition = useCallback((x, y) => {
			const {colorPicker, max, min, orientation, step} = props;
			let position = x;
			let offset = bounds.current.offsetX;

			if (orientation === 'vertical') {
				position = y;
				offset = bounds.current.offsetY;
			}

			let proportion = calcProportion(bounds.current.min, bounds.current.max, position - offset);
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

			if (value !== props.value) {
				forward('onChange', onChangeObj, props);
			}
		}, [props]);

		const updateBounds = useCallback((node) => {
			const {orientation} = props;

			const localBounds = node.getBoundingClientRect();
			const computedStyle = window.getComputedStyle(node);

			if (orientation === 'horizontal') {
				bounds.current.min = localBounds.left + parseInt(computedStyle.paddingLeft);
				bounds.current.max = localBounds.right - parseInt(computedStyle.paddingRight);
			} else {
				bounds.current.min = localBounds.top + parseInt(computedStyle.paddingTop);
				bounds.current.max = localBounds.bottom - parseInt(computedStyle.paddingBottom);
			}
		}, [props]);

		const updateOffset = useCallback((clientX, clientY, target) => {
			bounds.current.offsetX = 0;
			bounds.current.offsetY = 0;

			const knob = target.closest(`.${css.knob}`);
			if (knob) {
				const rect = knob.getBoundingClientRect();
				const centerX = rect.left + rect.width / 2;
				const centerY = rect.top + rect.height / 2;

				bounds.current.offsetX = clientX - centerX;
				bounds.current.offsetY = clientY - centerY;
			}
		}, []);

		const handleDown = useCallback(({clientX, clientY, currentTarget, target}) => {
			// bail early for emulated mousedown events from key presses
			if (typeof clientX === 'undefined' || typeof clientY === 'undefined') return;

			updateBounds(currentTarget);
			updateOffset(clientX, clientY, target);
			emitChangeForPosition(clientX, clientY);
		}, [emitChangeForPosition, updateBounds, updateOffset]);

		const handleDragStart = useCallback((ev) => {
			forward('onDragStart', ev, props);
			emitChangeForPosition(ev.x, ev.y);
		}, [emitChangeForPosition, props]);

		const handleDrag = useCallback((ev) => {
			forward('onDrag', ev, props);
			emitChangeForPosition(ev.x, ev.y);
		}, [emitChangeForPosition, props]);

		useEffect(() => {
			checkPropTypes(PositionDecorator, props);
		}, [props]);

		if (__DEV__) {
			const {min, value = min, max, step} = props;
			const validateProps = {min, value: value || min, max, step};

			validateRange(validateProps);
			validateStepValue(validateProps);
			validateStepMax(validateProps);
		}

		return (
			<Wrapped
				{...props}
				dragConfig={dragConfig}
				onDown={handleDown}
				onDragStart={handleDragStart}
				onDrag={handleDrag}
			/>
		);
	};

	PositionDecorator.displayName = 'PositionDecorator';
	PositionDecorator.propTypes = {
		disabled: PropTypes.bool,
		max: PropTypes.number,
		min: PropTypes.number,
		onChange: PropTypes.func,
		orientation: PropTypes.string,
		step: PropTypes.number,
		value: PropTypes.number
	};

	return PositionDecorator;
});

export default PositionDecorator;
export {
	PositionDecorator
};
