import DaySelector, {DaySelectorBase} from '@enact/moonstone/DaySelector';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {withInfo} from '@storybook/addon-info';

import {boolean, select} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

DaySelector.displayName = 'DaySelector';
const Config = mergeComponentMetadata('DaySelector', DaySelectorBase, DaySelector);

// NOTE: Something about the HOC is inhibiting accessing its defaultProps, so we're adding them here
// manually. This can (should) be revisited later to find out why and a solution.
Config.defaultProps = {
	dayNameLength: 'long',
	disabled: false
};

storiesOf('Moonstone', module)
	.add(
		'DaySelector',
		withInfo({
			text: 'Basic usage of DaySelector'
		})(() => (
			<DaySelector
				disabled={boolean('disabled', Config)}
				dayNameLength={select('dayNameLength', ['short', 'medium', 'long', 'full'], Config)}
				onSelect={action('onSelect')}
			/>
		))
	);
