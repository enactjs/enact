import PropTypes from 'prop-types';

class Hold {
	constructor () {
		this.holdJob = null;
		this.holdStart = null;
		this.pulsing = false;
		this.next = null;
	}

	isHolding = () => this.holdConfig != null

	begin = (holdConfig, {x, y}) => {
		this.startX = x;
		this.startY = y;

		this.holdConfig = Object.assign({}, holdConfig);

		this.holdConfig.events = this.holdConfig.events.slice();
		this.holdConfig.events.sort((a, b) => {
			if (a.time < b.time) return -1;
			if (a.time > b.time) return 1;
			return 0;
		});

		this.pulsing = false;
		this.next = this.holdConfig.events.shift();
		if (this.next) {
			this.holdStart = window.performance.now();
			this.startJob();
		}
	}

	move = (x, y) => {
		if (!this.isHolding()) return;

		const {cancelOnMove, moveTolerance, resume} = this.holdConfig;

		if (cancelOnMove) {
			const dx = this.startX - x;
			const dy = this.startY - y;
			const shouldEnd = Math.sqrt(dx * dx + dy * dy) >= moveTolerance;

			if (shouldEnd) {
				if (resume) {
					this.suspend();
				} else {
					this.end();
				}
			} else if (resume && !shouldEnd) {
				this.resume();
			}
		}
	}

	end = () => {
		if (!this.isHolding()) return;

		this.suspend();
		this.pulsing = false;
		this.holdConfig = null;
	}

	enter = () => {
		if (!this.isHolding()) return;

		const {resume} = this.holdConfig;

		if (resume) {
			this.resume();
		}
	}

	leave = () => {
		if (!this.isHolding()) return;

		const {resume} = this.holdConfig;

		if (resume) {
			this.suspend();
		} else {
			this.end();
		}
	}

	suspend = () => {
		clearInterval(this.holdJob);
		this.holdJob = null;
	}

	resume = () => {
		if (this.holdJob !== null) return;

		this.handlePulse();
		this.startJob();
	}

	startJob () {
		const {frequency} = this.holdConfig;

		if (!this.holdJob) {
			this.holdJob = setInterval(this.handlePulse, frequency);
		}
	}

	handlePulse = () => {
		const {onHold, onHoldPulse} = this.holdConfig;

		const holdTime = window.performance.now() - this.holdStart;

		let n = this.next;
		while (n && n.time <= holdTime) {
			this.pulsing = true;
			if (onHold) onHold(n);
			n = this.next = this.holdConfig.events && this.holdConfig.events.shift();
		}

		if (this.pulsing) {
			if (onHoldPulse) {
				onHoldPulse({
					holdTime
				});
			}
		}
	}
}

const holdConfigPropType = PropTypes.shape({
	cancelOnMove: PropTypes.bool,
	events: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string,
			time: PropTypes.number
		})
	),
	frequency: PropTypes.number,
	moveTolerance: PropTypes.number
});

export default Hold;
export {
	Hold,
	holdConfigPropType
};
