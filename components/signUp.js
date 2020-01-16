import React from 'react';
import {View, Text, StyleSheet,  Dimensions, StatusBar, Platform, TextInput, ImageBackground, TouchableOpacity, KeyboardAvoidingView} from 'react-native';
import Animated, {Easing} from 'react-native-reanimated'
import {TapGestureHandler, State} from 'react-native-gesture-handler' 
import Svg, {Image, Circle, ClipPath} from 'react-native-svg'
let {width, height} = Dimensions.get('window')
import AsyncStorage from '@react-native-community/async-storage';

import { Container, Header, Title, Left, Icon, Right, Button, Body, Content, Card, CardItem, InputGroup, Input  } from "native-base";
import Firebase, { db } from '../config/Firebase.js';
import { BarPasswordStrengthDisplay } from 'react-native-password-strength-meter';
const {Value, event, block, cond, eq, set, Clock, startClock, stopClock, debug, timing, clockRunning, interpolate, Extrapolate, concat} = Animated

import { TextField } from 'react-native-material-textfield';
export default class Signup extends React.Component {

    constructor(){
        super();
        this.onFocus = this.onFocus.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.onSubmitFirstName = this.onSubmitFirstName.bind(this);
        this.onSubmitLastName = this.onSubmitLastName.bind(this);
        this.onSubmitAbout = this.onSubmitAbout.bind(this);
        this.onSubmitEmail = this.onSubmitEmail.bind(this);
        this.onSubmitPassword = this.onSubmitPassword.bind(this);
        this.onAccessoryPress = this.onAccessoryPress.bind(this);
  
        this.firstnameRef = this.updateRef.bind(this, 'firstname');
        this.lastnameRef = this.updateRef.bind(this, 'lastname');
        this.aboutRef = this.updateRef.bind(this, 'about');
        this.emailRef = this.updateRef.bind(this, 'email');
        this.passwordRef = this.updateRef.bind(this, 'password');
        this.houseRef = this.updateRef.bind(this, 'house');
  
        this.state = {
            firstname: '',
            email: '',
            password: '',
            correct: false,
            validEmail: false,
            colorCorrect: '#0091ea',
            icEye: 'md-eye-off',
            showPassword: true,
            errorMessage: null,
            isLoading: false
        }
    }

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
  
      onChangeText(text) {
        ['firstname', 'email', 'password']
          .map((name) => ({ name, ref: this[name] }))
          .forEach(({ name, ref }) => {
            if (ref.isFocused()) {
              this.setState({ [name]: text });
            }
          });
      }
  
      onAccessoryPress() {
        this.setState(({ secureTextEntry }) => ({ secureTextEntry: !secureTextEntry }));
      }
  
      onSubmitFirstName() {
        this.email.focus();
      }
  
      onSubmitLastName() {
        this.about.focus();
      }
  
      onSubmitAbout() {
        this.email.focus();
      }
  
      onSubmitEmail() {
        this.password.focus();
      }
  
      onSubmitPassword() {
        this.password.blur();
      }

      formatEmail = (text) => {
            let re = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
            return re.test(text)
      };

      formatName = (text) => {
            let re = /^[a-z0-9_-]{3,15}$/
            return re.test(text)
      }


      sendEmailVerification(data) {
        var user = firebase.auth().currentUser;
        var email = data.email || user.email;
        return user.emailVerified || user.sendEmailVerification({
          url: window.location.href + '?email=' + user.email,
        });
      }
      

      onSubmit(firstname, email, password) {
        let errors = {};
        let hold= this.formatEmail(email)
        let nameHold = this.formatName(firstname)
        return async () => {

        ['firstname', 'email', 'password']
          .forEach((name1) => {
            let value = this[name1].value();
            
            if('email' === name1 && hold === false){
                errors[name1] = 'Email is not correctly formatted'
                
            }

          

            if (!value) {
              errors[name1] = 'Should not be empty';
            //  errors['firstname'] = 'Should not be empty';
              
            }else {
              if ('password' === name1 && value.length < 6) {
                errors[name1] = 'Too short';
                
              }
            } 
            this.setState({correct: true})
          });
  
        this.setState({ errors });

          if(this.state.correct === true){
            try {
                   // const { email, password, name } = getState().user
                    await Firebase.auth().createUserWithEmailAndPassword(email, password)
                    .then((response) => {
                      if (response.user.uid) {
                        const user = {
                            uid: response.user.uid,
                            email: email,
                            name: firstname,
                            password: password
                        }
                      
                       response.user.sendEmailVerification().then(function() {
                      // Email sent.
                        console.log("Hellooooo123")
                        AsyncStorage.setItem("userData", JSON.stringify(user));
                        db.collection('users')
                            .doc(response.user.uid)
                            .set(user)
                            
                            
                            alert("An Email has been sent to you for verification")
                       },
                        function(error) {
                      
                       })
                       
                       
                      // this.setState({isLoading: true})
                    }
                    }).then(() => this.props.navigation.navigate('Home'))
                    .catch(error => this.setState({ errorMessage: error.message }))
                    
                   
            }catch (e) {
                alert(e)
            }
            
        }}
      }
      
