import {mount} from 'enzyme';
import React from 'react';

import Item from '../../Item';

import VirtualList from '../VirtualList';

describe('VirtualList Specs', () => {
	describe('Set and change props Specs', () => {
		let
			myScrollTo,
			resultScrollLeft;

		const
			data = [],
			dataSize = 100,
			getScrollTo = (scrollTo) => {
				myScrollTo = scrollTo;
			},
			handlerOnScrollStop = (e) => {
				resultScrollLeft = e.scrollLeft;
			};

		for (let i = 0; i < dataSize; i++) {
			data.push({name: 'Account ' + i});
		}

		const subject = mount(
			<VirtualList
				cbScrollTo={getScrollTo}
				data={data}
				dataSize={dataSize}
				direction={'horizontal'}
				itemSize={30}
				onScrollStop={handlerOnScrollStop}
				style={{backgroundColor: 'red', width: '500px', height: '700px'}}
				// eslint-disable-next-line react/jsx-no-bind
				component={({index, key}) => (
					<Item key={key}>
						{data[index].name}
					</Item>
				)}
			/>
		);

		describe('Set props Specs', () => {
			it('should render a list item of \'data\'', function () {
				const expected = 'Account 0';
				const actual = subject.find('VirtualListCore').children().at(0).text();

				expect(actual).to.equal(expected);
			});

			it('should have the prop \'dataSize\' of 100', function () {
				const expected = 100;
				const actual = subject.find('VirtualListCore').prop('dataSize');

				expect(actual).to.equal(expected);
			});

			it('should have the prop \'direction\' of \'horizontal\'', function () {
				const expected = 'horizontal';
				const actual = subject.find('VirtualListCore').prop('direction');

				expect(actual).to.equal(expected);
			});

			it('should apply list size', function () {
				const expectedWidth = '500px';
				const expectedHeight = '700px';
				const actualWidth = subject.prop('style').width;
				const actualHeight = subject.prop('style').height;

				expect(actualWidth).to.equal(expectedWidth);
				expect(actualHeight).to.equal(expectedHeight);
			});

			it('should apply background color', function () {
				const expected = 'red';
				const actual = subject.prop('style').backgroundColor;

				expect(actual).to.equal(expected);
			});

			it('should scroll with cbScrollTo prop', function () {
				myScrollTo({position: {x: 10}, animate: false});

				const expected = 10;
				const actual = resultScrollLeft;

				expect(actual).to.equal(expected);
			});
		});

		describe('Change props Specs', () => {
			it('should change value of the prop \'data\' to \'Password 0\'', function () {
				data[0] = {name: 'Password 0'};
				subject.setProps({data: data});

				const expected = 'Password 0';
				const actual = subject.find('VirtualListCore').children().at(0).text();

				expect(actual).to.equal(expected);
			});

			it('should change value of the prop \'direction\' to \'horizontal\'', function () {
				subject.setProps({direction: 'vertical'});

				const expected = 'vertical';
				const actual = subject.find('VirtualListCore').prop('direction');

				expect(actual).to.equal(expected);
			});

			it('should change value of the prop \'spacing\' to 5', function () {
				subject.setProps({spacing: 5});

				const expected = 5;
				const actual = subject.find('VirtualListCore').prop('spacing');

				expect(actual).to.equal(expected);
			});

			it('should change value of the props \'style\' to \'backgroundColor\', \'width\', and \'height\'', function () {
				subject.setProps({style: {backgroundColor: 'blue', width: '400px', height: '600px'}});

				const expectedBackgroundColor = 'blue';
				const expectedWidth = '400px';
				const expectedHeight = '600px';
				const actualBackgroundColor = subject.prop('style').backgroundColor;
				const actualWidth = subject.prop('style').width;
				const actualHeight = subject.prop('style').height;

				expect(actualBackgroundColor).to.equal(expectedBackgroundColor);
				expect(actualWidth).to.equal(expectedWidth);
				expect(actualHeight).to.equal(expectedHeight);
			});
		});
	});
});
