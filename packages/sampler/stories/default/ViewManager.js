import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, number, range, select, text} from '@enact/storybook-utils/addons/controls';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import Group from '@enact/ui/Group';
import Item from '@enact/ui/Item';
import Layout, {Cell} from '@enact/ui/Layout';
import ri from '@enact/ui/resolution';
import Scroller from '@enact/ui/Scroller';
import {arrange, SlideArranger, SlideBottomArranger, SlideLeftArranger, SlideRightArranger, SlideTopArranger, ViewManager, ViewManagerBase} from '@enact/ui/ViewManager';
import PropTypes from 'prop-types';
import {useCallback, useState} from 'react';

import * as css from './ViewManager.module.less';

const ViewManagerConfig = mergeComponentMetadata('ViewManager', ViewManagerBase, ViewManager);

const SlideArrangerConfig = {
	groupId: 'SlideArranger'
};

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
	end: {'index': 0, 'index plus 1': 1, 'index plus 2': 2},
	start: {'index': 0, 'index minus 1': 1, 'index minus 2': 2}
};

const itemSize = 10;

const views = new Array(itemSize).fill().map((i, index) => {
	return {
		title: `Item ${index}`,
		content: `This is View ${index}`
	};
});

const ChildrenDiv = ({args, ...rest}) => {
	if (rest[args.enteringProp] === false) {
		return <div {...rest}>{rest.children} (finished its transition)</div>;
	} else {
		return <div {...rest}>{rest.children}</div>;
	}
};

ChildrenDiv.propTypes = {
	args: PropTypes.object
};

const ViewManagerLayout = (props) => {
	const [selected, setSelected] = useState(0);
	const handleChangeView = useCallback((ev) => {
		setSelected(ev.selected);
	}, [setSelected]);

	// eslint-disable-next-line enact/prop-types
	const {args, selectedEnd, selectedStart, ...rest} = props;
	const endRange = [selected, selected + 1, selected + 2];
	const startRange = [selected, selected - 1, selected - 2];
	const end = Math.min(endRange[prop.end[selectedEnd]], itemSize - 1);
	const start = Math.max(startRange[prop.start[selectedStart]], 0);

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
				{...rest}
			>
				{views.map((view, i) => (
					<ChildrenDiv args={args} className={css.box} key={i}>
						{view.content}
					</ChildrenDiv>
				))}
			</Cell>
		</Layout>
	);
};

export default {
	title: 'UI/ViewManager',
	component: 'ViewManager'
};

export const _ViewManager = (args) => {
	const arrangerType = args['arranger'];
	let arranger;

	if (arrangerType === 'SlideArranger') {
		const amount = args['amount'];
		const direction = args['direction'];
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
			args={args}
			arranger={arranger}
			duration={args['duration']}
			enteringDelay={args['enteringDelay']}
			enteringProp={args['enteringProp']}
			noAnimation={args['noAnimation']}
			onAppear={action('onAppear')}
			onEnter={action('onEnter')}
			onLeave={action('onLeave')}
			onStay={action('onStay')}
			onTransition={action('onTransition')}
			onWillTransition={action('onWillTransition')}
			reverseTransition={args['reverseTransition']}
			rtl={args['rtl']}
			selectedEnd={args['end']}
			selectedStart={args['start']}
		/>
	);
};

select('arranger', _ViewManager, Object.keys(prop.arranger), ViewManagerConfig, 'SlideBottomArranger');
number('duration', _ViewManager, ViewManagerConfig);
number('enteringDelay', _ViewManager, ViewManagerConfig);
text('enteringProp', _ViewManager, ViewManagerConfig);
boolean('noAnimation', _ViewManager, ViewManagerConfig);
boolean('reverseTransition', _ViewManager, ViewManagerConfig);
boolean('rtl', _ViewManager, ViewManagerConfig);
select('end', _ViewManager, Object.keys(prop.end), ViewManagerConfig, 'index');
select('start', _ViewManager, Object.keys(prop.start), ViewManagerConfig, 'index');
select('direction', _ViewManager, prop.direction, SlideArrangerConfig, prop.direction[0]);
range('amount', _ViewManager, SlideArrangerConfig, {min: 0, max: 100}, 100);

_ViewManager.storyName = 'ViewManager';

_ViewManager.parameters = {
	info: {
		text: 'Basic usage of ViewManager'
	}
};
