import LabeledIcon from '@enact/moonstone/LabeledIcon';
import Divider from '@enact/moonstone/Divider';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {withInfo} from '@storybook/addon-info';
import Scroller from '@enact/ui/Scroller';
import {LabeledIconBase as UiLabeledIconBase, LabeledIcon as UiLabeledIcon} from '@enact/ui/LabeledIcon';
import Layout, {Cell} from '@enact/ui/Layout';

import iconNames from '../moonstone-stories/icons';

import {mergeComponentMetadata} from '../../src/utils';
import {boolean, select, text} from '../../src/enact-knobs';

const Config = mergeComponentMetadata('LabeledIcon', UiLabeledIconBase, UiLabeledIcon, LabeledIcon);
Config.displayName = 'LabeledIcon';

storiesOf('LabeledIcon', module)
	.add(
		'with all icons',
		withInfo({
			propTablesExclude: [LabeledIcon, Scroller, Layout, Cell],
			text: 'Basic usage of LabeledIcon'
		})(() => {
			const disabled = boolean('disabled', Config);
			const inline = boolean('inline', Config);
			const labelPosition = select('labelPosition', ['above', 'after', 'before', 'below', 'left', 'right'], Config);
			const small = boolean('small', Config);
			return (
				<Layout orientation="vertical" style={{height: '100%'}}>
					<Cell shrink>
						<LabeledIcon
							disabled={disabled}
							inline={inline}
							labelPosition={labelPosition}
							small={small}
							icon={select('icon', ['', ...iconNames], Config, 'fullscreen')}
						>
							{text('children', Config, 'Hello LabeledIcon')}
						</LabeledIcon>
					</Cell>
					<Cell shrink component={Divider} style={{marginTop: '1em'}}>All Icons</Cell>
					<Cell>
						<Scroller>
							<Layout wrap align="center space-between">
								{iconNames.map((icon) =>
									<Cell size={200} key={'icon' + icon}>
										<LabeledIcon
											style={{marginLeft: 0, marginRight: 0}}
											icon={icon}
											disabled={disabled}
											labelPosition={labelPosition}
											small={small}
										>{icon}</LabeledIcon>
									</Cell>
								)}
							</Layout>
						</Scroller>
					</Cell>
				</Layout>);
		})
	);
