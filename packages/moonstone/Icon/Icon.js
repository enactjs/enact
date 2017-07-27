/**
 * Exports the {@link moonstone/Icon.Icon} component and the list of icon constants as
 * [iconList]{@link moonstone/Icon.iconList}.
 *
 * @module moonstone/Icon
 */

import factory from '@enact/core/factory';
import kind from '@enact/core/kind';
// import {diffClasses} from '@enact/ui/MigrationAid';
import {IconFactory as UiIconFactory} from '@enact/ui/Icon';
import React from 'react';

import Skinnable from '../Skinnable';

import iconList from './IconList.js';

import componentCss from './Icon.less';

/**
 * {@link moonstone/Icon.IconFactory} is Factory wrapper around {@link moonstone/Icon.Icon}
 * that allows overriding certain classes at design time. See {@link moonstone/Icon.IconBaseFactory}.
 *
 * @class IconFactory
 * @memberof moonstone/Icon
 * @factory
 * @public
 */
const IconBaseFactory = factory({css: componentCss}, ({css}) => {
	// diffClasses('Moon Icon', componentCss, css);

	const MoonstoneIcon = UiIconFactory({
		/* Replace classes in this step */
		css: /** @lends moonstone/Icon.IconFactory.prototype */ {
			...componentCss,
			// Include the component class name so it too may be overridden.
			Icon: css.Icon
		}
	});

	return kind({
		name: 'MoonstoneIcon',
		render: (props) => (
			<MoonstoneIcon {...props} iconList={iconList} />
		)
	});
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

const IconBase = IconBaseFactory();

const Icon = Skinnable(
	IconBase
);

const IconFactory = (props) => Skinnable(
	IconBaseFactory(props)
);


export default Icon;
export {
	Icon,
	IconBase,
	IconFactory,
	IconBaseFactory,
	iconList as icons
};
