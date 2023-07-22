import React, {useState, Component, useEffect} from 'react';
import {Image, Modal, Button, View, Text, SafeAreaView, StyleSheet, TextInput, ImageBackground, TouchableOpacity} from 'react-native';
import Add_ring_fill from '../assets/icons/Add_ring_fill.png'
import Question_fill from '../assets/icons/Question_fill.png'
import User_circle from '../assets/icons/User_circle.png'
import Subtract from '../assets/icons/Subtract.png'
import group_share from '../assets/icons/group_share.png'
import Date_today from '../assets/icons/Date_today.png'
import m1 from "../assets/m1.png"
import {NavigationContainer, useNavigation} from "@react-navigation/native";
import Setting_fill from '../assets/icons/Setting_fill.png'
import globe from '../assets/icons/globe.png'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {fetchUser, fetchUserPosts, fetchUserFollowing} from '../redux/actions/index'
import firebase from 'firebase/app';
import { getFirestore, doc, getDoc, collection, getDocs } from "firebase/firestore"; 
import { getAuth } from "firebase/auth";
import Message_open_fill from '../assets/icons/Message_open_fill.png'
import { SettingsContext } from './SettingsContext';
import SettingsModal from './SettingsModal';

export class HomeScreen extends Component{
  
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      settingModalVisible: false, 
    };
  }
  updateUserName = (userName) => {
    this.setState({ userName });
  }
  setModalVisible = (visible) => {
    this.setState({ isModalVisible: visible });
  }
  manageSettingModal = (value) => {
    this.setState({ settingModalVisible: value });
  };
  handleButtonPress = () => {
    this.setModalVisible(true);
  }
  componentDidMount(){
    this.props.fetchUser(); //Whenever user logs in
    this.props.fetchUserPosts();
    this.props.fetchUserFollowing();
  }
  render() {
    const {navigation} = this.props;
    const auth = getAuth();
    //setting up the current user
    let currentUser = auth.currentUser;
    console.log("currentUser:",currentUser.uid);
    


    return(
      <View style={styles.container}>
        <ImageBackground source={m1}
        resizeMode="cover" style={styles.image}>
          <SafeAreaView style={{flex:1,}}>
            <View flexDirection='row' justifyContent="flex-end">
              <TouchableOpacity onPress={this.handleButtonPress} style={styles.button1} activeOpacity={0.8}>
                <Image source={Message_open_fill} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.manageSettingModal(true)} style={styles.button2} activeOpacity={0.8}>
                <Image source={Setting_fill} />
              </TouchableOpacity>
            </View>
            <SettingsModal
              settingModalVisible={this.state.settingModalVisible} // Pass the settingModalVisible state as a prop
              manageSettingModal={this.manageSettingModal} // Pass the manageSettingModal function as a prop
            />
            <RequestsReceived
              isModalVisible={this.state.isModalVisible}
              setModalVisible={this.setModalVisible}
              acceptButtonText="Accept"
              declineButtonText="Decline"
              userName={this.state.userName}
              updateUserName={this.updateUserName}
              settingModalVisible={this.state.settingModalVisible} // Pass the settingModalVisible state as a prop
              manageSettingModal={this.manageSettingModal} // Pass the manageSettingModal function as a prop
            />
            <TouchableOpacity onPress= {()=> navigation.navigate('ShareDiary')} style={styles.roundButton1}><Image source={group_share}></Image></TouchableOpacity>
            <TouchableOpacity onPress= {()=> navigation.navigate('MailBox',{currentUserName: this.state.userName})} style={styles.roundButton2}><Image source={Subtract}></Image></TouchableOpacity>
            <TouchableOpacity onPress= {()=> navigation.navigate('WritingPage')} style={styles.roundButton3}><Image source={Add_ring_fill}></Image></TouchableOpacity>
            <TouchableOpacity onPress= {()=> navigation.navigate('CalendarPage')} style={styles.roundButton4}><Image source={Date_today}></Image></TouchableOpacity>
            <TouchableOpacity onPress= {()=> navigation.navigate('Contacts')} style={styles.roundButton5}><Image source={User_circle}></Image></TouchableOpacity>
          </SafeAreaView>
        
          
        </ImageBackground>
      </View>
    );
  }
};

