import React, {PropTypes} from 'react';
import css from './Tooltip.less';

const TooltipArrow = (props) => {	
	return  <svg className={css.tooltipArrow} viewBox={props.arrowType=='full' ? '0 0 3 6' : '0 0 3 5'} >
				<path d={props.type=='full' ? "M0,6C0,5,1,3,3,3C1,3,0,1,0,0V6Z" : "M0,5C0,3,1,0,3,0H0V5Z"} />
			</svg>
}

class Tooltip extends React.Component {
	static defaultProps = {
		tooltipType: 'below-left',
		tooltipTop: 0,
		tooltipLeft: 0,
		arrowType: 'half',
		visible: 'hidden'
	}

	static propTypes = {
		/**
		* Message of tooltip
		*
		* @type {string}
		* @default is not exist
		* @public
		*/
		alt: React.PropTypes.string.isRequired,

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
		* @type {number}
		* @default 0
		* @public
		*/
		tooltipTop: React.PropTypes.number,

		/**
		* Tooltip Left Position
		*
		* @type {number}
		* @default 0
		* @public
		*/
		tooltipLeft: React.PropTypes.number,

		/**
		* Tooltip Arrow Type
		*
		* @type {string}
		* @default 'half'
		* @public
		*/
		arrowType: React.PropTypes.oneOf(['full', 'half']),

		/**
		* Tooltip Visibility
		*
		* @type {string}
		* @default 'hidden'
		* @public
		*/
		visible: React.PropTypes.oneOf(['visible', 'hidden'])
	}		

	render () {
		return(
			<div
				className={css.tooltip + " " + css[this.props.tooltipType]}
				style={{visibility:this.props.visible, left:this.props.tooltipLeft, top:this.props.tooltipTop}}>
				<TooltipArrow type={this.props.arrowType} />
				<div
					ref={(label) => this.labelRef = label}
					className={css.tooltipLabel}>
					{this.props.alt}
				</div>
			</div>
		);
	}
}

export default Tooltip;
export {Tooltip};
