import Icon from '@enact/moonstone/Icon';
import Divider from '@enact/moonstone/Divider';
import iconNames from './icons';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {boolean, select, text} from '@kadira/storybook-addon-knobs';

// import icons
import docs from '../../images/icon-enact-docs.png';
import factory from '../../images/icon-enact-factory.svg';
import logo from '../../images/icon-enact-logo.svg';

storiesOf('Icon')
	.addWithInfo(
		' ',
		'Basic usage of Icon',
		() => {
			const small = boolean('small', false);
			return (
				<div>
					<Icon
						small={small}
					>
						{select('src', ['', docs, factory, logo], '') + select('icon', ['', ...iconNames], 'plus') + text('custom icon', '')}
					</Icon>
					<br />
					<br />
					<Divider>All Icons</Divider>
					{iconNames.map((icon, index) => <Icon key={index} small={small} title={icon}>{icon}</Icon>)}
				</div>
			);
		}
	);
