import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Button, Image, View, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImagePickerExample(props) {
  const [image, setImage] = useState(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [photoBoxStyle, setPhotoBoxStyle] = useState({
    width:'90%',
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    alignSelf: 'center',
    marginTop: 10,
    height: 40,
  });
  useEffect(() => {
    if (image) {
      setPhotoBoxStyle({
        height: 220,
        width:'90%',
        borderRadius: 10,
        alignSelf: 'center',
      });
      props.onImageSelected && props.onImageSelected(image);//최근에 추가함. 
    } else {
      setPhotoBoxStyle({
        width:'90%',
        borderRadius: 10,
        alignSelf: 'center',
        marginTop: 10,
        height: 40,
      });
    }
  }, [image]);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    
    console.log(result);

    if (!result.canceled) {
      props.onImageSelected(result.assets[0].uri);
      setImage(result.assets[0].uri);
      setShowImagePicker(true);
    }
  };

  return (
    <View style={photoBoxStyle}>
      <TouchableOpacity onPress={pickImage} >
        {image && <Image source={{ uri: image }} style={{alignSelf: 'center',height:200, width:200, marginTop:10}}/>}
        {!image && (
          <Button title="Photo +" onPress={pickImage} />
        )}
      </TouchableOpacity>
    </View>
  );
}

/*<View style={{ photoBoxStyle }}>
      {image ? (
        <TouchableOpacity onPress={pickImage}>
            <Image source={{ uri: image }} style={{ width: '80%', aspectRatio: 1, borderRadius:10, marginTop:20,}} />
        </TouchableOpacity>
      ) : (
        <Button title="Photo +" onPress={pickImage} />
      )}
    </View>*/