import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import ListBox from "./Utils/ListBoxButton";
import { getAllLessonsForCourse, getAllUnitsForLesson, deleteLesson } from "../DB/DbStorage";
import Icon from "react-native-vector-icons/EvilIcons";

export default function Lesson({ navigation, route }) {
  const [searchText, setSearchText] = useState("");
  const [lessondata, setlessondata] = useState([]);
  const [unitsCount, setunitsCounts] = useState([]);

  const { itemid } = route.params;
  
  // Debug log to check the itemid
  console.log("Lesson Screen Params:", { itemid, fullParams: route.params });

  useEffect(() => {
    const focusHandler = navigation.addListener("focus", () => {
      fetchlessondata();
      fetchUnitsCounts();
    });
    return focusHandler;
  }, [navigation]);

  const fetchlessondata = async () => {
    try {
      const fetch = await getAllLessonsForCourse(itemid);
      setlessondata(fetch);
    } catch (err) {
      console.log("Error in lesson fetch", err);
    }
  };

  const fetchUnitsCounts = async () => {
    try {
      const lessonData = await getAllLessonsForCourse(itemid);
      const counts = await Promise.all(
        lessonData.map(async (lesson) => {
          const units = await getAllUnitsForLesson(lesson.id);
          return units.length;
        })
      );
      setunitsCounts(counts);
    } catch (error) {
      console.error("Error fetching unit counts:", error);
    }
  };

  const handleDelete = async (lessonId, lessonName) => {
    Alert.alert(
      "Delete Lesson",
      `Are you sure you want to delete "${lessonName}"?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteLesson(lessonId);
              await fetchlessondata(); // Refresh the list after deletion
            } catch (error) {
              console.error("Error deleting lesson:", error);
              Alert.alert("Error", "Failed to delete lesson");
            }
          }
        }
      ]
    );
  };

  const handleEdit = (lesson) => {
    console.log("Editing lesson with courseId:", itemid);
    navigation.navigate("LessonForm", {
      CourseId: itemid,
      isEditing: true,
      lessonData: lesson
    });
  };

  const handleAddLesson = () => {
    console.log("=== Add Lesson Navigation ===");
    console.log("Current itemid:", itemid);
    console.log("Attempting to navigate to LessonForm with params:", {
      CourseId: itemid,
      isEditing: false
    });
    navigation.navigate("LessonForm", {
      CourseId: itemid,
      isEditing: false
    });
    console.log("Navigation called");
  };

  const renderItems = ({ item, index }) => {
    const navigate = () => {
      navigation.navigate("Units", {
        LessonId: item.id,
        lessonid: item.id // Pass the ID directly in navigation params
      });
    };
    
    const navigateunits = () => {
      navigation.navigate("ContentForm", { 
        lessonid: item.id 
      });
    };

    return (
      <TouchableOpacity
        className={`w-full flex flex-col items-center justify-center`}
      >
        <View className={`w-4/5 mx-auto h-20 my-1 ${item.colour ? item.colour : "bg-teal-300"} rounded-md flex px-4 items-center`}>
          <View className="flex flex-row justify-between items-center w-full">
            <TouchableOpacity 
              className="flex-1" 
              onPress={unitsCount[index] === 0 ? navigateunits : navigate}
            >
              <View>
                <Text
                  className="text-xl text-left tracking-wider font-medium"
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                {unitsCount[index] === 0 ? (
                  <View className="tracking-wider py-1">
                    <Text className="text-base text-blue-500">Add Unit</Text>
                  </View>
                ) : (
                  <Text className="text-sm tracking-wider">
                    {`${unitsCount[index]} Units`}
                  </Text>
                )}
              </View>
            </TouchableOpacity>

            <View className="flex flex-row items-center gap-4">
              <TouchableOpacity onPress={() => handleEdit(item)}>
                <MaterialIcons name="edit" size={24} color="#4B5563" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id, item.name)}>
                <MaterialIcons name="delete" size={24} color="#EF4444" />
              </TouchableOpacity>
              <AntDesign name="right" size={20} color="#6a717f" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="h-full bg-gray-50">
      <View className="relative flex-row justify-between mt-4 mx-auto w-4/5">
        <View className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none -top-2">
          <Icon
            name="search"
            style={{
              width: 60,
              height: 60,
              fontSize: 40,
              textAlign: "left",
              alignItems: "center",
              padding: 12,
              color: "#d5d9dc",
            }}
          />
        </View>
        <TextInput
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
          className="bg-transparent border border-gray-300 placeholder:tracking-widest hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-xl h-12 w-4/5 px-6 pl-16 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          placeholder="Search..."
          required
        />
        <TouchableOpacity
          onPress={handleAddLesson}
          className="bg-indigo-500 px-4 py-2 rounded-md"
        >
          <Text className="text-white font-medium">Add Lesson</Text>
        </TouchableOpacity>
      </View>

      <SafeAreaView className="w-full  bg-gray-50 h-5/6 py-6">
        {lessondata && lessondata.length > 0 ? (
          <FlatList
            data={lessondata}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItems}
          />
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {lessondata === null ? (
              <>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading...</Text>
              </>
            ) : (
              <Text>No lessons available</Text>
            )}
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}
