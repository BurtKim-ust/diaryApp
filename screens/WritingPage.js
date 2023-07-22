import React, {useState, useEffect, useRef} from 'react';
import {ImageButton, Image, View, Text, SafeAreaView, StyleSheet, TextInput, ImageBackground, TouchableOpacity, ScrollView, Platform, DatePickerAndroid} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import globe from '../assets/icons/globe.png'
import Question_fill from '../assets/icons/Question_fill.png'
import m1 from "../assets/m1.png"
import {NavigationContainer, useNavigation} from "@react-navigation/native";
import Dell_fill from '../assets/icons/Dell_fill.png'
import Setting_fill from '../assets/icons/Setting_fill.png'
import Lock_fill from '../assets/icons/Lock_fill.png'
import Unlock_fill from '../assets/icons/Unlock_fill.png'
import group_share from '../assets/icons/group_share.png'
import Angry from '../assets/icons/Angry.png'
import Happy from '../assets/icons/Happy.png'
import Sad from '../assets/icons/Sad.png'
import Lol from '../assets/icons/Lol.png'
import Wow from '../assets/icons/Wow.png'
import {connect} from 'react-redux'
import ImagePickerExample from '../components/ImagePickerExample';
import firebase from 'firebase/app';
import { Timestamp, getFirestore, addDoc, doc, getDoc, collection, getDocs } from "firebase/firestore"; 
import { getAuth } from "firebase/auth";
import { ref, getDownloadURL, uploadBytesResumable, getStorage } from 'firebase/storage';
//import 'firebase/storage';

