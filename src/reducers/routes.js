import { NavigationActions } from 'react-navigation';

import { AppNavigator } from 'api/AppNavigator';

const mainSceneAction = AppNavigator.router.getActionForPathAndParams('LoginStack');
const initialStateMain = AppNavigator.router.getStateForAction(mainSceneAction);

const initialNavState = AppNavigator.router.getStateForAction(
  initialStateMain,
);


function getCurrentRoute (state) {
  if (state.routes) {
      return getCurrentRoute(state.routes[state.index]);
  }
  return state;
}

export default function (state = initialNavState, action = {}) {
  const newState = AppNavigator.router.getStateForAction(action, state) || state
  newState.currentRoute =  getCurrentRoute(newState).routeName;
  return newState;
}