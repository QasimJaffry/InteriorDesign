import React from 'react';
import {View, Text, StyleSheet,  Dimensions, StatusBar, Platform, TextInput} from 'react-native';
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content, Card, CardItem, InputGroup, Input } from "native-base";
import { SearchBar } from 'react-native-elements';
import SwitchSelector from "react-native-switch-selector";
import ImageCard from './imageCard'
import { withNavigation } from 'react-navigation';
let {width, height} = Dimensions.get('window')

 // { label: "Feminino", value: "f", imageIcon: images.feminino }, //images.feminino = require('./path_to/assets/img/feminino.png')
  //{ label: "Masculino", value: "m", imageIcon: images.masculino } //images.masculino = require('./path_to/assets/img/masculino.png')

 

 class InteriorStart extends React.Component {

    constructor(){
        super();

    }
    // IMPORTANT FOR SEARCH FILTER

    /*  search = text => {
        console.log(text);
      };
      clear = () => {
        this.search.clear();
      };
      SearchFilterFunction(text) {
        //passing the inserted text in textinput
        const newData = this.arrayholder.filter(function(item) {
          //applying filter for the inserted text in search bar
          const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
        this.setState({
          //setting the filtered newData on datasource
          //After setting the data it will automatically re-render the view
          dataSource: newData,
          search:text,
        });
      }

    */
  
 

  
  

    render() {
        return (
       <ImageCard/>
           
        );
    }
}


const styles = StyleSheet.create({
    container: {
        marginTop: Platform.OS == 'ios'? 30 : 0
    }
});

export default withNavigation(InteriorStart);