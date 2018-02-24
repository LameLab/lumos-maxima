import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,

  container: {
    paddingBottom: 160
  },

  button: {
    backgroundColor: '#666',
    padding: 8,
    borderRadius: 4,
    minWidth: 48,
    width: '90%',
    marginTop: 20,
    marginRight: 'auto',
    marginLeft: 'auto'
  },

  buttonText: {
    color: '#ffffff',
    textAlign: 'center'
  },
  
  listItem: {
    padding: 16,
    borderBottomColor: 'transparent'
  },

  buttonGroup: {
    flexDirection: 'row'
  },

  buttonGroupButton: {
    flexBasis: 'auto',
    flexGrow: 0,
    flexShrink: 1,
    backgroundColor: '#666',
    padding: 8,
    borderRadius: 4,
    minWidth: 48,
    marginRight: 4,
    marginLeft: 4
  },


})
