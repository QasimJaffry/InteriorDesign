import React from 'react';
import { StyleSheet, Animated, Dimensions, FlatList, Text, Image, ScrollView,Platform, View,LayoutAnimation, UIManager, TouchableOpacity, Alert } from 'react-native'

import DoubleTap from './DoubleTap';
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content, Card, CardItem, InputGroup, Input } from "native-base";
import { SearchBar } from 'react-native-elements';
import FastImage from 'react-native-fast-image'
import { withNavigation, NavigationEvents, withNavigationFocus } from 'react-navigation';
let {width, height} = Dimensions.get('window')
import SwitchSelector from "react-native-switch-selector";
//var autocorrect = require('./autoCorrect')()
import words from '../words'
import Firebase, { db, storage } from '../config/Firebase';

//import AR from './App';
var autocorrect = require('./autoCorrect')({words: words})


 class CardImageExample extends React.Component {



   constructor(){
       super()
       this.state = {
        selected: new Map(),
           image1 : [{
               id: 0,
               name: 'Hello',
               uri: "https://ksassets.timeincuk.net/wp/uploads/sites/56/2019/09/Debenhams_Hero-Home-Decor-Trends-920x552.jpg",
           },
           {
               id: 1,
               name: 'Table',
               uri: "https://img.freepik.com/free-photo/modern-classic-living-room-interior-design-3d-rendering_33739-366.jpg?size=626&ext=jpg", 
           }, 
           {
               id: 2,
               name: 'Tables',
               uri: "https://ksassets.timeincuk.net/wp/uploads/sites/56/2019/09/Debenhams_Hero-Home-Decor-Trends-920x552.jpg", 
           }],
           width: 0, 
           height: 0,
           imageList : [],
           iconCon: 'menu',
           check : null,
           icEye: 'md-eye-off',
           showPassword: true,
           indexToAnimate: null,
           choose: 0,
           loading: false,
           imageData: [],
           value: '',
           showSearchBar: false,
           favourites: [], 
           load: false
        
           
       }
          
     //  this.iconCond = this.iconCond.bind(this);
       this.Item = this.Item.bind(this);
       this.arrayholder = [];
      
      // gs://interiorproject-2567f.appspot.com/1.jpg
      // this.changePwdType = this.changePwdType.bind(this)

    } 

    animatedValue = new Animated.Value(0);

    // componentDidUpdate(prevProps) {
    //   // Check that screen is newly focused
    //   if (this.props.isFocused && prevProps.isFocused !== this.props.isFocused) {
    //     this.makeRemoteRequest();
    //   }
    // }
    renderSeparator = () => {  
      return (  
        <View
        style={{
      height: 1,
      width: "100%",
      backgroundColor: 'transparent',
      paddingBottom: 10
     // marginLeft: "14%"
    }}
      />
      );  
  };  

    Item({ index,id,img,name, selected, onPressItem}) {
        return (
           
           <View style={{flex: 1}}>
       
                         
                <FastImage source={{
                          uri: img
                      }}
                    //  resizeMode='stretch'
                    style={{
                    //   flex: 2,
                        height: 250, 
                        width: '98%',
                        borderRadius: 30,
                        marginLeft: 3,
                        

                        //justifyContent: 'center'
                        
    
                  }} />
                    <TouchableOpacity  style={{    margin: 5,
                    position: "absolute",
                    bottom: 0,
                    left: 10,
                    width: 35,
                    height: 35,
                      }} onPress={() => {
                   onPressItem(id)
                }}>
                    <Icon name='ios-heart'
                     // fontSize='35'
                     
                        style={{color:'#a00d', fontSize: 40}}>
                            
                    </Icon>    
                           
                </TouchableOpacity>

        </View>
      
        );
      }
    
      onClick() {
        let { showSearchBar } = this.state;
        this.setState({
          showSearchBar: !showSearchBar,
        });
      }


    renderOverlay = (index) => {
        console.log("CALLLLLED")
        
        const imageStyles = [
          styles.overlayHeart,
          {
            opacity: this.animatedValue ,
            transform: [
              {
                scale: this.animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.7, 1.5],
                }),
              },
            ],
          },
        ];
    
        return (
          <View style={styles.overlay}>
            <Animated.Image
            //  key={index}
              source={{uri: 'https://firebasestorage.googleapis.com/v0/b/interiorproject-2567f.appspot.com/o/media%2Fheart.png?alt=media&token=469deab0-518c-491c-8d9a-d638ade36452'}}
              style={imageStyles}
            />
          </View>
        );
      }

    onPressAction = (key) => {
        const {currentUser} = Firebase.auth()
        this.setState((state, prevState) => {
          //create new Map object, maintaining state immutability
          const selected = new Map(state.selected);
          const check = state.check
        
              selected.set(key, !selected.get(key))
              console.log('settt')
           
               
              const items = state.imageData.filter(item => item.id !== key);

              state.imageData = items
                 
            const { currentUser } = Firebase.auth()
            const user1 = {
              uid: currentUser.uid,
              imageUrl: this.state.imageData,
             // id: this.state.idStore
            }
            db.collection("favourites").doc(currentUser.uid).set(user1)
              
            //   console.log(this.state.imageData)
                  
            
          
          return {selected};
        });
      }
   
      renderRow = (item, index) => {
        return (
            <this.Item
              key={index}
              id={item.id}
              
              img={item.imageUrl}
              //name={item.chair}
              selected={!!this.state.selected.get(item.id)}
              onPressItem={this.onPressAction}
              toggleLike={this.toggleLike}
             // renderOverlay={this.renderOverlay}
                />
        );
      }

      makeRemoteRequest = async () => {
            
       const { currentUser } = Firebase.auth()
        
       db.collection("favourites").doc(currentUser.uid).get().then((doc) => {
        
             // doc.data() is never undefined for query doc snapshots
             this.setState({imageData : doc.data().imageUrl})
          //   this.setState(state => {
          //    // let fruits_without_duplicates = ;
          //    let imageData = Array.from(new Set(state.imageData.concat(doc.data().imageUrl)));
           
          //    return {
          //      imageData,
              
          //    };
          //  });

         
     });
      } 

      componentDidMount() {
     //   this.setState({data : this.state.image1})
       // this.arrayholder = this.state.image1
       const { navigation } = this.props;
       this.focusListener = navigation.addListener("didFocus", () => {
         // The screen is focused
         // Call any action
         this.makeRemoteRequest()
       })
      
        
        }

     

    



      renderHeader = () => {
        return (
        
        
          <View searchBar style={{flexDirection: 'row', paddingTop: 15, paddingBottom:10}}>
          <Button transparent iconLeft style={{height:40, marginRight: 10}} onPress={() => {this.props.navigation.openDrawer()}}>
            <Icon name="ios-menu" style={{fontSize: 40}}/>
          </Button>
        
           
            <Text style={{flex:1, backgroundColor:'transparent', paddingLeft:10, paddingRight:10, textAlign:'center', fontSize: 25, fontWeight: 'bold'}}>
              Favourites
          </Text>
            
                <Button transparent  iconRight style={{height:40, top: -5, marginRight: 5}} onPress={() => {this.props.navigation.navigate('Home')}}>
                <Icon name="md-home" style={{fontSize: 40}}/>
                 </Button>
         
            </View>

          

        )
      }

  

    render(){
    // console.log(this.state.favourites, 'dasdasdadsasd')
     console.log(this.state.imageData, 'dasdasdadsasdasdasdasasd')
   
        return (
            
                
                <FlatList
                    data={ this.state.imageData}
                    renderItem={({ item, index }) => (
                    this.renderRow(item, index)
                    )}
                    keyExtractor={(item, index) => item.id.toString()}
                    extraData={this.state}
                    ListHeaderComponent={this.renderHeader}
                  ItemSeparatorComponent={this.renderSeparator}
                 // removeClippedSubviews={true}
               //   initialNumToRender={5}
                 // maxToRenderPerBatch={10}
                  //windowSize={10}
              //    removeClippedSubviews={true}
                //numColumns={2}
                  
                />
            
        );
    
    }

}

const styles = StyleSheet.create(
{ 
    container: {
        flex: 5,
    },
    image: {
        width: (Dimensions.get('window').width / 2) - 20,
        height: 150,
        margin: 10,
    },
    flatListStyle: {
         flex: 1,
    },
    
    overlay: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },

    overlayHeart: {
        tintColor: '#FFF',
    },
    container1: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white'
    },
    imageContainer: {
      borderColor: 'blue',
      borderRadius: 5,
      alignItems: "center"
    },
    text: {
      color: 'blue'
    },
    button: {
      width: 200,
      backgroundColor: 'blue',
      borderRadius: 10,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10
    },
    buttonText: {
      color: 'white',
      fontSize: 15
    },
    box: {
      position: 'absolute',
      borderColor: 'blue',
      borderWidth: 2,
    },
    boxes: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      top: 0,
    }
 } );

 export default withNavigation(CardImageExample);