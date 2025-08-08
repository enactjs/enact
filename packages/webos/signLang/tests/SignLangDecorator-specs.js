import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SignLangDecorator from '../SignLangDecorator';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('Button', () => {
    beforeAll(() => {
        window.PalmSystem = {
            getIdentifier: () => 'com.webos.app.test',
        }
    });

    test('FR.01.​TC.001: When signLangId is declared and the element receives focus, the Sign Language API is called.', async () => {
        const SignLangButton = SignLangDecorator('button');
        const onSuccess = jest.fn();

        render(<SignLangButton signLangId='test_id' signLangOption={{ 'onSuccess': onSuccess }} />);

        const button = screen.getByRole('button');
        await button.focus();

        expect(onSuccess).toHaveBeenCalled()
    });

    test('FR.01.​TC.002: If no attribute value is declared, the Sign Language API is not called on focus.', async () => {
        const SignLangButton = SignLangDecorator('button');
        const onSuccess = jest.fn();

        render(<SignLangButton signLangOption={{ 'onSuccess': onSuccess }} />);

        const button = screen.getByRole('button');
        await button.focus();

        expect(onSuccess).not.toHaveBeenCalled()
    });

    test('FR.01.​TC.003: When signLangDelay is declared and the element receives focus, the Sign Language API is called after a certain delay.', async () => {
        const SignLangButton = SignLangDecorator({ signLangDelay: 1000 }, 'button');
        const onSuccess = jest.fn();

        render(<SignLangButton signLangId='test_id' signLangOption={{ 'onSuccess': onSuccess }} />);

        const button = screen.getByRole('button');

        await button.focus();
        await delay(2000);

        expect(onSuccess).toHaveBeenCalled()
    });

    test('FR.01.​TC.004: When signLangId is declared and the element loses focus, the Sign Language API is called.', async () => {
        const SignLangButton = SignLangDecorator('button');
        const onSuccess = jest.fn();

        render(<SignLangButton signLangId='test_id' signLangOption={{ 'onSuccess': onSuccess }} />);

        const button = screen.getByRole('button');
        await button.focus();
        await button.blur();

        expect(onSuccess).toHaveBeenCalledTimes(2)
    });

    test('FR.01.​TC.005: If no attribute value is declared, the Sign Language API is not called on focus out.', async () => {
        const SignLangButton = SignLangDecorator('button');
        const onSuccess = jest.fn();

        render(<SignLangButton signLangOption={{ 'onSuccess': onSuccess }} />);

        const button = screen.getByRole('button');
        await button.focus();
        await button.blur();

        expect(onSuccess).not.toHaveBeenCalled()
    });

    test('FR.01.​TC.006: When signLangDelay is declared and the element loses focus, the Sign Language API is called immediately.', async () => {
        const SignLangButton = SignLangDecorator({ signLangDelay: 1000 }, 'button');
        const onSuccess = jest.fn();

        render(<SignLangButton signLangId='test_id' signLangOption={{ 'onSuccess': onSuccess }} />);

        const button = screen.getByRole('button');

        await button.focus();
        await delay(2000);
        await button.blur();

        expect(onSuccess).toHaveBeenCalledTimes(2)
    });

    test('FR.01.​TC.007: When a custom attribute is declared on a component with SignLangDecorator, it is reflected on the node.', () => {
        const SignLangButton = SignLangDecorator('button');

        render(<SignLangButton data-custom-attribute />);

        const button = screen.getByRole('button');

        const expected = 'data-custom-attribute';

        expect(button).toHaveAttribute(expected);
    });
});
