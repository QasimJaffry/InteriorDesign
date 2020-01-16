import React from 'react';
import {View, Text, StyleSheet, Dimensions,ToastAndroid, StatusBar,Item, Platform, TextInput, KeyboardAvoidingView, TouchableOpacity, YellowBox, Alert, ActivityIndicator} from 'react-native';
import Animated, {Easing} from 'react-native-reanimated'
import {TapGestureHandler, State} from 'react-native-gesture-handler' 
import Svg, {Image, Circle, ClipPath} from 'react-native-svg'

import Firebase, {db} from '../config/Firebase.js'
import AsyncStorage from '@react-native-community/async-storage';

import { Icon, Row, Button } from 'native-base'
import { TextField } from 'react-native-material-textfield';

let {width, height} = Dimensions.get('window')

const {Value, event, block, cond, eq, set, Clock, startClock, stopClock, debug, timing, clockRunning, interpolate, Extrapolate, concat} = Animated
console.disableYellowBox = true;
console.ignoredYellowBox = ['Warning: Setting a timer'];
function runTiming(clock, value, dest) {
    const state = {
      finished: new Value(0),
      position: new Value(0),
      time: new Value(0),
      frameTime: new Value(0)
    };
  
    const config = {
      duration: 1000,
      toValue: new Value(0),
      easing: Easing.inOut(Easing.ease)
    };
  
    return block([
      cond(clockRunning(clock), 0, [
        set(state.finished, 0),
        set(state.time, 0),
        set(state.position, value),
        set(state.frameTime, 0),
        set(config.toValue, dest),
        startClock(clock)
      ]),
      timing(clock, state, config),
      cond(state.finished, debug('stop clock', stopClock(clock))),
      state.position
    ]);
  }


export default class Login extends React.Component {
    
    constructor(){
        super();

        this.state = {
            email: '',
            password: '',
            signout: false,
            isValid: null,
            show: false,
            correct: false,
            icEye: 'md-eye-off',
            showPassword: true,
            errorMessage: null,
            isLoading: false
        }
        this.emailRef = this.updateRef.bind(this, 'email');
        this.onSubmitEmail = this.onSubmitEmail.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.onSubmitPassword = this.onSubmitPassword.bind(this);
        this.onAccessoryPress = this.onAccessoryPress.bind(this);
        this.buttonOpacity = new Value(1);
        this.passwordRef = this.updateRef.bind(this, 'password');
        this.onStateChange = event([
            {
                nativeEvent:({state})=>
                block([
                    cond(
                        eq(state,State.END),
                        set(this.buttonOpacity,
                        runTiming(new Clock(), 1, 0) )),
                        console.log("hello")
                ])
                
            }
            
        ]);

        this.onCloseState = event([
            {
                nativeEvent:({state})=>
                block([
                    cond(
                        eq(state,State.END),
                        set(this.buttonOpacity,
                        runTiming(new Clock(), 0, 1) ))
                
                ])
            }
        ]);

        this.buttonY = interpolate(this.buttonOpacity, {
            inputRange:[0,1],
            outputRange:[100,0],
            extrapolate: Extrapolate.CLAMP
        })

        this.bgY = interpolate(this.buttonOpacity, {
            inputRange:[0,1],
            outputRange:[-height/2 - 190,0],
            extrapolate: Extrapolate.CLAMP
        })

        this.textInputZindex = interpolate(this.buttonOpacity, {
            inputRange:[0,1],
            outputRange:[1,-1],
            extrapolate: Extrapolate.CLAMP
        })

        this.textInputY = interpolate(this.buttonOpacity, {
            inputRange:[0,1],
            outputRange:[0,100],
            extrapolate: Extrapolate.CLAMP
        })

        this.textInputOpacity = interpolate(this.buttonOpacity, {
            inputRange:[0,1],
            outputRange:[1,0],
            extrapolate: Extrapolate.CLAMP
        })

        this.rotateCross = interpolate(this.buttonOpacity, {
            inputRange:[0,1],
            outputRange:[180,360],
            extrapolate: Extrapolate.CLAMP
        })
    }

