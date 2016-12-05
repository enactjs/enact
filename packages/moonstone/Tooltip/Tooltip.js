import React, {PropTypes} from 'react';
import css from './Tooltip.less';

const TooltipArrow = (props) => {
	return <svg className={css.tooltipArrow} viewBox={'0 0 3 5'}><path d={props.type == 'edge' ? 'M0,5C0,4,1,3,3,2.5C1,2,0,1,0,0V5Z' : 'M0,5C0,3,1,0,3,0H0V5Z'} /></svg>
}

class Tooltip extends React.Component {
	static defaultProps = {
		tooltip: '',
		tooltipType: 'below leftArrow',
		tooltipTop: '0',
		tooltipLeft: '0',
		tooltipArrowType: 'corner',
		showing: false
	}

	static propTypes = {
		/**
		* Message of tooltip
		*
		* @type {string}
		* @default is not exist
		* @public
		*/
		tooltip: React.PropTypes.string,

		/**
		* Tooltip Type
		*
		* @type {string}
		* @default 'below-left'
		* @public
		*/
		tooltipType: React.PropTypes.string,

		/**
		* Tooltip Top Position
		*
		* @type {string}
		* @default 0
		* @public
		*/
		tooltipTop: React.PropTypes.string,

		/**
		* Tooltip Left Position
		*
		* @type {string}
		* @default 0
		* @public
		*/
		tooltipLeft: React.PropTypes.string,

		/**
		* Tooltip Arrow Type
		*
		* @type {string}
		* @default 'corner'
		* @public
		*/
		tooltipArrowType: React.PropTypes.oneOf(['corner', 'edge']),

		/**
		* Tooltip Showing
		*
		* @type {bool}
		* @default 'false'
		* @public
		*/
		showing: React.PropTypes.bool
	}

	render () {
		const {getTooltipRef} = this.props;

		return(
			<div
				className={[css.tooltip, this.props.tooltipType.split(' ').map((c) => css[c]).join(' '), (this.props.showing ? css.shown : '')].join(' ')}
				style={{left: this.props.tooltipLeft, top: this.props.tooltipTop}}>
				<TooltipArrow type={this.props.tooltipArrowType} />
				<div
					ref={getTooltipRef}
					className={css.tooltipLabel}>
					{this.props.tooltip.toUpperCase()}
				</div>
			</div>
		);
	}
}

export default Tooltip;
export {Tooltip};
