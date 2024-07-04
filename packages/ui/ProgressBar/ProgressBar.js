/**
 * A basic progress bar component that can display the progress of something in a horizontal,
 * vertical, or radial bar format.
 *
 * A secondary independent progress indicator can be displayed, to indicate
 * an additional degree of information, often used as a background loading progress.
 *
 * @module ui/ProgressBar
 * @exports ProgressBar
 * @exports ProgressBarBase
 * @exports ProgressBarDecorator
 */

import kind from '@enact/core/kind';
import EnactPropTypes from '@enact/core/internal/prop-types';
import clamp from 'ramda/src/clamp';
import compose from 'ramda/src/compose';
import PropTypes from 'prop-types';

import {validateRange} from '../internal/validators';
import ForwardRef from '../ForwardRef';

import * as componentCss from './ProgressBar.module.less';

const progressToProportion = (value) => clamp(0, 1, value);
const calcBarStyle = (prop, anchor, value = anchor, startProp, endProp) => {
	let start = Math.min(anchor, value);
	let end = Math.max(anchor, value) - start;

	if (__DEV__) {
		validateRange(start, 0, 1, 'ProgressBar', prop, 'min', 'max');
		validateRange(end, 0, 1, 'ProgressBar', prop, 'min', 'max');
	}

	return {
		[startProp]: progressToProportion(start),
		[endProp]: progressToProportion(end)
	};
};

/**
 * An unstyled progress bar component that can be customized by a theme or application.
 *
 * @class ProgressBarBase
 * @memberof ui/ProgressBar
 * @ui
 * @public
 */
const ProgressBarBase = kind({
	name: 'ui:ProgressBar',

	propTypes: /** @lends ui/ProgressBar.ProgressBarBase.prototype */ {
		/**
		 * The proportion of the loaded portion of the progress bar.
		 *
		 * * Valid values are between `0` and `1`.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		backgroundProgress: PropTypes.number,

		/**
		 * The contents to be displayed with progress bar.
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.node,

		/**
		 * Called with a reference to the root component.
		 *
		 * When using {@link ui/ProgressBar.ProgressBar}, the `ref` prop is forwarded to this
		 * component as `componentRef`.
		 *
		 * @type {Object|Function}
		 * @public
		 */
		componentRef: EnactPropTypes.ref,

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `progressBar` - The root component class
		 * * `bar`         - The background node (the empty part of the progressBar)
		 * * `fill`        - The foreground of the progress bar (`progress`)
		 * * `load`        - The `backgroundProgress` node
		 * * `horizontal`  - Applied when `orientation` is `'horizontal'`
		 * * `vertical`    - Applied when `orientation` is `'vertical'`
		 * * `radial`      - Applied when `orientation` is `'radial'`
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * Sets the orientation of the slider.
		 *
		 * Allowed values include:
		 *
		 * * `'horizontal'` - A left and right orientation
		 * * `'vertical'` - An up and down orientation
		 * * `'radial'` - A circular orientation
		 *
		 * @type {String}
		 * @default 'horizontal'
		 * @public
		 */
		orientation: PropTypes.string,

		/**
		 * The proportion of the filled portion of the progress bar.
		 *
		 * * Valid values are between `0` and `1`.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		progress: PropTypes.number,

		/**
		 * Sets the point, as a proportion between 0 and 1, from which the progress bar is filled.
		 *
		 * Applies to both the progress bar's `value` and `backgroundProgress`. In both cases,
		 * setting the value of `progressAnchor` will cause the progress bar to fill from that point
		 * down, when `value` or `backgroundProgress` is proportionally less than the anchor, or up,
		 * when `value` or `backgroundProgress` is proportionally greater than the anchor, rather
		 * than always from the start of the progress bar.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		progressAnchor: PropTypes.number
	},

	defaultProps: {
		backgroundProgress: 0,
		orientation: 'horizontal',
		progress: 0,
		progressAnchor: 0
	},

	styles: {
		css: componentCss,
		className: 'progressBar',
		publicClassNames: true
	},

	computed: {
		className: ({backgroundProgress, orientation, progress, styler}) => styler.append(orientation, {
			fillOverHalf: (progress > 0.5),
			loadOverHalf: (backgroundProgress > 0.5)
		}),
		style: ({backgroundProgress, progress, progressAnchor, style}) => {
			return {
				...style,
				'--ui-progressbar-proportion-anchor': progressAnchor,
				...calcBarStyle(
					'backgroundProgress',
					progressAnchor,
					backgroundProgress,
					'--ui-progressbar-proportion-start-background',
					'--ui-progressbar-proportion-end-background'
				),
				...calcBarStyle(
					'progress',
					progressAnchor,
					progress,
					'--ui-progressbar-proportion-start',
					'--ui-progressbar-proportion-end'
				)
			};
		}
	},

	render: ({children, componentRef, css, ...rest}) => {
		delete rest.backgroundProgress;
		delete rest.orientation;
		delete rest.progress;
		delete rest.progressAnchor;

		return (
			<div role="progressbar" {...rest} ref={componentRef}>
				<div className={css.bar}>
					<div className={css.load} />
					<div className={css.fill} />
				</div>
				{children}
			</div>
		);
	}
});

/**
 * A higher-order component that adds behavior to
 * {@link ui/ProgressBar.ProgressBarBase|ProgressBar}.
 *
 * @hoc
 * @memberof ui/ProgressBar
 * @mixes ui/ForwardRef.ForwardRef
 * @public
 */
const ProgressBarDecorator = compose(
	ForwardRef({prop: 'componentRef'})
);

/**
 * An unstyled progress bar component that can be customized by a theme or application.
 *
 * @class ProgressBar
 * @memberof ui/ProgressBar
 * @extends ui/ProgressBar.ProgressBarBase
 * @mixes ui/ProgressBar.ProgressBarDecorator
 * @omit componentRef
 * @ui
 * @public
 */
const ProgressBar = ProgressBarDecorator(ProgressBarBase);

export default ProgressBar;
export {
	ProgressBar,
	ProgressBarBase,
	ProgressBarDecorator
};
