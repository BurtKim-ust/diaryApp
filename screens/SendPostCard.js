import React, {useState, useRef} from 'react';
import {Image, FlatList, Modal, Button, onPressLearnMore, View, Text, SafeAreaView, StyleSheet, TextInput, ImageBackground, TouchableOpacity, Alert, TouchableWithoutFeedback, Keyboard} from 'react-native';
import globe from '../assets/icons/globe.png'
import Question_fill from '../assets/icons/Question_fill.png'
import m1 from "../assets/m1.png"
import {NavigationContainer, useNavigation, useRoute} from "@react-navigation/native";
import Send_fill from '../assets/icons/Send_fill.png'
import Dell_fill from '../assets/icons/Dell_fill.png'
import Setting_fill from '../assets/icons/Setting_fill.png'
import box1 from '../assets/shapes/box1.png'
import box2 from '../assets/shapes/box2.png'
import sent1 from '../assets/shapes/sent1.png'
import sent2 from '../assets/shapes/sent2.png'
import postcard1 from '../assets/postcards/postcard1.jpg'
import postcard2 from '../assets/postcards/postcard2.jpg'
import postcard3 from '../assets/postcards/postcard3.jpg'
import postcard4 from '../assets/postcards/postcard4.jpg'
import postcard5 from '../assets/postcards/postcard5.jpg'
import postcard6 from '../assets/postcards/postcard6.jpg'
import {connect} from 'react-redux'
import { Timestamp, getFirestore, addDoc, doc, getDoc, collection, getDocs } from "firebase/firestore"; 
import { getAuth } from "firebase/auth";
import firebase from 'firebase/app';
import 'firebase/firestore';


