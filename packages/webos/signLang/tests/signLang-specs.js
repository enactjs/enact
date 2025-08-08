
import * as signLang from '../signLang';

describe('singLang', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Activate Sign Language with ID', async () => {
        const test_id = 'test_id';
        const onSuccess = jest.fn();

        await signLang.startSignLang(test_id, { onSuccess: onSuccess });

        expect(onSuccess).toHaveBeenCalled();
    });

    test('Activate Sign Language with null ID', async () => {
        const onSuccess = jest.fn();

        await signLang.startSignLang(null, { onSuccess: onSuccess });

        expect(onSuccess).toHaveBeenCalled();
    });

    test('Deactivate Sign Language', async () => {
        const test_id = 'test_id';
        const onSuccess = jest.fn();

        await signLang.stopSignLang(test_id, { onSuccess: onSuccess });

        expect(onSuccess).toHaveBeenCalled();
    });
});
