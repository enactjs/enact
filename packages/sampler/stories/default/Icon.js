import Icon, {IconBase} from '@enact/moonstone/Icon';
import Heading from '@enact/moonstone/Heading';
import UiIcon from '@enact/ui/Icon';
import iconNames from './icons';
import React from 'react';
import {storiesOf} from '@storybook/react';

import {select, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

// import icons
import docs from '../../images/icon-enact-docs.png';
import factory from '../../images/icon-enact-factory.svg';
import logo from '../../images/icon-enact-logo.svg';

Icon.displayName = 'Icon';
const Config = mergeComponentMetadata('Icon', UiIcon, IconBase, Icon);

storiesOf('Moonstone', module)
	.add(
		'Icon',
		() => {
			const size = select('size', ['small', 'large'], Config, 'large');
			const iconType = select('icon type', ['glyph', 'url src', 'custom'], Config, 'glyph');
			let children;
			switch (iconType) {
				case 'glyph': children = select('icon', iconNames, Config, 'plus'); break;
				case 'url src': children = select('src', [docs, factory, logo], Config, logo); break;
				default: children = text('custom icon', Config);
			}
			return (
				<div>
					<Icon size={size}>
						{children}
					</Icon>
					<br />
					<br />
					<Heading showLine>All Icons</Heading>
					{iconNames.map((icon, index) => <Icon key={index} size={size} title={icon}>{icon}</Icon>)}
				</div>
			);
		},
		{
			info: {
				text: 'Basic usage of Icon'
			}
		}
	);
