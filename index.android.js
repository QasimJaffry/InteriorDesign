// import { AppRegistry } from 'react-native';
import App from './App.js';
import {name as appName} from './app.json';
//import App from './components/App'
// //AppRegistry.registerComponent(appName, () => App);

// // The below line is necessary for use with the TestBed App
// AppRegistry.registerComponent('ViroSample', () => App);

/**
 * Copyright (c) 2015-present, Viro, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */


import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
//import App from './components/App';
var reducers = require('./components/reducers')

import {
  AppRegistry
} from 'react-native';

let store = createStore(reducers);

export default class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    )
  }
}

AppRegistry.registerComponent(appName, () => Root);