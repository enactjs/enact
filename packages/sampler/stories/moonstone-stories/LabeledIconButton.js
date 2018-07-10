import LabeledIconButton from '@enact/moonstone/LabeledIconButton';
import Divider from '@enact/moonstone/Divider';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {withInfo} from '@storybook/addon-info';
import Scroller from '@enact/ui/Scroller';
import UILabeledIcon from '@enact/ui/LabeledIcon';
import Layout, {Cell} from '@enact/ui/Layout';

import iconNames from './icons';
import {mergeComponentMetadata} from '../../src/utils';
import {boolean, select, text} from '../../src/enact-knobs';

const Config = mergeComponentMetadata('LabeledIconButton', UILabeledIcon, LabeledIconButton);
Config.displayName = 'LabeledIconButton';

storiesOf('Moonstone', module)
	.add(
		'LabeledIconButton',
		withInfo({
			propTablesExclude: [LabeledIconButton, Scroller, Layout, Cell],
			text: 'Basic usage of LabeledIconButton'
		})(() => {
			const labelPosition = select('labelPosition', ['above', 'after', 'before', 'below', 'left', 'right'], Config);
			const pressed = boolean('pressed', Config);
			const small = boolean('small', Config);
			return (
				<Layout orientation="vertical" style={{height: '100%'}}>
					<Cell shrink>
						<LabeledIconButton
							// label={text('label', LabeledIconButton, 'Label')}
							// disabled={boolean('disabled', LabeledIconButton)}
							icon={select('icon', ['', ...iconNames], Config, 'fullscreen')}
							labelPosition={labelPosition}
							pressed={pressed}
							small={small}
						>
							{text('children', Config, 'Hello LabeledIconButton')}
						</LabeledIconButton>
					</Cell>
					<Cell shrink component={Divider} style={{marginTop: '1em'}}>Several Icons</Cell>
					<Cell>
						<Scroller>
							<Layout wrap align="center space-between">
								{iconNames.map((icon) =>
									<Cell size={200} style={{textAlign: 'center'}} key={'icon' + icon}>
										<LabeledIconButton
											style={{width: '100%', marginLeft: 0, marginRight: 0}}
											icon={icon}
											labelPosition={labelPosition}
											pressed={pressed}
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
