import {Header} from '@enact/moonstone/Panels';
import SwitchItem from '@enact/moonstone/SwitchItem';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {text} from '@storybook/addon-knobs';

storiesOf('Header', module)
	.add(
		'with RTL text',
		() => (
			<Header
				casing="preserve"
				type="compact"
				title={text('title', 'Title')}
				titleBelow={text('titleBelow', 'כתוביות למט')}
			/>
		)
	)
	.add(
		'Compact type with long text and headerComponent',
		() => (
			<Header
				casing="preserve"
				type="compact"
				title={text('title', 'Title')}
				titleBelow={text('titleBelow', 'This is a header sample with long titleBelow text and header components to test positioning of header components.')}
			>
				<SwitchItem>{'On / Off'}</SwitchItem>
			</Header>

		)
	)
	.add(
		'Standard type with long text and headerComponent',
		() => (
			<Header
				casing="preserve"
				title={text('title', 'Title')}
				titleBelow={text('titleBelow', 'This is a header sample with long titleBelow, subTitleBelow text and header components to test positioning of header components.')}
				subTitleBelow={text('subTitleBelow', 'This is a header sample with long titleBelow, subTitleBelow text and header components to test positioning of header components.')}
			>
				<SwitchItem>{'On / Off'}</SwitchItem>
			</Header>
		)
	);
