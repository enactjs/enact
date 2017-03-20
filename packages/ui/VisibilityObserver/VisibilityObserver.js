const VisibilityObserver = class VisibilityObserver {
	constructor (element, callback) {
		this.callback = callback;

		if (window.IntersectionObserver) {
			this.observer = new window.IntersectionObserver(
				this.processChanges.bind(this), {threshold: [0.1]});

			this.observer.observe(element);
		}

		this.self = this;
	}

	isVisible (boundingClientRect, intersectionRect) {
		return ((intersectionRect.width * intersectionRect.height) /
						(boundingClientRect.width * boundingClientRect.height) >= 0.5);
	}

	visibleTimerCallback = (element, observer) => {
		delete element.visibleTimeout;

		// Process any pending observations
		this.processChanges(observer.takeRecords());

		if ('isVisible' in element) {
			delete element.isVisible;
			if (this.callback) {
				this.callback();
			}
			observer.unobserve(element);
		}
	}

	processChanges = (changes) => {
		const self = this;

		changes.forEach((changeRecord) => {
			const element = changeRecord.target;
			element.isVisible = self.isVisible(changeRecord.boundingClientRect, changeRecord.intersectionRect);

			// Transitioned from hidden to visible
			if ('isVisible' in element) {
				element.visibleTimeout = setTimeout(self.visibleTimerCallback, 10, element, self.observer);
			// Transitioned from visible to hidden
			} else if ('visibleTimeout' in element) {
				window.clearTimeout(element.visibleTimeout);
				delete element.visibleTimeout;
			}
		});
	}
};

export default VisibilityObserver;
