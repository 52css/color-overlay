/*
* @Author: weijie
* @Date:   2016-08-16 16:43:45
* @Last Modified by:   weijie
* @Last Modified time: 2016-08-17 08:43:02
*/

require('styles/App.css');

import React from 'react';


class ColorSelectComponent extends React.Component {
  handleClick(e) {
    // 如果点击的是当前正在选中态的按钮，则翻转图片，否则将对应的图片居中
    this.props.handlerChangeColor1();
    e.preventDefault();
    e.stopPropagation();
  }
  render() {
    var myStyle = {

    };
    var bgColor = this.props.data.key;
    var className = 'ly-color-select';

    myStyle.backgroundColor = bgColor;

    if (this.props.data.selected) {
      className += ' is-selected';
    }

    return (
      <span style={myStyle} className={className} onClick={this.handleClick.bind(this)}></span>
    );
  }
}

ColorSelectComponent.defaultProps = {
};

export default ColorSelectComponent;
