/**
 * Exports the {@link module:@enact/moonstone/ItemOverlay~ItemOverlay} Higher-order Component (HOC)
 * and an {@link module:@enact/moonstone/ItemOverlay.Overlay} element component.
 *
 * @module @enact/moonstone/ItemOverlay
 */

import {kind, hoc} from '@enact/core';
import styles from '@enact/core/kind/styles';
import React, {PropTypes} from 'react';

import css from './ItemOverlay.less';


const styling = styles(css, {});

const defaultConfig = {
};

/**
 * {@link moonstone/ItemOverlay.Overlay} is the component inserted into an
 * {@link module:@enact/moonstone/ItemOverlay~ItemOverlay} on both sides.
 *
 * @class ItemBase
 * @memberof moonstone/Item
 * @ui
 * @public
 */
const Overlay = kind({
	name: 'Overlay',

	propTypes: /** @lends moonstone/Item.ItemBase.prototype */ {
		/**
		 * Should this component be hidden or not?
		 *
		 * @type {Boolean}
		 * default false
		 * @public
		 */
		hidden: PropTypes.bool
	},

	defaultProps: {
		hidden: false
	},

	styles: {
		css,
		className: 'overlay'
	},

	computed: {
		className: ({hidden, styler}) => styler.append({hidden})
	},

	render: (rest) => {
		delete rest.hidden;
		return (
			<div {...rest} />
		);
	}
});

const getOverlay = (props) => {
	// Don't return anything if we have no children. Single-hoarder.
	return (props.children) ? <Overlay {...props} /> : null;
};

/**
 * {@link module:@enact/ui/ItemOverlay~ItemOverlay} is a Higher-order Component that applies a
 * 'ItemOverlay' behavior to its wrapped component.
 *
 *
 * `ItemOverlay` hooks directly into `Item` and `MarqueeDecorator`. If `beginningOverlay` or
 * `endingOverlay` are present, they'll drop onto the `beforeMarquee` and `afterMarquee` props
 * respectively. Their visibility can be individually controlled via the `autoHide` prop.
 *
 *
 * @class ItemOverlay
 * @ui
 * @public
 */
const ItemOverlayHOC = hoc(defaultConfig, (config, Wrapped) => {
	return class ItemOverlay extends React.Component {
		static propTypes = {
			/**
			 * Controls the visibility state of the overlays. One, both, or neither overlay can be
			 * shown when the item is focused. Choosing 'ending' will leave `beginningOverlay`
			 * visible at all times; only `endingOverlay` will have its visibility toggled on focus.
			 * Valid values are 'beginning', 'ending', 'both' and 'no'. 'no' being no-auto-hiding
			 * for either overlay. They will both be present regardless of focus.
			 *
			 * @type {Boolean}
			 * @default 'no'
			 * @public
			 */
			autoHide: PropTypes.oneOf(['no', 'beginning', 'ending', 'both']),

			/**
			 * Property accepts a node which will be displayed at the beginning of the item.
			 * Typically this will be an icon or multiple icons.
			 *
			 * @type {Element}
			 * @default null
			 * @public
			 */
			beginningOverlay: PropTypes.node,

			/**
			 * Property accepts a node which will be displayed at the end of the item.
			 * Typically this will be an icon or multiple icons.
			 *
			 * @type {Element}
			 * @default null
			 * @public
			 */
			endingOverlay: PropTypes.node
		}

		static defaultProps = {
			autoHide: 'no'
		}

		render () {
			let {beginningOverlay, children, endingOverlay, autoHide, ...rest} = Object.assign({}, this.props);

			// Insert styles from the user, from our defaults, and from our wrapped component defaults
			rest.className = styling.styler.join(rest.className, css.item,
				(autoHide ? css[autoHide] : null)
			);

			return (
				<Wrapped
					beforeMarquee={getOverlay({className: css.beginning, children: beginningOverlay, hidden: (autoHide === 'beginning' || autoHide === 'both')})}
					afterMarquee={getOverlay({className: css.ending, children: endingOverlay, hidden: (autoHide === 'ending' || autoHide === 'both')})}
					{...rest}
				>
					{children}
				</Wrapped>
			);
		}
	};
});

export default ItemOverlayHOC;
export {ItemOverlayHOC as ItemOverlay, Overlay};
