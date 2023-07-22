import React, {useContext, useState, useEffect} from 'react';
import {Modal, Image, FlatList, Button, onPressLearnMore, View, Text, SafeAreaView, StyleSheet, TextInput, ImageBackground, TouchableOpacity} from 'react-native';
import globe from '../assets/icons/globe.png'
import Question_fill from '../assets/icons/Question_fill.png'
import m1 from "../assets/m1.png"
import {NavigationContainer, useNavigation} from "@react-navigation/native";
import Dell_fill from '../assets/icons/Dell_fill.png'
import Setting_fill from '../assets/icons/Setting_fill.png'
import Add_ring_fill from '../assets/icons/Add_ring_fill.png'
import Expand_right_light from '../assets/icons/Expand_right_light.png'
import box1 from '../assets/shapes/box1.png'
import box2 from '../assets/shapes/box2.png'
import sent1 from '../assets/shapes/sent1.png'
import sent2 from '../assets/shapes/sent2.png'
import postFrame from '../assets/shapes/postFrame.png'
import diaryPreview from '../assets/shapes/diaryPreview.png'
import imageBox from '../assets/shapes/imageBox.png'
import {connect} from 'react-redux'
import firebase from 'firebase/app';
import { SettingsContext } from './SettingsContext';

import { getFirestore, collection, getDocs} from 'firebase/firestore';
import SettingsModal from './SettingsModal';

