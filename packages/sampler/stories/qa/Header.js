import {Header, HeaderBase} from '@enact/moonstone/Panels';
import Button from '@enact/moonstone/Button';
import Input from '@enact/moonstone/Input';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {boolean, text, select} from '@enact/storybook-utils/addons/knobs';

Header.displayName = 'Header';
const Config = mergeComponentMetadata('Header', HeaderBase, Header);

const inputData = {
	tallText: 'ฟิ้  ไั  ஒ  த',

	shortTitle: 'Enact',
	shortTitleBelow: 'An app framework',
	shortSubTitleBelow: 'Built atop React',
	shortRtlTitle: 'غينيا واستمر',
	shortRtlTitleBelow: 'غينيا واستمر',

	longTitle: 'Core, The building blocks of an Enact application. Moonstone, our TV-centric UI library.',
	longTitleBelow: 'An app development framework built atop React that’s easy to use, performant and customizable. The goal of Enact is to provide the building blocks for creating robust and maintainable applications.',
	longSubTitleBelow: 'With over 50 components to choose from, Moonstone provides a solid base for creating applications designed for large screens. The Enact team welcomes contributions from anyone motivated to help out.',
	longRtlTitle: 'هذا النص طويل ولكن ليس طويلاً. بالتأكيد ليست قصيرة جدا ، على الرغم من.'
};

const headerComponents = <Button>Header Button</Button>;

const prop = {
	marqueeOn: ['hover', 'render']
};

storiesOf('Header', module)
	.add(
		'just title',
		context => {
			context.noHeader = true;
			const addHeaderComponents = boolean('add headerComponents', Config);
			return (
				<Header
					title={text('title', Config, inputData.shortTitle)}
					marqueeOn={select('marqueeOn', prop.marqueeOn, Config)}
				>
					{addHeaderComponents ? headerComponents : null}
				</Header>
			);
		}
	)
	.add(
		'just title, Compact',
		context => {
			context.noHeader = true;
			const addHeaderComponents = boolean('add headerComponents', Config);
			return (
				<Header
					type="compact"
					title={text('title', Config, inputData.shortTitle)}
					marqueeOn={select('marqueeOn', prop.marqueeOn, Config)}
				>
					{addHeaderComponents ? headerComponents : null}
				</Header>
			);
		}
	)
	.add(
		'short titles',
		context => {
			context.noHeader = true;
			const addHeaderComponents = boolean('add headerComponents', Config);
			return (
				<Header
					title={text('title', Config, inputData.shortTitle)}
					titleBelow={text('titleBelow', Config, inputData.shortTitleBelow)}
					subTitleBelow={text('subTitleBelow', Config, inputData.shortSubTitleBelow)}
					marqueeOn={select('marqueeOn', prop.marqueeOn, Config)}
				>
					{addHeaderComponents ? headerComponents : null}
				</Header>
			);
		}
	)
	.add(
		'short titles, Compact',
		context => {
			context.noHeader = true;
			const addHeaderComponents = boolean('add headerComponents', Config);
			return (
				<Header
					type="compact"
					title={text('title', Config, inputData.shortTitle)}
					titleBelow={text('titleBelow', Config, inputData.shortTitleBelow)}
					subTitleBelow={text('subTitleBelow', Config, inputData.shortSubTitleBelow)}
					marqueeOn={select('marqueeOn', prop.marqueeOn, Config)}
				>
					{addHeaderComponents ? headerComponents : null}
				</Header>
			);
		}
	)
	.add(
		'long titles',
		context => {
			context.noHeader = true;
			const addHeaderComponents = boolean('add headerComponents', Config);
			return (
				<Header
					title={text('title', Config, inputData.longTitle)}
					titleBelow={text('titleBelow', Config, inputData.longTitleBelow)}
					subTitleBelow={text('subTitleBelow', Config, inputData.longSubTitleBelow)}
					marqueeOn={select('marqueeOn', prop.marqueeOn, Config)}
				>
					{addHeaderComponents ? headerComponents : null}
				</Header>
			);
		}
	)
	.add(
		'long titles, Compact',
		context => {
			context.noHeader = true;
			const addHeaderComponents = boolean('add headerComponents', Config);
			return (
				<Header
					type="compact"
					title={text('title', Config, inputData.longTitle)}
					titleBelow={text('titleBelow', Config, inputData.longTitleBelow)}
					subTitleBelow={text('subTitleBelow', Config, inputData.longSubTitleBelow)}
					marqueeOn={select('marqueeOn', prop.marqueeOn, Config)}
				>
					{addHeaderComponents ? headerComponents : null}
				</Header>
			);
		}
	)
	.add(
		'RTL text',
		context => {
			context.noHeader = true;
			const addHeaderComponents = boolean('add headerComponents', Config);
			return (
				<Header
					title={text('title', Config, inputData.shortRtlTitle)}
					titleBelow={text('titleBelow', Config, inputData.shortRtlTitleBelow)}
					subTitleBelow={text('subTitleBelow', Config, inputData.shortRtlTitleBelow)}
					marqueeOn={select('marqueeOn', prop.marqueeOn, Config)}
				>
					{addHeaderComponents ? headerComponents : null}
				</Header>
			);
		}
	)
	.add(
		'RTL text, Compact',
		context => {
			context.noHeader = true;
			const addHeaderComponents = boolean('add headerComponents', Config);
			return (
				<Header
					type="compact"
					title={text('title', Config, inputData.shortRtlTitle)}
					titleBelow={text('titleBelow', Config, inputData.shortRtlTitleBelow)}
					marqueeOn={select('marqueeOn', prop.marqueeOn, Config)}
				>
					{addHeaderComponents ? headerComponents : null}
				</Header>
			);
		}
	)
	.add(
		'RTL text, long title',
		context => {
			context.noHeader = true;
			const addHeaderComponents = boolean('add headerComponents', Config);
			return (
				<Header
					title={text('title', Config, inputData. longRtlTitle)}
					titleBelow={text('titleBelow', Config, inputData.shortRtlTitleBelow)}
					subTitleBelow={text('subTitleBelow', Config, inputData.shortRtlTitleBelow)}
					marqueeOn={select('marqueeOn', prop.marqueeOn, Config)}
				>
					{addHeaderComponents ? headerComponents : null}
				</Header>
			);
		}
	)
	.add(
		'RTL text, long title, Compact',
		context => {
			context.noHeader = true;
			const addHeaderComponents = boolean('add headerComponents', Config);
			return (
				<Header
					type="compact"
					title={text('title', Config, inputData. longRtlTitle)}
					titleBelow={text('titleBelow', Config, inputData.shortRtlTitleBelow)}
					marqueeOn={select('marqueeOn', prop.marqueeOn, Config)}
				>
					{addHeaderComponents ? headerComponents : null}
				</Header>
			);
		}
	)
	.add(
		'tall-glyphs',
		context => {
			context.noHeader = true;
			const addHeaderComponents = boolean('add headerComponents', Config);
			return (
				<Header
					title={text('title', Config, inputData.tallText)}
					titleBelow={text('titleBelow', Config, inputData.tallText)}
					subTitleBelow={text('subTitleBelow', Config, inputData.tallText)}
					marqueeOn={select('marqueeOn', prop.marqueeOn, Config)}
				>
					{addHeaderComponents ? headerComponents : null}
				</Header>
			);
		}
	)
	.add(
		'tall-glyphs, Compact',
		context => {
			context.noHeader = true;
			const addHeaderComponents = boolean('add headerComponents', Config);
			return (
				<Header
					type="compact"
					title={text('title', Config, inputData.tallText)}
					titleBelow={text('titleBelow', Config, inputData.tallText)}
					marqueeOn={select('marqueeOn', prop.marqueeOn, Config)}
				>
					{addHeaderComponents ? headerComponents : null}
				</Header>
			);
		}
	);

