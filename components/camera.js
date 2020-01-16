
import React from 'react';
//import RNFetchBlob from "react-native-fetch-blob";

import {
  StyleSheet,
  Text,
  View,
  Alert,
  ActivityIndicator,PermissionsAndroid,Platform,TouchableOpacity,FlatList,
  ImageBackground,
  Image,

  
} from 'react-native';

import { CameraKitCameraScreen } from 'react-native-camera-kit';
import { Icon, Button } from 'native-base';
import { GOOGLE_CLOUD_VISION_API_KEY } from 'react-native-dotenv'
import  {withNavigation} from 'react-navigation'
var RNFS = require('react-native-fs');
import Tflite from 'tflite-react-native';
import Firebase, {db, storage} from '../config/Firebase'
//const fs = RNFetchBlob.fs;
import AsyncStorage from '@react-native-community/async-storage';
 
let tflite = new Tflite();
 
const height = 350;
const width = 350;
const blue = "#25d5fd";
const mobile = "MobileNet";
const ssd = "SSD MobileNet";
const yolo = "Tiny YOLOv2";
const deeplab = "Deeplab";
const posenet = "PoseNet";


 class App extends React.Component {
  state = { isPermitted: false,
            image: '',
            googleResponse: null,
            uploading: false,
            photoTaken: false,
            base64: '',
            model: null,
            source: null,
            imageHeight: height,
            imageWidth: width,
            recognitions: [],
            modelSelect : false,
            photoHeight: null,
            photoWidth: null,
            isTfReady:false,
            isSegmentationReady: false,
         //   imageHeight: 550,
           // imageWidth: 425,
            segemntation: '',
            result: [], 
             values : [

              {
                name: "Chair",
                count: 0 
              },
            
              {
                name: "Table",
                count: 0
              },
            
              {
                name: "Bed",
                count: 0
            
              },
              {
                name: 'Sofa_bed',
                count: 0
              },
              {
                name: "Nightstand",
                count: 0
              },
              {
                name: "Couch",
                count: 0
              },
              {
                name: "Door",
                count: 0
              }
            ]
          };
  constructor(props) {
    super(props);

    
  }

 

  onPress2() {
    var that = this;
    if (Platform.OS === 'android') {
      async function requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'InteriorDesign App Camera Permission',
              message: 'InteriorDesign App needs access to your camera ',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //If CAMERA Permission is granted
            //Calling the WRITE_EXTERNAL_STORAGE permission function
            requestExternalWritePermission();
          } else {
            alert('CAMERA permission denied');
          }
        } catch (err) {
          alert('Camera permission err', err);
          console.warn(err);
        }
      }
      async function requestExternalWritePermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'InteriorDesign App External Storage Write Permission',
              message:
                'InteriorDesign App needs access to Storage data in your SD Card ',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //If WRITE_EXTERNAL_STORAGE Permission is granted
            //Calling the READ_EXTERNAL_STORAGE permission function
            requestExternalReadPermission();
          } else {
            alert('WRITE_EXTERNAL_STORAGE permission denied');
          }
        } catch (err) {
          alert('Write permission err', err);
          console.warn(err);
        }
      }
      async function requestExternalReadPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: 'InteriorDesign App Read Storage Read Permission',
              message: 'InteriorDesign App needs access to your SD Card ',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //If READ_EXTERNAL_STORAGE Permission is granted
            //changing the state to re-render and open the camera
            //in place of activity indicator
            that.setState({ isPermitted: true });
          } else {
            alert('READ_EXTERNAL_STORAGE permission denied');
          }
        } catch (err) {
          alert('Read permission err', err);
          console.warn(err);
        }
      }
      //Calling the camera permission function
      requestCameraPermission();
    } else {
      this.setState({ isPermitted: true });
    }
  }
  onBottomButtonPressed(event) {
    const {uri} = JSON.stringify(event.captureImages);
    //const uri = event.nativeEvent.selected
    if (event.type === 'left') {
      this.setState({ isPermitted: false });
      
      this.props.navigation.navigate('Home');
    } else {
        //<View style={{backgroundColor: 'white'}}> 
      //  console.log(captureImages)
        //</View
        console.log("hii",event.captureImages[0].height)
        this.setState({ photoTaken: true, 
                        image: event.captureImages[0].uri,
                        photoHeight: event.captureImages[0].height,
                        photoWidth: event.captureImages[0].width})
        alert(event.captureImages[0].uri)
    //  Alert.alert(
    //     event.type,
    //     captureImages,
    //     [{ text: 'OK', onPress: () => console.log(captureImages.uri) }],
    //     { cancelable: false }
    //   );
     // {this.submitToGoogle()}
    }
  }

  buttonPressed (uri) {
    RNFS.readFile(uri, 'base64')
    .then(res =>{
      let result =  this.submitToGoogle(res);
       
     
    });
    
  }

