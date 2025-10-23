import {useEffect, useRef} from 'react';

function startMarqueeAnimation(node, distance, speed, rtl) {
	if (!node) return;
	cancelAnimationFrame(node._marqueeRAF);

	const dir = rtl ? 1 : -1;
	let pos = 0;
	const pixelsPerFrame = speed / 60;

	function animate() {
		pos += pixelsPerFrame * dir;
		const rounded = Math.round(pos);
		node.style.transform = `translate3d(${rounded}px, 0, 0)`;

		if (Math.abs(pos) >= distance) pos = 0;
		node._marqueeRAF = requestAnimationFrame(animate);
	}

	node._marqueeRAF = requestAnimationFrame(animate);
}

function stopMarqueeAnimation(node) {
	if (node && node._marqueeRAF) {
		cancelAnimationFrame(node._marqueeRAF);
		node._marqueeRAF = null;
		node.style.transform = 'translate3d(0, 0, 0)';
	}
}

export function useMarqueeAnimation({animating, distance, speed, rtl}) {
	const ref = useRef(null);

	useEffect(() => {
		const node = ref.current;
		if (!node) return;

		if (animating) {
			startMarqueeAnimation(node, distance, speed, rtl);
		} else {
			stopMarqueeAnimation(node);
		}

		return () => stopMarqueeAnimation(node);
	}, [animating, distance, speed, rtl]);

	return ref;
}