storiesOf('Header.Input', module)
	.add(
		'tall-glyphs',
		context => {
			context.noHeader = true;
			const addHeaderComponents = boolean('add headerComponents', Config);
			const input = boolean('Input Mode', Config, true) ? <Input placeholder={text('placeholder', Config, inputData.longTitle)} dismissOnEnter={boolean('Input dismissOnEnter', Config, true)} /> : null;
			return (
				<Header
					title={text('title', Config, inputData.tallText)}
					headerInput={input}
					titleBelow={text('titleBelow', Config, inputData.longTitleBelow)}
					subTitleBelow={text('subTitleBelow', Config, inputData.longSubTitleBelow)}
					marqueeOn={select('marqueeOn', prop.marqueeOn, Config)}
				>
					{addHeaderComponents ? headerComponents : null}
				</Header>
			);
		}
	)
	.add(
		'long text',
		context => {
			context.noHeader = true;
			const addHeaderComponents = boolean('add headerComponents', Config);
			const input = boolean('Input Mode', Config, true) ? <Input placeholder={text('placeholder', Config, inputData.longTitle)} dismissOnEnter={boolean('Input dismissOnEnter', Config, true)} /> : null;
			return (
				<Header
					headerInput={input}
					title={text('title', Config, inputData.longTitle)}
					titleBelow={text('titleBelow', Config, inputData.longTitleBelow)}
					subTitleBelow={text('subTitleBelow', Config, inputData.longSubTitleBelow)}
					marqueeOn={select('marqueeOn', prop.marqueeOn, Config)}
				>
					{addHeaderComponents ? headerComponents : null}
				</Header>
			);
		}
	);
