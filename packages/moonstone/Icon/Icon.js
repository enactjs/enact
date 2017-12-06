/**
 * A versatile way to draw an icon. This accepts strings to refer to preset icons, specific
 * codepoints in a dingbat font, entity references in several formats, and URLs for a graphic file.
 *
 * @example
 * <Icon>flag</Icon>
 *
 * @module moonstone/Icon
 * @exports Icon
 * @exports IconBase
 * @exports IconBaseFactory
 * @exports IconFactory
 * @exports iconList
 */

import kind from '@enact/core/kind';
import hoc from '@enact/core/hoc';
import Pure from '@enact/ui/internal/Pure';
import UiIcon from '@enact/ui/Icon';
import React from 'react';

import Skinnable from '../Skinnable';

import iconList from './IconList.js';

import componentCss from './Icon.less';

/**
 * A factory for customizing the visual style of [IconBase]{@link moonstone/Icon.IconBase}.
 *
 * @class IconBaseFactory
 * @memberof moonstone/Icon
 * @factory
 * @public
 */
const IconBase = kind({
	name: 'MoonstoneIcon',
	styles: {
		css: componentCss
		// publicClassNames: true
	},
	render: (props) => (
		<UiIcon
			{...props}
			css={props.css}
			iconList={iconList}
		/>
	)
});

// Let's find a way to import this list directly, and bonus feature, render our icons in the docs next to their names.
/**
 * {@link moonstone/Icon.iconList} is an object whose keys can be used as the child of an
 * {@link moonstone/Icon.Icon} component.
 *
 * List of Icons:
 * ```
 * plus
 * minus
 * arrowhookleft
 * arrowhookright
 * ellipsis
 * check
 * circle
 * stop
 * play
 * pause
 * forward
 * backward
 * skipforward
 * skipbackward
 * pauseforward
 * pausebackward
 * pausejumpforward
 * pausejumpbackward
 * jumpforward
 * jumpbackward
 * denselist
 * bulletlist
 * list
 * drawer
 * arrowlargedown
 * arrowlargeup
 * arrowlargeleft
 * arrowlargeright
 * arrowsmallup
 * arrowsmalldown
 * arrowsmallleft
 * arrowsmallright
 * closex
 * search
 * rollforward
 * rollbackward
 * exitfullscreen
 * fullscreen
 * arrowshrinkleft
 * arrowshrinkright
 * arrowextend
 * arrowshrink
 * flag
 * funnel
 * trash
 * star
 * hollowstar
 * halfstar
 * gear
 * plug
 * lock
 * forward15
 * back15
 * continousplay
 * playlist
 * resumeplay
 * image
 * audio
 * music
 * languages
 * cc
 * ccon
 * ccoff
 * sub
 * recordings
 * livezoom
 * liveplayback
 * liveplaybackoff
 * repeat
 * repeatoff
 * series
 * repeatdownload
 * view360
 * view360off
 * info
 * ```
 *
 * @name iconList
 * @memberof moonstone/Icon
 * @constant
 * @type Object
 * @public
 */

/**
  * A stateless [Icon]{@link moonstone/Icon.Icon}, with no HOCs applied.
  *
  * @class IconBase
  * @extends ui/Icon.IconBase
  * @memberof moonstone/Icon
  * @ui
  * @public
  */
// const IconBase = IconBaseFactory();

const IconDecorator = hoc((config, Wrapped) => Pure(
	Skinnable(
		Wrapped
	)
));

/**
 * A factory for customizing the visual style of [Icon]{@link moonstone/Icon.Icon}.
 * @see {@link moonstone/Icon.IconBaseFactory}.
 *
 * @class IconFactory
 * @memberof moonstone/Icon
 * @factory
 * @public
 */
const Icon = IconDecorator(IconBase);

/**
 * A ready-to-use Icon, with HOCs applied.
 *
 * @class Icon
 * @memberof moonstone/Icon
 * @extends moonstone/Icon.IconBase
 * @mixes moonstone/Skinnable
 * @ui
 * @public
 */

export default Icon;
export {
	Icon,
	IconBase,
	IconDecorator,
	iconList as icons
};
