import {Header, HeaderBase} from '@enact/moonstone/Panels';
import Button from '@enact/moonstone/Button';
import Input from '@enact/moonstone/Input';
import React from 'react';
import {storiesOf} from '@storybook/react';

import {mergeComponentMetadata} from '../../src/utils';
import {boolean, text} from '../../src/enact-knobs';

Header.displayName = 'Header';
const Config = mergeComponentMetadata('Header', HeaderBase, Header);

storiesOf('Header', module)
	.add(
		'with headerComponent',
		() => (
			<Header
				title={text('title', Config, 'Title')}
			>
				<Button small>On / Off</Button>
			</Header>
		)
	)
	.add(
		'with headerComponent, Compact',
		() => (
			<Header
				type="compact"
				title={text('title', Config, 'Title')}
			>
				<Button small>On / Off</Button>
			</Header>
		)
	)
	.add(
		'with titles below',
		() => (
			<Header
				title={text('title', Config, 'Title')}
				titleBelow={text('titleBelow', Config, 'This is a header sample with long titleBelow, subTitleBelow text and header components to test positioning of header components.')}
				subTitleBelow={text('subTitleBelow', Config, 'This is a header sample with long titleBelow, subTitleBelow text and header components to test positioning of header components.')}
			/>
		)
	)
	.add(
		'with titles below, Compact',
		() => (
			<Header
				type="compact"
				title={text('title', Config, 'Title')}
				titleBelow={text('titleBelow', Config, 'This is a header sample with long titleBelow, subTitleBelow text and header components to test positioning of header components.')}
				subTitleBelow={text('subTitleBelow', Config, 'This is a header sample with long titleBelow, subTitleBelow text and header components to test positioning of header components.')}
			/>
		)
	)
	.add(
		'with titles below and headerComponent',
		() => (
			<Header
				title={text('title', Config, 'Title')}
				titleBelow={text('titleBelow', Config, 'This is a header sample with long titleBelow, subTitleBelow text and header components to test positioning of header components.')}
				subTitleBelow={text('subTitleBelow', Config, 'This is a header sample with long titleBelow, subTitleBelow text and header components to test positioning of header components.')}
			>
				<Button small>On / Off</Button>
			</Header>
		)
	)
	.add(
		'with titles below and headerComponent, Compact',
		() => (
			<Header
				type="compact"
				title={text('title', Config, 'Title')}
				titleBelow={text('titleBelow', Config, 'This is a header sample with long titleBelow, subTitleBelow text and header components to test positioning of header components.')}
				subTitleBelow={text('subTitleBelow', Config, 'This is a header sample with long titleBelow, subTitleBelow text and header components to test positioning of header components.')}
			>
				<Button small>On / Off</Button>
			</Header>
		)
	)
	.add(
		'with RTL text',
		() => (
			<Header
				title={text('title', Config, 'Title')}
				titleBelow={text('titleBelow', Config, 'כתוביות למט')}
				subTitleBelow={text('subTitleBelow', Config, 'כתוביות למט')}
			/>
		)
	)
	.add(
		'with RTL text, Compact',
		() => (
			<Header
				type="compact"
				title={text('title', Config, 'Title')}
				titleBelow={text('titleBelow', Config, 'כתוביות למט')}
			/>
		)
	)
	.add(
		'with long text and headerComponent',
		() => (
			<Header
				title={text('title', Config, 'Title')}
				titleBelow={text('titleBelow', Config, 'This is a header sample with long titleBelow text and header components to test positioning of header components.')}
				subTitleBelow={text('subTitleBelow', Config, 'This is a header sample with long titleBelow, subTitleBelow text and header components to test positioning of header components.')}
			>
				<Button small>On / Off</Button>
			</Header>
		)
	)
	.add(
		'with long text and headerComponent, Compact',
		() => (
			<Header
				type="compact"
				title={text('title', Config, 'Title')}
				titleBelow={text('titleBelow', Config, 'This is a header sample with long titleBelow text and header components to test positioning of header components.')}
				subTitleBelow={text('subTitleBelow', Config, 'This is a header sample with long titleBelow, subTitleBelow text and header components to test positioning of header components.')}
			>
				<Button small>On / Off</Button>
			</Header>

		)
	)
	.add(
		'with Input, long text and headerComponent',
		() => {
			const input = boolean('Input Mode', Config, true) ? <Input dismissOnEnter={boolean('Input dismissOnEnter', Config, true)} /> : null;
			return (
				<Header
					title={text('title', Config, 'Title')}
					headerInput={input}
					titleBelow={text('titleBelow', Config, 'This is a header sample with long titleBelow, subTitleBelow text and header components to test positioning of header components.')}
					subTitleBelow={text('subTitleBelow', Config, 'This is a header sample with long titleBelow, subTitleBelow text and header components to test positioning of header components.')}
				>
					<Button small>On / Off</Button>
				</Header>
			);
		}
	)
	.add(
		'with Input, tall-glyphs, and titles below',
		() => {
			const input = boolean('Input Mode', Config, true) ? <Input dismissOnEnter={boolean('Input dismissOnEnter', Config, true)} /> : null;
			return (
				<Header
					title={text('title', Config, 'ิ้  ไั  ஒ  து': 'ิ้  ไั  ஒ  த')}
					headerInput={input}
					titleBelow={text('titleBelow', Config, 'This is a header sample with long titleBelow, subTitleBelow text and header components to test positioning of header components.')}
					subTitleBelow={text('subTitleBelow', Config, 'This is a header sample with long titleBelow, subTitleBelow text and header components to test positioning of header components.')}
				/>
			);
		}
	);
