import React, {useState, useEffect} from 'react'
import {Image, Button, View, Text, SafeAreaView, StyleSheet, TextInput, ImageBackground, TouchableOpacity} from 'react-native';
import globe from '../assets/icons/globe.png'
import Question_fill from '../assets/icons/Question_fill.png'
import m1 from "../assets/m1.png"
import {NavigationContainer, useNavigation} from "@react-navigation/native";
import Dell_fill from '../assets/icons/Dell_fill.png'
import Search from '../assets/icons/Search.png'
import Add_ring_fill from '../assets/icons/Add_ring_fill.png'
import Setting_fill from '../assets/icons/Setting_fill.png'
import {connect} from 'react-redux'
import firebase from 'firebase/app';
import 'firebase/firestore';
import { getAuth } from 'firebase/auth';
//import {currentUser} from './HomeScreen';

function ContactBox(props){
  return(
    <TouchableOpacity style={styles.contactBox}>
        <View style={styles.profilePicture}/>
        <Text style={styles.profileText}>{props.name}</Text>
    </TouchableOpacity>
  );
}

function ContactBoxs(props){
  return(
    <View style={{flex:1}}>
      {props.names.map((name, i) => (
        <ContactBox key={i} name={name} currentUser={props.currentUser}/>
      ))}
    </View>
  );
}

function Contacts(props){
  
    const navigation = useNavigation();
    const [names, setNames] = useState([]);
    const [user, setUser] = useState(props.currentUser);
    
    useEffect(()=> {
      
      console.log('currentUser:', props.currentUser);
      if(props.uid === getAuth().currentUser.uid){ //we are trying to access out own profile
        setUser(props.currentUser)

      }
      const tempNames = [];
      console.log("props.usersLoaded:",props.usersLoaded);
      //console.log("props.following.length:", props.following.length)
      if(props.usersLoaded==props.following.length){
        for(let i=0;i<props.following.length; i++){
          const user = props.users.find(el=>el.uid ===props.following[i]);
          tempNames[i]=user.name;
        }
        setNames(tempNames);
      }
    }, [props.following])

    return(
      <View style={styles.container}>
        <ImageBackground source={m1}
        resizeMode="cover" style={styles.image}>
          <View style={styles.frame}>
            <SafeAreaView style={{flex:1, width: '100%', height: '100%'}}>
              <View flexDirection='row' justifyContent='space-between' style={{alignItems:'center'}} >
                <Text style={styles.title}>연락처</Text>
                <View flexDirection='row' justifyContent="flex-end" >
                  <TouchableOpacity onPress= {()=> navigation.navigate('FriendRequest', { userName: user.name })} style={styles.button2}>
                    <Image source={Add_ring_fill} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress= {()=> navigation.navigate('')} style={styles.button1}>
                      <Image source={Setting_fill} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress= {()=> navigation.navigate('HomeScreen')} style={styles.exitButton}>
                    <Image source={Dell_fill} />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity onPress= {()=> navigation.navigate('')} style={styles.frame2}>
                  <Image source={Search} />
                  <Text style={styles.search}>검색</Text>
              </TouchableOpacity>
              <View style={styles.frame3}>
                  <View style={styles.profileBox}>
                      <View style={styles.profilePicture}/>
                      <Text style={styles.myProfileText}>{user.name}</Text>
                  </View>
                  <ContactBoxs names={names} currentUser={user.name}/>
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
      profileBox:{
        width: '95%',
        height: '12%',
        borderColor: '#CD9ECC',
        alignSelf:'center',
        borderRadius: 5,
        borderWidth: 1.5,
        top: "4%",
        marginBottom: "8%",
        flexDirection: 'row',
      },
      profilePicture:{
        height: '100%',
        borderColor: '#CD9ECC',
        aspectRatio: 1,
        borderRadius: '50%',
        borderWidth: 1,
        left: '2%',
      },
      contactBox:{
        width: '95%',
        height: '9%',
        borderColor: '#CD9ECC',
        alignSelf:'center',
        borderRadius: 5,
        borderWidth: 1,
        marginTop: "1%",
        flexDirection: 'row',
      },
      search:{
        fontSize: 22,
        fontWeight: '400',
        padding: 8,
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
      frame2:{
        height: '6%',
        width: '90%',
        borderRadius: 30,
        backgroundColor: '#E1BFDF',
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: "center",  
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 10,
      },
      frame3:{
        flex: 1,
        width: '90%',
        borderRadius: 30,
        backgroundColor: '#E1BFDF',
        alignSelf: "center",  
        flexDirection: "column",
        marginBottom: 15, // Add margin at the bottom
      },
      image:{
        flex: 1,
        justifyContent: 'center',
      },
      title:{
        fontSize: 24,
        fontWeight: '400',
        left: 30,
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
        marginRight: 10,
        
      },
      button1:{
        width: 50,
        height: 50,
        backgroundColor: '#A381A1',
        borderColor: '#6E8D9D',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        marginRight: 10,
      },
      button2:{
        width: 50,
        height: 50,
        backgroundColor: '#A381A1',
        borderColor: '#6E8D9D',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        marginRight: 10,
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
      },
      myProfileText:{
        fontWeight: '400',
        fontSize: 40,
        left: '20%',
        alignSelf: 'center',
      },
      profileText:{
        fontWeight: '400',
        fontSize: 24,
        left: '60%',
        alignSelf: 'center',
      },
    });
  
    const mapStateToProps = (store) =>({
      currentUser: store.userState.currentUser,
      following: store.userState.following,
      users: store.usersState.users,
      usersLoaded: store.usersState.usersLoaded,
    })

  export default connect(mapStateToProps, null)(Contacts);