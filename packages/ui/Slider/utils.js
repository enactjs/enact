const calcProportion = (min, max, value) => {
	if (value <= min) {
		return 0;
	} else if (value >= max) {
		return 1;
	} else {
		return (value - min) / (max - min);
	}
};

const hslToHex = (h) => {
	const f = n => {
		const k = (n + h / 30) % 12;
		const color = 1 / 2 - 1 / 2 * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
	};
	return `#${f(0)}${f(8)}${f(4)}`;
};


export {
	calcProportion,
	hslToHex
};
