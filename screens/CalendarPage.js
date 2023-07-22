import React, { useRef, useState, useEffect } from 'react';
import {Image, FlatList, Button, View, Text, SafeAreaView, StyleSheet, TextInput, ImageBackground, TouchableOpacity,Dimensions, PanResponder} from 'react-native';
import globe from '../assets/icons/globe.png'
import Question_fill from '../assets/icons/Question_fill.png'
import m1 from "../assets/m1.png"
import moment from 'moment';
import 'moment/locale/en-au';
import {NavigationContainer, useNavigation} from "@react-navigation/native";
import Dell_fill from '../assets/icons/Dell_fill.png'
import Search from '../assets/icons/Search.png'
import firebase from 'firebase/app';
import { getAuth } from "firebase/auth";
import Angry from '../assets/icons/Angry.png'
import Happy from '../assets/icons/Happy.png'
import Sad from '../assets/icons/Sad.png'
import Lol from '../assets/icons/Lol.png'
import Wow from '../assets/icons/Wow.png'
import { getFirestore,getDocs, collection, query, where } from 'firebase/firestore';

function CalendarPage(){
  const currentUser = getAuth().currentUser;
  const navigation = useNavigation();
  const screenWidth = Dimensions.get('window').width;
  const monthWidth = screenWidth - 55;
  const initialMonth = moment();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedPost, setSelectedPost] = useState([]);
  const [myPosts,setMyPosts] = useState([]);
  const [searchMode, setSearchMode] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [contentTitle, setContentTitle] = useState([]);
  const db = getFirestore();

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dx }) => Math.abs(dx) > 10,
      onPanResponderMove: (_, { dx }) => {
        const offset = Math.floor(dx / monthWidth);
        const newMonth = moment(initialMonth).add(offset, 'months');
        setDisplayedMonth(newMonth);
      },
    })
  ).current;

  const [displayedMonth, setDisplayedMonth] = useState(initialMonth);

  useEffect(() => {
    const fetchData = async () => {
      let posts = [];
      try {
        const snapshot = await getDocs(query(
          collection(db, 'posts', currentUser.uid, 'UserPosts')
        ));
    
        posts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        posts.sort((a, b) => b.creation.toDate() - a.creation.toDate());
      } catch (error) {
        console.log('Error fetching posts of the current user:', error);
      }
  
      console.log({ posts });
      setMyPosts(posts);
      console.log({ myPosts });
    };
  
    fetchData();
  }, []);

  /*const renderDay = (day) => {
    const date = moment(displayedMonth).date(day).format('YYYY-MM-DD');
    return (
      <TouchableOpacity style={[styles.dayContainer, { height: 50 }]} onPress={() => console.log(date)}>
        <Text style={styles.dayText}>{day}</Text>
      </TouchableOpacity>
    );
  };*/
  const handleSearchTextChange = (text) => {
    setSearchText(text);
    // Perform any additional logic or actions based on the updated search text
  };

  const filteredPosts = myPosts.filter((post) => {
    
    
    if (!searchText) {
      return false; // No search text entered, include no post
    }
    return post.content.toLowerCase().includes(searchText.toLowerCase()) ||
    post.title.toLowerCase().includes(searchText.toLowerCase());
  });

  const onPressDay = (date, posts) => {
    if (posts.length > 0) {
      setSelectedDate(date);
      setSelectedPost(posts);
      console.log({posts})
    }
  };
  
  const renderDay = (day) => {
    const date = moment(displayedMonth).date(day).format('YYYY-MM-DD');
    const posts = myPosts.filter((p) => {
      const creationDate = moment(p.creation.toDate()).format('YYYY-MM-DD');
      return moment(creationDate).isSame(date);
    });

    return (
      <TouchableOpacity
        style={[styles.dayContainer, { height: 60 }]}
        onPress={() => onPressDay(date, posts)}
      >
        <Text style={styles.dayText}>{day}</Text>
        <View style={styles.feelingContainer}>
          {posts.length > 0 &&
            posts.map((post, index) => (
              <React.Fragment key={index}>
                {index === 0 && (
                  <View>
                    {renderFeelingImage(post.feeling)}
                  </View>
                )}
                {index > 0 && index<3 && <Text>.</Text>}
              </React.Fragment>
            ))}
        </View>
      </TouchableOpacity>
    );
  };

  const renderFeelingImage = (feeling) => {
    let imageSource;
    switch (feeling) {
      case 'Angry':
        imageSource = Angry;
        break;
      case 'Sad':
        imageSource = Sad;
        break;
      case 'Happy':
        imageSource = Happy;
        break;
      case 'Lol':
        imageSource = Lol;
        break;
      case 'Wow':
        imageSource = Wow;
        break;
      default:
        imageSource = null;
    }

    if (imageSource) {
      return <Image source={imageSource} style={styles.feelingImage} />;
    } else {
      return null;
    }
  };

  
  const SelectedPostModal = ({ selectedPost, selectedDate }) => {
    const [selectedDetailedPost, setSelectedDetailedPost] = useState(null);
    const [modalVisible, setModalVisible] = useState(true);
  
    const onClose = () => {
      setModalVisible(false);
      setSelectedPost(null);
      setSelectedDetailedPost(null);
    };
  
    const handlePostClick = (index) => {
      setSelectedDetailedPost(selectedPost[index]);
    };
  
    const onDetailedClose = () => {
      setSelectedDetailedPost(null);
    };
  
    useEffect(() => {
      if (selectedPost !==null && selectedPost.length === 1) {
        setSelectedDetailedPost(selectedPost[0]);
      }
    }, [selectedPost]);
  
    if (!selectedPost || selectedPost.length === 0 || !modalVisible) {
      return null;
    }
  
    return (
      <View style={styles.modalContainer}>
        {selectedDetailedPost === null ? (
          <>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>닫기</Text>
            </TouchableOpacity>
            <View style={{ padding: 10 }}>
              {selectedPost.map((post, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handlePostClick(index)}
                  style={styles.postItem}
                >
                  <View style={styles.feelingContainer2}>
                    {renderFeelingImage(post.feeling)}
                  </View>
                  <Text style={styles.modalTitle}>{post.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          <>
            {selectedPost.length===1 ? (
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>닫기</Text>
              </TouchableOpacity>
            ):(
              <TouchableOpacity onPress={onDetailedClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>뒤로 가기</Text>
              </TouchableOpacity>
              )
            } 
            <View style={{ padding: 10 }}>
              <View style={styles.feelingContainer2}>
                {renderFeelingImage(selectedDetailedPost.feeling)}
              </View>
  
              <Text style={styles.modalTitle}>날짜: {selectedDate}</Text>
              <Text style={styles.modalTitle}>제목: {selectedDetailedPost.title}</Text>
              <Text style={styles.modalTitle}>내용: {selectedDetailedPost.content}</Text>
            </View>
          </>
        )}
      </View>
    );
  };
  
  

  const renderMonth = (_, index) => {
    const startDate = moment(displayedMonth).startOf('month');
    const endDate = moment(displayedMonth).endOf('month');
    const startDay = startDate.day(); // Get the starting day index (0 for Sunday, 1 for Monday, etc.)
    const daysCount = endDate.diff(startDate, 'days') + 1;
    const totalDays = startDay + daysCount; // Total number of days including placeholders
    const rowCount = Math.ceil(totalDays / 7); // Number of rows needed
  
    const daysArray = Array.from({ length: rowCount * 7 }, (_, i) => {
      if (i < startDay || i >= startDay + daysCount) {
        return null; // Placeholder for empty days
      }
      return startDate.clone().add(i - startDay, 'days').date();
    });
    
    // Generate days of the week headers
    const daysOfWeek = moment.weekdaysMin(); // Array of short day names (e.g., ['Sun', 'Mon', 'Tue', ...])
    const headerRow = daysOfWeek.map((day, index) => (
      <View key={index} style={styles.dayContainer}>
        <Text style={styles.dayText}>{day}</Text>
      </View>
    ));

    
    return (
      <View style={styles.monthContainer}>
        <Text style={styles.monthText}>{displayedMonth.format('MMMM YYYY')}</Text>
        <View style={styles.weekHeaderContainer}>{headerRow}</View>
        <FlatList
          data={daysArray}
          keyExtractor={(day) => day?.toString() || 'placeholder'}
          renderItem={({ item }) => {
            if (item) {
              return renderDay(item);
            } else {
              return <View style={styles.dayContainer} />; // Render empty day placeholder
            }
          }}
          horizontal={false}
          numColumns={7}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              setDisplayedMonth(moment(displayedMonth).subtract(1, 'month'))
            }
          >
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                setDisplayedMonth(moment(displayedMonth).add(1, 'month'))
              }
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    };

  return(
    <View style={styles.container}>
      <ImageBackground source={m1}
      resizeMode="cover" style={styles.image}>
      
          <View style={styles.frame}>
            <SafeAreaView style={{flex:1, width:'100%'}} flexDirection='column'>
              {searchMode===false ? (
                <>
                <View flexDirection='row' justifyContent='space-between' style={{marginBottom:10, alignItems:'center'}}>
                  <Text style={styles.title}>캘린더</Text>
                  <TouchableOpacity onPress= {()=> navigation.navigate('HomeScreen')} style={styles.exitButton}>
                    <Image source={Dell_fill} />
                  </TouchableOpacity>
                </View>
                
                <TouchableOpacity onPress= {()=> setSearchMode(true)} style={styles.frame2}>
                    <Image source={Search} />
                    <Text style={styles.search}>검색 엔진</Text>
                </TouchableOpacity>
               
            
                <View style={styles.frame3}>
                  <View style={styles.container2} {...panResponder.panHandlers}>
                    <FlatList
                      data={Array.from({ length: 50 }, (_, i) => i)} // Adjust the number of months as needed
                      keyExtractor={(month) => month.toString()}
                      renderItem={renderMonth}
                      horizontal
                      pagingEnabled
                      snapToAlignment="center"
                      snapToInterval={monthWidth}
                    />
                  </View>
                </View>
                <SelectedPostModal
                  selectedPost={selectedPost}
                  selectedDate={selectedDate}
                />
                </>):(
                  <>
                    <View style={styles.frame2}>
                      <Image style= {{left: 10}} source={Search} />
                      <TextInput
                        style={styles.searchInput}
                        onChangeText={handleSearchTextChange}
                        placeholder="검색 엔진"
                        value={searchText}
                      />
                      <TouchableOpacity style={{width: 70, alignSelf: 'flex-end', alignSelf:'center'}} onPress={()=> setSearchMode(false)}>
                        <Text>뒤로 가기</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.frame3}>
                    <FlatList
                      data={filteredPosts}
                      renderItem={({ item }) => (
                        // Render each matching item here
                        <>
                          <View style={{padding:10 }}>
                            <Text>제목: {item.title
                                .toLowerCase()
                                .split(new RegExp(`(${searchText.toLowerCase()})`, 'gi'))
                                .map((part, index) => (
                                  <React.Fragment key={index}>
                                    {part.toLowerCase() === searchText.toLowerCase() ? (
                                      <Text style={{ backgroundColor: 'white' }}>{part}</Text>
                                    ) : (
                                      part
                                    )}
                                  </React.Fragment>
                                ))}
                            </Text>
                            <Text>내용: {item.content
                                .toLowerCase()
                                .split(new RegExp(`(${searchText.toLowerCase()})`, 'gi'))
                                .map((part, index) => (
                                  <React.Fragment key={index}>
                                    {part.toLowerCase() === searchText.toLowerCase() ? (
                                      <Text style={{ backgroundColor: 'white'}}>{part}</Text>
                                    ) : (
                                      part
                                    )}
                                  </React.Fragment>
                                ))}
                            </Text>
                            <Text>
                              작성된 날짜: {moment(item.creation.toDate()).format('YYYY-MM-DD')}
                            </Text>
                          </View>
                        </>
                      )}
                      keyExtractor={(item) => item.id.toString()}
                    />
                    </View>
                  </>
                )}
              
            </SafeAreaView>
          </View>
      </ImageBackground>
    </View>
    // 로그인 페이지로 이동하는 버튼 
    //<Button title="go to main" onPress={()=>navigation.navigate('LogIn')}/>
    //<Button onPress={onPressLearnMore} title="+" style={styles.roundButton} />
  );
};
  
  const styles = StyleSheet.create({
      container:{
        flex:1,
      },
      container2: {
        flex:1,
        marginTop: 20,
        marginBottom: 20,
        alignItems: 'center',
      },
      searchInput: {
        flex: 1,
        fontSize: 16,
        paddingHorizontal: 5,
        marginLeft: 10,
        borderRadius: 10,
        backgroundColor: '#E1BFDF',
      },
      modalContainer: {
        flex: 1,
        backgroundColor: '#E1BFDF',
      },
      monthContainer: {
        width: Dimensions.get('window').width - 55,
        margin: 10,
      },
      weekHeaderContainer: {
        flexDirection: 'row',
        marginBottom: 10,
      },
      dayContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'gray',
      },
      dayText: {
        fontSize: 16,
      },
      monthText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      feelingText:{
        fontSize: 16,
      },
      feelingImage: {
        width: 20,
        height: 20,
        marginLeft: 2,
        marginRight: 2,
        marginBottom: 0,
        //여러개면 칸을 벗어남. 해결책 필요.
      },
      monthButton: {
        position: 'absolute',
        top: 10,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#E1BFDF',
      },
      monthButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingHorizontal: 20,
      },
      button: {
        backgroundColor: '#E1BFDF',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
      },
      buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      search:{
        fontSize: 22,
        fontWeight: '400',
        padding: 8,
      },
      feelingContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        justifyContent: 'center',
        bottom:1
      },
      feelingContainer2:{
        flexDirection: 'row',
        alignItems: 'center',
      },
      frame:{
        flex:1,
        width:'100%',
        borderRadius: 40,
        backgroundColor: 'rgba(177,137,176,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: "center",  

   
        flexDirection: 'column',
  
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
        marginBottom: 15
      },
      image:{
        flex: 1,
        justifyContent: 'center',
      },
      postItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      },
      title:{
        marginTop:10,
        fontSize: 24,
        fontWeight: '400',
        left: 30,
      },
      closeButton: {
        backgroundColor: 'purple',
        padding: 10,
        borderRadius: 5,
      },
      closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
      },
      modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
      },
      modalText: {
        fontSize: 16,
        marginBottom: 5,
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
        top: 0,
        right: 10,
        position: 'absolute',
        alignSelf:'flex-end'
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
  
  export default CalendarPage;