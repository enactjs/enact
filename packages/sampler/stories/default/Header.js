import {Header, HeaderBase} from '@enact/moonstone/Panels';
import Button from '@enact/moonstone/Button';
import IconButton from '@enact/moonstone/IconButton';
import Input from '@enact/moonstone/Input';
import React from 'react';
import {storiesOf} from '@storybook/react';

import {boolean, select, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

Header.displayName = 'Header';
const Config = mergeComponentMetadata('Header', HeaderBase, Header);

// Set up some defaults for info and knobs
const prop = {
	children: {
		'no buttons': null,
		'1 button': <IconButton>gear</IconButton>,
		'2 buttons': <React.Fragment>
			<Button>A Button</Button>
			<IconButton>gear</IconButton>
		</React.Fragment>
	},
	controls: {
		'no buttons': null,
		'1 button': <IconButton>gear</IconButton>,
		'2 buttons': <React.Fragment>
			<IconButton>star</IconButton>
			<IconButton>gear</IconButton>
		</React.Fragment>
	},
	marqueeOn: ['', 'hover', 'render'],
	type: ['compact', 'dense', 'standard']
};

storiesOf('Moonstone', module)
	.add(
		'Header',
		context => {
			context.noHeader = true;

			const headerInput = boolean('headerInput', Config) ? <Input placeholder="placeholder text" /> : null;
			const childrenSelection = select('children', ['no buttons', '1 button', '2 buttons'], Config);
			const children = prop.children[childrenSelection];

			const story = (
				<Header
					title={text('title', Config, 'The Matrix')}
					titleBelow={text('titleBelow', Config, 'Free your mind')}
					subTitleBelow={text('subTitleBelow', Config, 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.')}
					type={select('type', prop.type, Config)}
					centered={boolean('centered', Config)}
					fullBleed={boolean('fullBleed', Config)}
					headerInput={headerInput}
					hideLine={boolean('hideLine', Config)}
					marqueeOn={select('marqueeOn', prop.marqueeOn, Config)}
				>
					{children}
				</Header>
			);

			context.panelsProps = {
				controls: prop.controls[select('controls', ['no buttons', '1 button', '2 buttons'], {displayName: 'Panels'})],
				noCloseButton: boolean('noCloseButton', {displayName: 'Panels'}) || false
			};

			return story;
		},
		{
			info: {
				text: 'A block to use as a screen\'s title and description. Supports additional buttons and up to two subtitles.'
			}
		}
	);
