import {TouchableProps} from './Touchable';

export interface holdConfigPropType {
	cancelOnMove: boolean;
	events: Array<{name: string, time: number}>;
	frequency: number;
	global: boolean;
	moveTolerance: number;
}

class Hold {
	holdConfig: holdConfigPropType & {resume: boolean} | null = null;
	holdJob: number | null = null;
	holdStart: number | null = null;
	pulsing: boolean = false;
	next?: {name: string, time: number} | null = null;
	startX: number = 0;
	startY: number = 0;
	onHold?: TouchableProps['onHold'];
	onHoldStart?: TouchableProps['onHoldStart'];
	onHoldEnd?: TouchableProps['onHoldEnd'];

	constructor () {
		this.holdJob = null;
		this.holdStart = null;
		this.pulsing = false;
		this.next = null;
	}

	isHolding = () => this.holdConfig != null;

	isWithinTolerance = ({x, y}: {x: number, y: number}) => {
		const {moveTolerance} = this.holdConfig || defaultHoldConfig;
		const dx = this.startX - x;
		const dy = this.startY - y;

		return Math.sqrt(dx * dx + dy * dy) < moveTolerance;
	};

	begin = (defaultConfig: holdConfigPropType, {holdConfig, noResume, onHoldStart, onHoldEnd, onHold}: Partial<TouchableProps>, {x, y}: {x: number, y: number}) => {
		if (!onHoldStart && !onHold) return;

		this.startX = x;
		this.startY = y;

		this.holdConfig = {
			...defaultConfig,
			...holdConfig,
			resume: !noResume
		};

		this.onHold = onHold;
		this.onHoldStart = onHoldStart;
		this.onHoldEnd = onHoldEnd;

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
	};

	// This method will get the `onHoldStart`, `onHoldEnd`, `onHold` props.
	updateProps = ({onHoldStart, onHoldEnd, onHold}: Partial<TouchableProps>) => {
		// check `isHolding` gesture is not in progress. Check if gesture exists before updating the references to the `holdConfig`
		if (!this.isHolding()) return;

		// Update the original values with new values of the gestures
		this.onHold = onHold;
		this.onHoldStart = onHoldStart;
		this.onHoldEnd = onHoldEnd;
	};

	move = (coords: {x: number, y: number}) => {
		if (!this.isHolding()) return;

		const {cancelOnMove, resume = false} = this.holdConfig || {};

		if (cancelOnMove) {
			const shouldEnd = !this.isWithinTolerance(coords);

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
	};

	blur = () => {
		if (!this.isHolding()) return;

		if (!this.holdConfig?.global) {
			this.end();
		}
	};

	end = () => {
		if (!this.isHolding()) return;

		if (this.pulsing && this.onHoldEnd) {
			const time = window.performance.now() - (this.holdStart || 0);
			this.onHoldEnd({
				type: 'onHoldEnd',
				time
			});
		}

		this.suspend();
		this.pulsing = false;
		this.holdConfig = null;
	};

	enter = () => {
		if (!this.isHolding()) return;

		const {cancelOnMove, resume} = this.holdConfig || {};

		if (resume && !cancelOnMove) {
			this.resume();
		}
	};

	leave = () => {
		if (!this.isHolding()) return;

		const {global: isGlobal, resume} = this.holdConfig || {};

		if (isGlobal) return;

		if (resume) {
			this.suspend();
		} else {
			this.end();
		}
	};

	suspend = () => {
		if (this.holdJob) {
			clearInterval(this.holdJob);
		}
		this.holdJob = null;
	};

	resume = () => {
		if (this.holdJob !== null) return;

		this.handlePulse();
		this.startJob();
	};

	startJob () {
		const {frequency} = this.holdConfig || {};

		if (!this.holdJob) {
			this.holdJob = setInterval(this.handlePulse, frequency);
		}
	}

	handlePulse = () => {
		const holdTime = window.performance.now() - (this.holdStart || 0);

		let n = this.next;
		while (n && n.time <= holdTime) {
			const {events} = this.holdConfig || {};
			this.pulsing = true;
			if (this.onHoldStart) {
				this.onHoldStart({
					type: 'onHoldStart',
					...n
				});
			}

			// if the hold is canceled from the onHoldStart handler, we should bail early and prevent
			// additional hold/pulse events
			if (!this.isHolding()) {
				this.pulsing = false;
				break;
			}

			n = this.next = events && events.shift();
		}

		if (this.pulsing) {
			if (this.onHold) {
				this.onHold({
					type: 'onHold',
					time: holdTime
				});
			}
		}
	};
}

const defaultHoldConfig: holdConfigPropType = {
	cancelOnMove: false,
	events: [
		{name: 'hold', time: 200}
	],
	frequency: 200,
	global: false,
	moveTolerance: 16
};

export default Hold;
export {
	defaultHoldConfig,
	Hold
};
