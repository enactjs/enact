import React from 'react';
import {shallow} from 'enzyme';
import {isRtlText, findRtlText} from '../util.js';

describe('RTL Specs', () => {
	const RTLText =  'שועל החום הזריז קפץ מעל הכלב העצלן.ציפור עפה השעועית עם שקיעה.';

	it('should return true when a child contains rtl text', function () {
		const NestedComponent = () => (
			<div>
				<p>{RTLText}</p>
			</div>
		);

		const nestedText = shallow(
			<NestedComponent />
		);

		const expected = true;
		const currentElement = nestedText.node;
		const actual = findRtlText(currentElement);

		expect(actual).to.equal(expected);
	});

	it('should return true when a deeply nested child contains rtl text', function () {
		const NestedComponent = () => (
			<div>
				<div>
					<div>
						<div>
							<div>
								<p>{RTLText}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		);

		const nestedText = shallow(
			<NestedComponent />
		);

		const expected = true;
		const currentElement = nestedText.node;
		const actual = findRtlText(currentElement);

		expect(actual).to.equal(expected);
	});

	it('should return true when a deeply nested child contains ltr and rtl text', function () {
		const NestedComponent = () => (
			<div>
				<div>
					<div>
						<div>
							<div>
								<p>NonRTLText</p>
								<p>NonRTLText</p>
								<p>NonRTLText</p>
								<p>NonRTLText</p>
								<p>NonRTLText</p>
								<p>{RTLText}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		);

		const nestedText = shallow(
			<NestedComponent />
		);

		const expected = true;
		const currentElement = nestedText.node;
		const actual = findRtlText(currentElement);

		expect(actual).to.equal(expected);
	});

	it('should return false when a child contains does not rtl text', function () {
		const NestedComponent = () => (
			<div>
				<div>
					<div>
						<p>LTRText</p>
					</div>
				</div>
			</div>
		);

		const nestedText = shallow(
			<NestedComponent />
		);

		const expected = false;
		const currentElement = nestedText.node;
		const actual = findRtlText(currentElement);

		expect(actual).to.equal(expected);
	});

	it('should return true when RTL Text string is passed', function () {
		const expected = true;
		const actual = isRtlText(RTLText);

		expect(actual).to.equal(expected);
	});

	it('should return false when LTR Text string is passed', function () {
		const expected = false;
		const actual = isRtlText('LTR Text');

		expect(actual).to.equal(expected);
	});

});
