import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import useSpotlightContainer from '../useSpotlightContainer';
import {getContainerConfig} from '../../src/container';
import Spotlight from '../../src/spotlight';

function containerExists (id) {
	return getContainerConfig(id) != null;
}

const testId = 'test-useSpotlightContainer';

describe('useSpotlightContainer', () => {

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
		const Comp = (props) => {
			const spotlightContainer = useSpotlightContainer();

			return (<div {...props} {...spotlightContainer.attributes} />);
		};

		render(<Comp data-testid={testId} />);
		const component = screen.getByTestId(testId);

		const expectedAttribute = 'data-spotlight-container';
		const expectedValue = 'true';

		expect(component).toHaveAttribute(expectedAttribute, expectedValue);
	});

	describe('attributes', () => {
		test('should set `data-spotlight-container` attribute', () => {
			render(<Component data-testid={testId} />);
			const component = screen.getByTestId(testId);

			const expectedAttribute = 'data-spotlight-container';
			const expectedValue = 'true';

			expect(component).toHaveAttribute(expectedAttribute, expectedValue);
		});

		test('should generate a `data-spotlight-id` attribute when `id` is unset', () => {
			render(<Component data-testid={testId} />);
			const component = screen.getByTestId(testId);

			const expectedAttribute = 'data-spotlight-id';
			const expectedValue = expect.stringMatching(/container-\d+/);

			expect(component).toHaveAttribute(expectedAttribute, expectedValue);
		});

		test('should reuse the same generated `data-spotlight-id` attribute on re-render', () => {
			const {rerender} = render(<Component data-testid={testId} />);

			const expected = screen.getByTestId(testId).getAttribute('data-spotlight-id');

			rerender(<Component data-testid={testId} />);

			const actual = screen.getByTestId(testId).getAttribute('data-spotlight-id');

			expect(actual).toBe(expected);
		});

		test('should set a `data-spotlight-id` attribute when `id` is set', () => {
			const id = 'my-container';
			render(<Component data-testid={testId} spotlightId={id} />);
			const component = screen.getByTestId(testId);

			const expectedAttribute = 'data-spotlight-id';

			expect(component).toHaveAttribute(expectedAttribute, id);
		});

		test('should set `data-spotlight-container-disabled` attribute to be falsey when `disabled` is unset', () => {
			render(<Component data-testid={testId} />);
			const component = screen.getByTestId(testId);

			const expectedAttribute = 'data-spotlight-container-disabled';

			expect(component).not.toHaveAttribute(expectedAttribute);
		});

		test('should set `data-spotlight-container-disabled` attribute when `disabled` is set', () => {
			render(<Component data-testid={testId} spotlightDisabled />);
			const component = screen.getByTestId(testId);

			const expectedAttribute = 'data-spotlight-container-disabled';
			const expectedValue = 'true';

			expect(component).toHaveAttribute(expectedAttribute, expectedValue);
		});

		test('should set `data-spotlight-container-muted` attribute to be falsey when `muted` is unset', () => {
			render(<Component data-testid={testId} />);
			const component = screen.getByTestId(testId);

			const expectedAttribute = 'data-spotlight-container-muted';

			expect(component).not.toHaveAttribute(expectedAttribute);
		});

		test('should set `data-spotlight-container-muted` attribute when `muted` is set', () => {
			render(<Component data-testid={testId} spotlightMuted />);
			const component = screen.getByTestId(testId);

			const expectedAttribute = 'data-spotlight-container-muted';
			const expectedValue = 'true';

			expect(component).toHaveAttribute(expectedAttribute, expectedValue);
		});
	});

	describe('Spotlight configuration', () => {
		test('should create a new container with the specified id', () => {
			const id = 'my-container';

			expect(containerExists(id)).toBeFalsy();

			render(<Component spotlightId={id} />);

			const expected = true;
			const actual = containerExists(id);

			expect(actual).toBe(expected);
		});

		test('should configure a new container with the specified id', () => {
			const id = 'my-container';

			expect(containerExists(id)).toBeFalsy();

			const config = {
				restrict: 'self-only',
				defaultElement: 'my-element'
			};

			render(
				<Component
					containerConfig={{defaultElement: config.defaultElement}}
					spotlightId={id}
					spotlightRestrict={config.restrict}
				/>
			);

			const expected = config;
			const actual = getContainerConfig(id);

			expect(actual).toMatchObject(expected);
		});

		test('should update restrict value', () => {
			const id = 'my-container';
			const {rerender} = render(
				<Component
					spotlightId={id}
					spotlightRestrict="self-only"
				/>
			);

			rerender(
				<Component
					spotlightId={id}
					spotlightRestrict="self-first"
				/>
			);

			const expected = {restrict: 'self-first'};
			const actual = getContainerConfig(id);

			expect(actual).toMatchObject(expected);
		});
	});

	describe('lifecycle', () => {
		test('should remove its container when unmounted', () => {
			const {unmount} = render(<Component spotlightId="lifecycle" />);

			unmount();

			expect(containerExists('lifecycle')).toBe(false);
		});

		test('should keep the configuration of its container when unmounted with `preserveId`', () => {
			const {unmount} = render(<Component preserveId spotlightId="preserved" />);

			unmount();

			expect(containerExists('preserved')).toBe(true);
		});

		test('should not keep a generated container when unmounted with `preserveId`', () => {
			const {unmount} = render(<Component data-testid={testId} preserveId />);
			const generatedId = screen.getByTestId(testId).dataset.spotlightId;

			unmount();

			expect(containerExists(generatedId)).toBe(false);
		});

		test('should replace its container when its id changes', () => {
			const {rerender} = render(<Component spotlightId="first" />);

			rerender(<Component spotlightId="second" />);

			expect(containerExists('first')).toBe(false);
			expect(containerExists('second')).toBe(true);
		});
	});

	describe('navigableFilter', () => {
		const Filtered = ({navigableFilter, spotlightId}) => {
			const spotlightContainer = useSpotlightContainer({id: spotlightId, navigableFilter});

			return <div {...spotlightContainer.attributes} />;
		};

		test('should exclude the elements the given filter rejects', () => {
			const allowed = document.createElement('div');
			const rejected = document.createElement('div');
			render(<Filtered navigableFilter={(elem) => elem === allowed} spotlightId="filtered" />);

			const {navigableFilter} = getContainerConfig('filtered');

			expect(navigableFilter(allowed)).toBe(true);
			expect(navigableFilter(rejected)).toBe(false);
		});

		test('should allow every element without a filter', () => {
			render(<Filtered spotlightId="unfiltered" />);

			const {navigableFilter} = getContainerConfig('unfiltered');

			expect(navigableFilter(document.createElement('div'))).toBe(true);
		});
	});
});

