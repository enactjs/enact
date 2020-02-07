"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
// Full List (Hash) of Feedback states and their icons with metadata
//
var _default = {
  play: {
    icon: 'play',
    position: 'after',
    allowHide: true,
    message: null
  },
  pause: {
    icon: 'pause',
    position: 'after',
    allowHide: false,
    message: null
  },
  rewind: {
    icon: 'backward',
    position: 'before',
    allowHide: false,
    message: 'x'
  },
  slowRewind: {
    icon: 'pausebackward',
    position: 'before',
    allowHide: false,
    message: 'x'
  },
  fastForward: {
    icon: 'forward',
    position: 'after',
    allowHide: false,
    message: 'x'
  },
  slowForward: {
    icon: 'pauseforward',
    position: 'after',
    allowHide: false,
    message: 'x'
  },
  jumpBackward: {
    icon: 'pausejumpbackward',
    position: 'before',
    allowHide: false,
    message: ' '
  },
  jumpForward: {
    icon: 'pausejumpforward',
    position: 'after',
    allowHide: false,
    message: ' '
  },
  jumpToStart: {
    icon: 'skipbackward',
    position: 'before',
    allowHide: true,
    message: null
  },
  jumpToEnd: {
    icon: 'skipforward',
    position: 'after',
    allowHide: true,
    message: null
  },
  stop: {
    icon: null,
    position: null,
    allowHide: true,
    message: null
  }
};
exports["default"] = _default;