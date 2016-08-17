/*
* @Author: weijie
* @Date:   2016-08-14 22:41:13
* @Last Modified by:   weijie
* @Last Modified time: 2016-08-16 16:10:30
*/

'use strict';

/**
 * [layerConvert 2颜色叠加]
 * @param  {[type]} effect [description]
 * @param  {[type]} color1 [description]
 * @param  {[type]} color2 [description]
 * @return {[type]}        [description]
 */
function ColorOverlay(effect, color1, color2) {
  var allEffect = getEffect();
  var colorRgb1 = colorConvert(color1);
  var colorRgb2 = colorConvert(color2);
  var hasEffect = allEffect[effect];

  return hasEffect ? getRgb(effect, colorRgb1, colorRgb2) : '';

  /**
   * [getEffect 所有效果]
   * @return {[type]} [description]
   */
  function getEffect() {
    return {
      // 1. 变暗
      darker: function(A, B) {
        var rtv = Math.min(A, B);

        return rtv > 0 ? roundDecimal(rtv) : 0;
      },
      // 2. 变亮
      lighter: function(A, B) {
        var rtv = Math.max(A, B);

        return rtv > 0 ? roundDecimal(rtv) : 0;
      },
      // 3. 正片叠底
      multiply: function(A, B) {
        var rtv = A * B / 255;

        return rtv > 0 ? roundDecimal(rtv) : 0;
      },
      // 4. 颜色加深
      colorDeepening: function(A, B) {
        var rtv = A - ((255 - A) * (255 - B)) / B;
        return rtv > 0 ? roundDecimal(rtv) : 0;
      },
      // 5. 线性加深
      linearDarker: function(A, B) {
        var rtv = A + B - 255;

        return rtv > 0 ? roundDecimal(rtv) : 0;
      },
      // 6. 滤色
      colorFilter: function(A, B) {
        var rtv = Math.min(A + B - (A * B) / 255, 255);

        return rtv > 0 ? roundDecimal(rtv) : 0;
      },
      // 7. 颜色减淡
      colorDodge: function(A, B) {
        var rtv = Math.min(A + (A * B) / (255 - B), 255);

        return rtv > 0 ? roundDecimal(rtv) : 0;
      },
      // 8. 线性减淡
      linearDodge: function(A, B) {
        var rtv = A + B;

        return rtv > 0 ? roundDecimal(rtv) : 0;
      }
    };
  }

  /**
   * [getRgb 返回rgb]
   * @param  {[type]} effect    [description]
   * @param  {[type]} colorRgb1 [description]
   * @param  {[type]} colorRgb2 [description]
   * @return {[type]}           [description]
   */
  function getRgb(effect, colorRgb1, colorRgb2) {
    var rtv = 'rgb(' + [
      allEffect[effect](colorRgb1.r, colorRgb2.r),
      allEffect[effect](colorRgb1.g, colorRgb2.g),
      allEffect[effect](colorRgb1.b, colorRgb2.b)
    ].join(',') + ')';

    rtv = colorConvert(rtv);

    return rtv.hex;
  }
}


/**
 * [colorConvert 颜色转换]
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
function colorConvert(str) {
  var json = {
      hex: '',
      rgb: '',
      hexa: '',
      rgba: '',
      op: 1,
      r: '',
      g: '',
      b: ''
    },
    name2hex = {
      black: '#000000',
      silver: '#c0c0c0',
      maroon: '#800000',
      red: '#ff0000',
      navy: '#000080',
      blue: '#0000ff',
      purple: '#800080',
      fuchsia: '#ff00ff',
      green: '#008000',
      lime: '#00ff00',
      olive: '#808000',
      yellow: '#ffff00',
      teal: '#008080',
      aqua: '#00ffff',
      gray: '#808080',
      white: '#ffffff'
    },
    arr;

  if (name2hex[str]) {
    str = name2hex[str]
  }

  function componentToHex(c) {
      var hex = (+c).toString(16);

      return padLeft(hex, 2);
  }

  str = str.replace(/(\(|\))/g, '');
  arr = str.split(',');

  if (arr.length % 2 == 0) {
    json.op = arr[arr.length - 1];
    str = arr.slice(0, arr.length - 1).join(',');
  }

  if (arr.length > 2) {
    arr = str.replace(/rgba?/g, '').split(',');
    json.r = arr[0];
    json.g = arr[1];
    json.b = arr[2];

    json.rgb = 'rgb(' + arr.join(',') + ')';
    arr.push(json.op)
    json.rgba = 'rgba(' + arr + ')';
    var hex = arr.map(function(n) {
      return componentToHex(n);
    }).join('').slice(0, 6);
    json.hex = '#' + hex;
    json.hexa = '#' + (getOpacity(json.op) + '') + hex;
  } else {
    arr = str.replace(/#/, '').split('');
    if (arr.length == 5 || arr.length == 8) {
      json.op = roundDecimal(parseInt(arr.slice(0, 2).join(''), 16) / 255, 1);
      arr = arr.slice(2);
    }
    var newArr = [];
    if (arr.length == 3) {
      arr = arr.map(function(n) {
        return [n, n];
      });
    }
    var hex = arr.join('');
    for (var i = 0; i < 6; i += 2) {
      newArr.push(parseInt('0x' + hex.slice(i, i + 2)));
    }

    json.r = newArr[0];
    json.g = newArr[1];
    json.b = newArr[2];

    json.rgb = 'rgb(' + newArr + ')';
    newArr.push(json.op);
    json.rgba = 'rgba(' + newArr + ')';
    json.hex = '#' + hex;
    json.hexa = '#' + (getOpacity(json.op) + '') + hex;
  }
  return json;

  function getOpacity(num) {
    return padLeft((+parseInt(num * 255, 10)).toString(16), 2);
  }
}

/**
 * [padLeft 左边补充0]
 * @param  {[type]} str [description]
 * @param  {[type]} len [description]
 * @return {[type]}     [description]
 */
function padLeft(str, len) {
  if (str.length >= len) return str;
  return padLeft('0' + str, len);
}

/**
 * [roundDecimal 四舍五入]
 * @param  {[type]} val       [description]
 * @param  {[type]} precision [description]
 * @return {[type]}           [description]
 */
function roundDecimal(val, precision) {
  return Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) / Math.pow(10, (precision || 0));
}

export default ColorOverlay;
