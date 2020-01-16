import React from 'react';
import { StyleSheet, Text, View, YellowBox, ART } from 'react-native';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import reducer from './components/reducers/index';
import Index from './components/index.js'
import { createAppContainer, createSwitchNavigator  } from "react-navigation";
import {createStackNavigator} from 'react-navigation-stack';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer'; 
import Main from './components/Main'
import SignUp from './components/signUp'
import MyProfile from './components/profile'
import SideBar from './components/sideBar'
import Camera from './components/camera'
import Logout from './components/logout'
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import login from './components/login'
import Loading from './components/Loading'
import { Transition } from 'react-native-reanimated';
import Login from './components/index.js';
import Ar from './components/App.js';
import Favourites from './components/favourties'
import ForgotPassword from './components/passwordForgot.js'
console.ignoredYellowBox = ['Warning: Each', 'Warning: componentWillReceivedProps', 'Warning: Setting a timer'];
console.disableYellowBox = true;
console.ignoredYellowBox = ['Setting a timer'];
/*function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}
*/

const middleware = applyMiddleware(thunkMiddleware)
const store = createStore(reducer, middleware)

export default class App extends React.Component {

  constructor(){
    super()
    this.state={
      isReady: false
    }
  }

  async _loadAssetsAsync() {
    const imageAssets = cacheImages([require('./media/bg.jpeg')]);

   // const fontAssets = ([FontAwesome.font]);

    await Promise.all([...imageAssets]);
  }

  render(){

    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    )

  }
}

const AppNavigator = createStackNavigator({
  Home: {
    screen: Main
  }

 },{
   headerMode: 'none',
 }
);


const HomeScreenRouter = createDrawerNavigator(
  {
    Stack: {
      screen: AppNavigator
    },
    Profile: {
      screen: MyProfile
    },
    Favourites: {
      screen: Favourites
    },
    Logout:{
      screen: Logout
    }
      
  },
  {
    contentComponent: props => <SideBar {...props} />,
    drawerOpenRoute: "DrawerOpen",
    drawerCloseRoute: "DrawerClose",
    drawerToggleRoute: "DrawerToggle",
    drawerBackgroundColor: "transparent ",
  }
);

const AppNavigator2 = createStackNavigator({
  Drawer: {
    screen: HomeScreenRouter
    },
    Camera : {
      screen: Camera
    },
     AR: {
       screen: Ar
     }
   
},{
  headerMode: 'none'
});

const AppNavigator3 = createSwitchNavigator({
  Stack2: {
    screen: AppNavigator2
    },
    Start : {
      screen: Index
    },
    SignUp : {
      screen: SignUp
    },
    Login: {
      screen: login
    },
    Loading: {
      screen: Loading
    },
    ForgotPassword : {
      screen: ForgotPassword
    }
},{
  //transition: (
  //  <Transition.Together>
   //   <Transition.Out
   //     type="slide-bottom"
   //     durationMs={400}
   //     interpolation="easeIn"
   //   />
   //   <Transition.In type="fade" durationMs={500} />
   // </Transition.Together>
  //),
  initialRouteName: "Loading",
 
  headerMode: 'none'
});

const AppContainer = createAppContainer(AppNavigator3);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
