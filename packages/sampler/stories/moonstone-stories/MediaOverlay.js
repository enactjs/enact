import MediaOverlay, {MediaOverlayBase} from '@enact/moonstone/MediaOverlay';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {select} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('MediaOverlay', MediaOverlayBase);

const defaultPlaceholder =
	'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC' +
	'9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHN0cm9rZT0iIzU1NSIgZmlsbD0iI2FhYSIg' +
	'ZmlsbC1vcGFjaXR5PSIwLjIiIHN0cm9rZS1vcGFjaXR5PSIwLjgiIHN0cm9rZS13aWR0aD0iNiIgLz48L3N2Zz' +
	'4NCg==';

const prop = {
	videoTitles: [
		'Sintel',
		'Big Buck Bunny',
		'VideoTest',
		'Bad Video Source'
	],
	videos: [
		{
			poster: 'http://media.w3.org/2010/05/sintel/poster.png',
			source: 'http://media.w3.org/2010/05/sintel/trailer.mp4'
		},
		{
			poster: 'http://media.w3.org/2010/05/bunny/poster.png',
			source: 'http://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_480p_h264.mov'
		},
		{
			poster: 'http://media.w3.org/2010/05/video/poster.png',
			source: 'http://media.w3.org/2010/05/video/movie_300.mp4'
		},
		{
			poster: 'http://media.w3.org/2010/05/video/poster.png',
			// Purposefully not a video to demonstrate source error state
			source: 'https://github.com/mderrick/react-html5video'
		}
	],
	images: {
		'': 'None',
		'https://picsum.photos/1280/720?image=1080': 'Strawberries',
		'https://picsum.photos/1280/720?image=1063': 'Tunnel',
		'https://picsum.photos/1280/720?image=930': 'Mountains'
	},
	text: [
		'',
		'The quick brown fox jumped over the lazy dog. The bean bird flies at sundown.',
		'Η γρήγορη καφέ αλεπού πήδηξε πάνω από το μεσημέρι. Το πουλί πετά σε φασολιών δύση του ηλίου.',
		'ਤੁਰੰਤ ਭੂਰਾ Fox ਆਲਸੀ ਕੁੱਤੇ ਨੂੰ ਵੱਧ ਗਈ. ਬੀਨ ਪੰਛੀ ਸੂਰਜ ਡੁੱਬਣ \'ਤੇ ਉਡਾਣ ਭਰਦੀ ਹੈ.',
		'速い茶色のキツネは、怠け者の犬を飛び越えた。豆の鳥は日没で飛ぶ。',
		'那只敏捷的棕色狐狸跃过那只懒狗。豆鸟飞日落。',
		'빠른 갈색 여우가 게으른 개를 뛰어 넘었다.콩 조류 일몰에 파리.',
		'שועל החום הזריז קפץ מעל הכלב העצלן.ציפור עפה השעועית עם שקיעה.',
		'قفز الثعلب البني السريع فوق الكلب الكسول. الطيور تطير في الفول عند غروب الشمس.',
		'فوری بھوری لومڑی سست کتے پر چھلانگ لگا. بین پرندوں سوریاست میں پرواز.'
	],
	placeholder: {
		'': 'None',
		[defaultPlaceholder]: 'SVG'
	}
};


const videoSources = {};
for (let index = 0; index < prop.videos.length; index++) {
	if (index != null && prop.videos[index]) {
		videoSources[prop.videos[index].source] = prop.videoTitles[index];
	}
}

storiesOf('Moonstone', module)
	.add(
		'MediaOverlay',
		withInfo({
			propTables: [Config],
			text: 'The basic MediaOverlay'
		})(() => (
			<MediaOverlay
				imageOverlay={select('imageOverlay', prop.images)}
				placeholder={select('placeholder', prop.placeholder, 'None')}
				text={select('text', prop.text, prop.text[0])}
				textAlign={select('textAlign', ['start', 'center', 'end'], 'center')}
			>
				<source src={select('source', videoSources, prop.videos[0].source)} />
			</MediaOverlay>
		))
	);
