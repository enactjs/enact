import './src/glue';
import ilib from './ilib/lib/ilib';
import {$L, toIString} from './src/$L';
import {toLowerCase, toUpperCase} from './src/case';
import {updateLocale, isRtl} from './src/locale';

export default ilib;
export {
	$L,
	isRtl,
	toIString,
	toLowerCase,
	toUpperCase,
	updateLocale
};
