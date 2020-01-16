import React from "react";
import { AppRegistry, Image, StatusBar, Platform, View, Alert} from "react-native";
import { Container, Content, List, ListItem, Icon , Button, Text} from "native-base";

import LogOut from "./logout";
export default class SideBar extends React.Component {

  


  render() {
   
    return (
      <Container style={{backgroundColor: 'white'}}>
        <Content>
        <Image
            source={require('../media/image.jpg')}
            style={{
              height: 150,
              width: 280,
             // alignSelf: "stretch",
              justifyContent: "center",
              alignItems: "center",
              
             
            }}>
            </Image>
        
            <View style={{paddingTop: 15, borderTopWidth: 2,paddingBottom: 15, flexDirection: 'row'}}>
            <Icon name='ios-person' style={{paddingLeft: 20, paddingRight: 10, color: 'black'}}></Icon>
            <Text onPress={() => this.props.navigation.navigate('Profile')}
                      style={{fontSize: 20, color: 'black'}}>  Profile</Text>
            </View>

            <View style={{paddingTop: 15,borderBottomColor:'black',paddingBottom: 15, flexDirection: 'row'}}>
            <Icon name='ios-heart-empty' style={{paddingLeft: 20, paddingRight: 10, color: 'black'}}></Icon>
            <Text onPress={() => this.props.navigation.navigate('Favourites')}
                      style={{fontSize: 20, color: 'black'}}>  Favourites</Text>
            </View>

            <LogOut/>
          
          
        </Content>
      </Container>
    );
  }
}
