import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, number, select} from '@enact/storybook-utils/addons/knobs';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import Group from '@enact/ui/Group';
import Item from '@enact/ui/Item';
import Layout, {Cell} from '@enact/ui/Layout';
import Scroller from '@enact/ui/Scroller';
import {arrange, SlideArranger, SlideBottomArranger, SlideLeftArranger, SlideRightArranger, SlideTopArranger, ViewManager} from '@enact/ui/ViewManager';
import {Component} from 'react';

import css from './ViewManager.module.less';

const ViewManagerConfig = mergeComponentMetadata('ViewManager', ViewManager);

ViewManagerConfig.defaultProps = {
	duration: 300,
	enteringDelay: 0
};

const prop = {
	arranger: ['SlideBottomArranger', 'SlideLeftArranger', 'SlideRightArranger', 'SlideTopArranger', 'SlideArranger', 'CustomArranger'],
	direction: ['bottom', 'left', 'right', 'top']
};

const arrangers = {
	'SlideBottomArranger': SlideBottomArranger,
	'SlideLeftArranger': SlideLeftArranger,
	'SlideRightArranger': SlideRightArranger,
	'SlideTopArranger': SlideTopArranger
};

const views = new Array(10).fill().map((i, index) => {
	return {
		title: `Item ${index + 1}`,
		content: `This is View ${index + 1}`
	};
});

class ViewManagerLayout extends Component {
	constructor () {
		super();
		this.state = {selected: 0};
	}

	handleChangeView = (state) => this.setState(state);

	render () {
		const {selected} = this.state;

		return (
			<Layout>
				<Cell component={Scroller} size="7%">
					<Group
						className={css.group}
						childComponent={Item}
						itemProps={{className: css.navItem}}
						onSelect={this.handleChangeView}
						select="radio"
					>
						{views.map((view) => view.title)}
					</Group>
				</Cell>
				<Cell
					component={ViewManager}
					index={selected}
					{...this.props}
				>
					{views.map((view, i) => (
						<div key={i}>
							{view.content}
						</div>
					))}
				</Cell>
			</Layout>
		);
	}
}

export default {
	title: 'UI/ViewManager',
	component: 'ViewManager'
};

export const _ViewManager = () => {
	const arrangerType = select('arranger', prop.arranger, ViewManagerConfig, prop.arranger[0]);
	let arranger;

	if (arrangerType === 'SlideArranger') {
		const amount = number('amount', ViewManagerConfig, {range: true, min: 0, max: 100}, 100);
		const direction = select('direction', prop.direction, ViewManagerConfig, prop.direction[0]);
		arranger = SlideArranger({amount, direction});
	} else if (arrangerType === 'CustomArranger') {
		// The following arranger is from sandstone/internal/Panels/Arrangers.
		const quadInOut = 'cubic-bezier(0.455, 0.030, 0.515, 0.955)';
		const animationOptions = {easing: quadInOut};
		const FadeAndSlideArranger = {
			enter: (config) => {
				return arrange(config, [
					{transform: `translateX(${config.rtl ? '-' : ''}100%)`, opacity: 0, offset: 0},
					{opacity: 0, offset: 0.5},
					{transform: 'none', opacity: 1, offset: 1}
				], animationOptions);
			},
			leave: (config) => {
				return arrange(config, [
					{transform: 'none', opacity: 1, offset: 0},
					{opacity: 0, offset: 0.5},
					{transform: `translateX(${config.rtl ? '' : '-'}100%)`, opacity: 0, offset: 1}
				], animationOptions);
			}
		};
		arranger = FadeAndSlideArranger;
	} else {
		arranger = arrangers[arrangerType];
	}

	return (
		<ViewManagerLayout
			arranger={arranger}
			duration={number('duration', ViewManagerConfig)}
			enteringDelay={number('enteringDelay', ViewManagerConfig)}
			noAnimation={boolean('noAnimation', ViewManagerConfig)}
			onAppear={action('onAppear')}
			onEnter={action('onEnter')}
			onLeave={action('onLeave')}
			onStay={action('onStay')}
			onTransition={action('onTransition')}
			onWillTransition={action('onWillTransition')}
			reverseTransition={boolean('reverseTransition', ViewManagerConfig)}
			rtl={boolean('rtl', ViewManagerConfig)}
		/>
	);
};

_ViewManager.storyName = 'ViewManager';
_ViewManager.parameters = {
	info: {
		text: 'Basic usage of ViewManager'
	}
};
