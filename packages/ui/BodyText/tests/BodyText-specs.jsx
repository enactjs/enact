import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import {Cell} from '../../Layout';
import BodyText, {BodyTextBase} from '../BodyText';

describe('BodyText Specs', () => {
	test('should render a single <p> tag', () => {
		const msg = 'Hello BodyText!';
		render(<BodyText>{msg}</BodyText>);

		const expected = 'P';
		const actual = screen.getByText(msg).nodeName;

		expect(actual).toBe(expected);
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

		const expected = 'centered';

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

	test('should support changing the component element to a different DOM node', () => {
		const componentTag = 'address';
		render(<BodyTextBase component={componentTag} data-testid="bodyText" />);
		const bodyText = screen.getByTestId('bodyText');

		const expected = 'ADDRESS';
		const actual = bodyText.nodeName;

		expect(actual).toBe(expected);
	});
});
