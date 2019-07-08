// ilib doesn't load the non-Gregorian calendars and dates initially. To ensure they are packaged
// by enyo-dev, we've added explicit requires for each Date (which in turn requires the relevant
// Calendar). This is only necessary for builds not using the library-mode build of enyo-ilib which
// would have included everything

/*
require('../ilib/lib/GregorianDate');   // not required (rimshot) but included for completeness
require('../ilib/lib/CopticDate');
require('../ilib/lib/EthiopicDate');
require('../ilib/lib/GregorianDate');
require('../ilib/lib/HanDate');
require('../ilib/lib/HebrewDate');
require('../ilib/lib/IslamicDate');
require('../ilib/lib/JulianDate');
require('../ilib/lib/PersianDate');
require('../ilib/lib/PersianAlgoDate');
require('../ilib/lib/ThaiSolarDate');
*/

require('ilib/lib/GregorianDate');   // not required (rimshot) but included for completeness
require('ilib/lib/CopticDate');
require('ilib/lib/EthiopicDate');
require('ilib/lib/GregorianDate');
require('ilib/lib/HanDate');
require('ilib/lib/HebrewDate');
require('ilib/lib/IslamicDate');
require('ilib/lib/JulianDate');
require('ilib/lib/PersianDate');
require('ilib/lib/PersianAlgoDate');
require('ilib/lib/ThaiSolarDate');
