import classNames from 'classnames';
import {Job} from '@enact/core/util';
import PropTypes from 'prop-types';
import React, {PureComponent, Component} from 'react';
import ReactDOM from 'react-dom';

import ri from '../resolution';

import ScrollThumb from './ScrollThumb';

import componentCss from './Scrollbar.module.less';

const
	minThumbSize = 18, // Size in pixels
	thumbHidingDelay = 400; // in milliseconds

/*
 * Set CSS Varaible value.
 *
 * @method
 * @param {Node} element - Node.
 * @param {String} variable - CSS Variable property.
 * @param {String} value - CSS Variable value.
 */
const setCSSVariable = (element, variable, value) => {
	ReactDOM.findDOMNode(element).style.setProperty(variable, value); // eslint-disable-line react/no-find-dom-node
};

/**
 * An unstyled base component for a scroll bar. It is used in [Scrollable]{@link ui/Scrollable.Scrollable}.
 *
 * @class ScrollbarBase
 * @memberof ui/Scrollable
 * @ui
 * @private
 */
class ScrollbarBase extends PureComponent {
	static displayName = 'ui:Scrollbar'

	static propTypes = /** @lends ui/Scrollable.Scrollbar.prototype */ {
		/**
		 * The render function for child.
		 *
		 * @type {Function}
		 * @required
		 * @private
		 */
		childRenderer: PropTypes.func.isRequired,

		/**
		 * Client size of the container; valid values are an object that has `clientWidth` and `clientHeight`.
		 *
		 * @type {Object}
		 * @property {Number}    clientHeight    The client height of the list.
		 * @property {Number}    clientWidth    The client width of the list.
		 * @public
		 */
		clientSize: PropTypes.shape({
			clientHeight: PropTypes.number.isRequired,
			clientWidth: PropTypes.number.isRequired
		}),

		/**
		 * If `true`, add the corner between vertical and horizontal scrollbars.
		 *
		 * @type {Booelan}
		 * @default false
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

		this.containerRef = React.createRef();
		this.thumbRef = React.createRef();
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

		setCSSVariable(this.thumbRef.current, '--scrollbar-size-ratio', scrollThumbSizeRatio);
		setCSSVariable(this.thumbRef.current, '--scrollbar-progress-ratio', scrollThumbPositionRatio);
	}

	showThumb = () => {
		this.hideThumbJob.stop();
		ReactDOM.findDOMNode(this.thumbRef.current).classList.add(this.props.css.thumbShown); // eslint-disable-line react/no-find-dom-node
	}

	startHidingThumb = () => {
		this.hideThumbJob.start();
	}

	hideThumb = () => {
		ReactDOM.findDOMNode(this.thumbRef.current).classList.remove(this.props.css.thumbShown); // eslint-disable-line react/no-find-dom-node
	}

	hideThumbJob = new Job(this.hideThumb.bind(this), thumbHidingDelay);

	calculateMetrics = () => {
		const primaryDimenstion = this.props.vertical ? 'clientHeight' : 'clientWidth';
		let trackSize;

		if (this.props.clientSize) {
			trackSize = this.props.clientSize[primaryDimenstion];
		} else {
			trackSize = this.containerRef.current[primaryDimenstion];
		}

		this.minThumbSizeRatio = ri.scale(minThumbSize) / trackSize;
	}

	getContainerRef = () => (this.containerRef)

	render () {
		const
			{childRenderer, className, corner, css, vertical, ...rest} = this.props,
			containerClassName = classNames(
				className,
				css.scrollbar,
				corner ? css.corner : null,
				vertical ? css.vertical : css.horizontal
			);

		delete rest.clientSize;

		return (
			<div {...rest} className={containerClassName} ref={this.containerRef}>
				{childRenderer({
					getContainerRef: this.getContainerRef,
					thumbRef: this.thumbRef
				})}
			</div>
		);
	}
}

/**
 * An unstyled scroll bar. It is used in [Scrollable]{@link ui/Scrollable.Scrollable}.
 *
 * @class Scrollbar
 * @memberof ui/Scrollable
 * @ui
 * @private
 */
class Scrollbar extends Component {
	static propTypes = /** @lends ui/Scrollable.Scrollbar.prototype */ {
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
		vertical: true
	}

	setApi = (ref) => {
		if (ref) {
			const {getContainerRef, showThumb, startHidingThumb, update: uiUpdate} = ref;

			this.getContainerRef = getContainerRef;
			this.showThumb = showThumb;
			this.startHidingThumb = startHidingThumb;
			this.update = uiUpdate;
		}
	}

	render () {
		const {vertical} = this.props;

		return (
			<ScrollbarBase
				{...this.props}
				ref={this.setApi}
				childRenderer={({thumbRef}) => { // eslint-disable-line react/jsx-no-bind
					return (
						<ScrollThumb
							key="thumb"
							ref={thumbRef}
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
