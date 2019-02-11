import MediaOverlay, {MediaOverlayBase, MediaOverlayDecorator} from '@enact/moonstone/MediaOverlay';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {withInfo} from '@storybook/addon-info';

import {select} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

const prop = {
	videoTitles: [
		'Sintel',
		'Big Buck Bunny',
		'VideoTest',
		'Bad Video Source'
	],
	videos: {
		'Sintel': 'http://media.w3.org/2010/05/sintel/trailer.mp4',
		'Big Buck Bunny': 'http://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_480p_h264.mov',
		'VideoTest': 'http://media.w3.org/2010/05/video/movie_300.mp4',
		// Purposefully not a video to demonstrate source error state
		'Bad Video Source': 'https://github.com/mderrick/react-html5video'
	},
	imageNames: [
		'None',
		'Strawberries',
		'Tunnel',
		'Mountains',
		'Bad Image Source'
	],
	images: {
		'None': '',
		'Strawberries': 'http://picsum.photos/1280/720?image=1080',
		'Tunnel': 'http://picsum.photos/1280/720?image=1063',
		'Mountains': 'http://picsum.photos/1280/720?image=930',
		'Bad Image Source': 'imagenotfound.png'
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
	placeholderNames: [
		'None',
		'SVG'
	],
	placeholder: {
		'None': '',
		'SVG': 'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC' +
		'9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHN0cm9rZT0iIzU1NSIgZmlsbD0iI2FhYSIg' +
		'ZmlsbC1vcGFjaXR5PSIwLjIiIHN0cm9rZS1vcGFjaXR5PSIwLjgiIHN0cm9rZS13aWR0aD0iNiIgLz48L3N2Zz' +
		'4NCg=='
	}
};

const Config = mergeComponentMetadata('MediaOverlay', MediaOverlay, MediaOverlayBase, MediaOverlayDecorator);
Config.groupId = 'MediaOverlay';
MediaOverlay.displayName = 'MediaOverlay';

storiesOf('Moonstone', module)
	.add(
		'MediaOverlay',
		withInfo({
			text: 'The basic MediaOverlay'
		})(() => {
			const videoTitle = select('source', prop.videoTitles, Config, 'Sintel');
			const videoSource = prop.videos[videoTitle];
			const imageName = select('imageOverlay', prop.imageNames, Config);
			const imageSource = prop.images[imageName];
			const placeholderName = select('placeholder', prop.placeholderNames, Config, 'None');
			const placeholder = prop.placeholder[placeholderName];
			return (
				<MediaOverlay
					imageOverlay={imageSource}
					placeholder={placeholder}
					text={select('text', prop.text, Config, prop.text[0])}
					textAlign={select('textAlign', ['start', 'center', 'end'], Config, 'center')}
				>
					<source src={videoSource} />
				</MediaOverlay>
			);
		})
	);
