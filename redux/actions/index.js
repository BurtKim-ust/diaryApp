import firebase from 'firebase/app';
import { getFirestore, getDoc, collection, doc, getDocs, onSnapshot, query, orderBy } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import 'firebase/firestore';
import {USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE} from '../constants/index'

export function fetchUser() {
  return (dispatch) => {
    const db = getFirestore();
    const currentUser = getAuth().currentUser;
    const userRef = doc(db, "users", currentUser.uid);

    getDoc(userRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() });
        } else {
          console.log('does not exist');
        }
      })
      .catch((error) => {
        console.log("Error getting user document:", error);
      });
  };
}


export function fetchUserPosts() {
    return (dispatch) => {
      const db = getFirestore();
      const currentUser = getAuth().currentUser;
  
      const userPostsRef = collection(db, "posts", currentUser.uid, "UserPosts");
      const userPostsQuery = query(userPostsRef, orderBy("creation", "asc"));
  
      getDocs(userPostsQuery)
        .then((snapshot) => {
          let posts = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          console.log(posts);
          dispatch({ type: USER_POSTS_STATE_CHANGE, posts });
        })
        .catch((error) => {
          console.log("Error fetching user posts:", error);
        });
    };
  }
  
  export function fetchUserFollowing() {
    return (dispatch) => {
      const db = getFirestore();
      const currentUser = getAuth().currentUser;
  
      const userFollowingRef = collection(db, "following", currentUser.uid, "userFollowing");
  
      onSnapshot(userFollowingRef, (snapshot) => {
        let following = snapshot.docs.map((doc) => {
          const id = doc.id;
          return id;
        });
  
        dispatch({ type: USER_FOLLOWING_STATE_CHANGE, following });
  
        following.forEach((uid) => {
          dispatch(fetchUsersData(uid));
        });
      });
    };
  }
  
  export function fetchUsersData(uid) {
    return (dispatch, getState) => {
      const found = getState().usersState.users.some((el) => el.uid === uid);
  
      if (!found) {
        const db = getFirestore();
        const userRef = doc(db, "users", uid);
  
        getDoc(userRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              let user = snapshot.data();
              user.uid = snapshot.id;
              dispatch({ type: USERS_DATA_STATE_CHANGE, user });
              dispatch(fetchUsersFollowingPosts(uid));
            } else {
              console.log('User does not exist');
            }
          })
          .catch((error) => {
            console.log("Error fetching user data:", error);
          });
      }
    };
  }
  
  
  
  export function fetchUsersFollowingPosts(uid) {
    return (dispatch, getState) => {
      const db = getFirestore();
      const userPostsRef = collection(db, "posts", uid, "UserPosts");
      const userPostsQuery = query(userPostsRef, orderBy("creation", "asc"));
  
      getDocs(userPostsQuery)
        .then((snapshot) => {
          const userId = snapshot.ref && snapshot.ref.parent && snapshot.ref.parent.id;
          const user = getState().usersState.users.find((el) => el.uid === userId);
  
          let posts = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data, user: userId };
          });
  
          dispatch({ type: USERS_POSTS_STATE_CHANGE, posts, uid });
        })
        .catch((error) => {
          console.log("Error fetching users following posts:", error);
        });
    };
  }
  

/*export function sendFriendRequest(receiverUid, receiverName){
    console.log({receiverUid})
    firebase.firestore()
    .collection('requests')
    .doc("sent")
    .collection("UserIds")
    .doc(firebase.auth().currentUser.uid)
    .collection('requestsSent')
    .doc(receiverUid)
    .set({name: receiverName})
    .then(() => {
      console.log('Friend request sent!');
      firebase.firestore()
      .collection('requests')
      .doc("received")
      .collection("UserIds")
      .doc(receiverUid)
      .collection('requestsReceived')
      .doc(firebase.auth().currentUser.uid)
      .set({})
    })
    .catch((error) => {
      console.log('Error sending friend request: ', error);
    });
  };*/