import Firebase, { db } from '../../config/Firebase.js'
var nextImageId = 0;
// define types

export const UPDATE_EMAIL = 'UPDATE_EMAIL'
export const UPDATE_PASSWORD = 'UPDATE_PASSWORD'
export const LOGIN = 'LOGIN'
export const SIGNUP = 'SIGNUP'
export const UPDATE_USERNAME = 'UPDATE_USERNAME'
export const SIGNOUT = 'SIGNOUT'
//actions

export const emailUpdate = email => {
    return {
        type: UPDATE_EMAIL,
        payload: email
    }
}

export const passwordUpdate = password => {
    return {
        
        type: UPDATE_PASSWORD,
        payload: password
        
    }
    
}

export const userNameUpdate = name => {
    return {
        type: UPDATE_USERNAME,
        payload: name
    }
}

export const login = () => {
    return async (dispatch, getState) => {
        try {
            const { email, password } = getState().user
            const response = await Firebase.auth().
            signInWithEmailAndPassword(email, password)
           
            
            dispatch(getUser(response.user.uid))
        }
        catch (err) {
            console.log('asdasdadasd')
        }
    }
}

export const getUser = uid => {

    return async (dispatch, getState) => {
        try {
            const user = await db.collection('users')
                    .doc(uid)
                    .get()

            dispatch({ type: LOGIN, payload: user.data() })        
        
        } catch (err) {
            alert (err)
        }
    }
}

export const signup = () => {
    return async (dispatch, getState) => {
        try {
            const { email, password, name } = getState().user
            const response = await Firebase.auth().createUserWithEmailAndPassword(email, password)
            
            if (response.user.uid) {
                const user = {
                    uid: response.user.uid,
                    email: email,
                    name: name,
                    password: password
                }

                db.collection('users')
                    .doc(response.user.uid)
                    .set(user)
                
                dispatch({ type: SIGNUP, payload: user })
            
            }
        } catch (e) {
            alert(e)
        }
    }
}

export const signOut = () => {
    return (dispatch, getState, {getFirebase}) => {
        const firebase = getFirebase();

        firebase.auth().signOut().then(() => {
          
            dispatch({ type: SIGNOUT })
        })
    }
}

export function displayUIScreen(uiScreenToShow) {
    return {
      type: 'DISPLAY_UI_SCREEN',
      ui: uiScreenToShow,
    }
  }
  
  // action to add, to the AR Scene, the model at the given index from data model at path: js/model/ModelItems.js
  export function addModelWithIndex(index) {
    return {
        type:'ADD_MODEL',
        index: index,
    }
  }
  
  // action to remove model with given UUID from AR Scene
  export function removeModelWithUUID(uuid) {
    return {
        type:'REMOVE_MODEL',
        uuid: uuid,
    }
  }
  
  // action to add, to the AR Scene, the portal at the given index from data model at path: js/model/PortalItems.js

  
  // action to remove everything from the AR Scene
  export function removeAll() {
    return {
      type:'REMOVE_ALL',
    }
  }
  
  // action to select model at index, in the listview from data model at path: js/model/ModelItems.js
  export function toggleModelSelection(index) {
    return {
      type: 'TOGGLE_MODEL_SELECTED',
      index: index,
    };
  }
  
  // action to select effect at index, in the listview from data model at path: js/model/EffectItems.js
  export function toggleEffectSelection(index) {
    return {
      type: 'TOGGLE_EFFECT_SELECTED',
      index: index,
    };
  }
  
  // action to switch ListView to show Objects, Effects or Portals
  export function switchListMode(listMode, listTitle) {
    return {
      type: 'SWITCH_LIST_MODE',
      listMode: listMode,
      listTitle: listTitle,
    };
  }
  
  // action to change state of individual ListView items between NONE, LOADING, ERROR, LOADED (path: js/redux/LoadingStateConstants.js)
  export function changeModelLoadState(uuid, loadState) {
    return {
      type: 'CHANGE_MODEL_LOAD_STATE',
      uuid: uuid,
      loadState: loadState,
    };
  }
  

  
  // action to change state of individual ListView items to determine while item is clicked -> for triggering listview animations
  export function changeItemClickState(index, clickState, itemType) {
    return {
      type: 'CHANGE_ITEM_CLICK_STATE',
      index: index,
      clickState: clickState,
      itemType: itemType,
    };
  }
  
  // action to show / hide AR Initialization UI to guide user to move device around
  export function ARTrackingInitialized(trackingNormal) {
    return {
      type: 'AR_TRACKING_INITIALIZED',
      trackingNormal: trackingNormal,
    };
  }