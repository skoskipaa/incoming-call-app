//app.js
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  PermissionsAndroid,
} from 'react-native';

import CallDetectorManager from 'react-native-call-detection';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      featureOn: false,
      incoming: false,
      number: null,
    };
  }

  componentDidMount() {
    this.askPermission();
  }

  askPermission = async () => {
    try {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
      ]);
      //console.log('PERMISSIONS:', PermissionsAndroid.RESULTS.GRANTED);
      if (PermissionsAndroid.RESULTS.GRANTED === 'granted') {
        console.log('permissions granted successfully');
      } else {
        console.log('permissions denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  startListenerTapped = () => {
    this.setState({featureOn: true});
    this.callDetector = new CallDetectorManager(
      (event, number) => {
        if (event === 'Disconnected') {
          this.setState({incoming: false, number: null});
        } else if (event === 'Incoming') {
          this.setState({incoming: true, number});
        } else if (event === 'Offhook') {
          this.setState({incoming: true, number});
        } else if (event === 'Missed') {
          this.setState({incoming: false, number: null});
        }
      },
      true, // read the phone number of the incoming call [ANDROID]
      () => {}, // callback if your permission got denied [ANDROID] [only if you want to read incoming number] default: console.error
      {
        title: 'Phone State Permission',
        message:
          'This app needs access to your phone state in order to react and/or to adapt to incoming calls.',
      }
    );
  };
  stopListenerTapped = () => {
    this.setState({featureOn: false});
    this.callDetector && this.callDetector.dispose();
  };
  render() {
    return (
      <View style={styles.body}>
        <Text style={styles.text}>
          {this.state.featureOn ? ' ' : 'Laitetaanko numeronhaistelija päälle?'}
        </Text>
        <TouchableHighlight
          onPress={
            this.state.featureOn
              ? this.stopListenerTapped
              : this.startListenerTapped
          }>
          <View
            style={{
              width: 200,
              height: 200,
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: 'grey',
              borderWidth: 3,
              borderRadius: 10,
              backgroundColor: this.state.featureOn ? '#DC5F4F' : '#76AF87',
            }}>
            <Text style={styles.text}>
              {this.state.featureOn ? 'Stop' : 'Start'}
            </Text>
          </View>
        </TouchableHighlight>
        {this.state.incoming && (
          <Text
            style={{
              fontSize: 30,
              color: 'white',
              textAlign: 'center',
            }}>
            Puhelu numerosta {this.state.number}
          </Text>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#8CA558',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    padding: 20,
    fontSize: 20,
  },
});
