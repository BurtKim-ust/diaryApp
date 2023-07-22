import * as React from 'react';
import {Image, Button, onPressLearnMore, View, Text, SafeAreaView, StyleSheet, TextInput, ImageBackground, TouchableOpacity} from 'react-native';
import globe from '../assets/icons/globe.png'
import Dell_fill from '../assets/icons/Dell_fill.png'
import m1 from "../assets/m1.png"
import {NavigationContainer, useNavigation} from "@react-navigation/native";
import LogIn from './LogIn.js'

function ChooseLanguage(){
  const navigation = useNavigation();
  const buttonClickedHandler = () =>{
      console.log('You clicked a button');
  }
  return(
    <View style={styles.container}>
      <ImageBackground source={m1}
      resizeMode="cover" style={styles.image}>
        <View style={styles.description}>
          <Text style={styles.describingText}>
            Select Your Language
          </Text>
          <TouchableOpacity onPress= {buttonClickedHandler} style={styles.koreanButton}><Text style={styles.inText}>한국어</Text></TouchableOpacity>
          <TouchableOpacity onPress= {buttonClickedHandler} style={styles.englishButton}><Text style={styles.inText}>ENGLISH</Text></TouchableOpacity>
          <TouchableOpacity onPress= {()=> navigation.navigate('LogIn')} style={styles.exitButton}><Image source={Dell_fill}></Image></TouchableOpacity>
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
      height: '20%',
      backgroundColor: '#E7A6BD',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
      bottom: '45%',
      alignSelf: "center",  
      position: 'absolute',
    },
    englishButton:{
      width: '90%',
      height: '20%',
      backgroundColor: '#E7A6BD',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
      bottom: '20%',
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
        borderColor: '#6E8D9D',
        borderWidth: 2,
        top: 10,
        right: 10,
        position: 'absolute',
    },
    describingText:{
      top: '15%',
      fontSize: 24,
      fontWeight: '400',
      position: "absolute",
    },
    inText: {
      fontSize: 32,
      fontWeight: '400',
    }
  });

export default ChooseLanguage;