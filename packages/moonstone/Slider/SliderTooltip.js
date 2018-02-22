import {contextTypes} from '@enact/i18n/I18nDecorator';
import ilib from '@enact/i18n';
import NumFmt from '@enact/i18n/ilib/lib/NumFmt';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Tooltip from '../TooltipDecorator/Tooltip';

import css from './SliderTooltip.less';

/**
 * {@link moonstone/Slider.SliderTooltip} is a stateless Tooltip specifically for Slider.
 *
 * @class SliderTooltip
 * @memberof moonstone/Slider
 * @ui
 * @public
 */
class SliderTooltipBase extends React.Component {
	static displayName = 'SliderTooltip'

	static propTypes = /** @lends moonstone/Slider.SliderTooltip.prototype */{
		/**
		 * Setting to `true` overrides the natural LTR->RTL tooltip side-flipping for locale changes
		 * for `vertical` sliders. This may be useful if you have a static layout that does not
		 * automatically reverse when in an RTL language.
		 *
		 * @type {Boolean}
		 * @public
		 */
		forceSide: PropTypes.bool,

		/**
		* When not `vertical`, determines which side of the knob the tooltip appears on.
		* When `false`, the tooltip will be on the left side, when `true`, the tooltip will
		* be on the right.
		*
		* @type {String}
		* @default 'rising'
		* @private
		*/
		knobAfterMidpoint: PropTypes.bool,

		/**
		 * When true, value will be formatted using [Number Formatter from i18n]{@link i18n/ilib/lib/NumFmt.NumFmt}
		 * to display percentage values.
		 *
		 * @type {Boolean}
		 * @public
		 */
		percent: PropTypes.bool,

		/**
		 * The proportion of progress across the bar. Should be a number between 0 and 1.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		proportion: PropTypes.number,

		/**
		 * Specify where the tooltip should appear in relation to the Slider bar. Options are
		 * `'before'` and `'after'`. `before` renders above a `horizontal` slider and to the
		 * left of a `vertical` Slider. `after` renders below a `horizontal` slider and to the
		 * right of a `vertical` Slider. In the `vertical` case, the rendering position is
		 * automatically reversed when rendering in an RTL locale. This can be overridden by
		 * using the [tooltipForceSide]{@link moonstone/Slider.Slider#tooltipForceSide} prop.
		 *
		 * @type {String}
		 * @default 'before'
		 * @public
		 */
		side: PropTypes.oneOf(['before', 'after']),

		/**
		 * If `true` the slider will be oriented vertically.
		 *
		 * @type {Boolean}
		 * @public
		 */
		vertical: PropTypes.bool
	}

	static defaultProps = {
		knobAfterMidpoint: false,
		forceSide: false,
		proportion: 0,
		side: 'before',
		vertical: false
	}

	static contextTypes = contextTypes

	constructor (props) {
		super(props);

		if (props.percent) {
			this.initI18n();
		}
	}

	componentWillUpdate (nextProps) {
		if (nextProps.percent) {
			this.initI18n();
		}
	}

	initI18n = () => {
		const locale = ilib.getLocale();

		if (this.locale !== locale && typeof window === 'object') {
			this.locale = locale;
			this.numFmt = new NumFmt({type: 'percentage', useNative: false});
		}
	}

	getArrowAnchor () {
		const {knobAfterMidpoint, vertical} = this.props;

		if (vertical) return 'middle';
		return knobAfterMidpoint ? 'left' : 'right';
	}

	getClassName () {
		const {className, forceSide, side, vertical} = this.props;
		const cx = classNames.bind(css);
		return cx(css.tooltip, css[side], className, {
			ignoreLocale: forceSide,
			vertical,
			horizontal: !vertical
		});
	}

	getDirection () {
		const {forceSide, side, vertical} = this.props;
		let dir = 'right';
		if (vertical) {
			if (
				// LTR before (Both force and nonforce cases)
				(!this.context.rtl && side === 'before') ||
				// RTL after
				(this.context.rtl && !forceSide && side === 'after') ||
				// RTL before FORCE
				(this.context.rtl && forceSide && side === 'before')
			) {
				dir = 'left';
			} else {
				dir = 'right';
			}
		} else {
			dir = (side === 'before' ? 'above' : 'below');
		}
		return dir;
	}

	render () {
		const props = Object.assign({}, this.props);
		const {children, percent, ...rest} = props;
		delete rest.className;
		delete rest.knobAfterMidpoint;
		delete rest.forceSide;
		delete rest.proportion;
		delete rest.side;
		delete rest.vertical;

		return (
			<Tooltip
				arrowAnchor={this.getArrowAnchor()}
				className={this.getClassName()}
				direction={this.getDirection()}
				{...rest}
			>
				{percent ? this.numFmt.format(children) : children}
			</Tooltip>
		);
	}
}

export default SliderTooltipBase;
export {SliderTooltipBase, SliderTooltipBase as SliderTooltip};
