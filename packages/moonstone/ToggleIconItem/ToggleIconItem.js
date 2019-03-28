import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import EnactPropTypes from '@enact/core/internal/prop-types';
import Icon from '../Icon';
import componentCss from './ToggleIconItem.module.less';

/**
 * Renders an `ToggleItem` with a customized icon.
 *
 * @class ToggleIconItem
 * @memberof moonstone/ToggleIconItem
 * @ui
 * @public
 */

// eslint-disable-next-line
const itemIconCreator = (position) => ({css, itemIcon, itemIconPosition}) => {
	if (position === itemIconPosition) {
		return (
			itemIcon !== null ?
				<Icon slot={itemIconPosition} className={css.itemIcon}>{itemIcon}</Icon> : null
		);
	}
};


const ToggleIconItemBase = kind({
	name: 'ImageItem',

	propTypes: /** @lends moonstone/ToggleIconItem.ToggleIconItemBase.prototype */ {

		/**
		 * The `Icon` to render in this item.
		 * Nodes to be inserted before `children`, after `children` and before this component.
		 *
		 * * A string that represents an icon from the [iconList]{@link ui/Icon.Icon.iconList},
		 * * A URL specifying path to an icon image
		 *
		 * @type {String|Object}
		 * @required
		 * @public
		 */
		itemIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,

		/**
		 * The `Icon` to render in this item.
		 *
		 * Specifies on which position (`'beforeItem'`, `'beforeText'` or `'afterText'`) of the text the itemIcon appears.
		 *
		 * @type {String}
		 * @required
		 * @public
		 */
		itemIconPosition: PropTypes.oneOf(['beforeItem', 'beforeText', 'afterText']).isRequired,

		/**
		 * The type of toggleItem to use to render as root element.
		 * If specified by a non-toggleItem type, the `itemIcon` will not render normally.
		 *
		 * The following components are supported.
		 *
		 *  * `FormCheckboxItem`, `ChekcboxItem`, `RadioItem`, `SelectableItem`, `SwitchItem`
		 *
		 * @type {Component}
		 * @required
		 * @public
		 */
		toggleComponent: EnactPropTypes.component.isRequired,

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * By specifying the `min-width` as the itemIcon size, it can guarantee the itemIcon size.
		 *
		 * The following classes are supported:
		 *
		 * * `radioItem` - The root class name
		 * * `itemIcon` - The class name for customizing `itemIcon`
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object
	},

	styles: {
		css: componentCss,
		className: 'toggleIconItem',
		publicClassNames: ['toggleIconItem', 'itemIcon']
	},

	computed: {
		afterText: itemIconCreator('afterText'),
		beforeItem: itemIconCreator('beforeItem'),
		beforeText: itemIconCreator('beforeText')
	},

	render: ({toggleComponent: Component, ...props}) => {

		delete props.itemIcon;
		delete props.itemIconPosition;

		return (
			<Component
				role="checkbox"
				{...props}
				css={props.css}
			/>
		);
	}
});

export default ToggleIconItemBase;
export {
	ToggleIconItemBase as ToggleIconItem,
	ToggleIconItemBase
};
