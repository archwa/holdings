import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import * as Font from 'expo-font';

export default class App extends React.Component {
  state = {
    fontLoaded: false,
  };
  
  async componentDidMount() {
    await Font.loadAsync({
      'raleway': require('./assets/fonts/Raleway/Raleway-Regular.ttf')
    });
    this.setState({ fontLoaded: true });
  }
  
  render() {
    const dimensions = Dimensions.get('window');
    return (
      <View style={styles.container}>
        <Image
          source={require('./assets/gghc.png')}
          style={{ width: dimensions.width * 0.8, resizeMode: 'contain' }}
        />
        {
          this.state.fontLoaded ? (
            <Text style={{ fontFamily: 'raleway', fontSize: 18 }}>
              Welcome to the Holdings application.
            </Text>
          ) : null
        }
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
};
