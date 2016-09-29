/*
 * PackedBuffer.js - represent a packed buffer of bytes
 *
 * Copyright © 2014 LG Electronics, Inc.
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


/**
 * @constructor
 * Represents a binary buffer of unsigned bytes that will be parsed in various ways. The buffer
 * can be decoded by reading various lengths of bytes and interpretting them as longs
 * or unsigned bytes, etc. The bytes are interpretted in big-endian (network) format.
 * @param {string} buffer the binary buffer represented as a string
 */
var PackedBuffer = function (buffer) {
	this.buffer = buffer;
	this.index = 0;
};

/**
 * Return the specified number of signed long integers from the current location in
 * the buffer as an array of numbers and advance the current pointer in the buffer.
 * This method will only return as many longs as are available in the rest of the
 * buffer.
 *
 * @param {number} num The number of longs to return
 * @returns {Array.<number>} the array of signed long integers
 */
PackedBuffer.prototype.getLongs = function(num) {
	var result = undefined;
	if (this.buffer && this.index < this.buffer.length) {
		result = [];
		for (var i = 0; i < num && this.index+3 < this.buffer.length; i++) {
			var l = this.buffer[this.index] << 24 |
				this.buffer[this.index+1] << 16 |
				this.buffer[this.index+2] << 8 |
				this.buffer[this.index+3];
			result.push(l);
			this.index += 4;
		}
	}
	return result;
};

/**
 * Return a signed long integer from the current location in
 * the buffer as an array of numbers and advance the current pointer in the buffer.
 * This method will only return a long if it is available in the buffer, otherwise
 * it will return undefined.
 *
 * @returns {number} the long at the current point in the buffer, or undefined if
 * there is not enough bytes left in the buffer to form a long
 */
PackedBuffer.prototype.getLong = function() {
	var longs = this.getLongs(1);
	if (longs && longs.length > 0) {
		return longs[0];
	}
	return undefined;
};

/**
 * Return the specified number of signed byte integers from the current location in
 * the buffer as an array of numbers and advance the current pointer in the buffer.
 * This method will only return as many bytes as are available in the rest of the
 * buffer.
 *
 * @param {number} num The number of bytes to return
 * @returns {Array.<number>} the array of signed byte integers
 */
PackedBuffer.prototype.getBytes = function(num) {
	var result = undefined;
	if (this.buffer && this.index < this.buffer.length) {
		result = [];
		for (var i = 0; i < num && this.index < this.buffer.length; i++) {
			var b = this.buffer[this.index++];
			if (b & 0x80) {
				b -= 0x100;
			}
			result.push(b);
		}
	}
	return result;
};

/**
 * Return a signed byte integer from the current location in
 * the buffer as an array of numbers and advance the current pointer in the buffer.
 * This method will only return a byte if it is available in the buffer, otherwise
 * it will return undefined.
 *
 * @returns {number} the byte at the current point in the buffer, or undefined if
 * there is not enough bytes left in the buffer to form a byte
 */
PackedBuffer.prototype.getByte = function() {
	var bytes = this.getBytes(1);
	if (bytes && bytes.length > 0) {
		return bytes[0];
	}
	return undefined;
};

/**
 * Return the specified number of unsigned byte integers from the current location in
 * the buffer as an array of numbers and advance the current pointer in the buffer.
 * This method will only return as many bytes as are available in the rest of the
 * buffer.
 *
 * @param {number} num The number of bytes to return
 * @returns {Array.<number>} the array of unsigned byte integers
 */
PackedBuffer.prototype.getUnsignedBytes = function(num) {
	var result = undefined;
	if (this.buffer && this.index < this.buffer.length) {
		result = [];
		for (var i = 0; i < num && this.index < this.buffer.length; i++) {
			result.push(this.buffer[this.index++]);
		}
	}
	return result;

};

/**
 * Return a string made out of the given number of bytes and convert
 * from UTF-8 to UTF-16.
 *
 * @param {number} num The number of bytes to make a string out of
 * @returns {string} a string made out of the given bytes
 */
PackedBuffer.prototype.getString = function(num) {
	var arr = this.getUnsignedBytes(num);
	var str = "";
	for (var i = 0; i < arr.length; i++) {
		str += String.fromCharCode(arr[i]);
	}
	return str;

};

/**
 * Advance the current pointer in the buffer by the specified number of
 * bytes in the string.
 *
 * @param {number} num The number of bytes to skip
 */
PackedBuffer.prototype.skip = function(num) {
	this.index += num;
};

module.exports= PackedBuffer;
