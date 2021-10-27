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
			const expectedValue = 'container-3'; 	// 3 because this is the 3rd test, it increments automatically

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
});

