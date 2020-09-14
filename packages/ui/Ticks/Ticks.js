/**
 * Provides Moonstone-themed dial-like gauge component.
 *
 * @example
 * <Ticks progress={0.5} backgroundProgress={0.75} />
 *
 * @module moonstone/TicksBase
 * @exports TicksBase
 * @exports TicksBaseBase
 * @exports TicksBaseDecorator
 */

import kind from '@enact/core/kind';
// import Pure from '@enact/ui/internal/Pure';
import ri from '@enact/ui/resolution';
import PropTypes from 'prop-types';
import React from 'react';


import componentCss from './Ticks.module.less';

const TicksBase = kind({
	name: 'Ticks',

	propTypes: {
		amount: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
		counterclockwise: PropTypes.bool,
		css: PropTypes.object,
		degrees: PropTypes.number,
		distance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		// horizonFlip: PropTypes.bool,
		// level: PropTypes.bool,
		numerals: PropTypes.bool,
		startDegree: PropTypes.number,
		tickOrientation: PropTypes.oneOf(['inward', 'outward', 'horizon', 'level'])
	},

	defaultProps: {
		amount: 12,
		degrees: 360,
		distance: 100,
		// horizonFlip: false,
		// level: false,
		numerals: false,
		startDegree: 0,
		tickOrientation: 'inward'
	},

	styles: {
		css: componentCss,
		className: 'ticks',
		publicClassNames: true
	},


	computed: {
		className: ({tickOrientation, styler}) => styler.append(tickOrientation),
		style: ({degrees, distance, startDegree, style}) => ({
			'--ticks-range-degrees': degrees,
			'--ticks-start-degree': startDegree,
			'--ticks-distance': (typeof distance == 'number' ? ri.unit(ri.scale(distance), 'rem') : distance),
			...style
		}),
		tickList: ({amount}) => (amount instanceof Array) ? amount : Array.from(Array(amount + 1).keys())
		// tickList: ({amount, degrees}) => (amount instanceof Array) ? amount : Array.from(Array(degrees < 360 ? (amount + 1) : amount).keys())
	},

	render: ({counterclockwise, css, degrees, numerals, startDegree, tickList, tickOrientation, ...rest}) => {
		delete rest.amount;

		// console.log(rest.className, {css});

		if (tickList && tickList.length > 1) { // this needs to happen up at the ticklist level, not here, so we can differentiate between custom ones and prebuilt ones.
			return (
				<div {...rest}>
					{tickList.map((num, i) => {
						if ((degrees === 360 && i >= tickList.length - 1) || tickList.length === 0) return null;

						const tickDegree = ((i / (tickList.length - 1)) * degrees * (counterclockwise ? -1 : 1));
						const tickCustomRotation = (tickOrientation === 'horizon' && (((tickDegree + startDegree) % 360) > 90 && ((tickDegree + startDegree) % 360) < 270) ? 'rotate(180deg) translateY(-100%)' : 'scale(1)');
						// console.log('tickOrientation:', tickOrientation, tickDegree);
						return (
							<div
								key={'tick' + i}
								className={css.tick}
								style={{
									'--tick-degree': tickDegree,
									'--tick-custom-rotation': tickCustomRotation
								}}
							>
								{numerals ? num : null}
							</div>
						);
					}
					)}
				</div>
			);
		}
		return null;
	}
});


export default TicksBase;
export {
	TicksBase as Ticks,
	TicksBase
};
