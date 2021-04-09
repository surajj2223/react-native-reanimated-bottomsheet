/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';

import BottomSheet from 'react-native-reanimated-bottomsheet';

const App: () => React.ReactNode = () => {
  const sheetContent = (): React.ReactNode => (
    <View style={styles.sheetContentContainer} />
  );

  const sheetHeader = (): React.ReactNode => (
    <View style={styles.sheetHeaderContainer}>
      <View style={styles.knob} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <BottomSheet
        snapPoints={[200, 400, 600]}
        renderContent={sheetContent}
        renderHeader={sheetHeader}
      />
      <Text>Welcome to the BottomSheet example.</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetHeaderContainer: {
    height: 30,
    backgroundColor: '#282727',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  knob: {
    width: 40,
    height: 5,
    borderRadius: 5,
    backgroundColor: '#72706F',
  },
  sheetContentContainer: {
    flex: 1,
    backgroundColor: '#282727',
  },
});
export default App;
