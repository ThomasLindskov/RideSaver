import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
// import WebView from 'react-native-webview-alternative';
import { Dimensions, View } from 'react-native';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const WebViewComponent = ({ route }) => {
    return (
      <WebView
        source={{ uri: `${route.params.url}` }}
        style={{
          width: deviceWidth,
          height: deviceHeight,
        }}
      />
    );
}

export default WebViewComponent;
