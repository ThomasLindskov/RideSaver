import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

class WebViewComponent extends Component {
  render() {
    return <WebView soruce={{ uri: `${this.props.route.params.url}` }} />;
  }
}

export default WebViewComponent;
