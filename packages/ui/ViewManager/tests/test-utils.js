function MockAnimation (duration) {
	this.playbackState = 'running';
	this.finish = () => {
		if (this.playState === 'finished') return;

		this.playState = 'finished';
		if (this.onfinish) {
			this.onfinish();
		}
	};

	this.cancel = () => {
		this.playState = 'finished';
		if (this.oncancel) {
			this.oncancel();
		}
	};

	setTimeout(this.finish, duration);
}

export const MockArranger = {
	enter: ({duration}) => new MockAnimation(duration),
	stay: ({duration}) => new MockAnimation(duration),
	leave: ({duration}) => new MockAnimation(duration)
};
