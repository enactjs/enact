import ApiDecorator from '@enact/core/internal/ApiDecorator';
import classNames from 'classnames';
import {Job} from '@enact/core/util';
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';

import ri from '../resolution';

import ScrollThumb from './ScrollThumb';

import css from './Scrollbar.less';

const minThumbSize = 18; // Size in pixels

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
 * {@link ui/Scroller.Scrollbar} is a Scrollbar.
 * It is used in {@link ui/Scrollable.Scrollable}.
 *
 * @class Scrollbar
 * @memberof ui/Scroller
 * @ui
 * @private
 */
class ScrollbarBase extends PureComponent {
	static displayName = 'Scrollbar'

	static propTypes = /** @lends ui/Scroller.Scrollbar.prototype */ {
		/**
		 * Exposes this instance as the provider for its imperative API
		 *
		 * @type {Function}
		 * @private
		 */
		setApiProvider: PropTypes.func,

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

	constructor (props) {
		super(props);

		this.initContainerRef = this.initRef('containerRef');
		this.initThumbRef = this.initRef('thumbRef');

		if (props.setApiProvider) {
			props.setApiProvider(this);
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
	// component refs
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

	showThumb () {
		this.hideThumbJob.stop();
		this.thumbRef.classList.add(css.thumbShown);
	}

	startHidingThumb () {
		this.hideThumbJob.start();
	}

	hideThumb = () => {
		this.thumbRef.classList.remove(css.thumbShown);
	}

	hideThumbJob = new Job(this.hideThumb, 200);

	calculateMetrics = () => {
		const trackSize = this.containerRef[this.props.vertical ? 'clientHeight' : 'clientWidth'];
		this.minThumbSizeRatio = ri.scale(minThumbSize) / trackSize;
	}

	initRef (prop) {
		return (ref) => {
			this[prop] = ref;
		};
	}

	render () {
		const
			{className, vertical} = this.props,
			containerClassName = classNames(
				className,
				css.scrollbar,
				vertical ? css.vertical : css.horizontal
			);

		return (
			<div ref={this.initContainerRef} className={containerClassName}>
				<ScrollThumb
					className={css.scrollThumb}
					getScrollThumbRef={this.initThumbRef}
					vertical={vertical}
				/>
			</div>
		);
	}
}

const Scrollbar = ApiDecorator({api: ['hideThumb', 'showThumb', 'startHidingThumb', 'update']}, ScrollbarBase);

export default Scrollbar;
export {
	Scrollbar,
	ScrollbarBase
};
