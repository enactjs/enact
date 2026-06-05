import {boolean, number, select} from '@enact/storybook-utils/addons/controls';
import BodyText from '@enact/ui/BodyText';
import Card from '@enact/ui/Card';
import Item from '@enact/ui/Item';
import VirtualList from '@enact/ui/VirtualList';
import ri, {ResolutionDecorator, getScreenTypeObject, getScreenType} from '@enact/ui/resolution';
import {Fragment, useCallback, useState, useEffect} from 'react';

Card.displayName = 'Card';
ResolutionDecorator.displayName = 'ResolutionDecorator';
VirtualList.displayName = 'VirtualList';

export default {
	title: 'UI/ResolutionDecorator',
	component: ResolutionDecorator
};

const config = {
	linearScaling: {
		active: false,
		type: 'currentScreen'
	}
};

const screenTypes = [
	{name: 'vga', pxPerRem: 8, width: 640, height: 480, aspectRatioName: 'standard'},
	{name: 'xga', pxPerRem: 16, width: 1024, height: 768, aspectRatioName: 'standard'},
	{name: 'hd', pxPerRem: 16, width: 1280, height: 720, aspectRatioName: 'hdtv'},
	{name: 'uw-hd', pxPerRem: 16, width: 1920, height: 804, aspectRatioName: 'cinema'},
	{name: 'fhd', pxPerRem: 24, width: 1920, height: 1080, aspectRatioName: 'hdtv'},
	{name: 'uw-uxga', pxPerRem: 24, width: 2560, height: 1080, aspectRatioName: 'cinema'},
	{name: 'qhd', pxPerRem: 32, width: 2560, height: 1440, aspectRatioName: 'hdtv'},
	{name: 'wqhd', pxPerRem: 32, width: 3440, height: 1440, aspectRatioName: 'cinema'},
	{name: 'uhd', pxPerRem: 48, width: 3840, height: 2160, aspectRatioName: 'hdtv', base: true},
	{name: 'wuhd', pxPerRem: 48, width: 5158, height: 2160, aspectRatioName: 'cinema'},
	{name: 'uhd2', pxPerRem: 96, width: 7680, height: 4320, aspectRatioName: 'hdtv'}
];

const ResolutionDecoratorView = ({
	args,
	currentFontSize,
	screenInfo
}) => {
	const itemRenderer = useCallback(({index, ...rest}) => {
		return <Item {...rest}>Item {index}</Item>;
	}, []);

	return (
		<Fragment>
			<div style={{height: 'fit-content'}}>
				<BodyText>
					<strong>fontSizeHandling (landscape)</strong> and <strong>orientationHandling (portrait)</strong> can be used only when <code>linearScaling = false</code>
				</BodyText>
				<div style={{padding: '1rem', border: '1px solid #ccc', marginBottom: '1rem'}}>
					<BodyText><strong>Current Resolution:</strong> {screenInfo.width}x{screenInfo.height} ({screenInfo.name})</BodyText>
					<BodyText><strong>Font Size:</strong> {currentFontSize}</BodyText>
				</div>
				<BodyText><strong>Select Scaling Type and Resize the Window</strong></BodyText>
				<hr />
			</div>

			<div style={{padding: '1rem', border: '2px solid #ccc', height: '50%', display: 'flex', gap: '1rem'}}>
				<VirtualList
					dataSize={args['dataSize']}
					itemRenderer={itemRenderer}
					itemSize={ri.scale(args['itemSize'])}
				/>
				<hr />
				<div>
					<Card
						captionOverlay="Resolution TEsting"
						src="https://placehold.co/300x300/69cdff/ffffff/png?text=Card Component"
						style={{
							width: ri.scaleToRem(args['width']),
							height: ri.scaleToRem(args['height'])
						}}
					/>
					<h1>Text to test resolution changes</h1>
					<h2>Text to test resolution changes</h2>
					<h3>Text to test resolution changes</h3>
				</div>
			</div>
		</Fragment>
	);
};

export const ResolutionDecorator_ = (args) => {
	const [currentFontSize, setCurrentFontSize] = useState('');
	const [screenInfo, setScreenInfo] = useState({name: '', width: 0, height: 0});

	const updateInfo = useCallback(() => {
		const type = getScreenType({width: window.innerWidth, height: window.innerHeight});
		const screenTypeObject = getScreenTypeObject(type);
		if (screenTypeObject) {
			setScreenInfo({
				name: screenTypeObject.name,
				width: window.innerWidth,
				height: window.innerHeight
			});
		}
		setCurrentFontSize(document.documentElement.style.fontSize);
	}, []);

	useEffect(() => {
		updateInfo();
		window.addEventListener('resize', updateInfo);
		return () => window.removeEventListener('resize', updateInfo);
	}, [updateInfo]);

	config.linearScaling.type = args['scalingType'];
	config.linearScaling.active = args['linearScaling'];

	if (!config.linearScaling.active) {
		config.fontSizeHandling = args['fontSizeHandling'];
		config.orientationHandling = args['orientationHandling'];
	}

	const View = ResolutionDecorator({
		...config,
		screenTypes: screenTypes
	}, ResolutionDecoratorView);

	return (
		<View
			args={args}
			currentFontSize={currentFontSize}
			screenInfo={screenInfo}
		/>
	);
};

boolean('linearScaling', ResolutionDecorator_, ResolutionDecorator);
select('scalingType', ResolutionDecorator_, ['currentScreen', 'baseScreen'], ResolutionDecorator, 'currentScreen');
select('fontSizeHandling', ResolutionDecorator_, ['scale', 'normal'], ResolutionDecorator, 'scale');
select('orientationHandling', ResolutionDecorator_, ['scale', 'normal'], ResolutionDecorator, 'normal');
number('dataSize', ResolutionDecorator_, VirtualList, 100);
number('itemSize', ResolutionDecorator_, VirtualList, 156);
number('width', ResolutionDecorator_, Card, 500);
number('height', ResolutionDecorator_, Card, 250);

ResolutionDecorator_.parameters = {
	info: {
		text: 'Basic Usage of ResolutionDecorator and Linear Scaling'
	}
};
