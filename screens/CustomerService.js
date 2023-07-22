import * as React from 'react';
import {Image, Button, onPressLearnMore, View, Text, SafeAreaView, StyleSheet, TextInput, ImageBackground, TouchableOpacity} from 'react-native';
import globe from '../assets/icons/globe.png'
import Question_fill from '../assets/icons/Question_fill.png'
import m1 from "../assets/m1.png"
import {NavigationContainer, useNavigation} from "@react-navigation/native";
import Dell_fill from '../assets/icons/Dell_fill.png'
import LogIn from './LogIn.js'

function CustomerService(){
  const navigation = useNavigation();
  const buttonClickedHandler = () =>{
      console.log('You clicked a button');
  }
  return(
    <View style={styles.container}>
      <ImageBackground source={m1}
      resizeMode="cover" style={styles.image}>
        <View style={styles.description}>
        <TouchableOpacity onPress= {()=> navigation.navigate('LogIn')} style={styles.exitButton}><Image source={Dell_fill}></Image></TouchableOpacity>
          <Text style={styles.describingText}>
            문의/고객센터{'\n'}
            Customer Service
          </Text>
          <TouchableOpacity onPress= {buttonClickedHandler} style={styles.koreanButton}>
            <Text style={styles.inText}>
              e-mail: rhdtn1244@gmail.com{'\n'}{'\n'}
              오류 발생 시, 최신 버전으로
              업데이트 해보시길 권고드립니다.{'\n'}{'\n'}
              If there's an error, please
              update the app to the latest
              version.
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
    // 로그인 페이지로 이동하는 버튼 
    //<Button title="go to main" onPress={()=>navigation.navigate('LogIn')}/>
    //<Button onPress={onPressLearnMore} title="+" style={styles.roundButton} />
  );
};

const styles = StyleSheet.create({
    container:{
      flex:1,
    },
    description:{
      height: '50%',
      width: '100%',
      borderRadius: 30,
      backgroundColor: 'rgba(177,137,176,0.8)',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: "center",  
      position: 'absolute',
      bottom: '25%',
      textAlign: 'center',
    },
    image:{
      flex: 1,
      justifyContent: 'center',
    },
    koreanButton:{
      width: '90%',
      height: '65%',
      bottom: '5%',
      backgroundColor: '#E1BFDF',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
      alignSelf: "center",  
      position: 'absolute',
    },
    exitButton:{
      width: 50,
      height: 50,
      backgroundColor: '#E1BFDF',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50,
      top: 10,
      right: 10,
      position: 'absolute',
      borderColor: '#6E8D9D',
      borderWidth: 2,
    },
    describingText:{
      top: '9%',
      fontSize: 24,
      fontWeight: '400',
      textAlign: 'center',
      position: "absolute",
    },
    inText: {
      fontSize: 24,
      fontWeight: '400',
    }
  });

export default CustomerService;