import warning from 'warning';

const animations = {};

function animate (config) {
	const {type = 'minor', node, keyframes, options, onFinish, onCancel, onEnd} = config;

	let animation;

	warning(node != null, 'node is undefined');
	warning(node.animate, 'Node does not support web animations');
	warning(keyframes != null, 'keyframes is not defined');
	warning(keyframes.length > 1, 'keyframes must contain at least 2 entries');

	try {
		let set;

		animation = node.animate(keyframes, options);

		if (type) {
			set = animations[type] = animations[type] || new Set();
			set.add(animation);
		}

		animation.onfinish = () => {
			if (set) set.delete(animation);
			if (onFinish) onFinish(animation);
			if (onEnd) onEnd(animation);
		}
		animation.oncancel = () => {
			if (set) set.delete(animation);
			if (onCancel) onCancel(animation);
			if (onEnd) onEnd(animation);
		}
	} catch (e) {
		// eslint-disable-next-line no-console
		console.error('Failed to start animation');
		throw e;
	}

	return animation;
}

function invoke (animation, action) {
	if (typeof window !== 'undefined' && animation instanceof window.Animation) {
		if (animation.playState === 'running') {
			animation[action]();
		}
	}
}

function invokeType (type, action) {
	const set = animations[type];
	if (set) {
		for (let a of set) {
			invoke(a, action);
		}
	}
}

function cancel (animation) {
	invoke(animation, 'cancel');
}

function cancelAll (type) {
	invokeType(type, 'cancel');
}

function finish (animation) {
	invoke(animation, 'finish');
}

function finishAll (type) {
	invokeType(type, 'finish');
}

export {
	animate,
	cancel,
	cancelAll,
	finish,
	finishAll
};
