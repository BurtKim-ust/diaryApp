import React, { Component } from 'react'
import { Text, View, Button, TextInput, StyleSheet, ImageBackground, TouchableOpacity} from 'react-native'
import firebase from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import m1 from "../assets/m1.png"

export class SignUp extends Component {
    constructor(props){
        super(props);

        this.state={
            email: '',
            password: '',
            name: '',
        }
        this.onSignUp=this.onSignUp.bind(this)
    }
    onSignUp() {
        const auth = getAuth();
        const { email, password, name } = this.state;

        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
        // Use setDoc to add the user document to Firestore
        const db = getFirestore();
        const userDocRef = doc(db, "users", firebase.auth().currentUser.uid);

        setDoc(userDocRef, {
            name,
            email,
        })
        .then(() => {
        console.log("User document added to Firestore successfully!");
        })
        .catch((error) => {
        console.log("Error adding user document to Firestore:", error);
        });

        const user = userCredential.user;
        console.log(user);
        })
        .catch((error) => {
        console.log(error);
        });
    }
    render() {
        return (
            <View style={styles.container}>
                <ImageBackground source={m1}
                resizeMode="cover" style={styles.image}>
                    <View style={styles.container}>
                        <View style={styles.inputContainer}>
                            <TextInput
                            style={styles.emailTextInput}
                            placeholder="name"
                            onChangeText={(name) => this.setState({name})}
                            
                            />   
                            <TextInput
                            style={styles.passwordTextInput}
                            placeholder="email"
                            onChangeText={(email) => this.setState({email})}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            />
                            <TextInput
                            style={styles.logInButton}
                            placeholder="password"
                            onChangeText={(password) => this.setState({password})}
                            secureTextEntry={true}
                            />   
                            <TouchableOpacity style={styles.signUpButton} onPress={()=>{this.onSignUp()}}><Text style={styles.inText}>Sign Up</Text></TouchableOpacity>
                            
                        </View>
                    </View>
                    
                </ImageBackground>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    inputContainer: {
        flex:1,
        alignSelf: 'center',
        paddingHorizontal: 20,
        marginTop: 50,
        marginBottom: 20,
      },
    emailTextInput:{
        width: '68%', 
        height: '7%', 
        borderWidth: 1, 
        marginBottom: 10, 
        padding: 10, 
        top: '30%',
        opacity: 0.7,
        backgroundColor: '#E7A6BD', 
        borderColor: '#6E8D9D', 
        borderRadius: 10, 
        position: 'absolute', 
        alignItems: 'center',
        justifyContent: 'center', 
        alignSelf: "center",
      },
      passwordTextInput:{
        width: '68%', 
        height: '7%', 
        borderWidth: 1, 
        marginBottom: 10,      
        top: '38%',
        padding: 10, 
        backgroundColor: '#E7A6BD', 
        borderColor: '#6E8D9D', 
        borderRadius: 10, 
        position: 'absolute', 
        alignItems: 'center',
        justifyContent: 'center', 
        opacity: 0.7,
        alignSelf: "center",
      },
      logInButton:{
        width: '68%',
        height: '7%',
        borderWidth: 1, 
        marginBottom: 10,   
        padding: 10, 
        backgroundColor: '#E7A6BD',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        opacity: 0.7,
        top: '46%',
        borderColor: '#6E8D9D',
        alignSelf: "center",  
        position: 'absolute',
      },
      signUpButton:{
        width: '68%',
        height: '6%',
        backgroundColor: '#E7A6BD',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        borderColor: '#6E8D9D',
        opacity: 0.5,
        borderWidth: 1,
        top: '54%',
        alignSelf: "center",  
        position: 'absolute',
      },
    image:{
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
    },
    inText: {
        fontSize: 24,
        fontWeight: '400',
        position: 'absolute',
    }
  });

export default SignUp
