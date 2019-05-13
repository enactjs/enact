import LabeledIcon from '@enact/moonstone/LabeledIcon';
import Icon, {IconBase} from '@enact/moonstone/Icon';
import UiIcon from '@enact/ui/Icon';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {withInfo} from '@storybook/addon-info';
import {LabeledIconBase as UiLabeledIconBase, LabeledIcon as UiLabeledIcon} from '@enact/ui/LabeledIcon';

import iconNames from './icons';
import {mergeComponentMetadata} from '../../src/utils';
import {boolean, select, text} from '../../src/enact-knobs';

const Config = mergeComponentMetadata('LabeledIcon', UiLabeledIconBase, UiLabeledIcon, UiIcon, IconBase, Icon, LabeledIcon);
Config.displayName = 'LabeledIcon';

storiesOf('Moonstone', module)
	.add(
		'LabeledIcon',
		withInfo({
			text: 'Basic usage of LabeledIcon'
		})(() => (
			<LabeledIcon
				disabled={boolean('disabled', Config)}
				icon={select('icon', ['', ...iconNames], Config, 'fullscreen')}
				inline={boolean('inline', Config)}
				labelPosition={select('labelPosition', ['above', 'after', 'before', 'below', 'left', 'right'], Config)}
				size={select('size', ['small', 'large'], Config)}
			>
				{text('children', Config, 'Hello LabeledIcon')}
			</LabeledIcon>
		))
	);
