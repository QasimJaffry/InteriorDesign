
import { combineReducers } from 'redux';
import arobjects from './arobjects';
import ui from './ui';

// Combine Reducers for redux for handling state changes in the AR Scene (3D Viro Components) and React-Native UI components
module.exports = combineReducers({
  arobjects, ui
});
