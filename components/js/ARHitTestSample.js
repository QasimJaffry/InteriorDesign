
import React, { Component } from 'react';

import {
  ViroARScene,
  ViroAmbientLight,
  ViroARPlane,
  ViroMaterials,
  ViroNode,
  ViroUtils,
  ViroQuad,
  ViroSpotLight,
  Viro3DObject,
  ViroAnimations,
} from 'react-viro';

import TimerMixin from 'react-timer-mixin';
import PropTypes from 'prop-types';

var createReactClass = require('create-react-class');

var ARHitTestSample = createReactClass({
  mixins: [TimerMixin],

  getInitialState: function() {
    return {
      objPosition:[0.0, 0.0, 0.0],
      scale:[1.5, 1.5, 1.5],
      rotation:[0,0,0],
      shouldBillboard : true,
    }
  },

  render: function() {
    return (
      <ViroARScene ref="arscene" onTrackingUpdated={this._onTrackInit}>
          <ViroAmbientLight color="#ffffff" intensity={200}/>
          {this._getModel()}
      </ViroARScene>
    );
  },

  _getModel() {
    var modelArray = [];
    if(!this.props.arSceneNavigator.viroAppProps.displayObject || this.props.arSceneNavigator.viroAppProps.displayObjectName === undefined) {
      return;
    }

    let transformBehaviors = {};
    if (this.state.shouldBillboard) {
      transformBehaviors.transformBehaviors = this.state.shouldBillboard ? "billboardY" : [];
    }

     var bitMask = 4;
      modelArray.push(<ViroNode
        {...transformBehaviors}
        visible={this.props.arSceneNavigator.viroAppProps.displayObject}
       // position={[2.0, 0.0, -2.0]}
     //  position={[0, 0, -2]}
       //   scale={[1, 1, 1]}
       dragType="FixedToWorld" key={this.props.arSceneNavigator.viroAppProps.displayObjectName}
       position={this.state.objPosition}
       scale={this.state.scale}
        
        ref={this._setARNodeRef}
        
        rotation={this.state.rotation}
       >

        <ViroSpotLight
          innerAngle={25}
          outerAngle={140}
          direction={[0,-1,0]}
          position={[0, 5, 0]}
          color="#FFFFFF"
          shadowMapSize={2048}
          castsShadow={true}
          shadowNearZ={.1}
          shadowFarZ={6}
          shadowOpacity={.9}
          ref={this._setSpotLightRef}/>

        <Viro3DObject
         position={[0, this.props.arSceneNavigator.viroAppProps.yOffset, 0]}
          source={this.props.arSceneNavigator.viroAppProps.objectSource}
         scale={[0.1, 0.1, 0.1]}
          resources={[ require('./res/model/untitled.mtl'),
         
         // require('./res/OldChair/obj/Marmite.jpg')
                ]}
          onDrag={()=>{}}     
          //materials="scene"
          type = "OBJ" onLoadEnd={this._onLoadEnd} onLoadStart={this._onLoadStart}
          onRotate={this._onRotate}
          onPinch={this._onPinch} />

        <ViroQuad
            rotation={[-90, 0, 0]}
            position={[0, -.001, 0]}
            width={2.5} height={2.5}
            arShadowReceiver={true}

            ignoreEventHandling={true} />

      </ViroNode>
    );
    return modelArray;
  },

  _setARNodeRef(component) {
    this.arNodeRef = component;
  },

  _setSpotLightRef(component) {
    this.spotLight = component;
  },

  _onTrackInit() {
    this.props.arSceneNavigator.viroAppProps._onTrackingInit();
  },


  /*
   Rotation should be relative to its current rotation *not* set to the absolute
   value of the given rotationFactor.
   */
  _onRotate(rotateState, rotationFactor, source) {
    if (rotateState == 3) {
      this.setState({
        rotation : [this.state.rotation[0], this.state.rotation[1] + rotationFactor, this.state.rotation[2]]
      })
      return;
    }

    this.arNodeRef.setNativeProps({rotation:[this.state.rotation[0], this.state.rotation[1] + rotationFactor, this.state.rotation[2]]});
  },

  /*
   Pinch scaling should be relative to its last value *not* the absolute value of the
   scale factor. So while the pinching is ongoing set scale through setNativeProps
   and multiply the state by that factor. At the end of a pinch event, set the state
   to the final value and store it in state.
   */
  _onPinch(pinchState, scaleFactor, source) {
    var newScale = this.state.scale.map((x)=>{return x * scaleFactor})

    if (pinchState == 3) {
      this.setState({
        scale : newScale
      });
      return;
    }

    this.arNodeRef.setNativeProps({scale:newScale});
    this.spotLight.setNativeProps({shadowFarZ: 6 * newScale[0]});
  },

  _onLoadStart() {
    this.setState({
      shouldBillboard : true,
    });
    this.props.arSceneNavigator.viroAppProps._onLoadStart();
  },
  // Perform a hit test on load end to display object.
  _onLoadEnd() {
    this.refs["arscene"].getCameraOrientationAsync().then((orientation) => {
      this.refs["arscene"].performARHitTestWithRay(orientation.forward).then((results)=>{
          this._onArHitTestResults(orientation.position, orientation.forward, results);
      })
    });
    this.props.arSceneNavigator.viroAppProps._onLoadEnd();
  },

  _onArHitTestResults(position, forward, results) {
    // Default position is just 1.5 meters in front of the user.
    let newPosition = [forward[0] * 1.5, forward[1]* 1.5, forward[2]* 1.5];
    let hitResultPosition = undefined;

    // Filter the hit test results based on the position.
    if (results.length > 0) {
      for (var i = 0; i < results.length; i++) {
        let result = results[i];
        if (result.type == "ExistingPlaneUsingExtent") {
          var distance = Math.sqrt(((result.transform.position[0] - position[0]) * (result.transform.position[0] - position[0])) + ((result.transform.position[1] - position[1]) * (result.transform.position[1] - position[1])) + ((result.transform.position[2] - position[2]) * (result.transform.position[2] - position[2])));
          if(distance > .2 && distance < 10) {
            // If we found a plane greater than .2 and less than 10 meters away then choose it!
            hitResultPosition = result.transform.position;
            break;
          }
        } else if (result.type == "FeaturePoint" && !hitResultPosition) {
          // If we haven't found a plane and this feature point is within range, then we'll use it
          // as the initial display point.
          var distance = this._distance(position, result.transform.position);
          if (distance > .2  && distance < 10) {
            hitResultPosition = result.transform.position;
          }
        }
      }
    }

    if (hitResultPosition) {
      newPosition = hitResultPosition;
    }

    // Set the initial placement of the object using new position from the hit test.
    this._setInitialPlacement(newPosition);
  },

  _setInitialPlacement(position) {
    this.setState({
        objPosition: position,
    });
    this.setTimeout(() =>{this._updateInitialRotation()}, 200);
  },

  // Update the rotation of the object to face the user after it's positioned.
  _updateInitialRotation() {
    this.arNodeRef.getTransformAsync().then((retDict)=>{
       let rotation = retDict.rotation;
       let absX = Math.abs(rotation[0]);
       let absZ = Math.abs(rotation[2]);

       let yRotation = (rotation[1]);

       // If the X and Z aren't 0, then adjust the y rotation.
       if (absX > 1 && absZ > 1) {
         yRotation = 180 - (yRotation);
       }

       this.setState({
         rotation : [0,yRotation,0],
         shouldBillboard : false,
       });
     });
  },

  // Calculate distance between two vectors
  _distance(vectorOne, vectorTwo) {
    var distance = Math.sqrt(((vectorTwo[0] - vectorOne[0]) * (vectorTwo[0] - vectorOne[0])) + ((vectorTwo[1] - vectorOne[1]) * (vectorTwo[1] - vectorOne[1])) + ((vectorTwo[2] - vectorOne[2]) * (vectorTwo[2] - vectorOne[2])));
    return distance;
  }
});

var materials = ViroMaterials.createMaterials({
  scene : {
   // diffuseTexture: require('./js/res/OldChair/obj/objChair.mtl'),
   // diffuseTexture:  ,
    diffuseTexture:  require('./res/textures/fsl004r.jpg'),
   // specularTexture: require('./res/OldChair/obj/Marmitebump.jpg'),
   
    shininess: 2.0, 
    lightingModel: "Blinn"
  }
})


module.exports = ARHitTestSample;


