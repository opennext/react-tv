import React, { Component } from 'react'
import { Focusable, focus } from './_index'
import './App.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className='box-container'>
          <Focusable name='focusable-1' className='box' initialFocus={true} onBlurred={() => {
            console.log('onBlurred...')
            }}
            onFocused={() => {
              console.log('onFocused...')
            }}
            onSelected={() => {
              console.log('onSelected...')
            }}
          >
            <div>F1</div>
          </Focusable>

          <Focusable name='focusable-2' className='box' onFocused={() => {
            console.log('onFocused...2')
          }}><div>F2</div></Focusable>

          <Focusable name='focusable-3' className='box' onFocused={() => {
            console.log('onFocused...3')
          }}><div>F3</div></Focusable>
        </div>
      </div>
    );
  }
}

export default App;
