import React, { Component } from 'react'
import { ScrollView, Text, TextInput, View, Switch, FlatList, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

import * as firebase from 'firebase';
import firebaseConfig from '../../keys/gui-keys';

const firebaseApp = !firebase.apps.length ? firebase.initializeApp(firebaseConfig.keys) : firebase.app();

firebaseApp.auth().signInWithEmailAndPassword(firebaseConfig.emailAuthentication.email, firebaseConfig.emailAuthentication.password).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});

// Styles
import styles from './Styles/DeviceListScreenStyle'

class DeviceListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      result: 'NONE',
      status: 'SYNC'
    }
    this.cupsRef  = firebaseApp.database().ref('dead_inside/devices');
    this.inputRef = firebaseApp.database().ref('dead_inside/input');
    this.masterIO = firebaseApp.database().ref('dead_inside/masterIO');
    this.result   = firebaseApp.database().ref('dead_inside/masterIO/output/result');
  }

  getRef() {
    return firebaseApp.database().ref('dead_inside/devices');
  }

  componentDidMount() {
    this.listenForCups(this.cupsRef);
    this.listenForResult(this.result);
  }

  listenForResult(ref) {
    ref.on('value', (snap) => {
      this.setState({
        result: snap.val()
      })
    })
  }

  listenForCups(cupsRef) {
    cupsRef.on('value', (snap) => {
      const cups = []
      snap.forEach((cup) => {
        if (cup.val().id) {
          cups.push({
            key: cup.val().id,
            mode: cup.val().mode,
            nickname: cup.val().nickname,
            nicknameUpdated: false
          })
        }
      })
      this.setState({
        data: cups
      })
    })
  }

  editingEnd = (e, key) => {
    const text = e.nativeEvent.text;
    if (text.length) {
      this.cupsRef.child(key).update({nickname: text});
    }
  }

  inputChange = (text, key) => {
    /** get index of current cup being edited */
    const cupIndex = this.state.data.findIndex(cup => cup.key === key);
    /** because this is an array of objects, we can't use typical 'shallow' cloning methods like slice or the spread operator */
    const newState = this.state.data.map(data => {
      return {...data};
    });
    /** mutate new state */
    newState[cupIndex].nickname = text;
    newState[cupIndex].nicknameUpdated = true;
    /** update state */
    // this.setState({data: newState});
  }

  updateInput = (id, mode) => {
    this.inputRef.push().set({
      id: id,
      mode: mode
    });
  }

  _renderItem = ({item}) => {
    const placeholder = item.nickname || item.key;
    return (
      <View style={styles.listItem}>
        <View style={{paddingLeft: 4}}>
          <Text style={{fontWeight: 'bold'}}>{placeholder}</Text>
          <Text style={{fontSize: 10, fontWeight: 'bold'}}>CURRENT MODE: {item.mode}</Text>
        </View>
        <TextInput
          onEndEditing={e => this.editingEnd(e, item.key)}
          placeholder={"Give \"" + placeholder.toString() + "\" another name"}
        />
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={[styles.buttonGroupButton]} onPress={(e) => this.updateInput(item.key, 'RAINBOW')}>
            <Text style={styles.buttonText}>Rainbow</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={[styles.buttonGroupButton]} onPress={(e) => this.updateInput(item.key, 'SHUFFLE')}>
            <Text style={styles.buttonText}>Shuffle</Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={[styles.buttonGroupButton]} onPress={(e) => this.updateInput(item.key, 'OFF')}>
            <Text style={styles.buttonText}>Off</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render () {
    return (
      <ScrollView>
        <FlatList
          styles={{paddingBottom: 160}}
          data={this.state.data}
          extraData={this.state.data}
          renderItem={this._renderItem}
        />
        <View style={{paddingBottom: 80}}>
          <Text style={{textAlign: 'center', paddingTop: 40, paddingLeft: 20, paddingRight: 20, fontSize: 10, fontWeight: 'bold'}}>APPLY TO ALL:</Text>
          <TouchableOpacity style={styles.button} onPress={(e) => this.updateInput(0, 'SHUFFLE')}>
            <Text style={styles.buttonText}>Shuffle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={(e) => this.updateInput(0, 'RAINBOW')}>
            <Text style={styles.buttonText}>Rainbow</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={(e) => this.updateInput(0, 'OFF')}>
            <Text style={styles.buttonText}>Off</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.button} onPress={(e) => this.updateInput(0, 'SYNC')}>
            <Text style={styles.buttonText}>Sync</Text>
          </TouchableOpacity> */}
          {/* <Text style={{textAlign: 'center', paddingTop: 20}}>{this.state.result}</Text> */}
        </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeviceListScreen)
