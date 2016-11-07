import './glue';
import ilib from '../ilib/lib/ilib';
import {$L, toIString} from './$L';
import {toLowerCase, toUpperCase} from './case';
import {updateLocale, isRtlLocale} from './locale';
import {isRtlText} from './util';

export default ilib;
export {
	$L,
	isRtlLocale,
	isRtlText,
	toIString,
	toLowerCase,
	toUpperCase,
	updateLocale
};
