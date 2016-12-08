import React from 'react';
import kind from '@enact/core/kind';
import css from './Tooltip.less';

const TooltipArrow = kind({
	name: 'TooltipArrpw',

	propTypes: {
		type: React.PropTypes.string
	},

	render: ({type}) => {
		return <svg className={css.tooltipArrow} viewBox={'0 0 3 5'}><path d={type === 'edge' ? 'M0,5C0,4,1,3,3,2.5C1,2,0,1,0,0V5Z' : 'M0,5C0,3,1,0,3,0H0V5Z'} /></svg>;
	}
});

const Tooltip = kind({
	name: 'Tooltip',

	defaultProps: {
		text: '',
		type: 'below leftArrow',
		top: '0',
		left: '0',
		arrowType: 'corner'
	},

	propTypes: {
		/**
		* Tooltip Arrow Type
		*
		* @type {string}
		* @default 'corner'
		* @public
		*/
		arrowType: React.PropTypes.oneOf(['corner', 'edge']),

		/**
		* Delegate Tooltip's Ref
		*
		* @type {function}
		* @default ''
		* @public
		*/
		getTooltipRef: React.PropTypes.func,

		/**
		* Tooltip Left Position
		*
		* @type {string}
		* @default 0
		* @public
		*/
		left: React.PropTypes.string,

		/**
		* Message of tooltip
		*
		* @type {string}
		* @default is not exist
		* @public
		*/
		text: React.PropTypes.string,

		/**
		* Tooltip Top Position
		*
		* @type {string}
		* @default 0
		* @public
		*/
		top: React.PropTypes.string,

		/**
		* Tooltip Type
		*
		* @type {string}
		* @default 'below-left'
		* @public
		*/
		type: React.PropTypes.string
	},

	styles: {
		css,
		className: 'tooltip'
	},

	computed: {
		className: ({type, styler}) => styler.append(css[type.split(' ')[0]], css[type.split(' ')[1]])
	},

	render: ({getTooltipRef, text, left, top, arrowType, className}) => {
		return (
			<div
				className={className}
				style={{left: left, top: top}}
			>
				<TooltipArrow type={arrowType} />
				<div
					ref={getTooltipRef}
					className={css.tooltipLabel}
				>
					{text.toUpperCase()}
				</div>
			</div>
		);
	}
});

export default Tooltip;
export {Tooltip};