      updateRef(name, ref) {
        this[name] = ref;
      }

   /*signup = (name, email, password) => {
       
    return async () => {
        try {
               // const { email, password, name } = getState().user
                const response = await Firebase.auth().createUserWithEmailAndPassword(email, password)
                if (response.user.uid) {
                    const user = {
                        uid: response.user.uid,
                        email: email,
                        name: name,
                        password: password
                    }
                    console.log("asdad",name, email, password)
                    await AsyncStorage.setItem("userData", JSON.stringify(user));
                    db.collection('users')
                        .doc(response.user.uid)
                        .set(user)
                        
                       
                }
        }catch (e) {
            alert(e)
        }
        
    }}

  */
  
    signUpHandler = () => {
        this.props.signup()
        
    }

    onLoading() {
      if (this.state.isLoading === true) {
        ToastAndroid.showWithGravity(
          'SignUp Successful',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        )
      }
    }

    render() {
        let { errors = {}, secureTextEntry, ...data } = this.state;
        let { firstname, lastname } = data;
        return (

       
            <Container style={{ flex: 1,  marginTop: Platform.OS == 'ios'? 30 : 0 }}>
                 <KeyboardAvoidingView behavior={'padding'}>
            <ImageBackground source={{
                    uri: 'https://images.unsplash.com/photo-1467043153537-a4fba2cd39ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'}}
                    style={{height: '100%', width: '100%'}}>

            <Button transparent style={styles.buttonLogIN} onPress={() => {this.props.navigation.navigate('Start')}}>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                  LOG IN
                </Text>
            </Button>

            <View style={{justifyContent: 'center', flex: 1}}>
            <View style={styles.container}>

                  {this.state.errorMessage &&
                    <Text style={{ color: 'red', alignSelf: 'center', bottom: 5 , paddingTop: 5}}>
                      {this.state.errorMessage}
                    </Text>}

                    <TextField
                            ref={this.firstnameRef}
                            //value={this.state.name}
                            autoCorrect={false}
                            containerStyle={{marginLeft: 10, marginRight:10}}
                            inputContainerStyle	={{...styles.textInput1}}
                            enablesReturnKeyAutomatically={true}
                            onFocus={this.onFocus}
                            onChangeText={this.onChangeText}
                            onSubmitEditing={this.onSubmitFirstName}
                            returnKeyType='next'
                            placeholder='Name'
                            
                          //  tintColor={this.state.colorCorrect}
                            placeholderTextColor= 'black'
                            error={errors.firstname}
                    />
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
                            tintColor={this.state.colorCorrect}
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
                                maxLength={30}
                                characterRestriction={20}
                                onChangeText={this.onChangeText}
                                onSubmitEditing={this.onSubmitPassword}
                                returnKeyType='done'
                                placeholder='Password'
                                placeholderTextColor= 'black'
                                error={errors.password}
                                
                            // renderRightAccessory={this.renderPasswordAccessory}
                            />
                             <Icon name={this.state.icEye} style={{left: width-50, top:-55}}
                             onPress={this.changePwdType}></Icon>    
                        
                            <BarPasswordStrengthDisplay style={{justifyContent: 'center'}}
                                            password={this.state.password}
                                    />

                 <View style={styles.button}>
                     <Text style={{fontSize:20, fontWeight: 'bold'}}
                     onPress={this.onSubmit(this.state.firstname, this.state.email, this.state.password)}>
                         SIGN UP
                     </Text>
                  </View>
                
            </View>
            
            </View> 
            </ImageBackground>
            </KeyboardAvoidingView>
        </Container>
        
        );
    }
}


const styles = StyleSheet.create({
    container: {
        
       // backgroundImage: linear-gradient(to right bottom, #ed81da, #d273c8, #b764b6, #9e57a4, #854992);
    },
    button: {
        backgroundColor: 'white',
        height: 70,
        marginHorizontal: 20,
        marginTop: 20,
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
    buttonLogIN: {
  
        height: 40,
        marginRight: 30,
        marginTop: 10,
        alignSelf: 'flex-end',

    },
    textInput: {
        height: 50,
        borderRadius: 25,
        borderWidth: 0.5,
        marginHorizontal: 20,
        paddingLeft: 10,
        marginVertical: 5,
        borderColor: 'rgba(0,0,0,0.2)',
        //fontWeight: '300'
      //  backgroundColor: 'white'
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
        
        
    }

});

/*const mapDispatchToProps = dispatch => {
    return bindActionCreators({ emailUpdate, passwordUpdate, signup, userNameUpdate}, dispatch)
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Signup)*/