//const [date, setDate] = useState(new Date());
//<Image source={{uri:props.route.params.image}}/> is used when I get the image source from the post screen.
function WritingPage(props){
  const today = new Date();
  const [date, setDate] = useState(new Date());
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const textInputRef = useRef(null);
  const navigation = useNavigation();
  const [title, setTitle]=useState("");
  const [content, setContent]=useState("")
  const [feeling, setFeeling]=useState("Happy")
  const [writerName, setWriterName] = useState(props.currentUser.name);
  const [readableBy, setReadableBy]=useState("Myself")
  const [activeIndex, setActiveIndex] = useState(2);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [showReadableButtons, setShowReadableButtons] = useState(false);
  const [readableIcon, setReadableIcon] = useState(Lock_fill)
  console.log({writerName});
  const currentUserUid =getAuth().currentUser.uid;
  const db = getFirestore();
  const showDatePicker = () => {
    if (Platform.OS === 'android') {
      DatePickerAndroid.open({
        date,
      }).then((response) => {
        if (response.action === 'dateSetAction') {
          const selectedDate = new Date(response.year, response.month, response.day);
          setDate(selectedDate);
        }
      });
    } else {
      // For iOS devices, show DatePickerIOS
      setIsDatePickerVisible(true);
    }
  };

  const handleReadability = (number)=>{
    console.log({readableBy})
    setShowReadableButtons(false);
    if(number===1){
      setReadableBy("All")
      setReadableIcon(group_share)
    }else if(number===2){
      setReadableBy("Friends")
      setReadableIcon(Unlock_fill)
    }else{
      setReadableBy("Myself")
      setReadableIcon(Lock_fill)
    }

  }

  const clickReadability = ()=>{
    setShowReadableButtons(true);
    //console.log({showReadableButtons})
    //console.log({readableBy})
  }

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    setIsDatePickerVisible(false);
  };

  const handleBlur = () => {
    textInputRef.current.blur();
  };
  const handleImagePress = (index) => {
    setActiveIndex(index);
    switch (index) {
      case 0:
        setFeeling('Sad');
        break;
      case 1:
        setFeeling('Wow');
        break;
      case 2:
        setFeeling('Happy');
        break;
      case 3:
        setFeeling('Lol');
        break;
      case 4:
        setFeeling('Angry');
        break;
    }
  };

  const handleImageSelected = (imageUri) => {
    //console.log('imageUri:'+imageUri)
    setSelectedImage(imageUri);
  };
  const savePostData=(downloadURL)=>{
    console.log("downloadURL: "+ downloadURL)
    //firestore에 저장하기
    const postData = {
      downloadURL,
      content,
      creation: Timestamp.now(),
      feeling,
      readableBy,
      writerName,
      title
    };
  
    if (readableBy === "All") {
      addDoc(collection(db, 'everyonePosts'), postData);
    }
  
    addDoc(collection(db, 'posts', currentUserUid, 'UserPosts'), postData)
      .then(() => {
        props.navigation.navigate('HomeScreen');
      });
  }

  

  const uploadImage =async() => {
    try{
      if (!selectedImage) {
        // No image selected
        savePostData(null);
        return;
      }
      const uri = selectedImage;
      console.log({uri})
      const childPath = `post/${getAuth().currentUser.uid}/${Math.random().toString(36)}`;
      console.log(childPath);
      const response = await fetch(uri);
      const blob = await response.blob();

      //firebase storage에 저장하기
      const storage = getStorage();
      const storageRef = ref(storage, childPath);
      const task = uploadBytesResumable(storageRef, blob);
      const taskProgress = (snapshot) => {
        console.log(`transferred: ${snapshot.bytesTransferred}`);
      };
      
      const taskCompleted = async () => {
        const downloadURL = await getDownloadURL(task.snapshot.ref);
        savePostData(downloadURL);
        console.log("safely saved");
      };
      
      const taskError = (snapshot) => {
        console.log(snapshot);
      };

      task.on("state_changed", taskProgress, taskError, taskCompleted);
    } catch (error) {
        console.log(error);
      }
    }

    return(
      <View style={styles.container}>
        <ImageBackground source={m1}
          resizeMode="cover" style={styles.image}
        >
          <View style={styles.frame}>
            <SafeAreaView style={{flex:1, width:'100%'}} flexDirection="column">
            {showReadableButtons &&
              <>
                <TouchableOpacity onPress={()=>handleReadability(1)} style={{width: 50, height: 50,backgroundColor: '#A381A1', borderColor: '#6E8D9D', borderWidth: 2, justifyContent: 'center', alignItems: 'center', borderRadius: 50, top: 120, right: 180, position: 'absolute', zIndex:5}}>
                    <Image source={group_share} />
                    <Text style={{fontSize:8,fontWeight:'400'}}>전체 공개</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>handleReadability(2)} style={{width: 50, height: 50,backgroundColor: '#A381A1', borderColor: '#6E8D9D', borderWidth: 2, justifyContent: 'center', alignItems: 'center', borderRadius: 50, top: 120, right: 130, position: 'absolute', zIndex:5}}>
                    <Image source={Unlock_fill} />
                    <Text style={{fontSize:8,fontWeight:'400'}}>친구 공개</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>handleReadability(3)} style={{width: 50, height: 50,backgroundColor: '#A381A1', borderColor: '#6E8D9D', borderWidth: 2, justifyContent: 'center', alignItems: 'center', borderRadius: 50, top: 120, right: 80, position: 'absolute', zIndex:5}}>
                    <Image source={Lock_fill} />
                    <Text style={{fontSize:8,fontWeight:'400'}}>나만 보기</Text>
                </TouchableOpacity>
             </>
            }
            <View flexDirection='row'>
              <Text style={styles.title}>오늘의 기억</Text>
              <TouchableOpacity onPress= {()=> navigation.navigate('HomeScreen')} style={styles.exitButton}>
                  <Image source={Dell_fill} />
              </TouchableOpacity>
              <TouchableOpacity onPress= {()=> navigation.navigate('')} style={styles.button1}>
                  <Image source={Setting_fill} />
              </TouchableOpacity>
              <TouchableOpacity onPress={clickReadability} style={styles.button2}>
                  <Image source={readableIcon} />
              </TouchableOpacity>
            </View>

            <View style={styles.frame2}>
              <Text style={styles.chooseText}>오늘의 표정을 선택해주세요</Text>
              <View style={styles.emoticonBox}>
                  <TouchableOpacity style={styles.imageButton} onPress={()=>handleImagePress(0)}>
                      <Image source={Sad} style={[styles.margin,{tintColor: activeIndex === 0 ? 'red' : 'black'}]} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.imageButton} onPress={()=>handleImagePress(1)}>
                      <Image source={Wow} style={[styles.margin,{tintColor: activeIndex === 1 ? 'red' : 'black'}]}/>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.imageButton} onPress={()=>handleImagePress(2)}>
                      <Image source={Happy} style={[styles.margin,{tintColor: activeIndex === 2 ? 'red' : 'black'}]}/>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.imageButton} onPress={()=>handleImagePress(3)}>
                      <Image source={Lol} style={[styles.margin,{tintColor: activeIndex === 3 ? 'red' : 'black'}]}/>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.imageButton} onPress={()=>handleImagePress(4)}>
                      <Image source={Angry} style={[styles.margin,{tintColor: activeIndex === 4 ? 'red' : 'black'}]}/>
                  </TouchableOpacity>
              </View>
            </View>
            <SafeAreaView style={{flex: 1, right:0, left:0, marginTop:10, bottom:0, zIndex:1}}>
              <ScrollView style={styles.frame3}>
                <View>
                  <ImagePickerExample onImageSelected={handleImageSelected}/>
                </View>
                <View style={styles.dateBox}>
                  <Text onPress={showDatePicker} style={styles.date}>Date: {date.toDateString()}</Text>
                  {isDatePickerVisible && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="spinner"
                  onChange={(event, selectedDate) => {
                    if (selectedDate !== undefined) {
                      handleDateChange(selectedDate);
                    }
                  }}
                />
              )}
                </View>
                <View style={{width:"100%"}}>
                  <TextInput
                    ref={textInputRef}
                    placeholder="Write a Title . . ."
                    onChangeText={(title)=> setTitle(title)}
                    blurOnSubmit={false}
                    onSubmitEditing={handleBlur}
                    style={{left:'5%',fontSize: 18, fontWeight: '600', marginRight:'5%'}}
                  />
                  <TextInput
                    ref={textInputRef}
                    placeholder="Write a Caption . . ."
                    onChangeText={(content)=> setContent(content)}
                    multiline={true}
                    blurOnSubmit={false}
                    onSubmitEditing={handleBlur}
                    style={{left:'5%',fontSize: 14, fontWeight: '400', marginRight:'5%'}}
                  />
                </View>
              </ScrollView>
              <View style={{position: 'absolute', bottom: 50, right: '6%', width: '100%', alignItems: 'center'}}>
                <TouchableOpacity style={styles.buttonContainer} onPress={()=>uploadImage()}>
                  <Text>Save</Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
            </SafeAreaView>
          </View>
        </ImageBackground>
      </View>
      // 로그인 페이지로 이동하는 버튼 
      //<Button title="go to main" onPress={()=>navigation.navigate('LogIn')}/>
    );
  };

  const styles = StyleSheet.create({
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
      container:{
        flex:1,
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
        flexDirection: 'column',
        flexWrap: 'wrap',
      },
      frame2:{
        height: '13%',
        width: '90%',
        borderRadius: 30,
        backgroundColor: '#E1BFDF',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: "center",  
        textAlign: 'center',
        marginTop: 40,
        marginBottom: 10,
        zIndex: 2, 
      },
      emoticonBox:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom:'2%',
      },
      frame3:{
        marginBottom: 15,
        width: '90%',
        height:'100%',
        borderRadius: 30,
        backgroundColor: '#E1BFDF',
        alignSelf: "center",  
        //top: '9.4%',
        flexDirection: 'column',
        alignSelf: 'center',
      },
      photoBox:{
        height: 'auto',
        width:'90%',
        borderRadius: 10,
        borderColor: 'black',
        borderWidth: 1,
        alignSelf: 'center',
        marginTop: 10,
        minHeight: 40,
      },
      dateBox:{
        height: 25,
        width:'100%',
        marginTop: 10,
        alignSelf: 'center',
      },
      image:{
        flex: 1,
        justifyContent: 'center',
      },
      title:{
        top:24,
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
        top: 10,
        right: 10,
        position: 'absolute',
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
      margin: {
          margin: '2%',
      },
      imageButton:{
          backgroundColor:'',
          padding:10,
          alignItems: "center",
      },
      chooseText:{
          textAlign: 'center',
          marginTop: '5%',
          fontSize: 24,
          fontWeight: '400',
      },
      date:{
        left:'5%',
          textAlign: 'left',
          top: '3%',
          fontSize: 14,
          fontWeight: '400'
      }
    });
  
  const mapStateToProps = (store) =>({
    currentUser: store.userState.currentUser,
  })
  export default connect(mapStateToProps, null)(WritingPage);