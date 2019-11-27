// Icons For Samples
//
// Grouped into logical sets for easy consumption.
//

import {icons} from '@enact/moonstone/Icon';

const decrementIcons = [
	'minus',
	'backward',
	'skipbackward',
	'pausebackward',
	'pausejumpbackward',
	'jumpbackward',
	'rollbackward',
	'arrowshrink',
	'back15'
].sort();

const incrementIcons = [
	'plus',
	'forward',
	'skipforward',
	'pauseforward',
	'pausejumpforward',
	'jumpforward',
	'rollforward',
	'arrowextend',
	'forward15'
].sort();

const listIcons = [
	'denselist',
	'bulletlist',
	'list',
	'drawer',
	'playlist'
].sort();

const mediaIcons = [
	'circle',
	'stop',
	'play',
	'pause',
	'forward',
	'backward',
	'skipforward',
	'skipbackward',
	'pauseforward',
	'pausebackward',
	'pausejumpforward',
	'pausejumpbackward',
	'resumeplay',
	'image',
	'audio',
	'music',
	'languages',
	'cc',
	'ccon',
	'ccoff',
	'sub',
	'recordings',
	'livezoom',
	'liveplayback',
	'liveplaybackoff',
	'repeat',
	'repeatoff',
	'series',
	'repeatdownload',
	'view360',
	'view360off',
	'info',
	'repeattrack',
	'bluetoothoff',
	'verticalellipsis',
	'picture',
	'home',
	'warning',
	'scroll',
	'densedrawer',
	'liverecord',
	'liveplay',
	'contrast',
	'edit',
	'trashlock',
	'volumecycle',
	'movecursor',
	'refresh',
	'question',
	'questionreversed',
	's',
	'repeatone',
	'repeatall',
	'repeatnone',
	'speakers',
	'koreansubtitles',
	'chinesesubtitles',
	'searchfilled',
	'zoomin',
	'zoomout',
	'playlistadd',
	'files',
	'brightness',
	'download',
	'playlistedit',
	'font',
	'musicon',
	'musicoff',
	'liverecordone',
	'liveflagone',
	'shuffle',
	'sleep',
	'notification',
	'notificationoff',
	'checkselection'
].sort();

const arrowIcons = [
	'arrowlargedown',
	'arrowlargeup',
	'arrowlargeleft',
	'arrowlargeright',
	'arrowsmallup',
	'arrowsmalldown',
	'arrowsmallleft',
	'arrowsmallright',
	'arrowcurveright',
	'arrowrightskip',
	'arrowleftprevious',
	'arrowupdown'
].sort();

const starIcons = [
	'star',
	'hollowstar',
	'halfstar',
	'starminus'
].sort();

export default Object.keys(icons).sort();
export {decrementIcons, incrementIcons, listIcons, mediaIcons, arrowIcons, starIcons};
