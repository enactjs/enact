/**
 * Provides Moonstone styled icon components and behaviors.
 *
 * @example
 * <Icon>flag</Icon>
 *
 * @module moonstone/Icon
 * @exports Icon
 * @exports IconBase
 * @exports IconDecorator
 * @exports icons
 */

import kind from '@enact/core/kind';
import UiIcon from '@enact/ui/Icon';
import Pure from '@enact/ui/internal/Pure';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';

import Skinnable from '../Skinnable';

import iconList from './IconList.js';

import componentCss from './Icon.module.less';

/**
 * Renders a moonstone-styled icon without any behavior.
 *
 * @class IconBase
 * @memberof moonstone/Icon
 * @extends ui/Icon.Icon
 * @ui
 * @public
 */
const IconBase = kind({
	name: 'Icon',

	propTypes: /** @lends moonstone/Icon.IconBase.prototype */ {
		/**
		 * The size of the icon.
		 *
		 * @type {('large'|'small')}
		 * @default 'small'
		 * @public
		 */
		size: PropTypes.string
	},

	defaultProps: {
		size: 'small'
	},

	render: (props) => UiIcon.inline({
		...props,
		css: componentCss,
		iconList
	})
});

// Let's find a way to import this list directly, and bonus feature, render our icons in the docs
// next to their names.
/**
 * An object whose keys can be used as the child of an [Icon]{@link moonstone/Icon.Icon} component.
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
 * cycle
 * bluetoothoff
 * verticalellipsis
 * arrowcurveright
 * picture
 * home
 * warning
 * scroll
 * denselistdrawer
 * starminus
 * liverecord
 * liveplay
 * contrast
 * edit
 * trashlock
 * volumecycle
 * movecursor
 * refresh
 * question
 * questionreversed
 * s
 * cycleone
 * cyclea
 * cyclex
 * speakers
 * koreansubtitles
 * chinesesubtitles
 * fryingpan
 * musicnoteplus
 * files
 * arrowupdown
 * brightness
 * download
 * musicnoteplusminus
 * font
 * musicon
 * musicoff
 * ```
 *
 * @name iconList
 * @memberof moonstone/Icon
 * @constant
 * @type {Object}
 * @public
 */

/**
 * Moonstone-specific behaviors to apply to [IconBase]{@link moonstone/Icon.IconBase}.
 *
 * @hoc
 * @memberof moonstone/Icon
 * @mixes moonstone/Skinnable.Skinnable
 * @public
 */
const IconDecorator = compose(
	Pure,
	Skinnable
);

/**
 * A Moonstone-styled icon.
 *
 * @class Icon
 * @memberof moonstone/Icon
 * @extends moonstone/Icon.IconBase
 * @mixes moonstone/Icon.IconDecorator
 * @ui
 * @public
 */
const Icon = IconDecorator(IconBase);


export default Icon;
export {
	Icon,
	IconBase,
	IconDecorator,
	iconList as icons
};
