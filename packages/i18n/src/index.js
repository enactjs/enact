import './glue';
import ilib from '../ilib/lib/ilib';
import {$L, toIString} from './$L';
import {toLowerCase, toUpperCase} from './case';
import {updateLocale, isRtl} from './locale';

export default ilib;
export {
	$L,
	isRtl,
	toIString,
	toLowerCase,
	toUpperCase,
	updateLocale
};
