import Icon from '@enact/moonstone/Icon';
import Divider from '@enact/moonstone/Divider';
import iconNames from './icons';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {boolean, select, text} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

// import icons
import docs from '../../images/icon-enact-docs.png';
import factory from '../../images/icon-enact-factory.svg';
import logo from '../../images/icon-enact-logo.svg';

storiesOf('Moonstone', module)
	.add(
		'Icon',
		withInfo({
			propTablesExclude: [Divider, Icon],
			text: 'Basic usage of Icon'
		})(() => {
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
		})
	);
