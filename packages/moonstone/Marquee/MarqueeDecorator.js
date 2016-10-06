import hoc from '@enact/core/hoc';
import {contextTypes} from '@enact/i18n/I18nDecorator';
import React from 'react';

import css from './Marquee.less';

const animated = css.text + ' ' + css.animate;

const defaultConfig = {
	blur: 'onBlur',
	className: null,
	enter: 'onMouseEnter',
	focus: 'onFocus',
	leave: 'onMouseLeave'
};

const MarqueeDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {blur, className: marqueeClassName, enter, focus, leave} = config;

	const nonanimated = css.text + ' ' + marqueeClassName;

	return class extends React.Component {
		static displayName = 'MarqueeDecorator'
		static contextTypes = contextTypes

		distance = null

		static propTypes = {
			children: React.PropTypes.node,
			className: React.PropTypes.string,
			disabled: React.PropTypes.bool,
			marqueeDelay: React.PropTypes.number,
			marqueeDisabled: React.PropTypes.bool,
			marqueeOnFocus: React.PropTypes.bool,
			marqueeOnHover: React.PropTypes.bool,
			marqueeOnRender: React.PropTypes.bool,
			marqueePause: React.PropTypes.number,
			marqueeSpeed: React.PropTypes.number
		}

		static defaultProps = {
			marqueeDelay: 1000,
			marqueeOnFocus: true,
			marqueePause: 1000,
			marqueeSpeed: 60
		}

		constructor (props) {
			super(props);
			this.state = {
				overflow: 'ellipsis'
			};
		}

		componentDidMount () {
			if (this.props.marqueeOnRender) {
				this.startAnimation();
			}
		}

		componentDidUpdate () {
			// this.startAnimation();
		}

		componentWillUnmount () {
			clearTimeout(this.timer);
		}

		/**
		* Determine if the marquee should animate
		*
		* @param {Number} [distance] Marquee distance
		* @returns {Boolean} Returns `true` if this control has enough content to animate.
		* @private
		*/
		shouldAnimate (distance) {
			distance = (distance && distance >= 0) ? distance : this.calcDistance();
			return (distance > 0);
		}

		/**
		* Determines how far the marquee needs to scroll.
		*
		* @returns {Number} Marquee distance
		* @private
		*/
		calcDistance () {
			const node = this.node;
			let rect;

			// TODO: absolute showing check (or assume that it won't be rendered if it isn't showing?)
			if (node && this.distance == null) {
				rect = node.getBoundingClientRect();
				this.distance = Math.floor(Math.abs(node.scrollWidth - rect.width));

				// if the distance is exactly 0, then the ellipsis
				// most likely are hiding the content, and marquee does not
				// need to animate
				if (this.distance === 0) {
					this.setState({overflow: 'clip'});
				} else {
					this.setState({overflow: 'ellipsis'});
				}
			}

			return this.distance;
		}

		/**
		* Starts marquee animation.
		*
		* @private
		*/
		startAnimation = () => {
			if (this.state.animating || this.contentFits) return;

			const distance = this.calcDistance();

			// If there is no need to animate, return early
			if (!this.shouldAnimate(distance)) {
				this.contentFits = true;
				return;
			}

			clearTimeout(this.timer);
			this.timer = setTimeout(() => {
				this.setState({
					animating: true
				});
			}, this.props.marqueeDelay);
		}

		restartAnimation = () => {
			this.setState({
				animating: false
			});
			this.startAnimation();
		}

		stopAnimation = () => {
			clearTimeout(this.timer);
			this.timer = setTimeout(this.restartAnimation, this.props.marqueePause);
		}

		cancelAnimation = () => {
			clearTimeout(this.timer);
			this.setState({
				animating: false
			});
		}

		adjustDistanceForRTL (distance) {
			return this.context.rtl ? distance : distance * -1;
		}

		calcStyle () {
			const distance = this.calcDistance();
			const duration = distance / this.props.marqueeSpeed;

			const style = {
				textOverflow: this.state.overflow,
				transform: 'translateZ(0)'
			};

			if (this.state.animating) {
				style.transform = `translate3d(${this.adjustDistanceForRTL(distance)}px, 0, 0)`;
				style.transition = `transform ${duration}s linear`;
				style.WebkitTransition = `transform ${duration}s linear`;
			}

			return style;
		}

		handleTransitionEnd = () => {
			this.stopAnimation();
		}

		cacheNode = (node) => {
			this.node = node;
		}

		renderMarquee () {
			const {children, disabled, marqueeOnFocus, marqueeOnHover, ...rest} = this.props;
			const style = this.calcStyle();

			if (marqueeOnFocus) {
				rest[focus] = this.startAnimation;
				rest[blur] = this.cancelAnimation;
			}

			// TODO: cancel others on hover
			if ((marqueeOnHover && !this.marqueeOnFocus) || (disabled && this.marqueeOnFocus)) {
				rest[enter] = this.startAnimation;
				rest[leave] = this.cancelAnimation;
			}

			delete rest.marqueeDelay;
			delete rest.marqueeOnFocus;
			delete rest.marqueePause;
			delete rest.marqueeSpeed;

			return (
				<Wrapped {...rest} disabled={disabled}>
					<div className={css.marquee}>
						<div
							className={this.state.animating ? animated : nonanimated}
							style={style}
							ref={this.cacheNode}
							onTransitionEnd={this.handleTransitionEnd}
						>
							{children}
						</div>
					</div>
				</Wrapped>
			);
		}

		renderWrapped () {
			const props = Object.assign({}, this.props);

			delete props.marqueeDelay;
			delete props.marqueeDisabled;
			delete props.marqueeOnFocus;
			delete props.marqueeOnHover;
			delete props.marqueeOnRender;
			delete props.marqueePause;
			delete props.marqueeSpeed;

			return <Wrapped {...props} />;
		}

		render () {
			if (this.props.marqueeDisabled) {
				return this.renderWrapped();
			} else {
				return this.renderMarquee();
			}
		}
	};

});

export default MarqueeDecorator;
export {MarqueeDecorator};
