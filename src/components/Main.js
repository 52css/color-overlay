require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
let colorOverlay = require('actions/colorOverlay');
let ColorSelectComponent = require('components/ColorSelect').default;



class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedEffect: 'colorDeepening',
      color1Options: [
        {
          key: '#f27825',
          selected: true
        },
        {
          key: '#ffe135'
        },
        {
          key: '#b7cc33'
        },
        {
          key: '#36cc68'
        },
        {
          key: '#33cbcc'
        },
        {
          key: '#3636cc'
        },
        {
          key: '#cc36cd'
        },
        {
          key: '#cc3637'
        }
      ],
      color2: '#cccccc',
      color3: ''
    }
  }
  handleChange2(e) {
    var tar = e.target;
    var selectedEffect = tar.value;
    var color1 = this.getSelectedColor1();

    this.setState({
      selectedEffect: selectedEffect,
      color3: colorOverlay.default(selectedEffect, color1, this.state.color2)
    });
  }
  handlerChangeColor1(item) {
    return function () {
      this.changeColor1(item);
    }.bind(this);
  }
  changeColor1(color1) {
    var color1Options = this.state.color1Options;

    color1Options.forEach(function(item) {
      item.selected = item.key === color1;
    });

    this.setState({
      color1Options: color1Options,
      color3: colorOverlay.default(this.state.selectedEffect, color1, this.state.color2)
    });
  }
  getSelectedColor1() {
    return this.state.color1Options.filter((item) => {
      return item.selected;
    })[0].key;
  }
  handlerChangeColor2(event) {
    var tag = event.target,
      color1 = this.getSelectedColor1(),
      color2 = tag.value;

    this.setState({
      color2: color2,
      color3: colorOverlay.default(this.state.selectedEffect, color1, color2)
    });
  }
  componentDidMount() {
    var color1 = this.getSelectedColor1();

    console.log(color1);

    this.setState({
      color3: colorOverlay.default(this.state.selectedEffect, color1, this.state.color2)
    });
  }
  render() {
    var effects = [
      {
        value: 'darker', label: '变暗'
      },
      {
        value: 'lighter', label: '变亮'
      },
      {
        value: 'multiply', label: '正片叠底'
      },
      {
        value: 'colorDeepening', label: '颜色加深'
      },
      {
        value: 'linearDarker', label: '线性加深'
      },
      {
        value: 'colorFilter', label: '滤色'
      },
      {
        value: 'colorDodge', label: '颜色减淡'
      },
      {
        value: 'linearDodge', label: '线性减淡'
      }
    ];
    var resultStyle = {
      width: '100px',
      height: '100px',
      'display': 'inline-block',
      'background-color': this.state.color3
    }

    return (
      <div className="index">
        <form className="ly-form">
          <label className="ly-label">效果</label>
          <select className="ly-control" value={this.state.selectedEffect} onChange={this.handleChange2.bind(this)}>
            {effects.map((item) => {
              return <option value={item.value}>{item.label}</option>
            })}
          </select>
          <label className="ly-label">颜色1范围</label>
          <div className="">
            {this.state.color1Options.map((item) => {
              return <ColorSelectComponent
               key={item.key}
               data={item}
               handlerChangeColor1={this.handlerChangeColor1(item.key)}/>;
            })}
          </div>
          <label className="ly-label">颜色2</label>
          <input className="ly-control" type="color" value={this.state.color2} onChange={this.handlerChangeColor2.bind(this)}/>
          <label className="ly-label ly-result">返回颜色</label>
          <div>
            <span style={resultStyle}></span>
          </div>
        </form>
        <div className="notice">Please edit <code>src/components/Main.js</code> to get started!</div>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
