import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  EmitterSubscription,
} from 'react-native';
import SampleNativeModule from 'react-native-sample-native-module';

type Props = {};

type State = {
  deviceName?: string;
  sum?: number;
};

export default class App extends React.Component<Props, State> {
  state: State = {};
  lifecycleEventListener?: EmitterSubscription;

  runPickMedia = async () => {
    const result = await SampleNativeModule.pickMedia({
      mediaType: SampleNativeModule.PHOTO_MEDIA_TYPE,
      title: 'Pick audio',
    });
    console.log(result);
  };

  calculateSum = () => {
    SampleNativeModule.sum(
      Math.round(1000 * Math.random()),
      Math.round(100 * Math.random()),
      (result: number) => this.setState({ sum: result })
    );
  };

  componentDidMount() {
    SampleNativeModule.getDeviceName().then(value =>
      this.setState({
        deviceName: value,
      })
    );
    this.lifecycleEventListener = SampleNativeModule.registerActivityLifecycleListener(
      event => console.log(event)
    );
  }

  componentWillUnmount() {
    if (this.lifecycleEventListener) {
      this.lifecycleEventListener.remove();
    }
  }

  render() {
    const { deviceName, sum } = this.state;
    return (
      <View style={styles.container}>
        <Text>Device name: {deviceName}</Text>
        <TouchableOpacity onPress={this.calculateSum}>
          <Text>Sum: {sum}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.runPickMedia}>
          <Text>PICK MEDIA</Text>
        </TouchableOpacity>
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
});
