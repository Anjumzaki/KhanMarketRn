import 'react-native-get-random-values';
import { AppRegistry, Platform } from 'react-native';
import App from './App';

AppRegistry.registerComponent('khanmarket', () => App);

if (Platform.OS === 'web') {
  const rootTag = document.getElementById('root') || document.getElementById('main');
  AppRegistry.runApplication('khanmarket', { rootTag });
}