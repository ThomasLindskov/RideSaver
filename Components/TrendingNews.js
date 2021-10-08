import React, { useState, Component } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Image } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import config from '../config';

class TrendingNews extends Component {
  //   const [news] = useState([]);

  state = {
    news: [],
  };

  componentDidMount() {
    fetch(
      `https://newsapi.org/v2/top-headlines?country=us&apiKey=${config}`
    )
      .then((res) => res.json())
      .then((response) => {
        this.setState({ news: response.articles });
        console.log(
          'The total amount of articles is: ',
          this.state.news.length
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <View>
        {this.state.news.length === 0 ? (
          <ActivityIndicator color='#131200' size='large' />
        ) : (
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {this.state.news.map((news, index) => (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  this.props.navigation.navigate('WebView', { url: news.url })
                }
              >
                <View style={{ margin: 10 }}>
                  <Image
                    source={{ uri: `${news.urlToImage}` }}
                    style={{ height: 200, width: 200, borderRadius: 10 }}
                  />
                  <Text style={{ width: 200, textAlign: 'justify' }}>
                    {news.title}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    );
  }
}

export default TrendingNews;

const styles = StyleSheet.create({});