    loginHandle = () => {
       this.props.login()
      // this.props.navigation.navigate('Home')
       
    }
    updateRef(name, ref) {
        this[name] = ref;
      }
    async getToken(user) {
        try {
          let userData = await AsyncStorage.getItem("userData");
          let data = JSON.parse(userData);
  
          console.log(data);
        } catch (error) {
          console.log("Something went wrong", error);
        }
      }
  
      login = (email, pass) => {
  
        return async () => {
          try {
            
           // let userData = await AsyncStorage.setItem("userData");
           let userData = await AsyncStorage.getItem("userData");
           let data = JSON.parse(userData);
  
           if(data === null) {
  
           const response = await Firebase
            .auth()
            .signInWithEmailAndPassword(email, pass)
            .then(() => this.props.navigation.navigate('Home'))
            .catch(function(error) {
               // Alert.alert(error)
              });              
  
            if (response.user.uid) {
              const user = {
                  uid: response.user.uid,
                  email: email,
                  name: response.user.name,
                  password: pass
              }
  
            await AsyncStorage.setItem("userData", JSON.stringify(user));
           // this.props.navigation.navigate('Home')
           
            console.log("Firebase signin");
  
            }} else {
  
              let userData = await AsyncStorage.getItem("userData");
              let data = JSON.parse(userData);
  
              if(email === data.email && pass === data.password){
                console.log("success");
                this.props.navigation.navigate('Home')
                
              }
            }
  
            
          } catch (error) {
            console.log("Something went wrong", error);
          
          }
        }
      }

    
    ShowHideComponent = () => {
        if (this.state.show == true) {
          this.setState({ show: false });
        } else {
          this.setState({ show: true });
        }
      };

    onHandlePassword = (password) => {
        this.state.password
        this.ShowHideComponent()
    }
     /* login = (email, pass) => {
          Firebase
            .auth()
            .signInWithEmailAndPassword(email, pass)
            .then(res => {
              alert(res.user.email);
            }).then(res => {
              this.storeToken(JSON.stringify(res.user));
            }).then(
                this.props.navigation.navigate('Home')
            )
            .catch(error => {
              // Handle Errors here.
              console.log("addasad", error.message);
              
            });
      };
  
      componentDidMount() {
          this.getToken();
       }
  
  
       async storeToken(user) {
          try {
             await AsyncStorage.setItem("userData", JSON.stringify(user));
          } catch (error) {
            console.log("Something went wrong", error);
          }
        } */

        changePwdType = () => {
            let newState;
            if (this.state.showPassword) {
                newState = {
                    icEye: 'md-eye',
                    showPassword: false,
                    password: this.state.password
                }
            } else {
                newState = {
                    icEye: 'md-eye-off',
                    showPassword: true,
                    password: this.state.password
                }
            }
            // set new state value
            this.setState(newState)
        };

        onChangeText(text) {
            ['email', 'password']
            .map((name) => ({ name, ref: this[name] }))
            .forEach(({ name, ref }) => {
              if (ref.isFocused()) {
                this.setState({ [name]: text });
              }
            });
            let newState = {
                icEye: this.state.icEye,
                showPassword: this.state.showPassword,
               // password: password
            }
            this.setState(newState);   
          }

          onFocus() {
            let { errors = {} } = this.state;
      
            for (let name in errors) {
              let ref = this[name];
      
              if (ref && ref.isFocused()) {
                delete errors[name];
              }
            }
      
            this.setState({ errors });
          }
        fieldRef = React.createRef();

