import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import Icon, {IconBase} from '../Icon';

describe('Icon', () => {
	test('should allow icon-name words to pass through', () => {
		const iconName = 'hollow_star';
		render(<IconBase data-testid="icon">{iconName}</IconBase>);
		const icon = screen.getByTestId('icon');

		expect(icon).toHaveTextContent(iconName);
	});

	test('should allow single-byte characters to pass through', () => {
		const iconName = '+';
		render(<IconBase data-testid="icon">{iconName}</IconBase>);
		const icon = screen.getByTestId('icon');

		expect(icon).toHaveTextContent(iconName);
	});

	test('should allow multi-byte characters to pass through', () => {
		const iconName = '󰂪';
		render(<IconBase data-testid="icon">{iconName}</IconBase>);
		const icon = screen.getByTestId('icon');

		expect(icon).toHaveTextContent(iconName);
	});

	test('should allow pre-defined icon names as an icon', () => {
		const iconName = 'factory';
		const iconGlyph = 'F';
		const iconList = {
			train: 'T',
			factory: 'F'
		};
		render(<IconBase data-testid="icon" iconList={iconList}>{iconName}</IconBase>);
		const icon = screen.getByTestId('icon');

		expect(icon).toHaveTextContent(iconGlyph);
	});

	test('should allow un-matched icon names to fall through, even when pre-defined icons exist', () => {
		const iconName = 'custom-icon-word';
		const iconList = {
			train: 'T',
			factory: 'F'
		};
		render(<IconBase data-testid="icon" iconList={iconList}>{iconName}</IconBase>);
		const icon = screen.getByTestId('icon');

		expect(icon).toHaveTextContent(iconName);
	});

	test('should allow URIs to be used as an icon', () => {
		const src = 'images/icon.png';
		render(<IconBase data-testid="icon">{src}</IconBase>);
		const icon = screen.getByTestId('icon');

		const expected = {
			backgroundImage: `url(${src})`
		};

		expect(icon).toHaveStyle(expected);
	});

	test('should allow URLs to be used as an icon', () => {
		const src = 'http://enactjs.com/images/logo';
		render(<IconBase data-testid="icon">{src}</IconBase>);
		const icon = screen.getByTestId('icon');

		const expected = {
			backgroundImage: `url(${src})`
		};

		expect(icon).toHaveStyle(expected);
	});

	test('should merge author styles with image URLs', () => {
		const src = 'images/icon.png';
		render(<IconBase data-testid="icon" style={{color: 'green'}}>{src}</IconBase>);
		const icon = screen.getByTestId('icon');

		const expected = {
			color: 'green',
			backgroundImage: `url(${src})`
		};

		expect(icon).toHaveStyle(expected);
	});

	test('should return a DOM node reference for `componentRef`', () => {
		const ref = jest.fn();
		render(<Icon ref={ref} />);

		const expected = 'DIV';
		const actual = ref.mock.calls[0][0].nodeName;

		expect(actual).toBe(expected);
	});
});