function ShareDiary(props){
  const [imageSource1,setImageSource1] = useState(box1);  
  const [imageSource2,setImageSource2] = useState(sent1);
  const [mode,setMode] = useState('friendsMode')
  const navigation = useNavigation();
  const [zIndexRight,setZIndexRight] = useState(0)
  const [leftBoxColor, setLeftBoxColor] = useState('#E1BFDF')
  const [rightBoxColor, setRightBoxColor] = useState('rgba(177,137,176,0.8)')
  const [settingModalVisible, setSettingModalVisible] = useState(false);
  const { language, server, backgroundColor, updateLanguage, updateBackgroundColor, updateServer } = useContext(
    SettingsContext
  );
  const db=getFirestore();
  const eMode = () =>{
    setZIndexRight(2);
    setRightBoxColor('#E1BFDF');
    setLeftBoxColor('rgba(177,137,176,0.8)')
    setMode('everyoneMode');
    fetchData();
  }

  const fMode = () =>{
    setZIndexRight(0);
    setRightBoxColor('rgba(177,137,176,0.8)');
    setLeftBoxColor('#E1BFDF')
    setMode('friendsMode');
  }
  const [posts, setPosts] = useState([]);
  const [everyonePosts, setEveryonePosts] = useState([]);

  function FormattedDate(props) {
    const timestamp = props.timestamp.toDate(); // Fix: call toDate method on timestamp
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = timestamp.toLocaleDateString(undefined, options);
    return (<Text>{formattedDate}</Text>);
  }
  const manageSettingModal = (value) => {
    setSettingModalVisible(value);
  };

  const fetchData = async () => {
    let ePosts = [];
    try {
      const querySnapshot = await getDocs(collection(db, 'everyonePosts'));
      querySnapshot.forEach((doc) => {
        ePosts.push({
          id: doc.id,
          ...doc.data(),
        });
      });
    } catch (error) {
      console.log('Error fetching postcards opened to everyone:', error);
    }
    
    ePosts.sort(function (x, y) {
      return x.creation - y.creation;
    });

    console.log({ ePosts });
    setEveryonePosts(ePosts);
  };

  const handleLanguageChange = (language) => {
    // Update the language setting
    updateLanguage(language);
  };
  const handleServerChange = (server) => {
    // Update the language setting
    updateServer(server);
  };

  useEffect(()=> {
    let posts = [];
    console.log("props.usersLoaded:"+props.usersLoaded);
    console.log("props.following.length: "+ props.following.length);
    if(props.usersLoaded==props.following.length){
      for(let i=0;i<props.following.length; i++){
        const user = props.users.find(el=>el.uid ===props.following[i]);
        const userPosts = props.users.find(el => el.uid === user.uid)?.posts;
        console.log("user:"+JSON.stringify(user));
        console.log('User posts for uid ', user.uid, ': ', userPosts);
        if(user != undefined){
          //console.log("user.posts:"+JSON.stringify(userPosts));
          //posts=posts.concat(userPosts);
          posts=[...posts, ...user.posts]
          //the original is making an error probably because user.posts is not defined
        }
      }
      posts.sort(function(x,y){
        return x.creation - y.creation;
      })
      console.log({posts})
      setPosts(posts);
    }
    
  }, [props.usersLoaded])

  return(
    <View style={styles.container}>
      <ImageBackground source={m1}
      resizeMode="cover" style={styles.image}>

        <View style={styles.frame}>
          <SafeAreaView style={{flex:1, width:'100%'}}>
            <View flexDirection='row' justifyContent='space-between' alignItems='center'>
              <Text style={styles.title}>모두의 게시판</Text>
              <View flexDirection='row' justifyContent="flex-end" >
                <TouchableOpacity onPress={() => setSettingModalVisible(!settingModalVisible)} style={styles.button1}>
                  <Image source={Setting_fill} />
                </TouchableOpacity>
                <TouchableOpacity onPress= {()=> navigation.navigate('')} style={styles.button2}>
                  <Image source={Add_ring_fill} />
                </TouchableOpacity>
                <TouchableOpacity onPress= {()=> navigation.navigate('HomeScreen')} style={styles.exitButton}>
                    <Image source={Dell_fill} />
                </TouchableOpacity>
              </View>
            </View>
            <SettingsModal settingModalVisible={settingModalVisible} manageSettingModal={manageSettingModal} />
            <View style={styles.midFrame}>
              <View flexDirection='row' style={{top:0, width:"100%", backgroundColor: 'rgba(177,137,176,0.8)', marginBottom:5}}>
                <View style={{left:0,alignItems: 'center',justifyContent: 'center',borderTopLeftRadius: 20,borderTopRightRadius: 20, width:'55%', height:40, zIndex:2, backgroundColor: leftBoxColor}}>
                  <TouchableOpacity style={styles.boxContainer2} onPress= {fMode}>
                      <Text style={{fontSize: 20,  fontWeight: '400', }}>이웃글</Text>
                  </TouchableOpacity>
                </View>
                <View style={{position: 'absolute',right: 0, alignItems: 'center', justifyContent: 'center',  borderTopRightRadius: 20, borderTopLeftRadius: 20, width:'55%', height:40,zIndex:zIndexRight, backgroundColor:rightBoxColor,}}>
                  <TouchableOpacity style={styles.boxContainer4} onPress= {eMode}>
                      <Text style={{fontSize: 20, fontWeight: '400'}}>전체 공개글</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {(mode==="friendsMode")&&(
                <View style={styles.containerGallery}>
                  <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={posts.sort((a, b) => b.creation - a.creation)}
                    renderItem={({item})=>(
                      <View style={{flexDirection: "column", borderRadius: 10, borderWidth:2, width:'100%',aspectRatio: 350/250, marginBottom:10, backgroundColor: '#F0CFEE', borderColor: 'rgba(177,137,176,0.8)'}}>
                        <View style={styles.containerImage}>
                          <Image style={styles.image} source={{uri: item.downloadURL}}/>
                          <Text style={styles.textContainer}>{item.content}</Text>
                        </View>  
                        <View style={{width: '100%', height: '20%'}}>
                          <Text> 날짜: 
                            <FormattedDate timestamp={item.creation}/>
                          </Text>
                          {item.title ? (
                            <Text> 제목: {item.title.length > 20 ? item.title.substring(0, 20) + '...' : item.title}</Text>
                          ): <Text> 제목 없음</Text>}
                          <Text> 글쓴이: {item.writerName.length > 20 ? item.writerName.substring(0, 20) + '...' : item.writerName}</Text>
                        </View>
                    </View>
                  )}/>
                </View>
              )}
              {(mode==="everyoneMode")&&(
                <View style={styles.containerGallery}>
                  <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={everyonePosts.sort((a, b) => b.creation - a.creation)}
                    renderItem={({item})=>(
                      <View style={{flexDirection: "column", borderRadius: 10, borderWidth:2, width:'100%',aspectRatio: 350/250, marginBottom:10, backgroundColor: '#F0CFEE', borderColor: 'rgba(177,137,176,0.8)'}}>
                        <View style={styles.containerImage}>
                          <Image style={styles.image} source={{uri: item.downloadURL}}/>
                          <Text style={styles.textContainer}>{item.content}</Text>
                        </View>  
                        <View style={{width: '100%', height: '20%'}}>
                          <Text> 날짜: 
                            <FormattedDate timestamp={item.creation}/>
                          </Text>
                          {item.title ? (
                            <Text> 제목: {item.title.length > 20 ? item.title.substring(0, 20) + '...' : item.title}</Text>
                          ): <Text> 제목 없음</Text>}
                          <Text> 글쓴이: {item.writerName.length > 20 ? item.writerName.substring(0, 20) + '...' : item.writerName}</Text>
                        </View>
                    </View>
                  )}/>
                </View>
              )}
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
  textContainer:{
    width: '42.8%',
    height: '100%',
    backgroundColor: '#CC94CB',
    fontSize: 10,
    fontWeight: '400',
    padding: 5
  },  
  containerGallery:{
    width: '100%',
    height: '100%',
    alignItems: 'center',
    alignSelf: 'center'
  },
  containerImage:{
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    height:'80%',
    borderRadius:10,
  },
  image:{
    width: '57.2%',
    height: '100%',
    position: 'absolute',
    borderRadius: 10,//not working
  },
  title:{
    fontSize: 24,
    fontWeight: '400',
    left:30,
    marginTop:15,
  },
  boxContainer:{
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
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
    height: 'auto',
    borderRadius: 30,
    backgroundColor: '#E1BFDF',  
    marginTop: 10,
    alignSelf: 'center',
    marginBottom: 15,
  },
  image:{
    flex: 1,
    justifyContent: 'center',
  },
  settingExitButton:{
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignSelf:'flex-end',
    alignItems:'center',
    borderRadius: 50,
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
  }
});
  
const mapStateToProps = (store) =>({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
  users: store.usersState.users,
  usersLoaded: store.usersState.usersLoaded,
})
export default connect(mapStateToProps,null)(ShareDiary);