        onSubmit(email, pass) {
            let errors = {};
            return async () => {
 
                    ['email', 'password']
                    .forEach((name) => {
                      let value = this[name].value();
                        
                      /*if (!value) {
                        errors[name] = 'Should not be empty';
                        this.setState({correct: false})
                      } else {
                        if ('password' === name && value.length < 6) {
                          errors[name] = 'Too short';
                          this.setState({correct: false})
                        }
                      }*/
                      this.setState({correct: true})
                    });
            
                  this.setState({ errors });   
                 // let userData = await AsyncStorage.setItem("userData");
                 if(this.state.correct === true){
                    
                try {
                    
                 let userData = await AsyncStorage.getItem("userData");
                 let data = JSON.parse(userData);
                    
                 if(data === null) {
        
                 const response = await Firebase
                  .auth()
                  .signInWithEmailAndPassword(email, pass)
                  .then((response)=> {
                    if (response.user.uid) {
                      const user = {
                          uid: response.user.uid,
                          email: email,
                          name: response.user.name,
                          password: pass
                      }
          
                    AsyncStorage.setItem("userData", JSON.stringify(user));
                    
                    //this.setState({isLoading: true})
                    console.log("Firebase signin");
          
                    }
                  })
                  .then(<View style={styles.container}>
                    <Text style={{color:'#e93766', fontSize: 40}}>Loading</Text>
                    <ActivityIndicator color='#e93766' size="large" />
                  </View>)
                  .then(() => this.props.navigation.navigate('Home'))
                  .catch(error => this.setState({ errorMessage: error.message }))
                  
              } else {
        
                    let userData = await AsyncStorage.getItem("userData");
                    let data = JSON.parse(userData);
        
                    if(email === data.email && pass === data.password){
                      console.log("success");
                      this.props.navigation.navigate('Home')
                      
                    }
                  }

                } catch (error) {
                  console.log("Something went wrong", error);
                
                }}
          }
        }

        formatText = (text) => {
            return text.replace(/[^+\d]/g, '');
        };
        onSubmitEmail() {
            this.password.focus();
          }

          

          onAccessoryPress() {
            this.setState(({ secureTextEntry }) => ({ secureTextEntry: !secureTextEntry }));
          }
          onSubmitPassword() {
            this.password.blur();
          }
          
