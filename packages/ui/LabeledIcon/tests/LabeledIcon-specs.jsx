import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import LabeledIcon from '../LabeledIcon';
import CustomIcon from '../../Icon';

const iconName = <div data-testid="iconName">anIconName</div>;
const iconLabel = 'A real label';
const iconComponent = ({children}) => <div>{children}</div>;

describe('LabeledIcon Specs', () => {
	test('should insert the icon source into the icon when using the prop approach', () => {
		render(
			<LabeledIcon icon={iconName} iconComponent={iconComponent}>
				{iconLabel}
			</LabeledIcon>
		);
		const icon = screen.getByTestId('iconName');

		const expected = 'anIconName';

		expect(icon).toHaveClass('icon');
		expect(icon.textContent).toBe(expected);
	});

	test('should insert the icon source into the icon slot element', () => {
		render(
			<LabeledIcon iconComponent={iconComponent}>
				<icon>{iconName}</icon>
				{iconLabel}
			</LabeledIcon>
		);
		const icon = screen.getByTestId('iconName');

		const expected = 'anIconName';

		expect(icon).toHaveClass('icon');
		expect(icon.textContent).toBe(expected);
	});

	test('should insert custom icon components into the icon slot', () => {
		render(
			<LabeledIcon iconComponent={iconComponent}>
				<icon><CustomIcon data-testid="customIcon">{iconName}</CustomIcon></icon>
				{iconLabel}
			</LabeledIcon>
		);
		const customIcon = screen.getByTestId('customIcon');

		expect(customIcon).toBeInTheDocument();
	});

	test('should return a DOM node reference for `componentRef`', () => {
		const ref = jest.fn();
		render(<LabeledIcon icon={iconName} iconComponent={iconComponent} ref={ref} />);

		const expected = 'DIV';
		const actual = ref.mock.calls[0][0].nodeName;

		expect(actual).toBe(expected);
	});
});

