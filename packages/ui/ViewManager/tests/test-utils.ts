class MockAnimation {
	playState = 'running';
	onfinish?: () => void;
	oncancel?: () => void;

	constructor (duration: number) {
		setTimeout(this.finish, duration);
	}

	finish = () => {
		if (this.playState === 'finished') return;

		this.playState = 'finished';
		if (this.onfinish) {
			this.onfinish();
		}
	};

	cancel = () => {
		this.playState = 'finished';
		if (this.oncancel) {
			this.oncancel();
		}
	};
}

export const MockArranger = {
	enter: ({duration}: {duration: number}) => new MockAnimation(duration),
	stay: ({duration}: {duration: number}) => new MockAnimation(duration),
	leave: ({duration}: {duration: number}) => new MockAnimation(duration)
};
