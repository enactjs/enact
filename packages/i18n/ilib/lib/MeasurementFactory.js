/*
 * MeasurementFactory.js - Function to instantiate the appropriate subclasses of
 * the Measurement class.
 *
 * Copyright © 2015, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
!depends
UnknownUnit.js
AreaUnit.js
DigitalStorageUnit.js
DigitalSpeedUnit.js
EnergyUnit.js
FuelConsumptionUnit.js
LengthUnit.js
MassUnit.js
TemperatureUnit.js
TimeUnit.js
VelocityUnit.js
VolumeUnit.js
Measurement.js
*/

// TODO: make these dependencies dynamic or at least generate them in the build
// These will each add themselves to Measurement._constructors[]
var UnknownUnit = require("./UnknownUnit.js");
var AreaUnit = require("./AreaUnit.js");
var DigitalStorageUnit = require("./DigitalStorageUnit.js");
var DigitalSpeedUnit = require("./DigitalSpeedUnit.js");
var EnergyUnit = require("./EnergyUnit.js");
var FuelConsumptionUnit = require("./FuelConsumptionUnit.js");
var LengthUnit = require("./LengthUnit.js");
var MassUnit = require("./MassUnit.js");
var TemperatureUnit = require("./TemperatureUnit.js");
var TimeUnit = require("./TimeUnit.js");
var VelocityUnit = require("./VelocityUnit.js");
var VolumeUnit = require("./VolumeUnit.js");

var Measurement = require("./Measurement.js");

/**
 * Create a measurement subclass instance based on a particular measure
 * required. The measurement is immutable once
 * it is created, but it can be converted to other measurements later.<p>
 *
 * The options may contain any of the following properties:
 *
 * <ul>
 * <li><i>amount</i> - either a numeric amount for this measurement given
 * as a number of the specified units, or another Measurement instance
 * to convert to the requested units. If converting to new units, the type
 * of measure between the other instance's units and the current units
 * must be the same. That is, you can only convert one unit of mass to
 * another. You cannot convert a unit of mass into a unit of length.
 *
 * <li><i>unit</i> - units of this measurement. Use the
 * static call {@link MeasurementFactory.getAvailableUnits}
 * to find out what units this version of ilib supports. If the given unit
 * is not a base unit, the amount will be normalized to the number of base units
 * and stored as that number of base units.
 * For example, if an instance is constructed with 1 kg, this will be converted
 * automatically into 1000 g, as grams are the base unit and kg is merely a
 * commonly used scale of grams. 
 * </ul>
 *
 * Here are some examples of converting a length into new units. 
 * The first method is via this factory function by passing the old measurement 
 * in as the "amount" property.<p>
 * 
 * <pre>
 * var measurement1 = MeasurementFactory({
 *   amount: 5,
 *   units: "kilometers"
 * });
 * var measurement2 = MeasurementFactory({
 *   amount: measurement1,
 *   units: "miles"
 * });
 * </pre>
 * 
 * The value in measurement2 will end up being about 3.125 miles.<p>
 * 
 * The second method uses the convert method.<p>
 * 
 * <pre>
 * var measurement1 = MeasurementFactory({
 *   amount: 5,
 *   units: "kilometers"
 * });
 * var measurement2 = measurement1.convert("miles");
 * });
 * </pre>
 *
 * The value in measurement2 will again end up being about 3.125 miles.
 * 
 * @static
 * @param {Object=} options options that control the construction of this instance
 */
var MeasurementFactory = function(options) {
    if (!options || typeof(options.unit) === 'undefined') {
        return undefined;
    }

    var measure = undefined;

    // first try in the existing case
    for (var c in Measurement._constructors) {
        var measurement = Measurement._constructors[c];
        if (Measurement.getUnitId(measurement, options.unit)) {
            measure = c;
            break;
        }
    }

    if (!measure) {
        // if it wasn't found before, try again in lower case -- this may recognize incorrectly because some
        // units can differ only in their case like "mm" and "Mm"
        for (var c in Measurement._constructors) {
            var measurement = Measurement._constructors[c];
            if (typeof(Measurement.getUnitIdCaseInsensitive(measurement, options.unit)) !== 'undefined') {
                measure = c;
                break;
            }
        }
    }

    if (!measure || typeof(measure) === 'undefined') {
        return new UnknownUnit({
            unit: options.unit,
            amount: options.amount
        });
    } else {
        return new Measurement._constructors[measure](options);
    }
};

/**
 * Return a list of all possible units that this version of ilib supports.
 * Typically, the units are given as their full names in English. Unit names
 * are case-insensitive.
 *
 * @static
 * @return {Array.<string>} an array of strings containing names of measurement 
 * units available
 */
MeasurementFactory.getAvailableUnits = function () {
	var units = [];
	for (var c in Measurement._constructors) {
		var measure = Measurement._constructors[c];
		units = units.concat(measure.getMeasures());
	}
	return units;
};

module.exports = MeasurementFactory;
