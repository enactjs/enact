import hoc from '@enact/core/hoc';
import {forward} from '@enact/core/handle';
import React from 'react';
import PropTypes from 'prop-types';

import {calcPercent} from './utils';

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
			value: 0
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
			const position = orientation === 'horizontal' ? x : y;

			let percent = calcPercent(this.bounds.min, this.bounds.max, position);
			if (orientation === 'vertical') {
				percent = 1 - percent;
			}

			let value = (max - min) * percent + min;

			// adjust value for stepping
			if (step) {
				const delta = (value - min) % step;
				if (delta < step / 2) {
					value -= delta;
				} else {
					value += step - delta;
				}
			}

			forward('onChange', {
				type: 'onChange',
				value
			}, this.props);
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

		handleDown ({clientX, clientY, currentTarget}) {
			this.updateBounds(currentTarget);

			// bail early for emulated mousedown events from key presses
			if (typeof clientX === 'undefined' || typeof clientY === 'undefined') return;

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
