/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Button } from 'react-native';

import BottomSheet from 'react-native-reanimated-bottomsheet';

const App: () => React.ReactNode = () => {
  const sheetRef = useRef(null);
  const [sheetStatus, setSheetStatus] = useState<boolean>(false);

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
      <View style={{ flex: 1 }}>
        <Button
          onPress={() => {
            if (sheetStatus) sheetRef.current.close();
            else sheetRef.current.open();
            setSheetStatus(!sheetStatus);
          }}
          title={sheetStatus ? 'close' : 'open'}
        />
        <Text>Welcome to the BottomSheet example.</Text>
      </View>
      <BottomSheet
        ref={sheetRef}
        initialSnap={0}
        snapPoints={[200, 400]}
        renderContent={sheetContent}
        renderHeader={sheetHeader}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#fff',
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
