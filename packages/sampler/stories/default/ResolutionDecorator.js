import {boolean, number, select} from '@enact/storybook-utils/addons/controls';
import BodyText from '@enact/ui/BodyText';
import Card from '@enact/ui/Card';
import Item from '@enact/ui/Item';
import VirtualList from '@enact/ui/VirtualList';
import ri, {ResolutionDecorator, getScreenTypeObject, getScreenType} from '@enact/ui/resolution';
import {Fragment, useCallback, useEffect, useReducer} from 'react';

Card.displayName = 'Card';
ResolutionDecorator.displayName = 'ResolutionDecorator';
VirtualList.displayName = 'VirtualList';

export default {
	title: 'UI/ResolutionDecorator',
	component: ResolutionDecorator
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
						caption="Resolution Testing"
						captionOverlay
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
	const reducer = (reducerState, payload) => {
		return {...reducerState, ...payload};
	};

	const createInitialState = () => {
		return {
			currentFontSize: '',
			height: 0,
			name: '',
			width: 0
		};
	};

	const [screenInfo, dispatch] = useReducer(reducer, null, createInitialState);

	const updateInfo = useCallback(() => {
		const type = getScreenType({width: window.innerWidth, height: window.innerHeight});
		const screenTypeObject = getScreenTypeObject(type);
		if (screenTypeObject) {
			dispatch({
				name: screenTypeObject.name,
				width: window.innerWidth,
				height: window.innerHeight
			});
		}
		dispatch({currentFontSize: document.documentElement.style.fontSize});
	}, []);

	useEffect(() => {
		updateInfo();
		window.addEventListener('resize', updateInfo);
		return () => window.removeEventListener('resize', updateInfo);
	}, [updateInfo]);

	// Config is derived in render (not via a post-render effect) so `View` and the config stay
	// consistent within the same render pass and the controls take effect immediately.
	const resolutionConfig = {
		linearScaling: {
			active: args['linearScaling'],
			type: args['scalingType']
		},
		screenTypes
	};

	if (!resolutionConfig.linearScaling.active) {
		resolutionConfig.fontSizeHandling = args['fontSizeHandling'];
		resolutionConfig.orientationHandling = args['orientationHandling'];
	}

	// ResolutionDecorator bakes its config in at decoration time, so the demo must re-decorate when
	// the controls change. This inherently creates the component during render for this sampler story.
	const View = ResolutionDecorator(resolutionConfig, ResolutionDecoratorView);

	return (
		<View
			args={args}
			currentFontSize={screenInfo.currentFontSize}
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
