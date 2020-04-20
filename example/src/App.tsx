import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  EmitterSubscription,
  Image,
} from 'react-native';
import SampleNativeModule from 'react-native-sample-native-module';

const {
  pickMedia,
  PHOTO_MEDIA_TYPE,
  sum,
  getDeviceName,
  registerActivityLifecycleListener,
} = SampleNativeModule;

type Props = {};

type State = {
  deviceName?: string;
  sumResult?: number;
  uri?: string;
};

export default class App extends React.Component<Props, State> {
  state: State = {
    deviceName: undefined,
    sumResult: 0,
    uri: undefined,
  };
  lifecycleEventListener?: EmitterSubscription;

  runPickMedia = async () => {
    const { mediaUri } = await pickMedia({
      mediaType: PHOTO_MEDIA_TYPE,
      title: 'Pick audio',
    });
    this.setState({ uri: mediaUri });
  };

  calculateSum = () => {
    sum(
      Math.round(1000 * Math.random()),
      Math.round(100 * Math.random()),
      (result: number) => this.setState({ sumResult: result })
    );
  };

  componentDidMount() {
    getDeviceName().then(value =>
      this.setState({
        deviceName: value,
      })
    );
    this.lifecycleEventListener = registerActivityLifecycleListener(event =>
      console.log(event)
    );
  }

  componentWillUnmount() {
    if (this.lifecycleEventListener) {
      this.lifecycleEventListener.remove();
    }
  }

  render() {
    const { deviceName, sumResult, uri } = this.state;
    return (
      <View style={styles.container}>
        <Text>Device name: {deviceName}</Text>
        <TouchableOpacity onPress={this.calculateSum}>
          <Text>Sum: {sumResult}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.runPickMedia}>
          <Text>PICK MEDIA</Text>
        </TouchableOpacity>
        {uri && <Image style={styles.image} source={{ uri: uri }} />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  image: {
    height: 200,
    width: 200,
  },
});
