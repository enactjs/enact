class Hold {
	constructor () {
		this.holdJob = null;
		this.holdStart = null;
		this.pulsing = false;
		this.next = null;
	}

	isHolding = () => this.holdConfig != null

	begin = (holdConfig) => {
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

		const {cancelOnMove, moveTolerance, resume, x: startX, y: startY} = this.holdConfig;

		if (cancelOnMove) {
			const dx = startX - x;
			const dy = startY - y;
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

export default Hold;
export {
	Hold
};
