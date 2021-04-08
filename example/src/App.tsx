/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import BottomSheet from 'react-native-reanimated-bottomsheet';

const App: () => React.ReactNode = () => {
  const sheetContent = (): React.ReactNode => (
    <FlatList
      style={{ padding: 10 }}
      data={[
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
      ]}
      renderItem={() => (
        <View
          style={{ backgroundColor: 'yellow', height: 30, marginBottom: 5 }}
        />
      )}
    />
  );

  const sheetHeader = (): React.ReactNode => (
    <View
      style={{
        height: 30,
        backgroundColor: '#D2CECD',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
      }}
    />
  );

  return (
    <BottomSheet
      snapPoints={[200, 400, 450]}
      renderContent={sheetContent}
      renderHeader={sheetHeader}
    />
  );
};
export default App;
