import { StackNavigator } from 'react-navigation'
import DeviceListScreen from '../Containers/DeviceListScreen'
import LaunchScreen from '../Containers/LaunchScreen'

import styles from './Styles/NavigationStyles'

// Manifest of possible screens
const PrimaryNav = StackNavigator({
  DeviceListScreen: { screen: DeviceListScreen },
  LaunchScreen: { screen: LaunchScreen }
}, {
  // Default config for all screens
  headerMode: 'none',
  initialRouteName: 'DeviceListScreen',
  navigationOptions: {
    headerStyle: styles.header
  }
})

export default PrimaryNav
