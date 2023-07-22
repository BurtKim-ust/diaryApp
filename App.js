import React, {useState, useEffect, Component, useRef} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text, SafeAreaView, StyleSheet, TextInput, ImageBackground} from 'react-native';
import m1 from "./assets/m1.png"
import "react-native-gesture-handler";
import { initializeApp } from 'firebase/app';
//import { getAnalytics } from "firebase/analytics";

//import firebase from '@react-native-firebase/app';
//import auth from '@react-native-firebase/auth';
//import firestore from '@react-native-firebase/firestore';
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import rootReducer from './redux/reducers'
import firebase from 'firebase/app';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { SettingsProvider } from './screens/SettingsContext';

const Stack = createStackNavigator();

const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk],
});

const firebaseConfig = {
  apiKey: "AIzaSyBc7Lxlz-h7ZCZoFW7AQWMMoJt7lYxT4P0",
  authDomain: "mydiarymay2023.firebaseapp.com",
  projectId: "mydiarymay2023",
  storageBucket: "mydiarymay2023.appspot.com",
  messagingSenderId: "578206422553",
  appId: "1:578206422553:web:1aaafc6f8fc5c398133c88",
  measurementId: "G-1EFQ5VKV7M"
};

initializeApp(firebaseConfig);

import ChooseLanguage from './screens/ChooseLanguage.js'
import CustomerService from './screens/CustomerService.js'
import HomeScreen from './screens/HomeScreen.js'
import SignUp from './screens/SignUp.js'
import LogIn from './screens/LogIn.js'
import CalendarPage from './screens/CalendarPage.js'
import Contacts from './screens/Contacts.js'
import WritingPage from './screens/WritingPage.js'
import MailBox from './screens/MailBox.js'
import ShareDiary from './screens/ShareDiary.js'
import FriendRequest from './screens/FriendRequest.js'
import SendPostCard from './screens/SendPostCard.js';



const App = () => {
  const navigationRef = useRef(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        setLoggedIn(false);
        setLoaded(true);
      } else {
        setLoggedIn(true);
        setLoaded(true);
      }
    });
  }, []);
  if(!loaded){
    return(
      <View style={{flex:1, justifyContent: 'center'}}>
        <Text>Loading</Text>
      </View>
    )
  }
  
  return (
      <Provider store={store}>
        <SettingsProvider>
          <NavigationContainer ref={navigationRef}>
            <Stack.Navigator initialRouteName={loggedIn ? "HomeScreen" : "LogIn"}
            screenOptions={{
              headerShown: false
            }}>
              {!loggedIn ? (
                <>
                  <Stack.Screen name="LogIn" component={LogIn} />
                  <Stack.Screen name="ChooseLanguage" component={ChooseLanguage} />
                  <Stack.Screen name="CustomerService" component={CustomerService} />
                  <Stack.Screen name="SignUp" component={SignUp} />
                </>
              ) : (
                <>
                  <Stack.Screen name="HomeScreen" component={HomeScreen} />
                  <Stack.Screen name="Contacts" component={Contacts} />
                  <Stack.Screen name="WritingPage" component={WritingPage} />
                  <Stack.Screen name="MailBox" component={MailBox} />
                  <Stack.Screen name="ShareDiary" component={ShareDiary} />
                  <Stack.Screen name="CalendarPage" component={CalendarPage} />
                  <Stack.Screen name="FriendRequest" component={FriendRequest} />
                  <Stack.Screen name="SendPostCard" component={SendPostCard} />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </SettingsProvider>
      </Provider>
    
  );
}


const styles = StyleSheet.create({
  container:{
    flex:1,
  },
  image:{
    flex: 1,
    justifyContent: 'center',
  },
});

export default App;