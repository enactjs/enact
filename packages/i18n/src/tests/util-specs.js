import {isRtlText} from '../util.js';

describe('RTL Specs', () => {
	const RTLText =  'שועל החום הזריז קפץ מעל הכלב העצלן.ציפור עפה השעועית עם שקיעה.';

	it('should return true when array of React Components has rtl text', function () {
		const fakeReactComponents = [
			{
				props : {
					children: RTLText
				}
			},
			{
				props : {
					children: 'test'
				}
			}
		];

		const expected = true;
		const actual = isRtlText(fakeReactComponents)

		expect(actual).to.equal(expected);
	});

	it('should return false when array of React Components does not have rtl text', function () {
		const fakeReactComponents = [
			{
				props : {
					children: 'something'
				}
			},
			{
				props : {
					children: 'test'
				}
			}
		];

		const expected = false;
		const actual = isRtlText(fakeReactComponents)

		expect(actual).to.equal(expected);
	});

	it('should return true when RTL Text string is passed', function () {
		const expected = true;
		const actual = isRtlText(RTLText)

		expect(actual).to.equal(expected);
	});

	it('should return false when LTR Text string is passed', function () {
		const expected = false;
		const actual = isRtlText('LTR Text');

		expect(actual).to.equal(expected);
	});

});
