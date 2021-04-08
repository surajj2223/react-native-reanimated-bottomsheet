# react-native-reanimated-bottomsheet

A confifigurable and performant BottomSheet widget for React Native apps built using Reanimated v2 API.

## Installation

```sh
yarn install react-native-reanimated-bottomsheet
```
#### Dont forget to install Reanimated and GestureHandler libraries

```sh
yarn install react-native-reanimated
yarn install react-native-gesture-handler
```
#### Add Reanimated's babel plugin to your `babel.config.js`
```js
 module.exports = {
      ...
      plugins: [
          ...
          'react-native-reanimated/plugin',
      ],
  };
```
* Note: Reanimated plugin has to be listed last.

Thats it! You are done with installation!


## Usage

```js
import ReanimatedBottomsheet from "react-native-reanimated-bottomsheet";

 <ReanimatedBottomsheet
    snapPoints={[200, 400, 450]}
    renderContent={sheetContent}
    renderHeader={sheetHeader} />

```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
