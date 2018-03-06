let paused = false;

function pause () {
	paused = true;
}

function resume () {
	paused = false;
}

function isPaused () {
	return paused !== false;
}

class Pause {
	pause () {
		if (!isPaused()) {
			paused = this;
		}
	}

	resume () {
		if (paused === this) {
			paused = false;
		}
	}
}

export default Pause;
export {
	Pause,
	isPaused,
	pause,
	resume
};
