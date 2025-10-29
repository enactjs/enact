/**
 * Create a cubic-bezier easing function evaluator.
 */
const utilAnimation = (x1, y1, x2, y2) => {
	const AX = 1 + 3 * x1 - 3 * x2;
	const BX = 3 * x2 - 6 * x1;
	const CX = 3 * x1;

	const AY = 1 + 3 * y1 - 3 * y2;
	const BY = 3 * y2 - 6 * y1;
	const CY = 3 * y1;

	function sampleCurveX (t) {
		return ((AX * t + BX) * t + CX) * t;
	}

	function sampleCurveY (t) {
		return ((AY * t + BY) * t + CY) * t;
	}

	function sampleCurveDerivativeX (t) {
		return (3 * AX * t + 2 * BX) * t + CX;
	}

	function solveCurveX (x) {
		let t0 = x;
		let t1, t2;

		for (let i = 0; i < 4; ++i) {
			t2 = sampleCurveX(t0) - x;
			if (Math.abs(t2) < 0.001) return t0;

			t1 = sampleCurveDerivativeX(t0);
			if (Math.abs(t1) < 1e-6) break;
			t0 = t0 - t2 / t1;
		}
		return t0;
	}

	return {
		cubicBezier (x) {
			if (x === 0) return 0;
			if (x === 1) return 1;

			const t = solveCurveX(x);

			return sampleCurveY(t);
		}
	};
};

export default utilAnimation;
export {
	utilAnimation
};
