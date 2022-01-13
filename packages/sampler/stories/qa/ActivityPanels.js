import React from 'react';
import {storiesOf} from '@storybook/react';
import ri from '@enact/ui/resolution';

import Button from '@enact/moonstone/Button';
import Item from '@enact/moonstone/Item';
import {ActivityPanels, Panel, Header} from '@enact/moonstone/Panels';
import {ScrollableBase} from '@enact/moonstone/Scrollable';
import {ScrollableBase as UiScrollableBase} from '@enact/ui/Scrollable';
import Scroller from '@enact/moonstone/Scroller';

import {boolean, select} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

ActivityPanels.displayName = 'ActivityPanels';

const prop = {
	scrollbarOption: ['auto', 'hidden', 'visible']
};

const ScrollerConfig = mergeComponentMetadata('Scroller', UiScrollableBase, ScrollableBase, Scroller);

class ActivityPanelsWithScroller extends React.Component {
	constructor () {
		super();
		this.state = {
			index: 1
		};

		this.items = [];
		for (let i = 0; i < 15; i++) {
			this.items.push(i);
		}
	}

	nextPanel = () => {
		this.setState((state) => ({index: state.index + 1}));
	};

	prevPanel = () => {
		this.setState((state) => ({index: state.index - 1}));
	};

	render () {
		return (
			<ActivityPanels index={this.state.index} onSelectBreadcrumb={this.prevPanel}>
				<Panel>
					<Item onClick={this.nextPanel}>dummy</Item>
				</Panel>
				<Panel>
					<Header title={'panel 1'} />
					<div>
						<Scroller
							style={{height: ri.scaleToRem(400)}}
							focusableScrollbar={boolean('focusableScrollbar', ScrollerConfig)}
							horizontalScrollbar={select('horizontalScrollbar', prop.scrollbarOption, ScrollerConfig)}
							verticalScrollbar={select('verticalScrollbar', prop.scrollbarOption, ScrollerConfig)}
						>
							{this.items.map((index) => (<Item onClick={this.nextPanel} key={index}>{'Item' + index}</Item>))}
						</Scroller>
					</div>
					<div>
						<Button onClick={this.nextPanel}>A</Button>
						<Button onClick={this.nextPanel}>B</Button>
						<Button onClick={this.nextPanel}>C</Button>
					</div>
				</Panel>
				<Panel>
					<Header title={'panel 2'} />
					<Item onClick={this.prevPanel}>{'go back'}</Item>
				</Panel>
			</ActivityPanels>
		);
	}
}

storiesOf('ActivityPanels', module)
	.add(
		'with scroller',
		(context) => {
			context.noPanels = true;
			return (
				<ActivityPanelsWithScroller />
			);
		}
	);
