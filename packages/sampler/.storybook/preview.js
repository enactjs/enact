import {configureActions} from '@enact/storybook-utils/addons/actions';
import {getBooleanType, getObjectType} from '@enact/storybook-utils/addons/controls';
import {DocsPage, DocsContainer} from '@enact/storybook-utils/addons/docs';
import {themes} from '@storybook/theming';

import Environment from '../src/Environment';

// NOTE: Locales taken from strawman. Might need to add more in the future.
const locales = {
	'local':                                                             '',
	'en-US - US English':                                                'en-US',
	'ko-KR - Korean':                                                    'ko-KR',
	'es-ES - Spanish, with alternate weekends':                          'es-ES',
	'am-ET - Amharic, 5 meridiems':                                      'am-ET',
	'th-TH - Thai, with tall characters':                                'th-TH',
	'ar-SA - Arabic, RTL and standard font':                             'ar-SA',
	'ur-PK - Urdu, RTL and custom Urdu font':                            'ur-PK',
	'zh-Hans-HK - Simplified Chinese, custom Hans font':                 'zh-Hans-HK',
	'zh-Hant-HK - Traditional Chinese, custom Hant font':                'zh-Hant-HK',
	'vi-VN - Vietnamese, Special non-latin font handling':               'vi-VN',
	'ta-IN - Tamil, custom Indian font':                                 'ta-IN',
	'ja-JP - Japanese, custom Japanese font':                            'ja-JP',
	'en-JP - English, custom Japanese font':                             'en-JP',
	'si-LK - Sinhala, external font family with different line metrics': 'si-LK'
};

const backgrounds = {
	'Default (Based on Skin)': 'default',
	'Strawberries (Red)':      '#bb3352 url("http://picsum.photos/1280/720?image=1080") no-repeat center/cover',
	'Tunnel (Green)':          '#4e6a40 url("http://picsum.photos/1280/720?image=1063") no-repeat center/cover',
	'Mountains (Blue)':        '#5985a8 url("http://picsum.photos/1280/720?image=930") no-repeat center/cover',
	'Misty River':             '#71736d url("http://picsum.photos/1280/720?image=1044") no-repeat center/cover',
	'Turbulant Tides':         '#547460 url("http://picsum.photos/1280/720?image=1053") no-repeat center/cover',
	'Space Station':           '#7c4590 url("http://picsum.photos/1280/720?image=967") no-repeat center/cover',
	'Warm Pup':                '#5d6542 url("http://picsum.photos/1280/720?image=1025") no-repeat center/cover',
	'Random':                  '#555 url("http://picsum.photos/1280/720") no-repeat center/cover'
};

configureActions();
export const parameters = {
	docs: {
		container: DocsContainer,
		page: DocsPage,
		iframeHeight: 360,
		theme: themes.light
	},
	options: {
		storySort: {
			method: 'alphabetical'
		}
	}
};
export const globalTypes = {
	'locale': getObjectType('locale', 'en-US', locales),
	'background': getObjectType('background', 'default', backgrounds),
	'debug aria': getBooleanType('debug aria'),
	'debug layout': getBooleanType('debug layout'),
	'debug spotlight': getBooleanType('debug spotlight')
};
export const decorators = [Environment];
