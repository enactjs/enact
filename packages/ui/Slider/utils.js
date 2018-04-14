const calcProportion = (min, max, value) => {
	if (value <= min) {
		return 0;
	} else if (value >= max) {
		return 1;
	} else {
		return (value - min) / (max - min);
	}
};

export {
	calcProportion
};
