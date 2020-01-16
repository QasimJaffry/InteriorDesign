

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {StyleSheet,
        TouchableHighlight,
        Animated,
        Easing,
        Image,
        View,
        } from 'react-native';
import renderIf from './helpers/renderIf';

/*
 * Class for Succesful AR Tracking initializing animation.
 */
class SuccessAnimation extends Component {
  constructor(props) {
    super(props);
    this.scaleValue = new Animated.Value(0);
    this.fadeInValue = new Animated.Value(0);

    // Bindings
    this.fadeAndScale = this.fadeAndScale.bind(this);
    this._onPress = this._onPress.bind(this);

    var imgSource = this.props.stateImageArray[1];
    var imgClickSource = this.props.stateImageArray[0];

    this.buttonScale = this.scaleValue.interpolate({
      inputRange: [0, 0.8, 1],
      outputRange: [1, 1.2, 1]
    });
    this.buttonOpacity = this.fadeInValue.interpolate({
      inputRange: [0, 0.085, 0.915, 1],
      outputRange: [0,1, 1, 0]
    });

  }
  componentDidMount() {
    this.fadeAndScale();
  }
  render() {
    return (
      <TouchableHighlight underlayColor="#00000000" onPress={this._onPress}>
        <View>
          <Animated.Image 
              source={this.props.stateImageArray[0]}
              style={[this.props.style,{opacity: this.buttonOpacity},
                        {
                          transform:[
                            {scale: this.buttonScale}
                          ]
                        }
                    ]} />
        </View>
      </TouchableHighlight>
      );
  }

  _onPress() {
    // Picked from here https://facebook.github.io/react-native/docs/performance.html#my-touchablex-view-isn-t-very-responsive
    requestAnimationFrame(() => {
      this.props.onPress();   
    });
  }
  fadeAndScale() {
    this.scaleValue.setValue(0);
    Animated.parallel([
      Animated.timing(
        this.scaleValue,
        {
          toValue: 1,
          duration: 300,
          easing: Easing.easeInOutBack,
          useNativeDriver: true,
        }
      ),
      Animated.timing(
        this.fadeInValue,
        {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true, 
        }
      )
    ]).start(this.props.onFinish);
  }
}


SuccessAnimation.propTypes = {
        onPress: PropTypes.func.isRequired,
        stateImageArray: PropTypes.array.isRequired,
        style: PropTypes.any,
        selected: PropTypes.bool,
        onFinish: PropTypes.func
};

export default SuccessAnimation;
