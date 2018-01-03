/**
 * Exports the {@link ui/Scroller.Scroller} and
 * {@link ui/Scroller.ScrollerBase} components.
 * The default export is {@link ui/Scroller.Scroller}.
 *
 * @module ui/Scroller
 */

import classNamesBind from 'classnames/bind';
import {handle, forwardWithPrevent, preventDefault} from '@enact/core/handle';
import PropTypes from 'prop-types';
import clamp from 'ramda/src/clamp';
import React, {Component} from 'react';

import ri from '../resolution';
import ComponentOverride from '../ComponentOverride';

import css from './Scroller.less';

const classnames = classNamesBind.bind(css);

const ScrollStrategyPropType = PropTypes.shape({
	// (node) => bounds
	getBounds: PropTypes.func,
	// (node, x, y) => undefined
	scroll: PropTypes.func
});

const TranslateScrollStrategy = {
	getBounds: (node) => {
		const {clientHeight: height, clientWidth: width, scrollHeight, scrollWidth} = node;

		return {height, width, scrollHeight, scrollWidth};
	},
	scroll: (node, x, y) => {
		node.style.transform = `translateX(-${x}px)  translateY(-${y}px)`;
	}
};

/**
 * {@link ui/Scroller.ScrollerBase} is a base component for Scroller.
 * In most circumstances, you will want to use Scrollable version:
 * {@link ui/Scroller.Scroller}
 *
 * @class ScrollerBase
 * @memberof ui/Scroller
 * @ui
 * @public
 */
class ScrollerBase extends Component {
	static displayName = 'Scroller'

	static propTypes = /** @lends ui/Scroller.ScrollerBase.prototype */ {
		defaultScrollLeft: PropTypes.number,
		defaultScrollTop: PropTypes.number,
		horizontal: PropTypes.string,
		onStep: PropTypes.func,
		onWheel: PropTypes.func,
		scrollbarComponent: PropTypes.func,
		strategy: ScrollStrategyPropType,
		vertical: PropTypes.string
	}

	static defaultProps = {
		defaultScrollLeft: 0,
		defaultScrollTop: 0,
		horizontal: 'auto',
		strategy: TranslateScrollStrategy,
		vertical: 'auto'
	}

	constructor (props) {
		super();

		this.state = {
			height: 0,
			width: 0,
			scrollHeight: 0,
			scrollWidth: 0,
			x: props.defaultScrollLeft,
			y: props.defaultScrollTop
		};
	}

	componentDidMount () {
		this.calculateMetrics();
	}

	componentDidUpdate (prevProps, prevState) {
		const {x, y} = this.state;

		const didScrollXChange = this.state.x !== prevState.x;
		const didScrollYChange = this.state.y !== prevState.y;

		if (this.contentNode && this.props.strategy && (didScrollYChange || didScrollXChange)) {
			this.props.strategy.scroll(this.contentNode, x, y);
		}
	}

	setContainer = (node) => {
		this.containerNode = node;
	}

	setContent = (node) => {
		this.contentNode = node;
	}

	calculateMetrics () {
		this.setState((currentBounds) => {
			if (this.containerNode) {
				const bounds = this.props.strategy.getBounds(this.containerNode);

				if (
					bounds.height !== currentBounds.height ||
					bounds.width !== currentBounds.width ||
					bounds.scrollHeight !== currentBounds.scrollHeight ||
					bounds.scrollWidth !== currentBounds.scrollWidth
				) {
					return bounds;
				}
			}

			return null;
		});
	}

	isHorizontalScrollbarVisible () {
		return this.props.horizontal === 'always' || (
			this.props.horizontal === 'auto' && this.state.scrollWidth > this.state.width
		);
	}

	isVerticalScrollbarVisible () {
		return this.props.vertical === 'always' || (
			this.props.vertical === 'auto' && this.state.scrollHeight > this.state.height
		);
	}

