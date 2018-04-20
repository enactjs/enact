import hoc from '@enact/core/hoc';
import {forward} from '@enact/core/handle';
import React from 'react';
import PropTypes from 'prop-types';

import {calcProportion} from './utils';

import css from './Slider.less';

const PositionDecorator = hoc((config, Wrapped) => {
	return class extends React.Component {
		static displayName = 'PositionDecorator'

		static propTypes = {
			disabled: PropTypes.bool,
			max: PropTypes.number,
			min: PropTypes.number,
			onChange: PropTypes.func,
			orientation: PropTypes.string,
			step: PropTypes.number,
			value: PropTypes.number
		}

		static defaultProps = {
			disabled: false,
			min: 0,
			max: 100,
			orientation: 'horizontal',
			step: 1
		}

		constructor () {
			super();

			this.handleDown = this.handleDown.bind(this);
			this.handleDrag = this.handleDrag.bind(this);
			this.handleDragStart = this.handleDragStart.bind(this);
			this.bounds = {};
			this.dragConfig = {
				global: true
			};
		}

		emitChangeForPosition (x, y) {
			const {max, min, orientation, step} = this.props;
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

			if (value !== this.props.value) {
				forward('onChange', {
					type: 'onChange',
					value,
					proportion
				}, this.props);
			}
		}

		updateBounds (node) {
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

		updateOffset (clientX, clientY, target) {
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

		handleDown ({clientX, clientY, currentTarget, target}) {
			// bail early for emulated mousedown events from key presses
			if (typeof clientX === 'undefined' || typeof clientY === 'undefined') return;

			this.updateBounds(currentTarget);
			this.updateOffset(clientX, clientY, target);
			this.emitChangeForPosition(clientX, clientY);
		}

		handleDragStart (ev) {
			forward('onDragStart', ev, this.props);
			this.emitChangeForPosition(ev.x, ev.y);
		}

		handleDrag (ev) {
			forward('onDrag', ev, this.props);
			this.emitChangeForPosition(ev.x, ev.y);
		}

		render () {
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
