import LabeledIcon from '@enact/moonstone/LabeledIcon';
import Divider from '@enact/moonstone/Divider';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {withInfo} from '@storybook/addon-info';
import Scroller from '@enact/ui/Scroller';
import {LabeledIconBase as UiLabeledIconBase, LabeledIcon as UiLabeledIcon} from '@enact/ui/LabeledIcon';
import Layout, {Cell} from '@enact/ui/Layout';

import iconNames from './icons';
import {mergeComponentMetadata} from '../../src/utils';
import {boolean, select, text} from '../../src/enact-knobs';

const Config = mergeComponentMetadata('LabeledIcon', UiLabeledIconBase, UiLabeledIcon, LabeledIcon);
Config.displayName = 'LabeledIcon';

storiesOf('Moonstone', module)
	.add(
		'LabeledIcon',
		withInfo({
			propTablesExclude: [LabeledIcon, Scroller, Layout, Cell],
			text: 'Basic usage of LabeledIcon'
		})(() => (
			<LabeledIcon
				disabled={boolean('disabled', Config)}
				icon={select('icon', ['', ...iconNames], Config, 'fullscreen')}
				inline={boolean('inline', Config)}
				labelPosition={select('labelPosition', ['above', 'after', 'before', 'below', 'left', 'right'], Config)}
				small={boolean('small', Config)}
			>
				{text('children', Config, 'Hello LabeledIcon')}
			</LabeledIcon>
		))
	);
