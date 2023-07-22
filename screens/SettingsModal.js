import React, { useContext } from 'react';
import { Modal, View, Text, TouchableOpacity, Button, Image, SafeAreaView, StyleSheet } from 'react-native';
import Expand_right_light from '../assets/icons/Expand_right_light.png';
import Dell_fill from '../assets/icons/Dell_fill.png';
import { SettingsContext } from './SettingsContext';
import { logout } from '../components/LogOut';
const SettingsModal = ({ settingModalVisible, manageSettingModal }) => {
  const { handleLanguageChange, handleServerChange } = useContext(SettingsContext);
  const onLogOut = () => {
    logout(); // Call the logout function
  };

  return (
    <Modal visible={settingModalVisible} animation="slide" transparent={false} onRequestClose={() => manageSettingModal(false)}>
      <SafeAreaView flexDirection='column' style={{ flex: 1, backgroundColor: '#E1BFDF' }}>
        <View style={{flexDirection: 'row',
            width: '100%',
            borderBottomColor: 'white',
            borderBottomWidth: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 10,
            marginBottom:10,}}
        >
            <View style={{width: 50}}/>
            <Text style={{flex:1,textAlign: 'center', alignSelf: 'center', fontSize: 18, fontWeight:'400'}}>설정 및 문의</Text>
            <TouchableOpacity onPress= {() => manageSettingModal(false)} style={styles.settingExitButton}>
            <Image source={Dell_fill} />
            </TouchableOpacity>
        </View>
        
        <View flexDirection='column' style={{ flex: 1, }}>
            <Text style={{ textAlign: 'left', fontSize: 18, fontWeight: '400', paddingBottom:10,marginLeft: 15 }}>내 계정</Text>
            <View style={{
                flexDirection: 'row',
                width: '100%',
                borderBottomColor: 'white',
                borderBottomWidth: 1,
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 10,
                marginTop:10,
                paddingBottom:10,
            }}>
            <View style={{ borderRadius: 50, borderWidth: 1, width: 50, height: 50, borderColor: 'white', marginLeft: 10 }} />
            <View flexDirection='column' style={{  marginLeft: 20, flex:1}}>
                <Text style={{ textAlign: 'left', fontSize: 18, fontWeight: '400' }}>ㅇㅇㅇ [내 이름]</Text>
                <Text style={{ textAlign: 'left', fontSize: 14, fontWeight: '200' }}>비밀번호, 보안, 개인정보 등</Text>
            </View>
            <TouchableOpacity style={{borderRadius: 50, height:50,width:50, alignSelf: 'center', justifyContent: 'center'}}>
                <Image source={Expand_right_light} />
            </TouchableOpacity>
            </View>
            <View style={{
                flexDirection: 'row',
                width: '100%',
                borderBottomColor: 'white',
                borderBottomWidth: 1,
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 10,
                marginTop:20,
                paddingBottom:20,
            }}>
            
            <Text style={{ flex:0.5, textAlign: 'left', fontSize: 18, fontWeight: '400' }}>서버</Text>
            <View style={{ flex:0.5,flexDirection:'row',justifyContent: 'space-between',}}>
                <Button title="North America"  style={{ textAlign: 'center', fontSize: 18, fontWeight: '400' }} onPress={() => handleServerChange('미국')}/>
                <Button title="한국" style={{ textAlign: 'center', fontSize: 18, fontWeight: '400' }} onPress={() => handleServerChange('한국')}/>
            </View>  
            <View style={{width:30}}/>
            </View>
            <View style={{
            flexDirection: 'row',
            width: '100%',
            borderBottomColor: 'white',
            borderBottomWidth: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 10,
            marginTop:20,
            paddingBottom:20,
            
            }}>
            
            <Text style={{ flex:0.5, textAlign: 'left', fontSize: 18, fontWeight: '400' }}>언어</Text>
            <View style={{ flex:0.5,flexDirection:'row',justifyContent: 'space-between',}}>
                <Button title="English" style={{ textAlign: 'center', fontSize: 18, fontWeight: '400' }} onPress={() => handleLanguageChange('영어')}/>
                <Button title="한국어" style={{ textAlign: 'center', fontSize: 18, fontWeight: '400' }} onPress={() => handleLanguageChange('한국어')}/>
            </View>  
            <View style={{width:30}}/>
            </View>
            <View style={{
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 10,
            marginTop:10,
            paddingBottom:10,
            borderBottomColor: 'white',
            borderBottomWidth: 1
            }}>
            <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: '400' }}>사용문의</Text>
            <TouchableOpacity style={{borderRadius: 50, height:50,width:50, alignSelf: 'center', justifyContent: 'center'}}>
                <Image source={Expand_right_light} />
            </TouchableOpacity>
            </View>
            <View style={{
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 10,
            marginTop:10,
            paddingBottom:10,
            }}>
            <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: '400' }}>광고문의</Text>
            <TouchableOpacity style={{borderRadius: 50, height:50,width:50, alignSelf: 'center', justifyContent: 'center'}}>
                <Image source={Expand_right_light} />
            </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={onLogOut}><Text style={styles.inText}>Logout</Text></TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
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
    },
    logoutButton: {
        width: '100%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'white',
        borderWidth: 1,
        alignSelf: "center",
      },
  });

export default SettingsModal;
