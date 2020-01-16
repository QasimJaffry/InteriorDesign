import React from 'react';
import {View, StyleSheet,  Dimensions, StatusBar, Platform, TextInput, TouchableOpacity, Alert, Image} from 'react-native';
import { connect } from 'react-redux'
import Firebase from '../config/Firebase'
import AsyncStorage from '@react-native-community/async-storage';
import {signOut} from './actions/user'
let {width, height} = Dimensions.get('window')
import { Container, Content, List, ListItem, Icon , Button, Text} from "native-base";
import { withNavigation } from 'react-navigation';


 class LogOut extends React.Component {

    constructor(){
        super();
        this.state = {
            email : '',
            password : '',
            signout: false
        }
    }

    handleSignout = () => {
       
            Firebase.auth().signOut()
            console.log('suuccccess')
             AsyncStorage.removeItem('userData')
            this.props.navigation.navigate('Start')
               
	}
    button() {
        Alert.alert(
          'Log Out',
          'Are you sure you want to logout?',
          [
            {text: 'NO', onPress: () => console.warn('NO Pressed'), style: 'cancel'},
            {text: 'YES', onPress: () => this.handleSignout()},
          ]
        );
      }
  /* 
*/
    render() {
        return (
            <View style={{paddingTop: 10, borderBottomColor: 'black',paddingBottom: 15, flexDirection: 'row'}}>
            <Icon name='md-exit' style={{paddingLeft: 20, paddingRight: 20, color: 'black'}}></Icon> 
            <Text onPress={() => this.button()}
                      style={{fontSize: 20, color: 'black'}}>Log Out</Text> 
            </View>

            
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent:'center'
    }

});

/*const mapDispatchToProps = (dispatch) => {
    return {
        signOut: () => dispatch(signOut())
    }
}


export default connect(null, mapDispatchToProps)(LogOut)*/

export default withNavigation(LogOut)