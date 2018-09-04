import LabeledIcon from '@enact/moonstone/LabeledIcon';
import React from 'react';
import {storiesOf} from '@storybook/react';
import Scroller from '@enact/ui/Scroller';
import {LabeledIconBase as UiLabeledIconBase, LabeledIcon as UiLabeledIcon} from '@enact/ui/LabeledIcon';
import Layout, {Cell} from '@enact/ui/Layout';

import iconNames from '../default/icons';

import {mergeComponentMetadata} from '../../src/utils';
import {boolean, select} from '../../src/enact-knobs';

LabeledIcon.displayName = 'LabeledIcon';
const Config = mergeComponentMetadata('LabeledIcon', UiLabeledIconBase, UiLabeledIcon, LabeledIcon);

storiesOf('LabeledIcon', module)
	.add(
		'aligned grid',
		() => {
			const disabled = boolean('disabled', Config);
			const labelPosition = select('labelPosition', ['above', 'after', 'before', 'below', 'left', 'right'], Config);
			const small = boolean('small', Config);
			return (
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
			);
		}
	)
	.add(
		'inline',
		() => {
			const disabled = boolean('disabled', Config);
			const labelPosition = select('labelPosition', ['above', 'after', 'before', 'below', 'left', 'right'], Config);
			const small = boolean('small', Config);
			return (
				<Scroller>
					{iconNames.map((icon) =>
						<LabeledIcon
							key={'icon' + icon}
							icon={icon}
							inline
							disabled={disabled}
							labelPosition={labelPosition}
							small={small}
						>{icon}</LabeledIcon>
					)}
				</Scroller>
			);
		}
	);
