import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  PermissionsAndroid,
} from "react-native";
import Form from "../Utils/Form"

import * as ImagePicker from "expo-image-picker";
// import {
//   addCourse,
//   createTables,
//   addLesson,
//   listCourses,
// } from "../../DB/Database";
import { AntDesign } from "@expo/vector-icons";


export default function AddItems({ navigation }) {
  const [data, setdata] = useState([]);


  const items = data.map((e) => e);
  const d = items.map((r) => r.name);
  

  const [Image, setImage] = useState(null);
  const [FormOPtion, SetFormOption] = useState("folderopen");

  const ChooseFormOption = ["folderopen", "file1"];
  const handleFormsOption = (id) => {
    SetFormOption(id);
  };
  const [item, setItem] = useState({
    name: "",
    description: "",
    uri: "",
  });

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const chooseImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      //   allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    setImage(result);
  };

  const handleInputChange = (key, value) => {
    setItem({
      ...item,
      [key]: value,
    });
  };

  const handleAddItem = async () => {
    const newItem = {
      name: item.name,
      description: item.description,
      uri: Image?.assets[0]?.uri,
    };
    if (newItem.name) {
      await addCourse(newItem.name);
    }

    await Fetchdata();

    setItem({
      name: "",
      description: "",
    });
    setImage(null);
    navigation.navigate("Home");
  };

  return (
    <View className="w-full h-full bg-gray-100">
      <View className="flex flex-row justify-evenly px-4 pt-14">
        {ChooseFormOption.map((form) => (
          <TouchableOpacity
            className={`${
              form == FormOPtion ? "bg-gray-200" : ""
            } w-14 h-14 flex justify-center items-center rounded-xl`}
            onPress={() => handleFormsOption(form)}
          >
            <AntDesign name={form} size={24} color="black" />
          </TouchableOpacity>
        ))}
      </View>
      <View className="w-4/5 h-[500px] mt-10 mx-auto">
        {FormOPtion == "folderopen" ? (
          <Form
            handleAddItem={handleAddItem}
            item={item}
            handleInputChange={handleInputChange}
            chooseImage={chooseImage}
            Tittle="Add Course"
            Name="Course Name"
            Description="Course Description"
          />
        ) : (
          <Form
            handleAddItem={handleAddItem}
            item={item}
            handleInputChange={handleInputChange}
            chooseImage={chooseImage}
            Tittle="Add Lesson"
            Name="Lesson Name"
            Description="Lesson Description"
          />
        )}
      </View>
    </View>
  );
}
