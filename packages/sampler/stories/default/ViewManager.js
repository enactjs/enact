import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, number, select} from '@enact/storybook-utils/addons/knobs';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import Group from '@enact/ui/Group';
import Item from '@enact/ui/Item';
import Layout, {Cell} from '@enact/ui/Layout';
import ri from '@enact/ui/resolution';
import Scroller from '@enact/ui/Scroller';
import {arrange, SlideArranger, SlideBottomArranger, SlideLeftArranger, SlideRightArranger, SlideTopArranger, ViewManager, ViewManagerBase} from '@enact/ui/ViewManager';
import {useCallback, useState} from 'react';

import css from './ViewManager.module.less';

const ViewManagerConfig = mergeComponentMetadata('ViewManager', ViewManagerBase, ViewManager);

const prop = {
	arranger: {
		SlideBottomArranger,
		SlideLeftArranger,
		SlideRightArranger,
		SlideTopArranger,
		SlideArranger: null,
		'CustomArranger (FadeAndSlideArranger)': null
	},
	direction: ['bottom', 'left', 'right', 'top'],
	end: ['index', 'index+1', 'index+2'],
	start: ['index', 'index-1', 'index-2']
};

const itemSize = 10;

const views = new Array(itemSize).fill().map((i, index) => {
	return {
		title: `Item ${index}`,
		content: `This is View ${index}`
	};
});

const ViewManagerLayout = (props) => {
	const [selected, setSelected] = useState(0);
	const handleChangeView = useCallback((ev) => {
		setSelected(ev.selected);
	}, [setSelected]);

	const selectedEnd = select('end', prop.end, ViewManagerConfig, prop.end[0]);
	const selectedStart = select('start', prop.start, ViewManagerConfig, prop.start[0]);
	const endRange = [selected, selected+1, selected+2];
	const startRange = [selected, selected-1, selected-2];
	let end, start;

	for (let i = 0; i < 3; i++) {
		if (selectedEnd === prop.end[i]) {
			end = endRange[i];
		}
		if (selectedStart === prop.start[i]) {
			start = startRange[i];
		}
	}
	if (start < 0) {
		start = 0;
	}
	if (end >= itemSize) {
		end = itemSize - 1;
	}

	return (
		<Layout>
			<Cell component={Scroller} size="7%">
				<Group
					childComponent={Item}
					itemProps={{className: css.navItem}}
					onSelect={handleChangeView}
					select="radio"
				>
					{views.map((view) => view.title)}
				</Group>
			</Cell>
			<Cell
				component={ViewManager}
				end={end}
				index={selected}
				start={start}
				style={{height: ri.scale(42 * (end - start + 1)), overflow: 'hidden'}}
				{...props}
			>
				{views.map((view, i) => (
					<div className={css.box} key={i}>
						{view.content}
					</div>
				))}
			</Cell>
		</Layout>
	);
};

export default {
	title: 'UI/ViewManager',
	component: 'ViewManager'
};

export const _ViewManager = () => {
	const arrangerType = select('arranger', Object.keys(prop.arranger), ViewManagerConfig, 'SlideBottomArranger');
	let arranger;

	if (arrangerType === 'SlideArranger') {
		const SlideArrangerConfig = {displayName: 'SlideArranger'};
		const amount = number('amount', SlideArrangerConfig, {range: true, min: 0, max: 100}, 100);
		const direction = select('direction', prop.direction, SlideArrangerConfig, prop.direction[0]);
		arranger = SlideArranger({amount, direction});
	} else if (arrangerType === 'CustomArranger (FadeAndSlideArranger)') {
		// The following arranger is from sandstone/internal/Panels/Arrangers.
		const animationOptions = {easing: 'cubic-bezier(0.455, 0.030, 0.515, 0.955)'};
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
		arranger = prop.arranger[arrangerType];
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
