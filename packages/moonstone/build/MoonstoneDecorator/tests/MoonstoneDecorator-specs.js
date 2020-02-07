"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _ = _interopRequireDefault(require("../"));

var _spotlight = _interopRequireDefault(require("@enact/spotlight"));

var _MoonstoneDecoratorModule = _interopRequireDefault(require("../MoonstoneDecorator.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('MoonstoneDecorator', function () {
  var AppRoot = function AppRoot(props) {
    return _react["default"].createElement("div", Object.assign({
      "data-app": true
    }, props));
  };

  test('should add base moonstone classes to wrapped component', function () {
    var config = {
      ri: false,
      i18n: false,
      spotlight: false,
      "float": false,
      overlay: false
    };
    var App = (0, _["default"])(config, AppRoot);
    var subject = (0, _enzyme.mount)(_react["default"].createElement(App, null));

    _spotlight["default"].terminate();

    var appRoot = subject.find('[data-app]');
    var expected = true;
    var actual = appRoot.hasClass('moonstone') && appRoot.hasClass(_MoonstoneDecoratorModule["default"].bg);
    expect(actual).toBe(expected);
  });
  test('should add author classes to wrapped component', function () {
    var config = {
      ri: false,
      i18n: false,
      spotlight: false,
      "float": false,
      overlay: false
    };
    var App = (0, _["default"])(config, AppRoot);
    var subject = (0, _enzyme.mount)(_react["default"].createElement(App, {
      className: "author-class"
    }));

    _spotlight["default"].terminate();

    var appRoot = subject.find('[data-app]');
    var expected = true;
    var actual = appRoot.hasClass('author-class');
    expect(actual).toBe(expected);
  });
  test('should not add .moonstone class to wrapped component when float is enabled', function () {
    var config = {
      ri: false,
      i18n: false,
      spotlight: false,
      "float": true,
      overlay: false
    };
    var App = (0, _["default"])(config, AppRoot);
    var subject = (0, _enzyme.mount)(_react["default"].createElement(App, null));

    _spotlight["default"].terminate();

    var appRoot = subject.find('[data-app]');
    var expected = false;
    var actual = appRoot.hasClass('moonstone');
    expect(actual).toBe(expected);
  });
  test('should not add .bg class to wrapped component when overlay is enabled', function () {
    var config = {
      ri: false,
      i18n: false,
      spotlight: false,
      "float": false,
      overlay: true
    };
    var App = (0, _["default"])(config, AppRoot);
    var subject = (0, _enzyme.mount)(_react["default"].createElement(App, null));

    _spotlight["default"].terminate();

    var appRoot = subject.find('[data-app]');
    var expected = false;
    var actual = appRoot.hasClass(_MoonstoneDecoratorModule["default"].bg);
    expect(actual).toBe(expected);
  });
});