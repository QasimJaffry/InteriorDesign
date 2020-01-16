
import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as LoadingConstants from './js/LoadingStateConstants';
import * as UIConstants from './js/UIConstants';
import ModelItemRender from './js/ModelItemRender';


import { ARTrackingInitialized } from './actions/user';

import {
  ViroARScene,
  ViroConstants,
  ViroMaterials,
  ViroAmbientLight,
  ViroDirectionalLight,
  ViroSpotLight
} from 'react-viro';

import renderIf from './js/helpers/renderIf';


export class figment extends Component {

  constructor(props) {
    super(props);

    this.state = {
      text : "not tapped",
      currentObj: 0,
      isLoading: false,
      scaleSurface: [1,1,1],
    }

    this._renderModels = this._renderModels.bind(this);

   // this._renderEffects = this._renderEffects.bind(this);
    this._onTrackingUpdated = this._onTrackingUpdated.bind(this);
    this._performARHitTest = this._performARHitTest.bind(this);
    this._onLoadCallback = this._onLoadCallback.bind(this);
    this._onModelsClickStateCallback = this._onModelsClickStateCallback.bind(this);

  }

  render() {
    // the starting bitmask is 2 because the default is 1 (2^0 = 1)
    let startingBitMask = 2;
    // fetch models
    let models = this._renderModels(this.props.modelItems, startingBitMask);
    // increment startingBitMask by the number of models
    startingBitMask += Object.keys(this.props.modelItems).length;
  
    return (
        <ViroARScene ref="arscene" physicsWorld={{gravity:[0, -9.81, 0]}} postProcessEffects={[this.props.postProcessEffects]}
            onTrackingUpdated={this._onTrackingUpdated}>
          <ViroAmbientLight color="#ffffff" intensity={20}/>
          
          {/* DirectionalLight with the direction away from the user, pointed upwards, to light up the "face" of the model */}
          <ViroDirectionalLight color="#ffffff" direction={[0,-1,-.2]}/>
          
          {/* Spotlight on top of the model to highlight this model*/}
          <ViroSpotLight
            innerAngle={5}
            outerAngle={90}
            direction={[0,1,0]}
            position={[0, -7, 0]}
            color="#ffffff"
            intensity={250}/>
          {models}
         
          
        </ViroARScene>
    );
  }

  // Render models added to the scene. 
  // modelItems - list of models added by user; comes from redux, see js/redux/reducers/arobjects.js
  // startingBitMask - used for adding shadows for each of the, for each new object added to the scene,
  //           pass a bitMask as {Math.pow(2,objBitMask)}. This is done since each object has it's own 
  //           spotlight and a corresponding shadow plane. So each new set of these components are assigned a 
  //           consistent bitMask that's used in SpotLight's "influenceBitMask",
  //           Viro3DObject's "shadowCastingBitMask" and "lightReceivingBitMask" and Shadow plane (ViroQuad)'s "lightReceivingBitMask"
  _renderModels(modelItems, startingBitMask) {
    var renderedObjects = [];
    if(modelItems) {
      var root = this;
      let objBitMask = startingBitMask;
      Object.keys(modelItems).forEach(function(currentKey) {
        if(modelItems[currentKey] != null && modelItems[currentKey] != undefined) {
          renderedObjects.push(
            <ModelItemRender key={modelItems[currentKey].uuid}
              modelIDProps={modelItems[currentKey]}
              hitTestMethod={root._performARHitTest}
              onLoadCallback={root._onLoadCallback}
              onClickStateCallback={root._onModelsClickStateCallback}
              bitMask={Math.pow(2,objBitMask)} />
          );
        }
        objBitMask++;
      });

    }
    return renderedObjects;
  }

  // Callback fired when the app receives AR Tracking state changes from ViroARScene.
  // If the tracking state is not NORMAL -> show the user AR Initialization animation 
  // to guide them to move the device around to get better AR tracking.
  _onTrackingUpdated(state, reason) {
    var trackingNormal = false;
    if (state == ViroConstants.TRACKING_NORMAL) {
      trackingNormal = true;
    } 
    this.props.dispatchARTrackingInitialized(trackingNormal);
  }
  
  // Performed to find the correct position where to place a new object being added to the scene
  // Get's camera's current orientation, and performs an AR Hit Test with Ray along the camera's orientation
  // the object is then placed at the intersection of the Ray and identified AR point returned by the system
  // along that ray.
  _performARHitTest(callback) {
    this.refs["arscene"].getCameraOrientationAsync().then((orientation) => {
      this.refs["arscene"].performARHitTestWithRay(orientation.forward).then((results)=>{
        callback(orientation.position, orientation.forward, results);
      })
    });
  }

  _onLoadCallback(uuid, loadState) {
    this.props.arSceneNavigator.viroAppProps.loadingObjectCallback(uuid, loadState);
  }
  _onModelsClickStateCallback(uuid, clickState, itemType) {
    this.props.arSceneNavigator.viroAppProps.clickStateCallback(uuid, clickState, itemType);
  }

}

ViroMaterials.createMaterials({
  shadowCatcher: {
    writesToDepthBuffer: false,
    readsFromDepthBuffer: false,
    diffuseColor: "#ff9999"

  },
  ground: {
    lightingModel: "Lambert",
    cullMode: "None",
    shininess: 2.0,
    diffuseColor: "#ff999900"
  },
  theatre: {
    diffuseTexture: require('./js/res/360_dark_theatre.jpg'),
  },
});

// -- REDUX STORE
function selectProps(store) {
  return {
    modelItems: store.arobjects.modelItems,

  //  effectItems: store.arobjects.effectItems,
//    postProcessEffects: store.arobjects.postProcessEffects,
  };
}

// -- dispatch REDUX ACTIONS map
const mapDispatchToProps = (dispatch) => {
  return {
    dispatchARTrackingInitialized:(trackingNormal) => dispatch(ARTrackingInitialized(trackingNormal)),
  }
}
module.exports = connect(selectProps, mapDispatchToProps)(figment);
