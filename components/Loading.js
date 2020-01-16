// Loading.js
import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import Firebase, {db} from '../config/Firebase'

import AsyncStorage from '@react-native-community/async-storage';

export default class Loading extends React.Component {

  constructor() {
    super();
    this.state = {
      connection_Status: ""
    }
  }

  componentDidMount = () => {
   
      
        console.log("SDADADSADDSADS")
        Firebase.auth().onAuthStateChanged(user1 => {
          if (user1) {
              const user =  db.collection('users')
                  .doc(user1.uid)
                  .get()
              if (user != null) {
                  this.props.navigation.navigate('Home')
              }
              
          }else{
            this.props.navigation.navigate('Start')
          }
        
      

    });

   

   
}


  

    render() {
      return (
        <View style={styles.container}>
          <Text style={{color:'#880088', fontSize: 40}}>Loading</Text>
          <ActivityIndicator color='#880088' size="large" />
        </View>
      )
    }
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }
  });