const findName = async (uid) => {
  try {
    const db = getFirestore();
    const docRef = doc(db, "users", uid);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      const data = docSnapshot.data().name;
      return data;
    } else {
      console.log("findName is making an error");
      return null;
    }
  } catch (error) {
    console.log("Error getting findName document:", error);
    return null;
  }
};

function RequestsReceived(props) {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [requests, setRequests] = useState([]);
  const [userName, setUserName] = useState('');
  const [senderNames, setSenderNames] = useState({});

  const handleModalClose = () => {
    props.setModalVisible(false);
  };

  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (userName === '') {
    const userDocRef = doc(getFirestore(), "users", currentUser.uid);
    getDoc(userDocRef)
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const UserName2 = data.name;
          setUserName(UserName2);
          props.updateUserName(UserName2);
        }
      })
      .catch((error) => {
        console.log("Error fetching user data:", error);
      });
  }
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("useEffect fetchData currentUser", currentUser.uid);
  
        const currentUserName = await findName(currentUser.uid);
        console.log({ currentUserName });
        setSenderNames(prevState => ({ ...prevState, [currentUserName]: currentUserName }));
  
        const requestsSnapshot = await getDocs(
          collection(
            doc(getFirestore(), "requests", "received"),
            "UserIds",
            currentUser.uid,
            "requestsReceived"
          )
        );
  
        const data = requestsSnapshot.docs.map((doc) => ({
          key: doc.id,
          status: '',
          ...doc.data(),
        }));
  
        const requestsWithNames = await Promise.all(
          data.map(async (request) => {
            const senderName = await findName(request.key);
            return { ...request, senderName };
          })
        );
  
        console.log({ requestsWithNames });
        setRequests(requestsWithNames);
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchData();
  }, [currentUser.uid]);
  

  const acceptFriendRequest = async (senderId) => {
    try {
      const currentUser = getAuth().currentUser;
  
      const currentUserNameSnapshot = await getDoc(
        doc(
          collection(
            doc(
              firebase.firestore(),
              "requests",
              "sent",
              "UserIds",
              senderId,
              "requestsSent"
            )
          ),
          currentUser.uid
        )
      );
      const currentUserName = currentUserNameSnapshot.data().receiverName;
  
      const senderNameSnapshot = await getDoc(
        doc(
          collection(
            doc(
              firebase.firestore(),
              "requests",
              "received",
              "UserIds",
              currentUser.uid,
              "requestsReceived"
            )
          ),
          senderId
        )
      );
      const senderName = senderNameSnapshot.data().senderName;
  
      await deleteDoc(
        doc(
          collection(
            doc(
              firebase.firestore(),
              "requests",
              "received",
              "UserIds",
              currentUser.uid,
              "requestsReceived"
            )
          ),
          senderId
        )
      );
  
      await deleteDoc(
        doc(
          collection(
            doc(
              firebase.firestore(),
              "requests",
              "sent",
              "UserIds",
              senderId,
              "requestsSent"
            )
          ),
          currentUser.uid
        )
      );
  
      await setDoc(
        doc(collection(firebase.firestore(), "following", senderId, "userFollowing"), currentUser.uid),
        { name: currentUserName }
      );
  
      await setDoc(
        doc(collection(firebase.firestore(), "following", currentUser.uid, "userFollowing"), senderId),
        { name: senderName }
      );
  
      setRequests(requests.filter((request) => request.key !== senderId));
      console.log("Friend request accepted!");
    } catch (error) {
      console.log("Error accepting friend request: ", error);
    }
  };
  
  const declineFriendRequest = (senderId) => {
    try {
      deleteDoc(
        doc(
          collection(
            doc(
              firebase.firestore(),
              "requests",
              "received",
              "UserIds",
              currentUser.uid,
              "requestsReceived"
            )
          ),
          senderId
        )
      ).then(() => {
        deleteDoc(
          doc(
            collection(
              doc(
                firebase.firestore(),
                "requests",
                "sent",
                "UserIds",
                senderId,
                "requestsSent"
              )
            ),
            currentUser.uid
          )
        ).then(() => {
          setRequests(requests.filter((request) => request.key !== senderId));
        });
      });
    } catch (error) {
      console.log("Error declining friend request: ", error);
    }
  };
  
  const handleAcceptButton = (senderKey) =>{
    const updatedRequests = requests.map((request) =>
      request.key === senderKey ? { ...request, status: 'accepted' } : request
    );
    setRequests(updatedRequests);
  }
  const handleDeclineButton = (senderKey) =>{
    const updatedRequests = requests.map((request) =>
      request.key === senderKey ? { ...request, status: 'declined' } : request
    );
    setRequests(updatedRequests);
  }
  return(
    <Modal visible={props.isModalVisible} onRequestClose={handleModalClose}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={styles.requestsTitle}>Requests Received</Text>
        {requests.length > 0 ? (
          requests.map((request) => (
            <View key={request.key} style={styles.requestContainer}>
              <Text style={styles.requestText}>Sender: {request.senderName}</Text>
              {request.status === '' && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 5 }}>
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={()=>{acceptFriendRequest(request.key), handleAcceptButton(request.key)}}
                  >
                    <Text style={styles.buttonText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={()=>{declineFriendRequest(request.key), handleDeclineButton(request.key)}}
                  >
                    <Text style={styles.buttonText}>Decline</Text>
                  </TouchableOpacity>
                </View>
              )}
              {request.status === 'accepted' && (
                <Text>Accepted</Text>
              )}
              {request.status === 'declined' && (
                <Text>Declined</Text>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.noRequestsText}>No requests received</Text>
        )}
        <Button title="Close" onPress={handleModalClose} />
      </View>
    </Modal>
  )
}
//navigation.navigate("Profile",{uid: firebase.auth().currentUser.uid})를 통해 
//자신만의 profile로 이동 가능
const styles = StyleSheet.create({
  requestsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  requestContainer: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ccc',
  },
  requestText: {
    fontSize: 16,
  },
  acceptButton: {
    backgroundColor: '#6E8D9D',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  noRequestsText: {
    fontSize: 16,
    marginTop: 10,
  },
    container:{
      flex:1,
    },
    image:{
      flex: 1,
      justifyContent: 'center',
    },
    logInButton:{
      width: '68%',
      height: '6%',
      backgroundColor: '#E7A6BD',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50,
      bottom: '22%',
      alignSelf: "center",  
      position: 'absolute',
    },
    signInButton:{
      width: '68%',
      height: '6%',
      backgroundColor: '#E7A6BD',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50,
      bottom: '15%',
      alignSelf: "center",  
      position: 'absolute',
    },
    button1:{
      width: 50,
      height: 50,
      backgroundColor: '#6E8D9D',
      borderColor: '#71A1A5',
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50,
      marginRight: 10,
    },
    button2:{
      width: 50,
      height: 50,
      backgroundColor: '#6E8D9D',
      borderColor: '#71A1A5',
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50,
      marginRight: 10,
    },
    button3:{
      width: 50,
      height: 50,
      backgroundColor: '#6E8D9D',
      borderColor: '#71A1A5',
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50,
      top: 10,
      right: 130,
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
        bottom: '6%',
        left: '7%',
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
        bottom: '11%',
        left: '25%',
        position: 'absolute',
    },
    roundButton3:{
        width: 50,
        height: 50,
        backgroundColor: '#E7A6BD',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        borderColor: '#6E8D9D',
        borderWidth: 2,
        bottom: '13%',
        position: 'absolute',
        alignSelf: "center",
    },
    roundButton4:{
        width: 50,
        height: 50,
        backgroundColor: '#E7A6BD',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        borderColor: '#6E8D9D',
        borderWidth: 2,
        bottom: '11%',
        right: '25%',
        position: 'absolute',
    },
    roundButton5:{
        width: 50,
        height: 50,
        backgroundColor: '#E7A6BD',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        borderColor: '#6E8D9D',
        borderWidth: 2,
        bottom: '6%',
        right: '7%',
        position: 'absolute',
    },
    inText: {
      fontSize: 24,
      fontWeight: '400',
    }
  
});

const mapStateToProps = (store) =>({
  currentUser: store.userState.currentUser,
})

const mapDispatchProps = (dispatch) => bindActionCreators({fetchUser, fetchUserPosts, fetchUserFollowing}, dispatch)
export default connect(mapStateToProps, mapDispatchProps)(HomeScreen);