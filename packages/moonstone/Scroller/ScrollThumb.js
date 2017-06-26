import hoc from '@enact/core/hoc';
import {Job, setCSSVariable} from '@enact/core/util';
import React, {PureComponent, PropTypes} from 'react';

import css from './ScrollThumb.less';

/**
 * {@link moonstone/ScrollThumb.ScrollThumbFadable} is a Higher-order Component
 * to hide a scrollThumb after 200ms
 *
 * @class ScrollThumbFadable
 * @memberof moonstone/ScrollThumb
 * @hoc
 * @private
 */
const ScrollThumbFadable = hoc((config, Wrapped) => {
	return class extends PureComponent {
		static displayName = 'ScrollThumbFadable'

		static propTypes = /** @lends moonstone/ScrollThumb.ScrollThumbFadable.prototype */ {
			/**
			 * The function to pass a wrapped ref.
			 *
			 * @type {Function}
			 * @public
			 */
			getScrollThumbMovableRef: PropTypes.func,
			/**
			 * The function to pass a wrapped ref.
			 *
			 * @type {Function}
			 * @public
			 */
			getScrollThumbRef: PropTypes.func
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

		startHidingThumb () {
			this.hideScrollThumbJob.stop();
			this.hideScrollThumbJob.start();
		}

		hideThumb = () => {
			if (this.scrollThumbNode) {
				this.scrollThumbNode.classList.remove(css.show);
				this.scrollThumbNode.classList.add(css.hide);
			}
		}

		getScrollThumbNode = (node) => {
			this.scrollThumbNode = node;
			if (this.props.getScrollThumbRef) {
				this.props.getScrollThumbRef(node);
			}
		}

		render () {
			const {getScrollThumbMovableRef, ...rest} = this.props;

			return (<Wrapped {...rest} getScrollThumbRef={this.getScrollThumbNode} ref={getScrollThumbMovableRef} />);
		}
	};
});

/**
 * {@link moonstone/ScrollThumb.ScrollThumbMovable} is a Higher-order Component
 * to move up and down or left and right a thumb while scrolling a list
 *
 * @class ScrollThumbMovable
 * @memberof moonstone/ScrollThumb
 * @hoc
 * @private
 */
const ScrollThumbMovable = hoc((config, Wrapped) => {
	return class extends PureComponent {
		static displayName = 'ScrollThumbMovable'

		static propTypes = /** @lends moonstone/ScrollThumb.ScrollThumbMovable.prototype */ {
			/**
			 * The function to pass a wrapped ref.
			 *
			 * @type {Function}
			 * @public
			 */
			getScrollThumbRef: PropTypes.func.isRequired,

			/**
			 * If `true`, the scrollbar will be oriented vertically.
			 *
			 * @type {Boolean}
			 * @public
			 */
			vertical: PropTypes.bool.isRequired
		}

		update = (bounds, minThumbSizeRatio) => {
			const
				{vertical} = this.props,
				{clientWidth, clientHeight, scrollWidth, scrollHeight, scrollLeft, scrollTop} = bounds,
				clientSize = vertical ? clientHeight : clientWidth,
				scrollSize = vertical ? scrollHeight : scrollWidth,
				scrollOrigin = vertical ? scrollTop : scrollLeft,

				thumbSizeRatioBase = (clientSize / scrollSize),
				scrollThumbPositionRatio = (scrollOrigin / (scrollSize - clientSize)),
				scrollThumbSizeRatio = Math.max(minThumbSizeRatio, Math.min(1, thumbSizeRatioBase));

			setCSSVariable(this.scrollThumbNode, '--scrollbar-size-ratio', scrollThumbSizeRatio);
			setCSSVariable(this.scrollThumbNode, '--scrollbar-progress-ratio', scrollThumbPositionRatio);
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

			return <Wrapped {...props} getScrollThumbRef={this.getScrollThumbNode} />;
		}
	};
});

class ScrollThumbBase extends PureComponent {
	static displayName = 'ScrollThumbBase'

	static propTypes = /** @lends moonstone/ScrollThumb.ScrollThumbBase.prototype */ {
		/**
		 * The function to pass a wrapped ref.
		 *
		 * @type {Function}
		 * @public
		 */
		getScrollThumbRef: PropTypes.func.isRequired,

		/**
		 * If `true`, the scrollbar will be oriented vertically.
		 *
		 * @type {Boolean}
		 * @public
		 */
		vertical: PropTypes.bool.isRequired
	}

	render () {
		const {className, getScrollThumbRef, vertical, ...rest} = this.props;
		let classes = [className ? className : null, (vertical ? css.vertical : css.horizontal), css.scrollThumb].join(' ');

		return <div {...rest} className={classes} ref={getScrollThumbRef} />;
	}
}

/**
 * {@link moonstone/ScrollThumb.ScrollThumb} is the thumb of a Scrollbar with Moonstone styling.
 * It is used in {@link moonstone/Scrollbar.Scrollbar}.
 *
 * @class ScrollThumb
 * @memberof moonstone/ScrollThumb
 * @ui
 * @private
 */
const ScrollThumb = ScrollThumbFadable(ScrollThumbMovable(ScrollThumbBase));

export default ScrollThumb;
export {
	ScrollThumb,
	ScrollThumbBase
};
