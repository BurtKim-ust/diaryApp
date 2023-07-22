import React, {Component, useState} from 'react';
import {Image, Button, onPressLearnMore, View, Text, SafeAreaView, StyleSheet, TextInput, ImageBackground, TouchableOpacity} from 'react-native';
import globe from '../assets/icons/globe.png'
import firebase from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import Question_fill from '../assets/icons/Question_fill.png'
import m1 from "../assets/m1.png"

export class LogIn extends Component {
  constructor(props){
    super(props);

    this.state={
        email: '',
        password: '',
    }
    this.onSignUp=this.onSignUp.bind(this)
    
  }
  
  onSignUp(){
      const auth = getAuth();
      const {email, password} = this.state;
      signInWithEmailAndPassword(auth,email,password)
      .then((result)=>{
        console.log(result)
    })
    .catch((error)=>{
        console.log(error)
    })
  }
  componentDidMount(){
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if(!user){
        this.setState({
          loggedIn: false,
          loaded: true,
        })
      }else{
        this.setState({
          loggedIn: true,
          loaded: true,
        })
      }
    })
  }
  render(){
    const {navigation} =this.props;
    
    return(
      <View style={styles.container}>
        <ImageBackground source={m1}
        resizeMode="cover" style={styles.image}>
          <View style={styles.container}>
            <View style={styles.inputContainer}>
              <TextInput
              style={styles.emailTextInput}
              placeholder="email"
              onChangeText={(email) => this.setState({email})}
              autoCapitalize="none"
              keyboardType="email-address"
              />
              <TextInput
              style={styles.passwordTextInput}
              placeholder="password"
              onChangeText={(password) => this.setState({password})}
              secureTextEntry={true}
              />
              <TouchableOpacity onPress={()=>{this.onSignUp()}} style={styles.logInButton}><Text style={styles.inText}>Log In</Text></TouchableOpacity>
              <TouchableOpacity style={styles.signUpButton} onPress= {()=> navigation.navigate('SignUp')}><Text style={styles.inText}>Sign Up</Text></TouchableOpacity>
              
            </View>
            <TouchableOpacity onPress= {()=> navigation.navigate('ChooseLanguage')} style={styles.roundButton1}><Image source={globe}></Image></TouchableOpacity>
              <TouchableOpacity onPress= {()=> navigation.navigate('CustomerService')} style={styles.roundButton2}><Image source={Question_fill}></Image></TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }
};

const styles = StyleSheet.create({
    container:{
      flex:1,
      
    },
    image:{
      flex: 1,
      justifyContent: 'center',
    },
    inputContainer: {
      flex:1,
      alignSelf: 'center',
      paddingHorizontal: 20,
      marginTop: 50,
      marginBottom: 20,
    },
    emailTextInput:{
      width: '68%', 
      height: '7%', 
      borderWidth: 1, 
      marginBottom: 10, 
      padding: 10, 
      top: '30%',
      opacity: 0.7,
      backgroundColor: '#E7A6BD', 
      borderColor: '#6E8D9D', 
      borderRadius: 10, 
      position: 'absolute', 
      alignItems: 'center',
      justifyContent: 'center', 
      alignSelf: "center",
    },
    passwordTextInput:{
      width: '68%', 
      height: '7%', 
      borderWidth: 1, 
      marginBottom: 10,      
      top: '38%',
      padding: 10, 
      backgroundColor: '#E7A6BD', 
      borderColor: '#6E8D9D', 
      borderRadius: 10, 
      position: 'absolute', 
      alignItems: 'center',
      justifyContent: 'center', 
      opacity: 0.7,
      alignSelf: "center",
    },
    logInButton:{
      width: '68%',
      height: '6%',
      backgroundColor: '#E7A6BD',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 50,
      opacity: 0.5,
      top: '46%',
      borderColor: '#6E8D9D',
      borderWidth: 1,
      alignSelf: "center",  
      position: 'absolute',
    },
    signUpButton:{
      width: '68%',
      height: '6%',
      backgroundColor: '#E7A6BD',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50,
      borderColor: '#6E8D9D',
      opacity: 0.5,
      borderWidth: 1,
      top: '53%',
      alignSelf: "center",  
      position: 'absolute',
    },
    roundButton1:{
        width: 50,
        height: 50,
        backgroundColor: '#E7A6BD',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        borderColor: '#6E8D9D',
        borderWidth: 2,
        bottom: 20,
        right: 80,
        position: 'absolute',
    },
    roundButton2:{
      width: 50,
      height: 50,
      backgroundColor: '#E7A6BD',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50,
      borderColor: '#6E8D9D',
      borderWidth: 2,
      bottom: 20,
      right: 20,
      position: 'absolute',
    },
    inText: {
      fontSize: 24,
      fontWeight: '400',
    }
  });

export default LogIn;