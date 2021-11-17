/* global ILIB_ADDITIONAL_RESOURCES_PATH */
/*
 * glue.js - glue code to fit ilib into enyo
 *
 * Copyright © 2013-2014 LG Electronics, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import ilib from 'ilib';

import './dates';

import Loader from './Loader';
import {updateLocale} from '../locale';

const ILIB_ADDITIONAL_RESOURCES_PATH = 'resources_0';

ilib.setLoaderCallback(new Loader());
ilib.getLoader().addPath(typeof ILIB_ADDITIONAL_RESOURCES_PATH !== 'undefined' ? ILIB_ADDITIONAL_RESOURCES_PATH : '');

if (typeof window === 'object' && typeof window.UILocale !== 'undefined') {
	// this is a hack until GF-1581 is fixed
	ilib.setLocale(window.UILocale);
}

// we go ahead and run this once during loading of iLib settings are valid
// during the loads of later libraries.
updateLocale(null, true);