submitToGoogle = async (image) => {
  // var fs = require('react-native-fs');
  // var imageFile = fs.readFileSync(image)
  // var encoded = Buffer.from(imageFile).toString('base64');
  // console.log(encoded)
  try {
    this.setState({ uploading: true });
   // let { image } = this.state.image;
    let body = JSON.stringify({
      "requests": [
        {
            "image": {
                "content": image
            },
            "features": [
                {
                    "type": "LABEL_DETECTION", "maxResults": "5"
                },
                { "type": "IMAGE_PROPERTIES", "maxResults": "5" },
            ]
        }
    ]
    });
    let response = await fetch(
      "https://vision.googleapis.com/v1/images:annotate?key=" +
      GOOGLE_CLOUD_VISION_API_KEY,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: body
      }
    );
    let responseJson = await response.json();
    
    console.log(responseJson);
    alert(responseJson.responses[0].labelAnnotations[0].description)
    console.log(responseJson.responses[0].labelAnnotations.description)
    alert('hii')
    this.setState({
      googleResponse: responseJson,
      uploading: false
    });
 //   this.countLabels(values,responseJson.responses[0])
  } catch (error) {
    console.log(error);
  }
};



// countLabels (values, response) {
//   let i = 0
//   values.forEach((value) => {
//     response.labelAnnotations.forEach((label) => {
//       //console.log(values[i].name)
//              if (label.description === value.name) {
//                  values[i].count = values[i].count + 1
                 
//              }
//          });
//          i = i + 1
        
//   })
//   console.log(values)
// }



  componentDidMount(){
      this.onPress2();
  
   
  }


  onSelectImage() {

        let x = 0
        this.state.values.forEach((item) => {
          this.state.values[x].count = 0

          x=x+1
        })
    
        console.log(this.state.values, 'asdasdqwe123123123')
        var path =  'file://' + this.state.image;
        var w = this.state.photoWidth;
        var h = this.state.photoHeight;
        this.setState({
          source: { uri: path },
          imageHeight: h * width / w,
          imageWidth: width
        });

       
          
            tflite.detectObjectOnImage({
              path,
              threshold: 0.5,
            //  numResultsPerClass: 3,
          //    imageMean: 127.5,
        //      imageStd: 127.5,
            //  threshold: 0.3,       // defaults to 0.1
              numResultsPerClass: 1,// defaults to 5
            },
              (err, res) => {
                if (err)
                  console.log(err);
                else
                  this.setState({ recognitions: res });
                  var max = this.state.recognitions.reduce(function (prev, current) {
                    return (prev.confidenceInClass > current.confidenceInClass) ? prev : current
                 })
                 this.setState({ result: [max]})
                 console.log(this.state.result )

                 let i = 0
                  this.state.values.forEach((value) => {
                    this.state.result.forEach((label) => {
                      //console.log(values[i].name)
                            if (label.detectedClass === value.name) {
                                this.state.values[i].count = this.state.values[i].count + 1
                                
                            }
                        });
                        i = i + 1
                        
                  })
            

                //  AsyncStorage.setItem("userData", JSON.stringify(user));
              });
            
      
    
  }


  renderResults() {
    const { model, recognitions, imageHeight, imageWidth, result } = this.state;
    console.log(this.state.recognitions )
   
    const {currentUser} = Firebase.auth()
    //console.log(Object.entries(result) )
    const user = {
      uid: currentUser.uid,
      detect: this.state.result
    }
    db.collection('label').doc(currentUser.uid).set(user)

        return result.map((res, id) => {
          var left = res["rect"]["x"] * imageWidth;
          var top = res["rect"]["y"] * imageHeight;
          var width = res["rect"]["w"] * imageWidth;
          var height = res["rect"]["h"] * imageHeight;
          return (
            <View key={id} style={[styles.box, { top, left, width, height }]}>
              <Text style={{ color: 'white', backgroundColor: blue }}>
                {res["detectedClass"] + " " + (res["confidenceInClass"] * 100).toFixed(0) + "%"}
              </Text>
            </View>
          )
        });
      
  }

  onSelectModel() {
  //  this.setState({ model });
  
    tflite.loadModel({
      model: 'models/interior.tflite',// required
      labels: 'models/interior_label.txt',  // required
    },
      (err, res) => {
        if (err)
          console.log(err);
        else
          console.log(res);
      });
  }



  render() {
    const image = 'file://' + this.state.image
    const { model, source, imageHeight, imageWidth } = this.state;

    console.log(this.state.values)
    if (this.state.isPermitted) {
      return (
        
          (this.state.photoTaken === false ? 
          <CameraKitCameraScreen
          actions={{ rightButtonText: 'Done', leftButtonText: 'Cancel' }}
          onBottomButtonPressed={(event) => this.onBottomButtonPressed(event)}
          flashImages={{
            on: require('../media/Camera/flashOn.png'),
            off: require('../media/Camera/flashOff.png'),
            auto: require('../media/Camera/flashAuto.png')
          }}
          cameraFlipImage={require('../media/Camera/cameraFlipIcon.png')}
          captureButtonImage={require('../media/Camera/cameraButton.png')}
          
        />:
         
          //   <ImageBackground
          //   source={{uri: image}}
          //   style={{width: '100%', height: '100%'}}>
          //   <View searchBar style={{...styles.container1, flexDirection: 'row', paddingTop: 15}}>
          //   <Button transparent iconLeft style={{height:40, marginRight: 10}} onPress={() => {this.props.navigation.goBack()}}>
          //     <Icon name="ios-arrow-back" style={{fontSize: 40, color: '#FFFFFF'}}/>
          //   </Button>
    
          //   <Text style={{flex:1, backgroundColor:'transparent',marginTop:5, paddingLeft:10, paddingRight:10, textAlign:'center', fontSize: 23, color: '#FFFF'}}>
              
          //   </Text>
          //   <Button transparent iconRight style={{height:40, paddingLeft: 10, marginRight: 15}} onPress={() => this.renderModel()}>
          //     <Icon name="checkmark" style={{fontSize: 40, color: '#FFFFFF'}} />
          //   </Button>
          // </View>
          //   </ImageBackground>
         
       
          <View style={styles.container}>
         
            <TouchableOpacity style={
              [styles.imageContainer, {
                height: imageHeight,
                width: imageWidth,
                borderWidth: source ? 0 : 2
              }]} onPress={this.onSelectImage.bind(this)}>
              {
                source ?
                  <Image source={source} style={{
                    height: imageHeight, width: imageWidth
                  }} resizeMode="contain" /> :
                        <Image source={{uri:image}} style={{
                    height: imageHeight, width: imageWidth
                  }} resizeMode="contain" />
              }
              <View style={styles.boxes}>
                {this.renderResults()}
              </View>
            </TouchableOpacity>
            
            <View>
              <TouchableOpacity style={styles.button} onPress={this.onSelectModel.bind(this)}>
                <Text style={styles.buttonText}>DETECT</Text>
              </TouchableOpacity>
            </View>
          
        </View>


          )
      )
   
    } else {
        return (
          <View style={styles.container}>
           
          </View>
        );
      }
  }
}


