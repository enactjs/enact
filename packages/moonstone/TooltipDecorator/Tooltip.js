import React from 'react';
import kind from '@enact/core/kind';
import css from './Tooltip.less';

const Tooltip = kind({
	name: 'Tooltip',

	propTypes: {
		/**
		* Tooltip Arrow Type
		*
		* @type {String}
		* @default 'corner'
		* @public
		*/
		arrowType: React.PropTypes.oneOf(['corner', 'edge']),

		/**
		* Delegate Tooltip's dom reference
		*
		* @type {Function}
		* @default ''
		* @public
		*/
		getTooltipRef: React.PropTypes.func,

		/**
		* Tooltip Position
		*
		* @type {Object}
		* @public
		*/
		position: React.PropTypes.object,

		/**
		* Message of tooltip
		*
		* @type {String}
		* @public
		*/
		text: React.PropTypes.string,

		/**
		* Type of tooltip
		*
		* @type {String}
		* @default 'below leftArrow'
		* @public
		*/
		type: React.PropTypes.string
	},

	defaultProps: {
		arrowType: 'corner',
		text: '',
		type: 'below leftArrow'
	},

	styles: {
		css,
		className: 'tooltip'
	},

	computed: {
		className: ({type, styler}) => styler.append(css[type.split(' ')[0]], css[type.split(' ')[1]])
	},

	render: ({getTooltipRef, text, position, arrowType, className, style, ...props}) => {
		const styles = Object.assign({}, position, style);

		return (
			<div
				className={className}
				style={styles}
				{...props}
			>
				<svg className={css.tooltipArrow} viewBox={'0 0 3 5'}>
					<path d={arrowType === 'edge' ? 'M0,5C0,4,1,3,3,2.5C1,2,0,1,0,0V5Z' : 'M0,5C0,3,1,0,3,0H0V5Z'} />
				</svg>
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
