import {
  createRouter,
} from '@expo/ex-navigation';

import AuthenticationScreen from '../screens/AuthenticationScreen';
import EventListScreen from '../screens/EventListScreen';
import SettingScreen from '../screens/SettingScreen';
import EditScreen from '../screens/EditScreen';
import GeneralInfoScreen from '../screens/GeneralInfoScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
import TabNavigationLayout from './TabNavigationLayout';


export default createRouter(() => ({
  authentication: () => AuthenticationScreen,
  eventList: () => EventListScreen,
  setting: () => SettingScreen,
  generalinfo: () => GeneralInfoScreen,
  eventdetail: () => EventDetailScreen,
  tabNavigation: () => TabNavigationLayout,
}), {
  ignoreSerializableWarnings: true,
});
