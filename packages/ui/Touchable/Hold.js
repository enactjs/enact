import PropTypes from 'prop-types';

class Hold {
	constructor () {
		this.holdJob = null;
		this.holdStart = null;
		this.pulsing = false;
		this.next = null;
	}

	isHolding = () => this.holdConfig != null

	begin = (defaultConfig, {holdConfig, noResume, onHold, onHoldEnd, onHoldPulse}, {x, y}) => {
		if (!onHold && !onHoldPulse) return;

		this.startX = x;
		this.startY = y;

		this.holdConfig = {
			...defaultConfig,
			...holdConfig,
			onHold,
			onHoldEnd,
			onHoldPulse,
			resume: !noResume
		};

		// copy the events array since it is mutated for each hold
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

	move = ({x, y}) => {
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

	blur = () => {
		if (!this.isHolding()) return;

		if (!this.holdConfig.global) {
			this.end();
		}
	}

	end = () => {
		if (!this.isHolding()) return;

		const {onHoldEnd} = this.holdConfig;
		if (this.pulsing && onHoldEnd) {
			const time = window.performance.now() - this.holdStart;
			onHoldEnd({
				type: 'onHoldEnd',
				time
			});
		}

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

		const {global: isGlobal, resume} = this.holdConfig;

		if (isGlobal) return;

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
		const holdTime = window.performance.now() - this.holdStart;

		let n = this.next;
		while (n && n.time <= holdTime) {
			const {events, onHold} = this.holdConfig;
			this.pulsing = true;
			if (onHold) {
				onHold({
					type: 'onHold',
					...n
				});
			}

			// if the hold is canceled from the onHold handler, we should bail early and prevent
			// additional hold/pulse events
			if (!this.isHolding()) {
				this.pulsing = false;
				break;
			}

			n = this.next = events && events.shift();
		}

		if (this.pulsing) {
			const {onHoldPulse} = this.holdConfig;

			if (onHoldPulse) {
				onHoldPulse({
					type: 'onHoldPulse',
					time: holdTime
				});
			}
		}
	}
}

const defaultHoldConfig = {
	cancelOnMove: false,
	events: [
		{name: 'hold', time: 200}
	],
	frequency: 200,
	global: false,
	moveTolerance: 16
};

const holdConfigPropType = PropTypes.shape({
	cancelOnMove: PropTypes.bool,
	events: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string,
			time: PropTypes.number
		})
	),
	frequency: PropTypes.number,
	global: PropTypes.bool,
	moveTolerance: PropTypes.number
});

export default Hold;
export {
	defaultHoldConfig,
	Hold,
	holdConfigPropType
};