export default function SendPostCard(){
  const route = useRoute();
  const { name,uid, currentUserUid, currentUserName } = route.params;
  console.log({currentUserUid, currentUserName})
  const navigation = useNavigation();
  const db = getFirestore();
  const [postcardPhoto, setPostcardPhoto] = useState('')
  const [writingMode, setWritingMode] = useState(false)
  const [isSendingMode, setIsSendingMode] = useState(false)
  const [recipientUid, setRecipientUid] = useState(uid);
  const [body, setBody] = useState('');
  const [content, setContent] = useState('')
  const [recipientName, setRecipientName] = useState(name)
  const textInputRef = useRef(null);
  const handleTouchablePress = () => {
    // Dismiss the keyboard when the TouchableWithoutFeedback is pressed
    Keyboard.dismiss();
  };
    
    const postcards = [
      { name: 'postcard1', image: postcard1 },
      { name: 'postcard2', image: postcard2 },
      { name: 'postcard3', image: postcard3 },
      { name: 'postcard4', image: postcard4 },
      { name: 'postcard5', image: postcard5 },
      { name: 'postcard6', image: postcard6 }
    ];

    const handleSendingModeClose = ()=>{
        setIsSendingMode(false);
    }
    const handleImagePress = (item)=>{
        setPostcardPhoto(item.name);
        console.log({postcardPhoto});
    }
    const handleUnwritingMode =()=>{
      setWritingMode(false);
      setPostcardPhoto('');
    }
    const handleWritingMode = () =>{
      if (postcardPhoto !== ""){
          setWritingMode(true);
      }else{
          setWritingMode(false);
          Alert.alert('표지를 먼저 선택해주세요');
      }
      console.log({postcardPhoto})
      console.log({writingMode})
    }
    const handleBlur = () => {
      console.log('handleBlur was triggered')
      textInputRef.current.blur();
    };
    const sendPostCard= async()=>{
    try{
        //console.log({recipientName})
        //console.log({recipientUid})
        const user = getAuth().currentUser;
        console.log("user.uid:"+user.uid)
        console.log("recipientUid:"+ recipientUid)

        //console.log({user})
        // Check if recipient exists
        if (recipientName.length > 0) {
        const postCardData = {
            creation: Timestamp.now(),
            senderUid: user.uid,
            recipientUid: recipientUid,
            senderName: currentUserName,
            recipientName: recipientName,
            body: body,
            postcardNumber: postcardPhoto,
        };
        console.log({postCardData})
        console.log("error here2")
        // Send email using Firebase Firestore
        await addDoc(collection(db, "postCards", "sent", "UserIds", user.uid, "SentPostCards"), postCardData);
        await addDoc(collection(db, "postCards", "received", "UserIds", recipientUid, "ReceivedPostCards"), postCardData);
        // Clear input fields
        textInputRef.current.clear();
        setBody('');

        Alert.alert('Postcard Sent', 'Your id has been sent successfully!');
        } else {
        Alert.alert('Recipient Not Found', 'The recipient id does not exist.');
        }
      } catch (error) {
          console.log('Error sending postcard:', error);
          Alert.alert('Error', 'An error occurred while sending the postcard.');
      }
    }

    return (
      <TouchableWithoutFeedback onPress={handleTouchablePress} style={{flex:1}}>
    <SafeAreaView style={styles.modalContainer}>
        <View flexDirection='row'>
          <Text style={styles.modalTitle}>엽서 보내기</Text>
          <TouchableOpacity title="Close" style={styles.modalContent} onPress= {()=> navigation.navigate('MailBox',{currentUserName: currentUserName})} >
            <Image source={Dell_fill} />
          </TouchableOpacity>
        </View>
        
        {(writingMode||postcardPhoto)? 
        (
        <>
          <View style={{ width:'100%', borderRadius:20, borderWidth:1, justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
            <TouchableOpacity style={{width: '100%', margin: 10, alignItems: 'center', justifyContent: 'center'}} onPress={handleUnwritingMode}>
              <Text style={{fontSize: 16,fontWeight: '400'}}>표지 선택하기</Text>
            </TouchableOpacity>
          </View>
          <View style={{flex:1, width:'100%', borderRadius:20, borderWidth:1, justifyContent: 'flex-start', alignItems: 'center', marginTop: 10}}>
            
            <View style={{top:15,}}>
              <Text style={{fontSize: 16,fontWeight: '400', textDecorationLine: 'underline'}}>엽서 글쓰기 </Text>
            </View>
            <View style={{alignSelf: 'flex-start'}}>
              
                <View style={styles.touchableArea}>
                  <TextInput
                    ref={textInputRef}
                    placeholder="엽서를 써보아요 . . .                                                               "
                    onChangeText={(body)=> setBody(body)}
                    multiline={true}
                    onBlur={handleBlur}
                    style={{fontSize: 14, fontWeight: '400', marginTop:20, alignSelf: 'flex-start',marginLeft: 20}}
                  />
                </View>
            </View>
            <View style={{position: 'absolute', bottom: '6%', width: '100%', alignItems: 'center'}}>
              <TouchableOpacity style={styles.buttonContainer} onPress={()=>sendPostCard()}>
                <Text>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
          
        </>
        ):(
        <>
          <View style={{height: '45%', width:'100%', borderRadius:20, borderWidth:1, justifyContent: 'flex-start', alignItems: 'center', marginTop: 10}}>
              <View style={{top:15,}}>
                <Text style={{fontSize: 16,fontWeight: '400', textDecorationLine: 'underline'}}>표지 선택하기 </Text>
              </View>
              <View style={{marginTop: '9%', justifyContent: 'flex-start', alignItems: 'flex-start', alignSelf: "center", textAlign: 'center',}}>
                <FlatList
                  numColumns={3}
                  horizontal={false}
                  data={postcards}
                  renderItem={({item})=>(
                      <TouchableOpacity style={styles.postcardContainer} onPress={()=>handleImagePress(item)}>
                        <Image
                          source={item.image}
                          style={styles.postcardImage} 
                        />
                      </TouchableOpacity>
                  )}/>
              </View>
          </View>
          <View style={{ width:'100%', borderRadius:20, borderWidth:1, justifyContent: 'center', alignItems: 'center', marginTop: 5}}>
            <TouchableOpacity style={{width: '100%', margin: 10, alignItems: 'center', justifyContent: 'center'}} onPress={handleWritingMode}>
              <Text style={{fontSize: 16,fontWeight: 400}}>엽서 글쓰기</Text>
            </TouchableOpacity>
          </View>
        </>)}
        
      </SafeAreaView>
      </TouchableWithoutFeedback>
    )
}
const styles = StyleSheet.create({
    container:{
      flex:1,
    },
    touchableArea: {
      flex: 1,
    },
    buttonContainer:{
      width: 50,
      backgroundColor: '#A381A1',
      borderWidth: 2,
      borderColor:'#A381A1',
      alignItems: 'center',
      borderRadius: 20,
      position: 'absolute',
      right:'6%',
    },
    modalContainer: {
      flex:1,
      alignItems: 'center',
      backgroundColor: '#E1BFDF', // Add a background color for the modal container
      paddingHorizontal: 20,
      
    },
    modalContent: {
      width: 50,
      height: 50,
      //backgroundColor: '#E1BFDF',
      //borderColor: '#E1BFDF',
      left:'50%',
      paddingTop:4,
      borderRadius: 50,
      position: 'absolute'
      
    },
    modalTitle:{
      fontSize: 24,
      fontWeight: '400',
      alignSelf:'center', 
      textAlign:'center',
      justifyContent: 'center'
    },
    boxContainer1:{
      left:0,
      alignItems: 'center',
      justifyContent: 'center',

    },
    boxContainer2:{
      alignItems: 'center',
      justifyContent: 'center',
    },
    boxContainer3:{
      right: 0,
      alignItems: 'center',
      justifyContent: 'center',

    },
    
    boxContainer4:{
      
      alignItems: 'center',
      justifyContent: 'center',

    },
    frame:{
      flex:1,
      height: '100%',
      width: '100%',
      borderRadius: 40,
      backgroundColor: 'rgba(177,137,176,0.8)',
      justifyContent: 'flex-start',
      alignItems: 'center',
      alignSelf: "center",  
      position: 'absolute',
      textAlign: 'center',
    },
    midFrame:{
      width: '90%',
      height: '88%',
      borderRadius: 30,
      backgroundColor: '#E1BFDF',  
      top: 70,
      alignSelf: 'center',
    },
    image:{
      flex: 1,
      justifyContent: 'center',
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
      position: 'absolute',
    },
    title:{
      top:24,
      fontSize: 24,
      fontWeight: '400',
      position: "absolute",
      left: 30,
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
      top: 10,
      right: 70,
      position: 'absolute',
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
      top: 10,
      right: 130,
      position: 'absolute',
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
    contactBox:{
      width: '80%',
      height: 50,
      borderColor: '#CD9ECC',
      alignSelf:'center',
      borderRadius: 5,
      borderWidth: 1,
      marginTop: 5,
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
    },
    profilePicture:{
        height: '100%',
        borderColor: '#D6B0D3',
        aspectRatio: 1,
        borderRadius: '50%',
        borderWidth: 1,
        left: '2%',
    },
    requestBox:{
      width: '30%',
      height: "100%",
      borderColor: '#CD9ECC',
      borderRadius: 5,
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileText:{
      fontWeight: '400',
      fontSize: 24,
      alignSelf: 'center',
  },
  postcardContainer: {
    width: '30%', // Adjust the width to fit 3 columns
    aspectRatio: 1, // Maintain the aspect ratio of the image
    margin: 5, // Add margin between images
  },
  postcardImage:{
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Adjust the image resizing mode
    borderRadius: 10,
  }
})
