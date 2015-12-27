var Colors = require('material-ui/lib/styles/colors');
var ColorManipulator = require('material-ui/lib/utils/color-manipulator');
var Spacing = require('material-ui/lib/styles/spacing');


module.exports = {
  spacing: Spacing,
  fontFamily: 'Fira Sans, sans-serif',
  palette: {
    primary1Color: Colors.white,
    primary2Color: '#A3311D',
    primary3Color: Colors.lightBlack,
    accent1Color: '#6CA547',
    accent2Color: '#A3311D',
    accent3Color: Colors.grey500,
    textColor: Colors.white,
    alternateTextColor: '#636266',
    canvasColor: '#47474A',
    borderColor: Colors.grey300,
    disabledColor: ColorManipulator.fade(Colors.white, 0.7)
  }
};