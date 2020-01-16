import React from 'react';
import {View, Text, StyleSheet,  Dimensions, StatusBar, Platform, TextInput, ImageBackground, Image, Alert} from 'react-native';
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content, Card, CardItem, InputGroup, Input, Label  } from "native-base";
let {width, height} = Dimensions.get('window')
import Firebase, { db } from '../config/Firebase';
import AsyncStorage from '@react-native-community/async-storage';
import * as firebase from 'firebase'
import FastImage from 'react-native-fast-image'
export default class Profile extends React.Component {

    constructor(){
        super();
        this.state = { currentUser: null,
        uid: '',
        name: '',
        email: '',
        password: '',
        hidePassword: '',
        newPassword: false,
        oldPassword: '',
        newPassd: '',
        retypePass: ''
      }
      var newPass1 = false
    }


    componentDidMount() {
     
      const { currentUser } = Firebase.auth()
     
    // console.log(user1)
      const user =  db.collection('users')
      .doc(currentUser.uid)
      .get().then(doc => {
        if (!doc.exists) {
          console.log('No such document!');
        } else {
          this.setState({
            uid : doc.data().uid,
            name: doc.data().name,
            email: doc.data().email,
            password: doc.data().password
          })
          console.log('Document data:', this.state.name);
          console.log(this.state.password.length)
        }
      })
    //  this.setState({uid : currentUser.uid})
      //console.log(user.data())
    }

    passLength  (password) {
        let num = password.length
        console.log(num)
       
        
        for(var i=0; i<num; i++){
          this.state.hidePassword = this.state.hidePassword  + '*'
        }
      
      //  console.log(   this.state.hidePassword )
    }

    newPass = () => {
        this.setState({newPassword: true})
    }
  
    reauthenticate = (currentPassword) => {
      var user = firebase.auth().currentUser;
      var cred = firebase.auth.EmailAuthProvider.credential(
          user.email, currentPassword);
      return user.reauthenticateWithCredential(cred);
    }