// function resizeImage(path, callback, width = 640, height = 480) {
//   ImageResizer.createResizedImage(path, width, height, 'JPEG', 80).then((resizedImageUri) => {
//       callback(resizedImageUri);

//   }).catch((err) => {
//       console.error(err)
//   });
// }

//run filter for frontend side logic (filter for hotdog, if you wanna do a "is hotdog or not" app)
// function filterLabelsList(response, minConfidence = 0) {
//   let resultArr = [];
//   response.labelAnnotations.forEach((label) => {
//       if (label.score > minConfidence) {
//           resultArr.push(label);
//       }
//   });
//   return resultArr;
// }


// async function checkForLabels(base64) {

//   return await
//       fetch(config.googleCloud.api + config.googleCloud.apiKey, {
//           method: 'POST',
//           body: JSON.stringify({
//               "requests": [
//                   {
//                       "image": {
//                           "content": base64
//                       },
//                       "features": [
//                           {
//                               "type": "LABEL_DETECTION", "maxResults": "5"
//                           },
//                           { "type": "IMAGE_PROPERTIES", "maxResults": "5" },
//                       ]
//                   }
//               ]
//           })
//       }).then((response) => {
//           return response.json();
//       }, (err) => {
//           console.error('promise rejected')
//           console.error(err)
//       });
// }

// NativeModules.RNImageToBase64.getBase64String(resizedImageUri, async (err, base64) => {
//   // Do something with the base64 string
//   if (err) {
//       console.error(err)
//   }
//   console.log('converted to base64');
//   // ToastAndroid.show('converted to base64', ToastAndroid.SHORT);

//   let result = await checkForLabels(base64);
//   console.log(result);
//   // ToastAndroid.show(JSON.stringify(result), ToastAndroid.SHORT);

//   //custom filter
//   let filteredResult = filterLabelsList(result.responses[0], 0.3);
//   displayResult(filteredResult);

//   this.setState({
//       loading: false
//   });
// })

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    width: 300,
    marginTop: 16,
  },
  container1: {
    marginTop: Platform.OS == 'ios'? 30 : 0
},
container2: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'white'
},
imageContainer: {
  borderColor: blue,
  borderRadius: 5,
  alignItems: "center"
},
text: {
  color: blue
},
button: {
  width: 200,
  backgroundColor: blue,
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
  borderColor: blue,
  borderWidth: 2,
},
boxes: {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  top: 0,
}
});
export default withNavigation(App);

