// ilib doesn't load the non-Gregorian calendars and dates initially. To ensure they are packaged
// by Enact CLI, we've added explicit imports for each Date (which in turn imports the relevant
// Calendar). This is only necessary for builds not using the library-mode build of i18n which
// would have included everything

import 'ilib/lib/GregorianDate';   // not required (rimshot) but included for completeness
import 'ilib/lib/CopticDate';
import 'ilib/lib/EthiopicDate';
import 'ilib/lib/HanDate';
import 'ilib/lib/HebrewDate';
import 'ilib/lib/IslamicDate';
import 'ilib/lib/JulianDate';
import 'ilib/lib/PersianDate';
import 'ilib/lib/PersianAlgoDate';
import 'ilib/lib/ThaiSolarDate';
