import hoc from '@enact/core/hoc';
import {Job} from '@enact/core/util';
import React, {PureComponent, PropTypes} from 'react';

import css from './ScrollThumb.less';

/**
 * {@link moonstone/Scrollbar.ScrollThumbFadable} is a Higher-order Component
 * to hide a scrollThumb after 200ms
 *
 * @class ScrollThumbFadable
 * @memberof moonstone/Scrollbar
 * @hoc
 * @private
 */
const ScrollThumbFadable = hoc((config, Wrapped) => {
	return class extends PureComponent {
		static displayName = 'ScrollThumbFadable'

		static propTypes = /** @lends moonstone/ScrollThumb.ScrollThumbFadable.prototype */ {
			getScrollThumbMovableRef: PropTypes.func.isRequired
		}

		constructor () {
			super();
			this.hideScrollThumbJob = new Job(this.hideThumb, 200);
		}

		scrollThumbNode = null;

		showThumb () {
			this.hideScrollThumbJob.stop();
			if (this.scrollThumbNode) {
				this.scrollThumbNode.classList.add(css.show);
				this.scrollThumbNode.classList.remove(css.hide);
			}
		}

		delayHidingThumb () {
			this.hideScrollThumbJob.stop();
			this.hideScrollThumbJob.start();
		}

		hideThumb = () => {
			this.scrollThumbNode.classList.remove(css.show);
			this.scrollThumbNode.classList.add(css.hide);
		}

		getScrollThumbNode = (node) => {
			this.scrollThumbNode = node;
		}

		render () {
			const {getScrollThumbMovableRef, ...rest} = this.props;

			return (<Wrapped {...rest} getScrollThumbRef={this.getScrollThumbNode} ref={getScrollThumbMovableRef} />);
		}
	};
});

const
	setCssValueOn = (element, variable, value) => {
		element.style.setProperty(variable, value);
	},
	updateVerticalProgress = (element, value) => {
		setCssValueOn(element, '--scrollbar-v-progress', value);
	},
	updateVerticalSize = (element, value) => {
		setCssValueOn(element, '--scrollbar-v-size', (value * 100) + '%');
	},
	updateHorizontalProgress = (element, value) => {
		setCssValueOn(element, '--scrollbar-h-progress', value);
	},
	updateHorizontalSize = (element, value) => {
		setCssValueOn(element, '--scrollbar-h-size', (value * 100) + '%');
	};

const ScrollThumbMovable = hoc((config, Wrapped) => {
	return class extends PureComponent {
		static displayName = 'ScrollThumbMovable'

		static propTypes = /** @lends moonstone/ScrollThumb.ScrollThumbMovable.prototype */ {
			getScrollThumbRef: PropTypes.func.isRequired,
			vertical: PropTypes.bool.isRequired
		}

		update = (bounds, rtl) => {
			const
				{vertical} = this.props,
				{clientWidth, clientHeight, scrollWidth, scrollHeight, scrollLeft, scrollTop} = bounds,
				scrollLeftRtl = rtl ? (scrollWidth - clientWidth - scrollLeft) : scrollLeft;
			let
				scrollThumbSizeRatio = vertical ?
					Math.min(1, clientHeight / scrollHeight) :
					Math.min(1, clientWidth / scrollWidth),
				scrollThumbPositionRatio = vertical ?
					scrollTop / (scrollHeight - clientHeight) :
					scrollLeftRtl / (scrollWidth - clientWidth);

			// overscroll cases
			if (scrollThumbPositionRatio < 0) {
				scrollThumbSizeRatio = scrollThumbSizeRatio + scrollThumbPositionRatio;
				scrollThumbPositionRatio = 0;
			} else if (scrollThumbPositionRatio > 1) {
				scrollThumbSizeRatio = scrollThumbSizeRatio + (1 - scrollThumbPositionRatio);
				scrollThumbPositionRatio = 1;
			}

			scrollThumbPositionRatio = (vertical || !rtl) ? (scrollThumbPositionRatio * (1 - scrollThumbSizeRatio)) : (scrollThumbPositionRatio * (1 - scrollThumbSizeRatio) - 1);

			if (vertical) {
				updateVerticalSize(this.scrollThumbNode, scrollThumbSizeRatio);
				updateVerticalProgress(this.scrollThumbNode, scrollThumbPositionRatio);
			} else {
				updateHorizontalSize(this.scrollThumbNode, scrollThumbSizeRatio);
				updateHorizontalProgress(this.scrollThumbNode, scrollThumbPositionRatio);
			}
		}

		getScrollThumbNode = (node) => {
			this.scrollThumbNode = node;
			if (this.props.getScrollThumbRef) {
				this.props.getScrollThumbRef(node);
			}
		}

		render () {
			const props = Object.assign({}, this.props);

			delete props.getScrollThumbNode;
			delete props.vertical;

			return (<Wrapped {...props} getScrollThumbRef={this.getScrollThumbNode} />);
		}
	};
});

class ScrollThumbBase extends PureComponent {
	static displayName = 'ScrollThumbBase'

	static propTypes = /** @lends moonstone/ScrollThumb.ScrollThumbBase.prototype */ {
		getScrollThumbRef: PropTypes.func.isRequired
	}

	render () {
		const {getScrollThumbRef, ...rest} = this.props;

		return (<div {...rest} ref={getScrollThumbRef} />);
	}
}

const ScrollThumb = ScrollThumbFadable(ScrollThumbMovable(ScrollThumbBase));

export default ScrollThumb;
export {
	ScrollThumb,
	ScrollThumbBase
};
