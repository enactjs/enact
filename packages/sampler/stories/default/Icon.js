import Icon from '@enact/moonstone/Icon';
import Divider from '@enact/moonstone/Divider';
import iconNames from './icons';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {withInfo} from '@storybook/addon-info';

import {boolean, select, text} from '../../src/enact-knobs';
import emptify from '../../src/utils/emptify.js';

// import icons
import docs from '../../images/icon-enact-docs.png';
import factory from '../../images/icon-enact-factory.svg';
import logo from '../../images/icon-enact-logo.svg';

storiesOf('Moonstone', module)
	.add(
		'Icon',
		withInfo({
			text: 'Basic usage of Icon'
		})(() => {
			const size = select('size', ['small', 'medium'], Icon);
			return (
				<div>
					<Icon
						size={size}
					>
						{emptify(select('src', ['', docs, factory, logo], Icon, '')) + emptify(select('icon', ['', ...iconNames], Icon, 'plus')) + emptify(text('custom icon', Icon, ''))}
					</Icon>
					<br />
					<br />
					<Divider>All Icons</Divider>
					{iconNames.map((icon, index) => <Icon key={index} size={size} title={icon}>{icon}</Icon>)}
				</div>
			);
		})
	);