	scrollIncrementally (dx, dy) {
		this.setState(({height, scrollHeight, scrollWidth, width, x, y}) => {
			return {
				x: clamp(0, scrollWidth - width, x + dx),
				y: clamp(0, scrollHeight - height, y + dy)
			};
		});
	}

	scrollByWheel (deltaMode, wheelDelta) {
		// The ratio of the maximum distance scrolled by wheel to the size of the viewport.
		const scrollWheelPageMultiplierForMaxPixel = 0.2;

		// The ratio of wheel 'delta' units to pixels scrolled.
		const scrollWheelMultiplierForDeltaPixel = 1.5;

		// theme-specific?
		const pixelPerLine = 39;

		let maxPixel = 0;
		let orientation;
		if (this.isVerticalScrollbarVisible()) {
			orientation = 'vertical';
			maxPixel = this.state.height * scrollWheelPageMultiplierForMaxPixel;
		} else if (this.isHorizontalScrollbarVisible()) {
			orientation = 'horizontal';
			maxPixel = this.state.width * scrollWheelPageMultiplierForMaxPixel;
		}

		let delta = 0;

		if (deltaMode === 0) {
			delta = clamp(-maxPixel, maxPixel, ri.scale(wheelDelta * scrollWheelMultiplierForDeltaPixel));
		} else if (deltaMode === 1) { // line; firefox
			delta = clamp(-maxPixel, maxPixel, ri.scale(wheelDelta * pixelPerLine * scrollWheelMultiplierForDeltaPixel));
		} else if (deltaMode === 2) { // page
			delta = wheelDelta < 0 ? -maxPixel : maxPixel;
		}

		if (delta !== 0) {
			this.scrollIncrementally(
				orientation === 'horizontal' ? delta : 0,
				orientation === 'vertical' ? delta : 0
			);
		}
	}

	handle = handle.bind(this)

	handleHorizontalStep = this.handle(
		forwardWithPrevent('onStep'),
		({delta}) => this.scrollIncrementally(delta, 0)
	);

	handleVerticalStep = this.handle(
		forwardWithPrevent('onStep'),
		({delta}) => this.scrollIncrementally(0, delta)
	)

	handleWheel = this.handle(
		forwardWithPrevent('onWheel'),
		preventDefault,
		(ev) => {
			const eventDeltaMode = ev.deltaMode;
			const eventDelta = (-ev.wheelDeltaY || ev.deltaY);

			this.scrollByWheel(eventDeltaMode, eventDelta);
		}
	)

	render () {
		const {children, className, scrollbarComponent, ...rest} = this.props;

		const showHorizontal = this.isHorizontalScrollbarVisible();
		const showVertical = this.isVerticalScrollbarVisible();

		const classes = classnames(
			css.scroller,
			className,
			{
				vertical: showVertical,
				horizontal: showHorizontal
			}
		);

		delete rest.defaultScrollLeft;
		delete rest.defaultScrollTop;
		delete rest.horizontal;
		delete rest.strategy;
		delete rest.vertical;

		return (
			<div className={classes} {...rest} onWheel={this.handleWheel}>
				<div className={css.container} ref={this.setContainer}>
					<div ref={this.setContent} className={css.content}>
						{children}
					</div>
				</div>
				<ComponentOverride
					component={showVertical ? scrollbarComponent : null}
					max={this.state.scrollHeight - this.state.height}
					onStep={this.handleVerticalStep}
					orientation="vertical"
					size={this.state.height}
					value={this.state.y}
				/>
				<ComponentOverride
					component={showHorizontal ? scrollbarComponent : null}
					max={this.state.scrollWidth - this.state.width}
					onStep={this.handleHorizontalStep}
					orientation="horizontal"
					size={this.state.width}
					value={this.state.x}
				/>
			</div>
		);
	}
}

export default ScrollerBase;
export {ScrollerBase as Scroller, ScrollerBase};
