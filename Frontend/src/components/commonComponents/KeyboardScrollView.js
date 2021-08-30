import React from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const KeyboardScrollView = (props) => {
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{flexGrow: 1}}
      keyboardShouldPersistTaps="handled">
      {props.children}
    </KeyboardAwareScrollView>
  );
};

export default KeyboardScrollView;
