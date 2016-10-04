import kind from '@enact/core/kind';
import ri from '@enact/ui/resolution';
import React, {PropTypes} from 'react';

import iconList from './IconList.js';

import css from './Icon.less';

const IconBase = kind({
	name: 'Icon',

	propTypes: {
		children: PropTypes.string,
		small: PropTypes.bool,
		src: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
	},

	defaultProps: {
		small: false
	},

	styles: {
		css,
		className: 'icon'
	},

	computed: {
		className: ({children: icon, pressed, small, styler}) => styler.append(
			!iconList[icon] && css.dingbat,	// If the icon isn't in our known set, apply our custom font class
			{pressed, small}
		),
		style: ({src, style}) => {
			let updated = Object.assign({}, style);

			let source = ri.selectSrc(src);
			if (src && src !== 'none' && src !== 'inherit' && src !== 'initial') {
				source = `url(${source})`;
			}

			updated.backgroundImage = source;
			return updated;
		},
		children: ({children: icon}) => {
			let iconEntity = iconList[icon] || icon;

			if (!iconList[icon]) {
				if (typeof iconEntity == 'string') {
					if (iconEntity.indexOf('&#') === 0) {
						// Convert an HTML entity: &#99999;
						iconEntity = parseInt(iconEntity.slice(2, -1), 10);
					} else if (iconEntity.indexOf('\\u') === 0) {
						// Convert a unicode reference: \u99999;
						iconEntity = parseInt(iconEntity.slice(2), 16);
					} else if (iconEntity.indexOf('0x') === 0) {
						// Converts a hex reference in string form
						iconEntity = String.fromCodePoint(iconEntity);
					}
				}
			}
			if (typeof iconEntity == 'number') {
				// Converts a hex reference in number form
				iconEntity = String.fromCodePoint(iconEntity);
			}
			return iconEntity;
		}
	},

	render: (props) => {
		delete props.small;
		delete props.src;

		return <div {...props} />;
	}
});

export default IconBase;
export {IconBase as Icon, IconBase, iconList as icons};
