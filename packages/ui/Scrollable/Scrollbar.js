import classNames from 'classnames';
import {Job} from '@enact/core/util';
import PropTypes from 'prop-types';
import React, {PureComponent, Component} from 'react';

import ri from '../resolution';

import componentCss from './Scrollbar.less';
import ScrollThumb from './ScrollThumb';

const
	minThumbSize = 18, // Size in pixels
	thumbHidingDelay = 400; /* in milliseconds */

/*
 * Set CSS Varaible value.
 *
 * @method
 * @param {Node} element - Node.
 * @param {String} variable - CSS Variable property.
 * @param {String} value - CSS Variable value.
 */
const setCSSVariable = (element, variable, value) => {
	element.style.setProperty(variable, value);
};

/**
 * A basic scroll bar. It is used in [Scrollable]{@link ui/Scrollable.Scrollable}.
 *
 * @class ScrollbarBase
 * @memberof ui/Scrollable
 * @ui
 * @private
 */
class ScrollbarBase extends PureComponent {
	static displayName = 'ui:Scrollbar'

	static propTypes = /** @lends ui/Scrollable.ScrollbarBase.prototype */ {
		/**
		 * Render function for children
		 *
		 * @type {Function}
		 * @private
		 */
		render: PropTypes.func.isRequired,

		/**
		 * If `true`, add the corner between vertical and horizontal scrollbars.
		 *
		 * @type {Booelan}
		 * @public
		 */
		corner: PropTypes.bool,

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `scrollbar` - The scrollbar component class
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * Called when the component contructed
		 *
		 * @type {Function}
		 * @private
		 */
		setRef: PropTypes.func,

		/**
		 * If `true`, the scrollbar will be oriented vertically.
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		vertical: PropTypes.bool
	}

	static defaultProps = {
		corner: false,
		css: componentCss,
		vertical: true
	}

	constructor (props) {
		super(props);

		this.setContainerRef = this.setRef('containerRef');
		this.setScrollThumbRef = this.setRef('thumbRef');

		if (props.setRef) {
			props.setRef(this);
		}
	}

	componentDidMount () {
		this.calculateMetrics();
	}

	componentDidUpdate () {
		this.calculateMetrics();
	}

	componentWillUnmount () {
		this.hideThumbJob.stop();
	}

	minThumbSizeRatio = 0
	ignoreMode = false

	// refs
	containerRef = null
	thumbRef = null

	update = (bounds) => {
		const
			{vertical} = this.props,
			{clientWidth, clientHeight, scrollWidth, scrollHeight, scrollLeft, scrollTop} = bounds,
			clientSize = vertical ? clientHeight : clientWidth,
			scrollSize = vertical ? scrollHeight : scrollWidth,
			scrollOrigin = vertical ? scrollTop : scrollLeft,

			thumbSizeRatioBase = (clientSize / scrollSize),
			scrollThumbPositionRatio = (scrollOrigin / (scrollSize - clientSize)),
			scrollThumbSizeRatio = Math.max(this.minThumbSizeRatio, Math.min(1, thumbSizeRatioBase));

		setCSSVariable(this.thumbRef, '--scrollbar-size-ratio', scrollThumbSizeRatio);
		setCSSVariable(this.thumbRef, '--scrollbar-progress-ratio', scrollThumbPositionRatio);
	}

	showThumb = () => {
		this.hideThumbJob.stop();
		this.thumbRef.classList.add(this.props.css.thumbShown);
	}

	startHidingThumb = () => {
		this.hideThumbJob.start();
	}

	hideThumb = () => {
		this.thumbRef.classList.remove(this.props.css.thumbShown);
	}

	hideThumbJob = new Job(this.hideThumb.bind(this), thumbHidingDelay);

	calculateMetrics = () => {
		const trackSize = this.containerRef[this.props.vertical ? 'clientHeight' : 'clientWidth'];
		this.minThumbSizeRatio = ri.scale(minThumbSize) / trackSize;
	}

	getContainerRef = () => (this.containerRef)

	setRef (prop) {
		return (ref) => {
			this[prop] = ref;
		};
	}

	render () {
		const
			{className, corner, css, render, vertical, ...rest} = this.props,
			containerClassName = classNames(
				className,
				css.scrollbar,
				corner ? css.corner : null,
				vertical ? css.vertical : css.horizontal
			);

		delete rest.setRef;

		return (
			<div {...rest} className={containerClassName} ref={this.setContainerRef}>
				{render({
					getContainerRef: this.getContainerRef,
					setScrollThumbRef: this.setScrollThumbRef
				})}
			</div>
		);
	}
}

/**
 * A basic scroll bar. It is used in [Scrollable]{@link ui/Scrollable.Scrollable}.
 *
 * @class Scrollbar
 * @memberof ui/Scrollable
 * @ui
 * @private
 */
class Scrollbar extends Component {
	static propTypes = /** @lends moonstone/Scrollable.Scrollbar.prototype */ {
		/**
		 * If `true`, the scrollbar will be oriented vertically.
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		vertical: PropTypes.bool
	}

	render () {
		const {vertical} = this.props;

		return (
			<ScrollbarBase
				{...this.props}
				ref={(ref) => { // eslint-disable-line react/jsx-no-bind
					if (ref) {
						const {showThumb, startHidingThumb, update: uiUpdate} = ref;

						this.showThumb = showThumb;
						this.startHidingThumb = startHidingThumb;
						this.update = uiUpdate;
					}
				}}
				render={({setScrollThumbRef}) => { // eslint-disable-line react/jsx-no-bind
					return (
						<ScrollThumb
							setRef={setScrollThumbRef}
							key="thumb"
							vertical={vertical}
						/>
					);
				}}
			/>
		);
	}
}

export default Scrollbar;
export {
	Scrollbar,
	ScrollbarBase,
	ScrollThumb
};
