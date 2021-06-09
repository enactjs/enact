import {shallow} from 'enzyme';
import Spotlight from '../../src/spotlight';
import {getContainerConfig} from '../../src/container';

import useSpotlightContainer from '../useSpotlightContainer';

function containerExists (id) {
	return getContainerConfig(id) != null;
}

describe('useSpotlightContainer', () => {

	// TODO: Test lifecycle (e.g unload, preserveId)

	function Component (props) {
		const {
			containerConfig,
			preserveId,
			spotlightDisabled,
			spotlightId,
			spotlightMuted,
			spotlightRestrict,
			...rest
		} = props;

		const spotlightContainer = useSpotlightContainer({
			id: spotlightId,
			muted: spotlightMuted,
			disabled: spotlightDisabled,
			restrict: spotlightRestrict,

			// continue5WayHold, defaultElement, and enterTo can be in the containerConfig object
			containerConfig,
			preserveId
		});

		return (
			<div
				{...rest}
				{...spotlightContainer.attributes}
			/>
		);
	}

	// remove all containers after each test
	afterEach(Spotlight.clear);

	test('should support omitting the config object', () => {
		function Comp (props) {
			const spotlightContainer = useSpotlightContainer();

			return (
				<div {...props} {...spotlightContainer.attributes} />
			);
		}

		const subject = shallow(
			<Comp />
		);

		const expected = true;
		const actual = subject.prop('data-spotlight-container');

		expect(actual).toBe(expected);
	});

	describe('attributes', () => {
		test(
			'should set `data-spotlight-container` attribute',
			() => {
				const subject = shallow(
					<Component />
				);

				const expected = true;
				const actual = subject.prop('data-spotlight-container');

				expect(actual).toBe(expected);
			}
		);

		test(
			'should generate a `data-spotlight-id` attribute when `id` is unset',
			() => {
				const subject = shallow(
					<Component />
				);

				const expected = /container-\d+/;
				const actual = subject.prop('data-spotlight-id');

				expect(actual).toMatch(expected);
			}
		);

		test(
			'should reuse the same generated `data-spotlight-id` attribute on re-render',
			() => {
				const subject = shallow(
					<Component />
				);

				const expected = subject.prop('data-spotlight-id');

				subject.setProps({});

				const actual = subject.prop('data-spotlight-id');

				expect(actual).toMatch(expected);
			}
		);

		test(
			'should set a `data-spotlight-id` attribute when `id` is set',
			() => {
				const id = 'my-container';
				const subject = shallow(
					<Component spotlightId={id} />
				);

				const expected = id;
				const actual = subject.prop('data-spotlight-id');

				expect(actual).toBe(expected);
			}
		);

		test(
			'should set `data-spotlight-container-disabled` attribute to be falsey when `disabled` is unset',
			() => {
				const subject = shallow(
					<Component />
				);

				const actual = subject.prop('data-spotlight-container-disabled');

				expect(actual).toBeFalsy();
			}
		);

		test(
			'should set `data-spotlight-container-disabled` attribute when `disabled` is set',
			() => {
				const subject = shallow(
					<Component spotlightDisabled />
				);

				const expected = true;
				const actual = subject.prop('data-spotlight-container-disabled');

				expect(actual).toBe(expected);
			}
		);

		test(
			'should set `data-spotlight-container-muted` attribute to be falsey when `muted` is unset',
			() => {
				const subject = shallow(
					<Component />
				);

				const actual = subject.prop('data-spotlight-container-muted');

				expect(actual).toBeFalsy();
			}
		);

		test(
			'should set `data-spotlight-container-muted` attribute when `muted` is set',
			() => {
				const subject = shallow(
					<Component spotlightMuted />
				);

				const expected = true;
				const actual = subject.prop('data-spotlight-container-muted');

				expect(actual).toBe(expected);
			}
		);
	});

	describe('Spotlight configuration', () => {
		test(
			'should create a new container with the specified id',
			() => {
				const id = 'my-container';

				expect(containerExists(id)).toBeFalsy();

				shallow(
					<Component spotlightId={id} />
				);

				const expected = true;
				const actual = containerExists(id);

				expect(actual).toBe(expected);
			}
		);

		test(
			'should configure a new container with the specified id',
			() => {
				const id = 'my-container';

				expect(containerExists(id)).toBeFalsy();

				const config = {
					restrict: 'self-only',
					defaultElement: 'my-element'
				};

				shallow(
					<Component
						spotlightId={id}
						spotlightRestrict={config.restrict}
						containerConfig={{defaultElement: config.defaultElement}}
					/>
				);

				const expected = config;
				const actual = getContainerConfig(id);

				expect(actual).toMatchObject(expected);
			}
		);

		test(
			'should update restrict value',
			() => {
				const id = 'my-container';
				const subject = shallow(
					<Component
						spotlightId={id}
						spotlightRestrict="self-only"
					/>
				);

				subject.setProps({spotlightRestrict: 'self-first'});

				const expected = {restrict: 'self-first'};
				const actual = getContainerConfig(id);

				expect(actual).toMatchObject(expected);
			}
		);
	});
});

