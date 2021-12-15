import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import BodyText, {BodyTextBase} from '../BodyText';
import {Cell} from '../../Layout';

import css from '../BodyText.module.less';

describe('BodyText Specs', () => {
	test('should render a single <p> tag', () => {
		const msg = 'Hello BodyText!';
		const {container} = render(<BodyText>{msg}</BodyText>);
		const bodyText = container.querySelector('p');

		expect(bodyText).toBeInTheDocument();
	});

	test('should render BodyText with content', () => {
		const content = 'Hello BodyText!';
		render(<BodyText>{content}</BodyText>);
		const bodyText = screen.getByText(content);

		expect(bodyText).toBeInTheDocument();
	});

	test('should not include the centered class by default', () => {
		render(<BodyTextBase data-testid="bodyText" />);
		const bodyText = screen.getByTestId('bodyText');

		const expected = css.centered;

		expect(bodyText).not.toHaveClass(expected);
	});

	test('should include the centered class if `centered` is true', () => {
		render(<BodyText centered data-testid="bodyText" />);
		const bodyText = screen.getByTestId('bodyText');

		const expected = 'centered';

		expect(bodyText).toHaveClass(expected);
	});

	test('should support changing the component element to a functional component', () => {
		const component = Cell;
		render(<BodyTextBase component={component} data-testid="bodyText" />);
		const bodyText = screen.getByTestId('bodyText');

		const expected = 'cell';

		expect(bodyText).toHaveClass(expected);
	});

	// TODO Test is skipped because React Testing Library does not support checking if the component is changed to a different DOM node
	test.skip('should support changing the component element to a different DOM node', () => {
		const componentTag = 'address';
		render(<BodyTextBase component={componentTag} data-testid="bodyText" />);
		const bodyText = screen.getByTestId('bodyText');

		const expected = componentTag;
		const actual = bodyText.getElement().type;

		expect(actual).toBe(expected);
	});
});
