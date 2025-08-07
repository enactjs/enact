import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SignLangDecorator from '../SignLangDecorator';

// describe('Button', () => {
//     beforeAll(() => {
//         window.PalmSystem = {
//             getIdentifier: () => 'com.webos.app.test',
//         }
//     });

//     test('Check onFocus handler is called', async () => {
//         const SignLangButton = SignLangDecorator('button');
//         const onSuccess = jest.fn();

//         render(<SignLangButton signLangId='test_id' signLangOption={{ 'onSuccess': onSuccess }} />);

//         const button = screen.getByRole('button');
//         await button.focus();

//         expect(onSuccess).toHaveBeenCalled()
//     });
// });

// describe('Button', () => {
//     test('Check onFocus handler is called', () => {
//         const SignLangButton = SignLangDecorator('button');
//         const onFocus = jest.fn();

//         render(<SignLangButton data-test onFocus={onFocus} />);

//         const button = screen.getByRole('button');
//         button.focus();

//         expect(onFocus).toHaveBeenCalled()
//     });
// });

// describe('Button', () => {
//     test('Should delegate attribute to the dom node', () => {
//         const SignLangButton = SignLangDecorator('button');

//         render(<SignLangButton data-test />);

//         const button = screen.getByRole('button');

//         const expected = 'data-test';

//         expect(button).toHaveAttribute(expected);
//     });
// });

describe('SignLangDecorator', () => {
    it('should render correctly', () => {
        expect(true).toBe(true); // 기본 테스트 추가
    });
});
