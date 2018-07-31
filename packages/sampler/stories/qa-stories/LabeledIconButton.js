import LabeledIconButton from '@enact/moonstone/LabeledIconButton';
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

const Config = mergeComponentMetadata('LabeledIconButton', UiLabeledIconBase, UiLabeledIcon, LabeledIconButton);
Config.displayName = 'LabeledIconButton';

storiesOf('LabeledIconButton', module)
	.add(
		'with all icons',
		withInfo({
			propTablesExclude: [LabeledIconButton, Scroller, Layout, Cell],
			text: 'Basic usage of LabeledIconButton'
		})(() => {
			const disabled = boolean('disabled', Config);
			const inline = boolean('inline', Config);
			const labelPosition = select('labelPosition', ['above', 'after', 'before', 'below', 'left', 'right'], Config);
			const selected = boolean('selected', Config);
			const small = boolean('small', Config);
			return (
				<Layout orientation="vertical" style={{height: '100%'}}>
					<Cell shrink>
						<LabeledIconButton
							disabled={disabled}
							inline={inline}
							labelPosition={labelPosition}
							selected={selected}
							small={small}
							icon={select('icon', ['', ...iconNames], Config, 'fullscreen')}
						>
							{text('children', Config, 'Hello LabeledIconButton')}
						</LabeledIconButton>
					</Cell>
					<Cell shrink component={Divider} style={{marginTop: '1em'}}>All Icons</Cell>
					<Cell>
						<Scroller>
							<Layout wrap align="center space-between">
								{iconNames.map((icon) =>
									<Cell size={200} key={'icon' + icon}>
										<LabeledIconButton
											style={{marginLeft: 0, marginRight: 0}}
											disabled={disabled}
											icon={icon}
											inline={inline}
											labelPosition={labelPosition}
											small={small}
										>{icon}</LabeledIconButton>
									</Cell>
								)}
							</Layout>
						</Scroller>
					</Cell>
				</Layout>);
		})
	);
