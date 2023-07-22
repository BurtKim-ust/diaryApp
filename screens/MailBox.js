import React, {useState, useEffect, useRef} from 'react';
import {Image, FlatList, Modal, Button, View, Text, SafeAreaView, StyleSheet, TextInput, ImageBackground, TouchableOpacity, Alert} from 'react-native';
import globe from '../assets/icons/globe.png'
import Question_fill from '../assets/icons/Question_fill.png'
import m1 from "../assets/m1.png"
import { getAuth } from "firebase/auth";
import { getFirestore, doc, query, where, collection, getDocs, getDoc } from "firebase/firestore";
import {useRoute, NavigationContainer, useNavigation} from "@react-navigation/native";
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
import firebase from 'firebase/app';

function MailBox(props){
  const route = useRoute();
  
  const { currentUserName } = route.params;
  console.log({currentUserName})
  const [imageSource1,setImageSource1] = useState(box1);  
  const [imageSource2,setImageSource2] = useState(sent1);
  const [mode,setMode] = useState('boxMode')
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPostcardVisible, setIsPostcardVisible] = useState(false);
  const [users,setUsers]=useState(props.users);
  const [postCardData, setPostCardData] = useState([]);
  const [sentPostCardData,setSentPostCardData] = useState([]);
  const [body,setBody] = useState('')
  const [senderName, setSenderName] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [creation, setCreation] = useState('')
  const [zIndexRight,setZIndexRight] = useState(0)
  const [leftBoxColor, setLeftBoxColor] = useState('#E1BFDF')
  const [rightBoxColor, setRightBoxColor] = useState('rgba(177,137,176,0.8)')
  const currentUserUid = getAuth().currentUser.uid;
  const db=getFirestore();
  console.log({currentUserUid})
  const fetchPostCardData = async () => {
    try {
      const userPostsRef = collection(db, "postCards", 'received', 'UserIds', currentUserUid, 'ReceivedPostCards');
      
      const snapshot = await getDocs(userPostsRef);
      const postData = snapshot.docs.map((doc) => {
        const data = doc.data();
        const id = doc.id;
        return { id, ...data };
    });
      setPostCardData(postData);
    } catch (error) {
      console.log('Error fetching postcard data:', error);
    }
  
    try {
      const userPostsRef2 = collection(db, 'postCards', 'sent', 'UserIds', currentUserUid, 'SentPostCards');
      
      const snapshot2 = await getDocs(userPostsRef2);
      const postData2 = snapshot2.docs.map((doc) => {
        const data = doc.data();
        const id = doc.id;
        return { id, ...data };
    });
      setSentPostCardData(postData2);
    } catch (error) {
      console.log('Error fetching postcard data:', error);
    }
  };
  //console.log({postCardData})
  
  useEffect(() => {
    fetchPostCardData();
  }, []); // Fetch postcard data on component mount

  const sentmode = () =>{
    if(imageSource2 ===sent1){
    setImageSource1(box2);
    setImageSource2(sent2);
    console.log('sent mode');}
    setZIndexRight(2);
    setRightBoxColor('#E1BFDF');
    setLeftBoxColor('rgba(177,137,176,0.8)')
    setMode('sentMode');
  }

  const boxmode = () =>{
    if(imageSource2 ===sent2){
    setImageSource1(box1); 
    setImageSource2(sent1);
    console.log('box mode');
    }
    setZIndexRight(0);
    setRightBoxColor('rgba(177,137,176,0.8)');
    setLeftBoxColor('#E1BFDF')
    setMode('boxMode');
  }
  const setModalVisible = (visible) => {
    setIsModalVisible(visible);
  }
  const handleButtonPress = () => {
    setModalVisible(true);
    console.log({isModalVisible});
  }
  const handleButton2Press = (item,currentUserUid)=>{
    console.log({item})
    console.log({currentUserUid})
  }
  const handleModalClose = () => {
    console.log("clicked")
    setModalVisible(false);
    setUsers(props.users)
  };
  const handleModalClose2 = (item) =>{
    setIsModalVisible(false);
    navigation.navigate('SendPostCard', {uid:item.uid, name: item.name, currentUserUid: currentUserUid, currentUserName:currentUserName})
  }
  const handlePostcardClose = () => {
    setIsPostcardVisible(false);
    setBody('')
    setSenderName('')
    setCreation('')
    console.log({isPostcardVisible})
  };
  const clickPostCard = (item)=>{
    setIsPostcardVisible(true)
    setBody(item.body)
    setSenderName(item.senderName)
    setCreation(item.creation)
  }
  const clickSentPostCard = (item)=>{
    setIsPostcardVisible(true)
    setBody(item.body)
    setRecipientName(item.recipientName)
    setCreation(item.creation)
  }
  const fetchUsers=(search) =>{
      const searchValue = search.trim();
      const startValue = searchValue;
      const endValue = searchValue + '\uf8ff';
    
      const usersQuery = query(
        collection(db, 'following', currentUserUid, "userFollowing"),
        where('name', '>=', startValue),
        where('name', '<', endValue)
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
  }
  function FormattedDate({ timestamp }) {
    if (!timestamp || typeof timestamp.toDate !== 'function') {
      return null; // or return a default value or error message
    }
    const formattedDate = timestamp.toDate().toLocaleDateString('en-US');
    return <Text>{formattedDate}</Text>;
  }
  /*
  const sendPostCardMode= (item)=>{
    setIsSendingMode(true);
    setModalVisible(false);
    setRecipientId(item.id);
    setRecipientName(item.name);
    console.log({item})
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
  */

  /*const handleBlur = (event) => {
    console.log('handleBlur 1 was triggered')
    const clickedElement = event.target;
    const textInputElement = textInputRef.current;
  
    // Check if the clicked element is not the text input itself
    if (clickedElement !== textInputElement) {
      console.log('handleBlur 2 was triggered');
      textInputElement.blur();
    }
  };*/
  /*
  const sendPostCard= async()=>{
    try{
      console.log({recipientName})
      console.log({recipientId})
      const user = firebase.auth().currentUser;

      // Check if recipient exists
      if (recipient.length > 0) {
        const postCardData = {
          senderId: user.id,
          recipientId: recipientId,
          senderName: user.name,
          recipientName: recipientName,
          body: body,
          postcardNumber: postcardPhoto,
        };

        // Send email using Firebase Firestore
        await firebase
        .firestore()
        .collection('postCards')
        .doc("sent")
        .collection("UserIds")
        .doc(user.id)
        .set(postCardData)
        await firebase
        .firestore()
        .collection('postCards')
        .doc("received")
        .collection("UserIds")
        .doc(recipientId)
        .set(postCardData)
        

        // Clear input fields
        setRecipientId('');
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
  */
  return(
    <View style={styles.container}>
      <ImageBackground source={m1}
      resizeMode="cover" style={styles.image}>
        <View style={styles.frame}>
          <SafeAreaView style={{flex:1}}>
            <View flexDirection='row' justifyContent='space-between' >
              <Text style={styles.title}>우편함</Text>
              <View flexDirection='row' justifyContent="flex-end" >
                <TouchableOpacity onPress= {()=> navigation.navigate('')} style={styles.button1}>
                  <Image source={Setting_fill} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleButtonPress} style={styles.button2}>
                  <Image source={Send_fill} />
                </TouchableOpacity>
                <TouchableOpacity onPress= {()=> navigation.navigate('HomeScreen')} style={styles.exitButton}>
                  <Image source={Dell_fill} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.midFrame}>
              <View flexDirection='row' style={{width:"100%", backgroundColor:'rgba(177,137,176,0.8)'}}>
                <View style={{marginLeft:0,alignItems: 'center',justifyContent: 'center',borderTopLeftRadius: 20,borderTopRightRadius: 20, width:'55%', height:40, zIndex:2, backgroundColor: leftBoxColor}}>
                  <TouchableOpacity style={styles.boxContainer2} onPress= {boxmode}>
                      <Text style={{fontSize: 20,  fontWeight: '400', }}>수신함</Text>
                  </TouchableOpacity>
                </View>
                <View style={{marginRight: 0, alignItems: 'center', justifyContent: 'center',  borderTopRightRadius: 20, borderTopLeftRadius: 20, width:'55%', height:40,zIndex:zIndexRight, backgroundColor:rightBoxColor,}}>
                  <TouchableOpacity style={styles.boxContainer4} onPress= {sentmode}>
                      <Text style={{fontSize: 20, fontWeight: '400'}}>발송한 엽서</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Modal
                visible={isPostcardVisible}
                transparent={false}
                onRequestClose={handlePostcardClose}
              >
                <View style={{flex:1, justifyContent: 'center',backgroundColor: 'rgba(177,137,176,0.8)',}}>
                  <SafeAreaView style={{flex:1}} flexDirection='column'>

                  
                    <TouchableOpacity style={{width: 50,height: 50,backgroundColor: '#A381A1',borderColor: '#6E8D9D',borderWidth: 2,justifyContent: 'center',alignItems: 'center',borderRadius: 50, marginBottom:10, alignSelf: 'flex-end', right:10}} onPress={handlePostcardClose}>
                        <Image source={Dell_fill} />
                    </TouchableOpacity>
                    <SafeAreaView style={{width:'95%',flex:1, marginBottom:15, borderRadius: 30, backgroundColor: '#E1BFDF', alignSelf: 'center', justifyContent: 'flex-start'}}>
                      
                      <View flexDirection='row'>
                        <Text style={{top:10, position: 'absolute', left: '5%'}}>
                          {(mode === 'boxMode') && '보낸사람: ' + senderName}
                          {(mode === 'sentMode') && '받는사람: ' + recipientName}
                        </Text>
                        <Text style={{top:10, position: 'absolute', right: '5%'}}>
                          날짜: <FormattedDate timestamp={creation}/>
                        </Text>
                      </View>
                      <Text style={{marginTop:30, width: '90%', left: '5%'}}>
                        {body}
                      </Text>
                    </SafeAreaView>
                  </SafeAreaView>
                </View>
              </Modal>
              
              {(mode==="boxMode")&&<FlatList
                numColumns={3}
                style={{marginTop:5,}}
                horizontal={false}
                data={postCardData.sort((a, b) => b.creation - a.creation)}
                keyExtractor={(item)=> item.id}
                renderItem={({item})=>(
                    <TouchableOpacity style={styles.postcardContainer} onPress={()=>clickPostCard(item)}>
                      {(item.postcardNumber=='postcard1')&&<Image
                        source={postcard1}
                        style={styles.postcardImage} 
                      />}
                      {(item.postcardNumber=='postcard2')&&<Image
                        source={postcard2}
                        style={styles.postcardImage} 
                      />}
                      {(item.postcardNumber=='postcard3')&&<Image
                        source={postcard3}
                        style={styles.postcardImage} 
                      />}
                      {(item.postcardNumber=='postcard4')&&<Image
                        source={postcard4}
                        style={styles.postcardImage} 
                      />}
                      {(item.postcardNumber=='postcard5')&&<Image
                        source={postcard5}
                        style={styles.postcardImage} 
                      />}
                      {(item.postcardNumber=='postcard6')&&<Image
                        source={postcard6}
                        style={styles.postcardImage} 
                      />}
                      <Text style={styles.postcardText}>from {item.senderName}</Text>
                    </TouchableOpacity>
                )}/>
              }
              {
                (mode==="sentMode")&&<FlatList
                numColumns={3}
                style={{marginTop:5,}}
                horizontal={false}
                data={sentPostCardData.sort((a, b) => b.creation - a.creation)}
                keyExtractor={(item)=> item.id}
                renderItem={({item})=>(
                    <TouchableOpacity style={styles.postcardContainer} onPress={()=>clickSentPostCard(item)}>
                      {(item.postcardNumber=='postcard1')&&<Image
                        source={postcard1}
                        style={styles.postcardImage} 
                      />}
                      {(item.postcardNumber=='postcard2')&&<Image
                        source={postcard2}
                        style={styles.postcardImage} 
                      />}
                      {(item.postcardNumber=='postcard3')&&<Image
                        source={postcard3}
                        style={styles.postcardImage} 
                      />}
                      {(item.postcardNumber=='postcard4')&&<Image
                        source={postcard4}
                        style={styles.postcardImage} 
                      />}
                      {(item.postcardNumber=='postcard5')&&<Image
                        source={postcard5}
                        style={styles.postcardImage} 
                      />}
                      {(item.postcardNumber=='postcard6')&&<Image
                        source={postcard6}
                        style={styles.postcardImage} 
                      />}
                      <Text style={styles.postcardText}>to {item.recipientName}</Text>
                    </TouchableOpacity>
                )}/>
              }
            </View>
          
          </SafeAreaView>
        </View>
      </ImageBackground>

      <Modal
        visible={isModalVisible}
        transparent={false}
        onRequestClose={handleModalClose}
      >
          <SafeAreaView style={styles.modalContainer}>
            <View flexDirection='row' justifyContent='space-between' style={{alignItems:'center'}}>
              <Text style={{fontSize: 24,fontWeight: '400',flex:1,alignSelf:'center', textAlign:'center',justifyContent: 'center'}}>엽서 보내기</Text>
              <TouchableOpacity title="Close" style={styles.modalContent} onPress={handleModalClose} >
                <Image source={Dell_fill} />
              </TouchableOpacity>
            </View>
            
            <View flexDirection= 'row' style={{marginTop: '5%'}}>
              <Text style={{top:6}}>받는 사람: </Text>
              <View style={{width: '70%', height: 30, left:5, borderWidth: 1, borderColor: 'black', borderRadius: 20, justifyContent: 'center'}}>
                <TextInput style={{left: 10}} onChangeText={(search)=> fetchUsers(search)}/>
              </View>
            </View>

            <View style={{ justifyContent: 'center', alignItems: 'center', alignSelf: "center", marginTop:'5%'}}>
              <FlatList
                numColumns={1}
                horizontal={false}
                data={users}
                renderItem={({item})=>(
                  <View style={styles.contactBox}>
                    <View style={styles.profilePicture}/>
                    <Text style={styles.profileText}>{item.name}</Text>
                    <TouchableOpacity style={styles.requestBox} onPress= {()=>handleModalClose2(item)}>
                      <Text>엽서 보내기</Text> 
                    </TouchableOpacity>
                  </View>
                )}/>
            </View>
            
          </SafeAreaView>
      </Modal>
      
      
      
    </View>
    // 로그인 페이지로 이동하는 버튼 
    //<Button title="go to main" onPress={()=>navigation.navigate('LogIn')}/>
    //<Button onPress={onPressLearnMore} title="+" style={styles.roundButton} />
  );
};
/*
      <Modal
        visible={isSendingMode}
        onRequestClose={handleSendingModeClose}
      >
        
        <SafeAreaView style={styles.modalContainer}>
          <TouchableOpacity title="Close" style={styles.modalContent} onPress={handleSendingModeClose} >
            <Image source={Dell_fill} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>엽서 보내기</Text>
          {(writingMode||postcardPhoto)? 
          (
          <>
            <View style={{ width:'100%', borderRadius:20, borderWidth:1, justifyContent: 'center', alignItems: 'center', marginTop: 5}}>
              <TouchableOpacity style={{width: '100%', margin: 10, alignItems: 'center', justifyContent: 'center'}} onPress={handleUnwritingMode}>
                <Text style={{fontSize: 16,fontWeight: 400}}>표지 선택하기</Text>
              </TouchableOpacity>
            </View>
            <View style={{height: '70%', width:'100%', borderRadius:20, borderWidth:1, justifyContent: 'flex-start', alignItems: 'center', marginTop: 10}}>
              <View style={{top:15,}}>
                <Text style={{fontSize: 16,fontWeight: 400, textDecorationLine: 'underline'}}>엽서 글쓰기 </Text>
              </View>
              <View style={{alignSelf: 'flex-start'}}>
                <TextInput
                  ref={textInputRef}
                  placeholder="엽서를 써보아요 . . .                                                               "
                  onChangeText={(content)=> setContent(content)}
                  multiline={true}
                  onBlur={handleBlur}
                  style={{fontSize: 14, fontWeight: '400', marginTop:20, alignSelf: 'flex-start',marginLeft: 20}}
                />
                
              </View>
              
            </View>
            
          </>
          ):(
          <>
            <View style={{height: '40%', width:'100%', borderRadius:20, borderWidth:1, justifyContent: 'flex-start', alignItems: 'center', marginTop: 10}}>
                <View style={{top:15,}}>
                  <Text style={{fontSize: 16,fontWeight: 400, textDecorationLine: 'underline'}}>표지 선택하기 </Text>
                </View>
                <View style={{marginTop: 30, justifyContent: 'flex-start', alignItems: 'flex-start', alignSelf: "center", textAlign: 'center',}}>
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
      </Modal>
*/
const styles = StyleSheet.create({
    container:{
      flex:1,
    },
    
    modalContainer: {
      flex:1,
      alignItems: 'center',
      backgroundColor: '#E1BFDF', // Add a background color for the modal container
      paddingHorizontal: 20,
      
    },
    postcardText: {
      position: 'absolute',
      bottom: 5,
      right: 5,
      color: 'white',
      fontWeight: 'bold',
    },
    modalContent: {
      width: 50,
      height: 50,
      //backgroundColor: '#E1BFDF',
      //borderColor: '#E1BFDF',
      right: 10,
      top:1,
      borderRadius: 50,
      position: 'absolute'
      
    },
    modalContent2: {
      width: 50,
      height: 50,
      //backgroundColor: '#E1BFDF',
      //borderColor: '#E1BFDF',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50,
      top: 50,
      right: 10,
      borderWidth:1,
      position: 'absolute',
      
    },
    boxContainer2:{
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height:'100%'
    },
    boxContainer4:{ 
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height:'100%'
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
      height: '99%',
      borderRadius: 30,
      backgroundColor: '#E1BFDF',  
      marginTop: 10,
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
      marginRight: 10,
    },
    title:{
      fontSize: 24,
      fontWeight: '400',
      left:30,
      marginTop:15
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
    margin: '1.6%', // Add margin between images
  },
  postcardImage:{
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Adjust the image resizing mode
    borderRadius: 10,
  }

  });

const mapStateToProps = (store) =>({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
  users: store.usersState.users,
  usersLoaded: store.usersState.usersLoaded,
})

export default connect(mapStateToProps, null)(MailBox);