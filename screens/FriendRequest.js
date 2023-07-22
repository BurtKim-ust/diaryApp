import React, { useState, useEffect } from 'react';
import {FlatList, Image, Button, onPressLearnMore, View, Text, SafeAreaView, StyleSheet, TextInput, ImageBackground, TouchableOpacity} from 'react-native';
import {NavigationContainer, useNavigation} from "@react-navigation/native";
import m1 from "../assets/m1.png"
import Search from '../assets/icons/Search.png'
import firebase from 'firebase/app';
import 'firebase/firestore';
import ProfileBox from '../components/ProfileBox'
import Dell_fill from '../assets/icons/Dell_fill.png'
import { Timestamp, getFirestore, addDoc, doc, query, where, startAt, endBefore, limit, getDocs, collection } from "firebase/firestore"; 
import { getAuth } from "firebase/auth";

function FriendRequest({route}){
  const {userName} = route.params;
  const navigation = useNavigation();
  const [users,setUsers]=useState([]);
  const db = getFirestore();


  const fetchUsers = (search) => {
    const searchValue = search.trim();
    const startValue = searchValue;
    const endValue = searchValue + '\uf8ff';
  
    const usersQuery = query(
      collection(db, 'users'),
      where('name', '>=', startValue),
      where('name', '<', endValue),
      limit(6)
    );
  
    getDocs(usersQuery)
      .then((snapshot) => {
        let users = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          const user = { id, ...data };
          user.uid = doc.id; // Add uid to user object
          return user;
        });
  
        users = users.filter((user) =>
          user.name.toLowerCase().startsWith(search.toLowerCase())
        );
  
        setUsers(users);
        console.log({ users });
      })
      .catch((error) => {
        console.log('Error fetching users:', error);
      });
  };

  return(
    <View style={styles.container}>
        <ImageBackground source={m1}
        resizeMode="cover" style={styles.image}>
            <View style={styles.frame}>
              <SafeAreaView style={{flex:1, width:'100%'}}>
                <View flexDirection='row' justifyContent='space-between' style={{alignItems:'center'}}>
                  <Text style={styles.title}>이웃 신청 보내기</Text>
                  <TouchableOpacity onPress= {()=> navigation.navigate('HomeScreen')} style={styles.exitButton}>
                    <Image source={Dell_fill} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.midFrame}>
                  <View style={{flex: 1, flexDirection: 'column', alignItems:'center', position: 'absolute', alignSelf: 'center'}}>
                    <View style={{top:'4%', height: '50%', flexDirection:'row', position:'relative'}}>
                      <Image source={Search} />
                      <Text style={{fontWeight:'400', fontSize: 20, alignSelf:'center'}}>유저명으로 검색</Text>
                    </View>
                    <View style={styles.search}>
                      <TextInput
                        style={{width:"100%", height:'100%', textAlign:'center'}}
                        onChangeText={(search)=> fetchUsers(search)}/>
                    </View>
                  </View>

                  <View style={styles.frame3}>
                    <FlatList
                      numColumns={1}
                      horizontal={false}
                      data={users}
                      renderItem={({item})=>(
                        <ProfileBox name={item.name} id={item.id} uid={item.uid} senderName={userName}/>
                      )}/>
                  </View>
                </View>
              </SafeAreaView>
            </View>
        </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
    container:{
      flex:1,
    },
    search:{
      height: '100%',
      width: 240,
      borderRadius: 30,
      borderWidth:1,
      backgroundColor: '#D6B0D3',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: "center",  
      position:'relative',
      textAlign: 'center',
      top:'50%',
    },
    frame:{
      height: '100%',
      width: '100%',
      borderRadius: 40,
      backgroundColor: 'rgba(177,137,176,0.8)',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: "center",  
      position: 'absolute',
      textAlign: 'center',
    },
    midFrame:{
      flex:1,
      width: '90%',
      marginBottom:15,
      borderRadius: 30,
      backgroundColor: '#E1BFDF',  
      marginTop: 10,
      alignSelf: 'center',
    },
    frame2:{
      flex:1,
      alignItems: 'center',
      flexDirection: 'column',
    },
    frame3:{
      width: '90%',
      borderRadius: 10,
      backgroundColor: '#E1BFDF',
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: "center",  
      textAlign: 'center',
      top: '28%',
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
    },
    exitButton:{
      width: 50,
        height: 50,
        backgroundColor: '#A381A1',
        borderColor: '#6E8D9D',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        top: 10,
        right: 10,
        
    },
    profilePicture:{
      height: '100%',
      borderColor: '#D6B0D3',
      aspectRatio: 1,
      borderRadius: '50%',
      borderWidth: 1,
      left: '2%',
    },
    contactBox:{
      width: '95%',
      height: 50,
      borderColor: '#CD9ECC',
      alignSelf:'center',
      borderRadius: 5,
      borderWidth: 1,
      marginTop: 5,
      flexDirection: 'row',
    },
    bottomBox:{
      width: '95%',
      height: 25,
      alignSelf:'center',
      marginTop: 1,
      flexDirection: 'row',
      marginBottom: 5,
    },
    requestBox:{
      width: '50%',
      height: "100%",
      borderColor: '#CD9ECC',
      borderRadius: 5,
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    describingText:{
      top: '9%',
      fontSize: 24,
      fontWeight: '400',
      textAlign: 'center',
      position: "absolute",
    },
    title:{
      fontSize: 24,
      fontWeight: '400',
      left:30,
      marginTop:15
    },
    inText: {
      fontSize: 24,
      fontWeight: '400',
    },
    profileText:{
      fontWeight: '400',
      fontSize: 24,
      left: '30%',
      alignSelf: 'center',
    },
    idText:{
      fontWeight: '200',
      fontSize: 12,
      left: '90%',
      alignSelf: 'center',
    },

  });



export default FriendRequest;