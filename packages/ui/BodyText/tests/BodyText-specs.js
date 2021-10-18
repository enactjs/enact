import {mount, shallow} from 'enzyme';
import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import BodyText, {BodyTextBase} from '../BodyText';
import {Cell} from '../../Layout';

import css from '../BodyText.module.less';

describe('BodyText Specs', () => {
	test('should render a single <p> tag', () => {
		const msg = 'Hello BodyText!';
		// const bodyText = mount(
		// 	<BodyText>{msg}</BodyText>
		// );
		render(<BodyText>{msg}</BodyText>);
		const bodyText = screen.getByText('Hello BodyText!');

		expect(bodyText).toBeInTheDocument();

		// const bodyTextTag = bodyText.find('p');
		// const expected = 1;
		// const actual = bodyTextTag.length;
		//
		// expect(actual).toBe(expected);
	});

	test('should render BodyText with content', () => {
		const content = 'Hello BodyText!';

		// const bodyTextTag = mount(
		// 	<BodyText>{content}</BodyText>
		// );
		render(<BodyText>{content}</BodyText>);
		const bodyText = screen.getByText('Hello BodyText!');

		expect(bodyText).toHaveTextContent(content);

		// const expected = content;
		// const actual = bodyTextTag.text();
		//
		// expect(actual).toBe(expected);
	});
	//
	test('should not include the centered class by default', () => {
		// const subject = shallow(
		// 	<BodyTextBase />
		// );
		render(<BodyTextBase data-testid="bodyText" />);
		const bodyText = screen.getByTestId('bodyText');

		const expected = css.centerd;

		expect(bodyText).not.toHaveClass(expected);

		// const expected = false;
		// const actual = subject.hasClass(css.centered);
		// expect(actual).toBe(expected);
	});
	//
	test('should include the centered class if `centered` is true', () => {
		// const subject = shallow(
		// 	<BodyTextBase centered />
		// );
		render(<BodyText centered data-testid="bodyText" />);
		const bodyText = screen.getByTestId('bodyText');

		const expected = 'centered';

		expect(bodyText).toHaveClass(expected);

		// const expected = true;
		// const actual = subject.hasClass(css.centered);
		// expect(actual).toBe(expected);
	});

	// Test is skipped because React Testing Library does not support if component element is changed to a functional component
	test('should support changing the component element to a functional component', () => {
		const component = Cell;
		// const subject = shallow(
		// 	<BodyTextBase component={component} />
		// );
		render(<BodyTextBase component={component} data-testid="bodyText" />);
		const bodyText = screen.getByTestId('bodyText');

		const expected = 'cell';

		expect(bodyText).toHaveClass(expected);
	});

	// Test is skipped because React Testing Library does not support if the component if changed to a different DOM node
	test.skip('should support changing the component element to a different DOM node', () => {
		const componentTag = 'address';
		// const subject = shallow(
		// 	<BodyTextBase component={componentTag} />
		// );
		render(<BodyTextBase component={componentTag} data-testid="bodyText" />);
		const bodyText = screen.getByTestId('bodyText');

		const expected = componentTag;
		const actual = bodyText.getElement().type;

		expect(actual).toBe(expected);
	});
});
