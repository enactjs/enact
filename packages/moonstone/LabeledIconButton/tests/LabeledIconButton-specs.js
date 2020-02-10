import React from 'react';
import {mount} from 'enzyme';
import LabeledIconButton from '../LabeledIconButton';

describe('LabeledIconButton Voice Control Specs', () => {
	test(
		'should set "data-webos-voice-disabled" to IconButton',
		() => {
			const labeledIconButton = mount(
				<LabeledIconButton data-webos-voice-disabled>star</LabeledIconButton>
			);

			const expected = true;
			const actual = labeledIconButton.find('[role="button"]').prop('data-webos-voice-disabled');
			expect(actual).toBe(expected);
		}
	);

	test(
		'should set "data-webos-voice-group-label" to IconButton',
		() => {
			const voiceGroupLabel = 'voice group label';
			const labeledIconButton = mount(
				<LabeledIconButton data-webos-voice-group-label={voiceGroupLabel}>star</LabeledIconButton>
			);

			const expected = voiceGroupLabel;
			const actual = labeledIconButton.find('[role="button"]').prop('data-webos-voice-group-label');
			expect(actual).toBe(expected);
		}
	);

	test(
		'should set "data-webos-voice-label" to IconButton',
		() => {
			const voiceLabel = 'voice label';
			const labeledIconButton = mount(
				<LabeledIconButton data-webos-voice-label={voiceLabel}>star</LabeledIconButton>
			);

			const expected = voiceLabel;
			const actual = labeledIconButton.find('[role="button"]').prop('data-webos-voice-label');
			expect(actual).toBe(expected);
		}
	);

	test(
		'should set "data-webos-voice-intent" to IconButton',
		() => {
			const voiceIntent = 'Select PlayContent';
			const labeledIconButton = mount(
				<LabeledIconButton data-webos-voice-intent={voiceIntent}>star</LabeledIconButton>
			);

			const expected = voiceIntent;
			const actual = labeledIconButton.find('[role="button"]').prop('data-webos-voice-intent');
			expect(actual).toBe(expected);
		}
	);
});
