import React, { Component, Fragment } from 'react'
import { Text, SafeAreaView, View, StyleSheet, TextInput,  } from 'react-native'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content, Card, CardItem, InputGroup, Input, Label  } from "native-base";
import Firebase, {db } from '../config/Firebase'
import { withNavigation } from 'react-navigation';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .label('Email')
    .email('Enter a valid email')
    .required('Please enter a registered email')
})

class ForgotPassword extends Component {
  handlePasswordReset = async (values, actions) => {
    const { email } = values
   // var user = firebase.auth().currentUser;
    try {
      await Firebase.auth().sendPasswordResetEmail(email)
     .then(r => {
        console.log(r)
        this.props.navigation.navigate('Start')
      })
     
    } catch (error) {
      alert( error.message)
    }
  }

  render() {
    return (
      <View style={styles.container}>
         <Button transparent iconLeft style={{ marginRight: 10, marginTop:30, paddingBottom:150}} onPress={() => {this.props.navigation.navigate('Start')}}>
              <Icon name="md-arrow-round-back" style={{fontSize: 40, color: 'black'}}/>
            </Button>
        <Text style={styles.text}>Forgot Password?</Text>
        <Formik
          initialValues={{ email: '' }}
          onSubmit={(values, actions) => {
            this.handlePasswordReset(values, actions)
          }}
          validationSchema={validationSchema}>
          {({
            handleChange,
            values,
            handleSubmit,
            errors,
            isValid,
            touched,
            handleBlur,
            isSubmitting
          }) => (
            <Fragment>
            <View style={{margin:15, borderBottomWidth: 1}}>
              <TextInput
                name='email'
                value={values.email}
                onChangeText={handleChange('email')}
                placeholder='Enter email'
                autoCapitalize='none'
               // iconName='ios-mail'
               // iconColor='#2C384A'
                onBlur={handleBlur('email')}
              />
            </View>
             
            <View style={styles.container1}>
                <Text style={styles.errorText}>{touched.email && errors.email}</Text>
            </View>

            

            <Button rounded  
              disabled={!isValid || isSubmitting}
             style={{backgroundColor:'white', justifyContent: 'center', paddingRight: 20, paddingLeft: 20}}
             >
               <Text style={{fontSize: 17, color: '#880088', fontWeight:'bold'}}
          onPress={handleSubmit}
               >
                 Send Email
               </Text>
             </Button>

            <View style={styles.container1}>
                <Text style={styles.errorText}>{errors.general}</Text>
            </View>
              
            </Fragment>
          )}
        </Formik>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
 //marginTop: 150
  },
  text: {
    color: '#333',
    fontSize: 24,
    marginLeft: 25
  },
  buttonContainer: {
    margin: 25
  }, container1: {
    marginLeft: 25
  },
  errorText: {
    color: 'red'
  }
})

export default withNavigation (
  ForgotPassword)
