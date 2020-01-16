import * as firebase from 'firebase';
import 'firebase/firestore'
import { API_KEY, AUTH_DOMAIN, DATABASE_URL, PROJECT_ID, MESSAGE_SENDER_ID, APP_ID } from 'react-native-dotenv'

const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    databaseURL: DATABASE_URL,
    projectId: PROJECT_ID,
    storageBucket: 'gs://interiorproject-2567f.appspot.com',
    messagingSenderId: MESSAGE_SENDER_ID,
    appId: APP_ID
}

let Firebase = firebase.initializeApp(firebaseConfig)
export const db = firebase.firestore()
export var storage = firebase.storage();
// avoid deprecated warnings

export default Firebase