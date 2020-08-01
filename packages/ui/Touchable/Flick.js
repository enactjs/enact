import {Job} from '@enact/core/util';
import PropTypes from 'prop-types';

class Flick {
	constructor () {
		this.tracking = false;
		this.moves = [];
	}

	isTracking () {
		return this.tracking;
	}

	begin = ({maxDuration, maxMoves, minVelocity}, {onFlick}, coords) => {
		this.minVelocity = minVelocity;
		this.maxMoves = maxMoves;

		if (maxDuration !== null) {
			this.cancelJob.startAfter(maxDuration);
		}
		this.tracking = !!onFlick;
		this.moves.length = 0;
		this.onFlick = onFlick;

		this.move(coords);
	}

	// This method will get the `onHold`, `onHoldEnd`, `onHoldPulse` props and update the existing `holdConfig` values.
	updateProps = ({onHold, onHoldEnd, onHoldPulse}) => {
		// `holdConfig` might not exists a gesture not in progress. Check if gesture exists before updating the references to the `holdConfig`
		if (!this.holdConfig) return;

		// This will update the `holdConfig` with the new value
		this.holdConfig.onHoldPulse = onHoldPulse;
		this.holdConfig.onHold = onHold;
		this.holdConfig.onHoldEnd = onHoldEnd;
	}

	move = ({x, y}) => {
		if (!this.tracking) return;

		this.moves.push({
			x,
			y,
			t: window.performance.now()
		});

		// track specified # of points
		if (this.moves.length > this.maxMoves) {
			this.moves.shift();
		}
	}

	blur = () => {
		this.end();
	}

	cancel = () => {
		this.tracking = false;
	}

	cancelJob = new Job(this.cancel);

	end = () => {
		if (!this.tracking) return;

		this.cancelJob.stop();

		const moves = this.moves;
		if (moves.length > 1) {
			// note: important to use up time to reduce flick
			// velocity based on time between move and up.
			const last = moves[moves.length - 1];
			const t = window.performance.now();

			let x = 0, y = 0;

			// take the greatest of flick between each tracked move and last move
			for (let i = moves.length - 2, m; (m = moves[i]); i--) {
				// this flick (this move - last move) / (this time - last time)
				const dt = t - m.t;
				const vx = (last.x - m.x) / dt;
				const vy = (last.y - m.y) / dt;

				// if either axis is a greater flick than previously recorded use this one
				if (Math.abs(vx) > Math.abs(x) || Math.abs(vy) > Math.abs(y)) {
					x = vx;
					y = vy;
				}
			}

			const v = Math.sqrt(x * x + y * y);
			if (v > this.minVelocity) {
				const vertical = Math.abs(y) > Math.abs(x);
				// generate the flick using the start event so it has those coordinates
				// this.sendFlick(ti.startEvent, x, y, v);
				this.onFlick({
					type: 'onFlick',
					direction: vertical ? 'vertical' : 'horizontal',
					velocityX: x,
					velocityY: y,
					velocity: v
				});
			}
		}

		this.tracking = false;
	}
}

const defaultFlickConfig = {
	maxDuration: 250,
	maxMoves: 5,
	minVelocity: 0.1
};

const flickConfigPropType = PropTypes.shape({
	maxDuration: PropTypes.number,
	maxMoves: PropTypes.number,
	maxVelocity: PropTypes.number
});

export default Flick;
export {
	defaultFlickConfig,
	Flick,
	flickConfigPropType
};
