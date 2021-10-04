import React, { Component } from 'react';
import {
  ActivityIndicator,
  Text,
  View,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import config from '../config/config';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class GetNews extends Component {
  state = {
    news: [],
  };
  componentDidMount() {
    this.props.navigation.setOptions({
      title: this.props.route.params.category,
    });

    fetch(
      `https://newsapi.org/v2/top-headlines?category=${this.props.route.params.category}&country=us&apiKey=${config.API_KEY}`
    )
      .then((res) => res.json())
      .then((response) => {
        if (response.articles.length !== 0) {
          this.setState({ news: response.articles });
          console.log(
            'The total amount of articles is: ',
            this.state.news.length
          );
        } else {
          Alert.alert('Sorry, no articles in this category').then(
            navigation.navigate('TrendingNews')
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  render() {
    return (
      <View style={{ alignItems: 'center', backgroundColor: '#E7C4B1' }}>
        {this.state.news.length === 0 ? (
          <ActivityIndicator
            style={{
              height: deviceHeight,
              width: deviceHeight,
              justifyContent: 'center',
              alignItems: 'center',
              color: '#131200',
            }}
            size='large'
            color='#131200'
          />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {this.state.news.map((news, index) =>
              news.urlToImage ? (
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    this.props.navigation.navigate('WebView', { url: news.url })
                  }
                >
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      backgroundColor: '#FFFBFF',
                      borderRadius: 10,
                      elevation: 4,
                      width: deviceWidth - 30,
                      marginVertical: 7,
                    }}
                  >
                    <Image
                      source={{ uri: `${news.urlToImage}` }}
                      style={{ height: 100, width: 100, borderRadius: 10 }}
                    />
                    <Text
                      style={{
                        width: deviceWidth - 130,
                        paddingLeft: 10,
                        paddingTop: 5,
                      }}
                    >
                      {news.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : null
            )}
          </ScrollView>
        )}

        <Text> {this.props.route.params.category} </Text>
      </View>
    );
  }
}

export default GetNews;
