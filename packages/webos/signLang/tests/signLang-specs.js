
import * as signLang from '../signLang';

describe('singLang', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('FR.05.​TC.001: Execute startSignLang when signLangId has a value.', async () => {
        const test_id = 'test_id';
        const onSuccess = jest.fn();

        await signLang.startSignLang(test_id, { onSuccess: onSuccess });

        expect(onSuccess).toHaveBeenCalled();
    });

    test('FR.05.​TC.002: Execute startSignLang when signLangId is null.', async () => {
        const onSuccess = jest.fn();

        await signLang.startSignLang(null, { onSuccess: onSuccess });

        expect(onSuccess).not.toHaveBeenCalled();
    });

    test('FR.06.​TC.001: Execute stopSignLang when signLangId has a value.', async () => {
        const test_id = 'test_id';
        const onSuccess = jest.fn();

        await signLang.stopSignLang(test_id, { onSuccess: onSuccess });

        expect(onSuccess).toHaveBeenCalled();
    });

    test('FR.06.​TC.002: Execute stopSignLang when signLangId is null.', async () => {
        const test_id = 'test_id';
        const onSuccess = jest.fn();

        await signLang.stopSignLang(null, { onSuccess: onSuccess });

        expect(onSuccess).not.toHaveBeenCalled();
    });
});
