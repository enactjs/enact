import {calcVelocity} from './ScrollAnimator';
import hoc from '@enact/core/hoc';
import {perfNow} from '@enact/core/util';
import React, {Component} from 'react';

const holdTime =  50;

const Draggable = hoc((config, Wrapped) => {
	return class extends Component {
		static displayName = 'Draggable'

		dragInfo = {
			t: 0,
			clientX: 0,
			clientY: 0,
			dx: 0,
			dy: 0,
			dt: 0
		}

		isDragging = false
		isFirstDragging = false

		dragStart (e) {
			const d = this.dragInfo;

			this.isDragging = true;
			this.isFirstDragging = true;
			d.t = perfNow();
			d.clientX = e.clientX;
			d.clientY = e.clientY;
			d.dx = d.dy = 0;
		}

		drag (e) {
			const
				{direction} = this,
				t = perfNow(),
				d = this.dragInfo;

			if (direction === 'horizontal' || direction === 'both') {
				d.dx = e.clientX - d.clientX;
				d.clientX = e.clientX;
			} else {
				d.dx = 0;
			}

			if (direction === 'vertical' || direction === 'both') {
				d.dy = e.clientY - d.clientY;
				d.clientY = e.clientY;
			} else {
				d.dy = 0;
			}

			d.t = t;

			return {dx: d.dx, dy: d.dy};
		}

		dragStop () {
			const
				d = this.dragInfo,
				t = perfNow();

			d.dt = t - d.t;
			this.isDragging = false;
		}

		isFlicking () {
			const d = this.dragInfo;

			if (d.dt > holdTime) {
				return false;
			} else {
				return true;
			}
		}

		// mouse event handler for JS scroller

		onMouseDown = (e) => {
			this.animator.stop();
			this.dragStart(e);
		}

		onMouseMove = (e) => {
			if (this.isDragging) {
				const
					{dx, dy} = this.drag(e),
					bounds = this.getScrollBounds();

				if (this.isFirstDragging) {
					if (!this.scrolling) {
						this.scrolling = true;
						this.doScrollStart();
					}
					this.isFirstDragging = false;
				}
				this.showThumb(bounds);
				this.scroll(this.scrollLeft - dx, this.scrollTop - dy);
			}
		}

		onMouseUp = (e) => {
			if (this.isDragging) {
				this.dragStop(e);

				if (!this.isFlicking()) {
					this.stop();
				} else {
					const
						d = this.dragInfo,
						target = this.animator.simulate(
							this.scrollLeft,
							this.scrollTop,
							calcVelocity(-d.dx, d.dt),
							calcVelocity(-d.dy, d.dt)
						);

					this.isScrollAnimationTargetAccumulated = false;
					this.start({
						targetX: target.targetX,
						targetY: target.targetY,
						animate: true,
						duration: target.duration
					});
				}
			}
		}

		onMouseLeave = (e) => {
			this.onMouseMove(e);
			this.onMouseUp();
		}

		render () {
			return <Wrapped {...this.props} dragging={this.isDragging} />;
		}
	};
});

export default Draggable;
export {
	Draggable
};
