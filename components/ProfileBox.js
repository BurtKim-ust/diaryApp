import {useState} from 'react'
import { connect } from 'react-redux';
import {Modal, StyleSheet, View, TouchableOpacity, Text} from 'react-native'
import firebase from 'firebase/app';
import { setDoc, doc, getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const mapStateToProps = (store) =>({
    following: store.userState.following,
})

const sendFriendRequest = (receiverUid, receiverName, following, senderName, setShowPopup, setButtonText) => {
    console.log({receiverUid})
    console.log({receiverName})
    console.log({senderName})
    const db= getFirestore();
    const currentUser=getAuth().currentUser;

    if (following.includes(receiverUid)) {
        console.log('Receiver is already being followed');
        setShowPopup(true);
      } else {
        setDoc(
          doc(db, 'requests', 'sent', 'UserIds', currentUser.uid, 'requestsSent', receiverUid),
          { receiverName: receiverName }
        )
          .then(() => {
            console.log('Friend request sent!');
            setButtonText('신청 완료');
            setDoc(
              doc(
                db,
                'requests',
                'received',
                'UserIds',
                receiverUid,
                'requestsReceived',
                currentUser.uid
              ),
              { senderName: senderName }
            );
          })
          .catch((error) => {
            console.log('Error sending friend request: ', error);
          });
      }
}
function ProfileBox(props) {
    const [showPopup, setShowPopup] = useState(false);
    const [buttonText, setButtonText] = useState('이웃 신청'); 
    const currentUser=getAuth().currentUser;

    return(
        <>
          <View style={styles.contactBox}>
            <View style={styles.profilePicture}/>
            <Text style={styles.profileText}>{props.name}</Text>
          </View>
          {props.uid !==currentUser.uid ?
            (<View style={styles.bottomBox}>
              <TouchableOpacity style={styles.requestBox} onPress={()=> sendFriendRequest(props.uid, props.name, props.following, props.senderName, setShowPopup, setButtonText)}>
                <Text>{buttonText}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.requestBox}>
                <Text>엽서 보내기</Text> 
              </TouchableOpacity>
            </View>)
            :
            null
          }
          <Modal
                animationType="slide"
                transparent={true}
                visible={showPopup}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                    <Text style={styles.modalText}>이미 이웃입니다</Text>
                    <TouchableOpacity onPress={() => setShowPopup(false)}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
      );
}
const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 20,
        width: 240,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 10,
    },
    closeButtonText: {
        color: 'blue',
        fontSize: 16,
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
export default connect(mapStateToProps)(ProfileBox);