import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {Constant,setCurrentFocusItem } from './focus'
//import focus from './focus'
//Constant = focus.Constant
//setCurrentFocusItem = focus.setCurrentFocusItem
import nearestFocusableFinder from './nearestFocusableFinder'

class Focusable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      focusState: Constant.FOCUS_STATE.BLURRED
    }
  }
  componentWillMount() {
    //if (!nearestFocusableFinder.$$get(Util.getData(this).name)) {
    nearestFocusableFinder.$$put(this, this.props.name)
    //}
  }
  componentDidMount() {
    this.props.initialFocus === true && setCurrentFocusItem(this)
  }
  render() {
    return (
      <div ref={(div) => { this.focusableDOM = div }}
        className={this.props.className + ' ' + Constant.CLASS_NAMES[this.state.focusState]}>
        {this.props.contentEditable ? null : this.props.children}
      </div>
    )
  }
}

Focusable.defaultProps = {
  initialFocus: false,
}

Focusable.propTypes = {
  initialFocus: PropTypes.bool,
  onBlurred: PropTypes.func,
  onFocused: PropTypes.func,
  onSelected: PropTypes.func,
  className: PropTypes.string,
}

export default Focusable