    changePassword = (currentPassword, newPassword, retypePass) => {

      let updateUser = {
        password: ''
      }

      if(newPassword === retypePass){
      this.reauthenticate(currentPassword).then(() => {
        var user = firebase.auth().currentUser;
        user.updatePassword(retypePass).then(() => {
          console.log("Password updated!");
          db.collection('users')
          .doc(user.uid)
          .update({
            password:retypePass
          }).then(console.log("SUCCCCESSS")).catch((error) => {
                console.log(error)
          })
          updateUser = {
            
            password: retypePass
          }

          AsyncStorage.mergeItem("userData", JSON.stringify(updateUser));
        
          Alert.alert(
            'Successfull',
            'Password Updated',
            [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            
          );
        }).then(() => this.props.navigation.navigate('Start'))
        .catch((error) => { console.log(error); });
      }).catch((error) => { console.log(error); });
    }else{
      alert("Password doesn't match");
    }
    }

   /* changePassword = () => {
          let updateUser = null
          console.log(this.state.password)
        this.reauthenticate(this.state.password).then(() => {
          var user = Firebase.auth().currentUser;
          user.updatePassword(this.state.newPassd).then(() => {
            console.log("Password updated!");
            console.log(this.state.uid);
            console.log(this.state.newPassd)
            db.collection('users')
            .doc(this.state.uid)
            .update({
              password:this.state.newPassd
            }).then(console.log("SUCCCCESSS")).catch((error) => {
                  console.log(error)
            })
           updateUser = {
              password: newPassword
            }
            AsyncStorage.mergeItem("userData", JSON.stringify(updateUser));
            Alert.alert(
              'Successfull',
              'Password Updated',
              [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
              ],
              
            );
          }).catch((error) => { console.log(error); });
        }).catch((error) => { console.log(error); });
      }
     
    */

   

    render() {
        return (
          
          <Container>
         
          <ImageBackground source={{
            uri:'https://ih0.redbubble.net/image.217196421.1915/flat,1000x1000,075,f.u1.jpg'
          }} style={{height: 180, width: '100%'}}>

          
             <View searchBar style={{...styles.container, flexDirection: 'row', paddingTop: 15}}>
            <Button transparent iconLeft style={{height:40, marginRight: 10}} onPress={() => {this.props.navigation.openDrawer()}}>
              <Icon name="ios-menu" style={{fontSize: 40, color: '#FFFFFF'}}/>
            </Button>
    
            <Text style={{flex:1, backgroundColor:'transparent',marginTop:5, paddingLeft:10, paddingRight:10, textAlign:'center', fontSize: 23, color: '#FFFF'}}>
              Profile
            </Text>
    
            <Button transparent iconRight style={{height:40, paddingLeft: 10}} onPress={() => {this.props.navigation.navigate('Home')}}>
              <Icon name="md-home" style={{fontSize: 40, color: '#FFFFFF'}} />
            </Button>
          </View>
          <FastImage source={{
            uri:'https://www.abeautifulsite.net/uploads/2014/08/bit-face.png?width=600&key=c6d70b7b067981cded2d49fc8a5e3ca1dc9dc9fdaab2ac05db4cb96481a36a77'
          }} style={{ width: 120, height: 120, borderRadius: 200 / 2, alignSelf: 'center', marginTop: 30}}/>
          
          <Text style={{alignSelf: 'center', fontWeight: 'bold', fontSize: 20}}>Interior Designer</Text>
          
          </ImageBackground>

          <View style={styles.profile}>
     
              <Label style={styles.label}>
                Name
              </Label>
              <Text style={styles.text}>
                {this.state.name}
              </Text>

              
              <Label style={styles.label}>
                Email
              </Label>
              <Text style={styles.text}>
                {this.state.email}
              </Text>
                </View>

                
          {this.state.newPassword === false ? 
            <View style={{...styles.profile1, top: -120}}>
           
            
              <Button rounded  
             
             style={{backgroundColor:'white', justifyContent: 'center', marginRight: 80, marginLeft: 80}}>
               <Text style={{fontSize: 17, color: '#880088', fontWeight:'bold'}}
               onPress={  () => {
              this.newPass()}}
               >
                 Change Password
               </Text>
             </Button>

            </View>

            :
            <View  style={{...styles.profile1, top: -60}}>

              
              <TextInput  style={styles.text} secureTextEntry={true}
               placeholder="Old Password"
               onChangeText={(oldPassword) => this.setState({oldPassword})} />
                
              
              <TextInput style={styles.text} secureTextEntry={true}
                placeholder="New Password"
                onChangeText={(newPassd) => this.setState({newPassd})}   
              />

              
              <TextInput style={styles.text} secureTextEntry={true}
                placeholder="Re-type Password"  
                onChangeText={(retypePass) => this.setState({retypePass})} 
              />

              <Button rounded  
             
              style={{backgroundColor:'white', justifyContent: 'center', marginRight: 80, marginLeft: 80}}>
                <Text style={{fontSize: 17, color: '#880088', fontWeight:'bold'}}
                onPress={() => this.changePassword(this.state.oldPassword, this.state.newPassd, this.state.retypePass)}
                >
                  Change Password
                </Text>
              </Button>

            </View>}
            
          </Container>
           
        );
    }
}


const styles = StyleSheet.create({
  container: {
      marginTop: Platform.OS == 'ios'? 30 : 0
  },
  profile:{
    flex: 1,
    justifyContent: 'center',
    marginLeft: 20,
    top: -2
  },
  profile1:{
//flex: 1,
    justifyContent: 'center',
    marginLeft: 20,
   // top: -2
  },
  text: {
    borderRadius: 4,
    //borderWidth: 0.5,
    borderBottomWidth: 1,
    borderBottomColor: '#d6d7da',
    paddingBottom: 10,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 'bold'
 //   borderTopWidth: 0
  },
  label:{
    fontSize: 20,
    paddingBottom: 5,
   // color: '#bb00bb'
  }

});