    render() {
        const { isValid } = this.state;
        let { errors = {}, secureTextEntry, ...data } = this.state;
        return (

            <View style={{flex: 1, backgroundColor: 'white', justifyContent: "flex-end"}}>
               <Animated.View style={{...StyleSheet.absoluteFill, transform: [
                   {
                       translateY: this.bgY
                   }
               ]}}>
                   <Svg height={height + 50} width={width}>
                       <ClipPath id="clip">
                            <Circle r={height + 50}  cx={width/2} />
                       </ClipPath>
                        <Image 
                            href={require('../media/bg.jpeg')}
                            width={width}
                            height={height + 50}
                            preserveAspectRatio='xMidYMid slice'
                            clipPath="url(#clip)"
                        />
                    </Svg>
               </Animated.View>
               <View style={{height: height/3, justifyContent:'center' }}>

                    <TapGestureHandler onHandlerStateChange={this.onStateChange}>
                        <Animated.View style={{...styles.button, opacity: this.buttonOpacity,
                        transform:[{translateY: this.buttonY}]}}> 
                            <Text style={{fontSize: 20, fontWeight: 'bold'}}>SIGN IN</Text>
                        </Animated.View>
                    </TapGestureHandler>
                    
                    
                    <Animated.View style={{...styles.button,
                         opacity: this.buttonOpacity, transform:[
                             {
                                 translateY: this.buttonY
                             }
                         ]}}> 
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}
                        onPress={() => this.props.navigation.navigate('SignUp')}>SIGN UP</Text>
                    </Animated.View>
                     
                    <Animated.View style={{
                        opacity: this.textInputOpacity, 
                        zIndex: this.textInputZindex, 
                        height: height, ...StyleSheet.absoluteFill, 
                        top:null, 
                        justifyContent: 'center',
                        paddingTop: 90,
                        
                        transform: [{translateY: this.textInputY}]}}>
                            
                         <TapGestureHandler onHandlerStateChange={this.onCloseState}>
                             <Animated.View style={styles.closeButton}>
                                 <Animated.Text style={{fontSize: 15, transform:[{rotate: concat(this.rotateCross, 'deg')}] }}>
                                     X
                                 </Animated.Text>
                             </Animated.View>
                         </TapGestureHandler>
                        
                        
                      

                        
                         {this.state.errorMessage &&
                          <Text style={{ color: 'red', alignSelf: 'center', bottom: 5 , paddingTop: 5}}>
                            {this.state.errorMessage}
                          </Text>}

                        <TextField
                            ref={this.emailRef}
                            containerStyle={{marginLeft: 10, marginRight:10}}
                            inputContainerStyle	={{...styles.textInput1}}
                         // defaultValue={this.state.email}
                            keyboardType='email-address'
                            autoCapitalize='none'
                            autoCorrect={false}
                            activeLineWidth={2}
                            //lineWidth={1}
                            enablesReturnKeyAutomatically={true}
                            underlineColorAndroid='transparent'
                            onChangeText={this.onChangeText}
                            onSubmitEditing={this.onSubmitEmail}
                            returnKeyType='next'
                            onFocus={this.onFocus}
                            placeholder='Email Address'
                            placeholderTextColor= 'black'
                            error={errors.email}
                        />
 
                        <TextField
                                ref={this.passwordRef}
                                secureTextEntry={this.state.showPassword}
                                containerStyle={{marginLeft: 10, marginRight:10}}
                                inputContainerStyle	={{...styles.textInput1}}
                                autoCapitalize='none'
                                autoCorrect={false}
                                enablesReturnKeyAutomatically={true}
                                clearTextOnFocus={true}
                                onFocus={this.onFocus}
                                onChangeText={this.onChangeText}
                                onSubmitEditing={this.onSubmitPassword}
                                returnKeyType='done'
                                placeholder='Password'
                                placeholderTextColor= 'black'
                                error={errors.password}
                                
                            // renderRightAccessory={this.renderPasswordAccessory}
                          //  style={{position: 'absolute', right: 40, top: height/2}}
                            />
                             <Icon name={this.state.icEye}  style={{  left: width-50, top:-45}}
                             onPress={this.changePwdType}></Icon>    
                      

                        
                           
                        
                        
                         <Animated.View style={styles.button}  >
                            
                                <Text style={{fontSize:20, fontWeight: 'bold'}}
                                   onPress={this.onSubmit(this.state.email, this.state.password)}
                                   >
                                    SIGN IN
                                </Text>

                         

                         </Animated.View>

                       <Animated.View style={{alignItems: 'center', justifyContent: 'center', top: 20}}>

                       
                      
        <Button rounded  
             
             style={{backgroundColor:'white', justifyContent: 'center', paddingRight: 20, paddingLeft: 20}}
             >
               <Text style={{fontSize: 17, color: '#880088', fontWeight:'bold'}}
          onPress={()=> this.props.navigation.navigate("ForgotPassword")}
               >
                 Forgot Password?
               </Text>
             </Button>
                      </Animated.View>
                    </Animated.View>
                  
               </View>
            </View>
          
        );
    }
}


const styles = StyleSheet.create({
    container: {
      flex: 1
        
    },
    button: {
        backgroundColor: 'white',
        height: 70,
        marginTop: 20,
        marginHorizontal: 20,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
    },
    textInput: {
        height: 50,
        borderRadius: 25,
        borderWidth: 0.5,
        marginHorizontal: 20,
        paddingLeft: 10,
        marginVertical: 5,
        marginLeft: 5,
        borderColor: 'rgba(0,0,0,0.2)',
    },
    
    textInput1: {
      //  marginTop: 10,
        height: 50,
        borderRadius: 8,
        borderWidth: 0.5,
        paddingLeft: 5,
        textAlignVertical: 'center',
        paddingBottom: 15,
        borderColor: 'rgba(0,0,0,0.2)',
    },
    closeButton: {
        height: 40,
        width: 40,
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: height /2 - 150,
        left: width / 2 - 20
    }

});

/*const mapDispatchToProps = dispatch => {
    return bindActionCreators({ getUser }, dispatch)
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login)*/