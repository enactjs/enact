import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PropTypes from 'prop-types';
import {createContext, useState} from 'react';

import functionalKind from '../functionalKind';

describe('functionalKind', () => {
    const TestContext = createContext({
        value: 'initial'
    });
    const FunctionalKind = functionalKind({
        name: 'Kind',
        propTypes: {
            prop: PropTypes.number.isRequired,
            label: PropTypes.string
        },
        defaultProps: {
            label: 'Label'
        },
        contextType: TestContext,
        styles: {
            className: 'kind'
        },
        handlers: {
            onClick: (ev, props, context) => {
                props.onClick(context.value);
            }
        },
        computed: {
            value: ({prop}) => prop + 1,
            contextValue: (props, context) => {
                return context ? `context${context.value}` : 'unknown';
            }
        },
        useRender: ({contextValue, label, value, ...rest}) => {
            delete rest.prop;
            return (
                <div {...rest} data-context={contextValue} title={label}>
                    {value}
                </div>
            );
        }
    });

    test('should assign name to displayName', () => {
        const expected = 'Kind';
        const actual = FunctionalKind.displayName;

        expect(actual).toBe(expected);
    });

    test('should support undefined handlers', () => {
        const Minimal = functionalKind({
            name: 'Minimal',
            useRender: () => <div data-testid="minimal"/>
        });

        render(<Minimal/>);

        const minimalDiv = screen.queryByTestId('minimal');

        expect(minimalDiv).toBeInTheDocument();
    });

    test('should detect invalid proType on component rerender', () => {
        const Minimal = functionalKind({
            name: 'Minimal',
            propTypes: {
                value: PropTypes.number
            },
            useRender: (props) => <div data-testid="minimal" {...props} />
        });

        const {rerender} = render(<Minimal value={0}/>);

        let minimalDiv = screen.queryByTestId('minimal');

        expect(minimalDiv).toBeInTheDocument();

        let consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();

        rerender(<Minimal value="five"/>);

        expect(consoleErrorMock).toHaveBeenCalled();

        consoleErrorMock.mockRestore();
    });

    test('should default {label} property', () => {
        render(<FunctionalKind prop={1} data-testid="unlabeled"/>);

        const expected = 'Label';
        const actual = screen.queryByTestId('unlabeled').getAttribute('title');

        expect(actual).toBe(expected);
    });

    test('should default {label} property when explicitly undefined', () => {
        // Explicitly testing for undefined
        // eslint-disable-next-line no-undefined
        render(<FunctionalKind label={undefined} data-testid="unlabeled" prop={1}/>);

        const expected = 'Label';
        const actual = screen.queryByTestId('unlabeled').getAttribute('title');

        expect(actual).toBe(expected);
    });

    test('should add className defined in styles', () => {
        render(<FunctionalKind prop={1}/>);

        const expected = 'kind';
        const kindDiv = screen.getByTitle('Label');

        expect(kindDiv).toHaveClass(expected);
    });

    test('should compute {value} property', () => {
        render(<FunctionalKind prop={1}/>);

        const expected = '2';
        const kindDiv = screen.getByTitle('Label');

        expect(kindDiv).toHaveTextContent(expected);
    });

    test('should support contextType in handlers', async () => {
        const onClick = jest.fn();
        const user = userEvent.setup();
        render(<FunctionalKind onClick={onClick} prop={1}/>);

        const kindDiv = screen.getByTitle('Label');
        await user.click(kindDiv);

        const expected = 'initial';
        const actual = onClick.mock.calls[0][0];

        expect(actual).toBe(expected);
    });

    test('should support contextType in computed', () => {
        render(<FunctionalKind prop={1}/>);

        const expected = 'contextinitial';
        const kindDiv = screen.getByTitle('Label');

        expect(kindDiv).toHaveAttribute('data-context', expected);
    });

    test('support using hooks within kind instances', async () => {
        const user = userEvent.setup();
        const Comp = functionalKind({
            name: 'Comp',
            functional: true,
            useRender: () => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const [state, setState] = useState(0);

                return <button data-testid="button" onClick={() => setState(state + 1)}>{state}</button>;
            }
        });

        render(<Comp/>);

        const button = screen.getByTestId('button');
        await user.click(button);

        const expected = '1';

        expect(button).toHaveTextContent(expected);
    });

    describe('inline', () => {
        test('should support a minimal kind', () => {
            const Minimal = functionalKind({
                name: 'Minimal',
                useRender: () => <div/>
            });

            const component = Minimal.inline();

            const expected = 'div';
            const actual = component.type;

            expect(actual).toBe(expected);
        });

        test('should set default props when prop is not passed', () => {
            const component = FunctionalKind.inline();

            // since we're inlining the output, we have to reference where the label prop lands --
            // the title prop of the <div> -- rather than the label prop on the component (which
            // doesn't exist due to inlining).
            const expected = 'Label';
            const actual = component.props.title;

            expect(actual).toBe(expected);
        });

        test('should set default props when passed prop is undefined', () => {
            const component = FunctionalKind.inline({
                // explicitly testing settings undefined in this test case
                // eslint-disable-next-line no-undefined
                label: undefined
            });

            const expected = 'Label';
            const actual = component.props.title;

            expect(actual).toBe(expected);
        });

        test('should include handlers', () => {
            const component = FunctionalKind.inline();

            const expected = 'function';
            const actual = typeof component.props.onClick;

            expect(actual).toBe(expected);
        });

        test('should not support context', () => {
            const component = FunctionalKind.inline();

            const expected = 'unknown';
            const actual = component.props['data-context'];

            expect(actual).toBe(expected);
        });
    });
});
