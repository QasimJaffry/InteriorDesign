import React from 'react';
import { StyleSheet, Animated, Dimensions, FlatList, Text, Image, ScrollView,Platform, View,LayoutAnimation, UIManager, TouchableOpacity } from 'react-native'

import DoubleTap from './DoubleTap';
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content, Card, CardItem, InputGroup, Input } from "native-base";
import { SearchBar } from 'react-native-elements';
import FastImage from 'react-native-fast-image'
import { withNavigation } from 'react-navigation';
let {width, height} = Dimensions.get('window')
import SwitchSelector from "react-native-switch-selector";
//var autocorrect = require('./autoCorrect')()
import words from '../words'
import Firebase, { db, storage } from '../config/Firebase';
import * as firebase from 'firebase';

//import AR from './App';
var autocorrect = require('./autoCorrect')({words: words})
//var words = ['word', 'weird', 'wired']
const options = [
  { label: "Pictures", value: 1 },
  { label: "AR", value: 2}
];
 //var word = words


 class CardImageExample extends React.Component {

     /* setImageSize(width, height){
        if (this.props.width && !this.props.height) {
          this.setState({
            width: this.props.width, 
            height: height * (this.props.width / width)
          });
        } else if (!this.props.width && this.props.height) {
          this.setState({
            width: width * (this.props.height / height),
            height: this.props.height
          });
        } else {
          this.setState({
            width: width,
            height: height
          });
        }
      } */
   

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
           arrayholder: [],
           filterData: [],
           favourites: [],
           idStore: [],
           labelData: []
        
           
       }
          
     //  this.iconCond = this.iconCond.bind(this);
       this.Item = this.Item.bind(this);
       
      // gs://interiorproject-2567f.appspot.com/1.jpg
      // this.changePwdType = this.changePwdType.bind(this)

    } 

    animatedValue = new Animated.Value(0);

    switchHandle = () => {
        

      if(this.state.choose === 2){
        console.log("ARRR")
        this.props.navigation.navigate('AR');
      }
      
    };

    
    renderSeparator = () => {  
      return (  
        <View
        style={{
      height: 1,
      width: "100%",
      backgroundColor: "#CED0CE",
     // marginLeft: "14%"
    }}
      />
      );  
  };  

    Item({ index,id,img,name, selected, onPressItem}) {
        return (
           
           <View style={{flex:1}}>
            <Card style={{
                borderRadius: 15,
                  elevation: 5,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 3,
                  },
                  shadowOpacity: 0.27,
                  shadowRadius: 4.65,
                  elevation: 6
            }}>
             <DoubleTap onDoubleTap={() => onPressItem(id)}>
                <CardItem cardBody>                        
                <FastImage source={{
                          uri: img
                      }}
                      resizeMode='stretch'
                    style={{
                     //  flex: 1,
                        height: 200, 
                        width: '100%',
                       // width: '100%',
                        borderRadius: 15,
                        //justifyContent: 'center'
                        
    
                  }} />
                  
                </CardItem>
                </DoubleTap>
                <CardItem>
               
                <TouchableOpacity  onPress={() => {
                   onPressItem(id)
                }}>
                    <Icon name='ios-heart'
                      
                        style={{color: selected ? '#a00d' : null}}>
                            
                    </Icon>    
                           
                </TouchableOpacity>
                
                { this.state.check === id ? this.renderOverlay() : null }     
                    <Text>{name}</Text>                        
                </CardItem>
           </Card>
        </View>
      
        );
      }
    
    

    toggleLike = (id) => {
        this.setState((state) => {
          const newLiked = state.check;
          
         
          //remove key if selected, add key if not selected
        //  this.state.selected.has(key) ? selected.delete(key, !selected.get(key)) : selected.set(key, !selected.get(key));
          if (selected) {
            Animated.sequence([
              Animated.spring(this.animatedValue, { toValue: 1 }),
              Animated.spring(this.animatedValue, { toValue: 0 }),
            ]).start();
          }
    
          return { check: newLiked };
        });
    }

    renderOverlay = (index) => {
       // console.log("CALLLLLED")
        
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
              source={require('../media/heart.png')}
              style={imageStyles}
            />
          </View>
        );
      }

    onPressAction = (key) => {
      const { currentUser } = Firebase.auth()
        this.setState((state, prevState) => {
          //create new Map object, maintaining state immutability
          const selected = new Map(state.selected);
         // const imageList = state.imageList
         
          
          if(this.state.selected.has(key)){
            const items = this.state.favourites.filter(item => item.id !== key);

            state.favourites = items
         
            const user1 = {
              uid: currentUser.uid,
              imageUrl: this.state.favourites,
            }
      
            db.collection("favourites").doc(currentUser.uid).set(user1)
            console.log(this.state.favourites, "HI")

              selected.delete(key, !selected.get(key))  

          }else{

              selected.set(key, !selected.get(key))
              
              state.check = key
              console.log(key, 'asdasas', this.state.check)
              Animated.sequence([
                Animated.spring(this.animatedValue, { toValue: 1 }),
                Animated.spring(this.animatedValue, { toValue: 0 }),
                
              ]).start()
              const url = this.state.imageData.filter(obj => {
                if(obj.id === key ){
                  console.log(obj.imageUrl, 'asdasdasdasdqwqew')
                  obj.isLiked = true
                  state.favourites = [...this.state.favourites, obj ] 
    
                          const user1 = {
                            uid: currentUser.uid,
                            imageUrl: this.state.favourites,
                           // id: this.state.idStore
                          }
                          db.collection("favourites").doc(currentUser.uid)
                          .get().then(doc => {
                            if(!doc.exists){
                              db.collection("favourites").doc(currentUser.uid)
                              .set(user1)
                            }
                            else{
                              db.collection("favourites").doc(currentUser.uid)
                              .update({
                                imageUrl: firebase.firestore.FieldValue.arrayUnion(obj),
                                
                              //  id: firebase.firestore.FieldValue.arrayUnion(obj.id)
                              })
                            }
                          })
                    
                }})
            
                
     
          }
         
          return {selected};
        });
      }
   
      renderRow = (item, index) => {
        return (
            <this.Item
              key={index}
              id={item.id}
              img={item.imageUrl}
              name={item.chair}
              selected={!!this.state.selected.get(item.id)}
              onPressItem={this.onPressAction}
              toggleLike={this.toggleLike}
             // renderOverlay={this.renderOverlay}
                />
        );
      }

      componentDidMount() {
     //   this.setState({data : this.state.image1})
       // this.arrayholder = this.state.image1
       const { currentUser } = Firebase.auth()   
      const user2 = {
          uid: currentUser.uid,
          detect: []
       }
         // The screen is focused
         // Call any action
        db.collection('label')
.doc(currentUser.uid).set(user2)       
        
          db.collection("images").get().then( (querySnapshot) =>   {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
               // this.setState({imageData : 'asdasddas'})
               this.setState(state => {
                const imageData = state.imageData.concat(doc.data());
                return {
                  imageData,
                 
                };
              });
             

              
              var starsRef = storage.refFromURL(doc.data().imageUrl);

              starsRef.getDownloadURL().then((url) => {
            //   console.log(doc.data().imageUrl)
                
              // console.log(object1)
              this.setState(state => {
                const imageData = state.imageData.map(obj =>
                  obj.id === doc.data().id ? { ...obj, imageUrl: url } : obj
              );
             
                return {
                  imageData,
                  arrayholder: imageData
                };
              });
                
              })
          
                // console.log(this.state.imageData)
                //this.state.imageList.push(doc.data())
             //   this.arrayholder.concat(this.state.imageData)
             //state.arrayholder = state.arrayholder.concat(this.state.imageData)
               // console.log((this.state.imageData));
            });
        });

      
        const { navigation } = this.props;
        this.focusListener = navigation.addListener("didFocus", () => {
        const { currentUser } = Firebase.auth()
        db.collection("favourites").doc(currentUser.uid).get().then(doc => {
          this.setState({ favourites: [ ...doc.data().imageUrl ], choose: 0}) 
          this.setState((state) => {
            const selected = new Map(null);
            this.state.favourites.map((item) => {
              if(item.id === this.state.selected.get(item.id)){

                selected.delete(item.id,  !selected.get(item.id)) 
                
                console.log(item.id,'truttt') 
              }

               else{
                selected.set(item.id, !selected.get(item.id))
                console.log('false')
               } 

              })
           
          
               
          
              
          
          

            return {selected}
          })
          
        
          
        
        })

      //  const {currentUser} = Firebase.auth()
        db.collection('label').doc(currentUser.uid).get().then((doc) => {
          this.setState({ labelData: ((doc.data().detect[0].detectedClass))}) 
        })    
        let label = this.state.imageData.filter(item => item.class === this.state.labelData) 
        this.setState({filterData: label})
        
       // let i = 0
    //  let data =    this.state.imageData.filter((value) => {
      
    //         //console.log(values[i].name)
    //               if ( value.chair === true) {
    //                  // this.state.labelData[i].count = this.state.values[i].count + 1
    //                   //if(1 === value.chairs){
    //                       return value
    //                   //}
                      
    //               }
    //             //   if (value.bed === true) {
    //             //     //this.state.labelData[i].count = this.state.values[i].count + 1
    //             //     if(label[1].count === value.beds){
    //             //         return value
    //             //     }
                    
    //             //   }
    //             //   if (value.table === true) {
    //             //    // this.state.labelData[i].count = this.state.values[i].count + 1
    //             //     if(label[2].count === value.tables){
    //             //         return value
    //             //     }
                    
    //             //   }
    //             //   if ( value.couch === true) {
    //             //     //this.state.labelData[i].count = this.state.values[i].count + 1
    //             //     if(label[3].count === value.couchs){
    //             //         return value
    //             //     }
                    
    //             //   }  if ( value.sofa_bed === true) {
    //             //  //   this.state.labelData[i].count = this.state.values[i].count + 1
    //             //     if(label[4].count === value.sofa_beds){
    //             //         return value
    //             //     }
                    
    //             //   }
              
    //           i = i + 1
              
    //     })
    //     this.setState({
    //       filterData: this.state.filterData.concat(data),
    //     });
        
        // let data = this.state.imageData.filter((item) => {
        //   (this.state.labelData).map((val)=> {
        //     if(val.name === 'Chair' && val){

        //     }
        //   })
        // })

        // let data  = this.state.imageData.filter((item) => {
        //   Object.values(this.state.labelData).map((val) => {
        //    console.log((val.name))
        //   })
        // })
        // let data = Object.values(this.state.labelData).map((val) => {
        //   if(val.count > 0){
        //     this.state.imageData.map((item) => {
        //       if(val.name )
        //     })
        //   }
        // })
      
        // let data = this.state.imageData.filter((item) => {
        //   let count = 0
        //   if(item.chair === true){
        //     Object.values(this.state.labelData).map((val) => {
        //          if(val.name === 'Chair'){
        //             if(item.chairs === val.count){
        //                 count = count + 1
        //             }
        //          }
        //          if(val.name === 'Table'){
        //           if(item.tables === val.count){
        //               count = count + 1
        //           }
        //        }
        //           if(val.name === 'Bed'){
        //             if(item.beds === val.count){
        //                 count = count + 1
        //             }
        //         }
        //           if(val.name === 'Nightstand'){
        //             if(item.nightstands === val.count){
        //                 count = count + 1
        //             }
        //         }
        //           if(val.name === 'Door'){
        //             if(item.doors === val.count){
        //                 count = count + 1
        //             }
        //         }
        //           if(val.name === 'Sofa_bed'){
        //             if(item.sofa_beds === val.count){
        //                 count = count + 1
        //             }
        //         }
        //           if(val.name === 'Couch'){
        //             if(item.couchs === val.count){
        //                 count = count + 1
        //             }
        //         }

        //          })
        //   }
        // })
      //  console.log(this.state.selected, 'mine')
      })
   
  }
      

      onChange = text => {
        this.setState({
          value: text,
        });
      }

      searchFilterFunction = (text) => {
      //  console.log(this.state.arrayholder)
   
        var store = ''
       

          console.log(autocorrect(this.state.value.toLowerCase()))
          if(this.state.value !== ''){
          store = autocorrect(this.state.value.toLowerCase())
          }
          else{
            store = ''
          }
          this.setState({
            value: store,
          });
      
          let filteredData = this.state.imageData.filter( (item) => {
            if(store.includes('chair')){
                if( item.chair === true){
                return item
            }}

            if(store.includes('door')){
                if(item.door === true){
                  return item
            }}

            if(store.includes('table')){
                if( item.table === true){
                  return item
            }}

            if(store.includes('sofa')){
                if(item.sofa_bed === true){
                  return item
            }}

            if(store.includes('nightstand')){
                if(item.nightstand === true){
                  return item
            }}

            if(store.includes('couch')){    
                if(item.couch === true){
                  return item
            }}

            if(store.includes('bed')){   
                if(item.bed === true){
                  return item
                }
            }
          });
          this.setState({
            filterData: filteredData,
          });
       
        
       
      //  this.getCountry("Chair")
      };

      renderHeader = () => {
        return (
         <View>

        
          <View searchBar style={{ flexDirection: 'row', paddingTop: 15}}>
          <Button transparent iconLeft style={{height:40, marginRight: 10}} onPress={() => {this.props.navigation.openDrawer()}}>
            <Icon name="ios-menu" style={{fontSize: 40}}/>
          </Button>
    
          {/* <InputGroup rounded style={{flex:1, backgroundColor:'#fff',height:40, paddingLeft:10, paddingRight:10}}>
            <Icon name="search" style={{fontSize: 30}}/>
            <Input style={{height:40}} placeholder="Search Interiors" />
            <Icon name="ios-list" style={{fontSize: 30}} />
          </InputGroup> */}
    
          <SearchBar        
            placeholder="Search"        
            clearIcon={{size: 27}}
            //autoCorrect={true}    
            searchIcon={{size: 27}}  
            onChangeText={text => this.onChange(text)}
          //  autoCorrect={this.autoCorrect(this.state.value)}  
            keyboardType='web-search'
            returnKeyType='search'
            onSubmitEditing={() => this.searchFilterFunction()}
            value={this.state.value}  
            onFocus= {() => this.setState({value : ''})}
            containerStyle={{ backgroundColor:'transparent',height:40, paddingLeft:20, width:width /1.35 - 10, borderWidth: 1, borderRadius: 35}}  
            inputContainerStyle={{ backgroundColor:'transparent', top: -13, right: 20, marginTop: 5}}      
          />    
    
          <Button transparent iconRight style={{height:40, top: -2, marginLeft: -10}} onPress={() => {this.props.navigation.navigate('Camera')}}>
            <Icon name="ios-camera" style={{fontSize: 40}} />
          </Button>
          </View>
          <SwitchSelector style={{marginTop: 15, marginBottom: 20, width: 200, alignSelf: 'center'}}
           initial={0}
           onPress={value => this.setState({choose: value})}
           textColor={'#7a44cf'} //'#7a44cf'
           selectedColor={'#ffffff'}
           buttonColor={'#7a44cf'}
           borderColor={'#7a44cf'}
           hasPadding
           //value={value => this.setState({choose: value})}
           options={options}
           {...this.switchHandle()}
         />
         <Text style={{flex: 1,fontWeight:'bold', fontSize: 20, textAlign: 'center'}}>
                    Recent 
                </Text>
        

        </View>

        )
      }

  

    render(){
  //   console.log(this.state.favourites, 'dasdasdadsasd')
   // console.log((this.state.labelData.values(this.state.labelData.map(((item) => item.detectedClass)))), 'sdadasdas')
  //  console.log(this.state.filterData, 'sd')

        return (
            
                
                <FlatList
                    data={this.state.filterData && this.state.filterData.length > 0 ? this.state.filterData : this.state.imageData}
                    renderItem={({ item, index }) => (
                    this.renderRow(item, index)
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    extraData={this.state}
                    ListHeaderComponent={this.renderHeader}
                  ItemSeparatorComponent={this.renderSeparator}
                 // removeClippedSubviews={true}
                  initialNumToRender={5}
                  maxToRenderPerBatch={10}
                  windowSize={10}
              //    numColumns={1.5}
                  
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
        top: -250,
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