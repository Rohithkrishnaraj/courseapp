import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import React, { useState, useEffect } from "react";
import { getAllCourses, getAllLessonsForCourse } from "../DB/DbStorage";

import Icon from "react-native-vector-icons/EvilIcons";

export default function Course({ navigation, route }) {
  const [searchText, setSearchText] = useState("");
  const [coursedata, setcoursedata] = useState([]);
  const [lessonCounts, setLessonCounts] = useState([]);

  useEffect(() => {
    const focusHandler = navigation.addListener("focus", () => {
      Fetchcoursedata();
      fetchLessonCounts();
    });
    return focusHandler;
  }, [navigation]);

  const fetchLessonCounts = async () => {
    try {
      const courseData = await getAllCourses();
      const counts = await Promise.all(
        courseData.map(async (course) => {
          const lessons = await getAllLessonsForCourse(course.id);
          return lessons.length;
        })
      );
      setLessonCounts(counts);
    } catch (error) {
      console.error("Error fetching lesson counts:", error);
    }
  };

  const Fetchcoursedata = async () => {
    try {
      const fetch = await getAllCourses();
      setcoursedata(fetch);
      console.log(fetch);
    } catch (err) {
      console.log("show data", err);
    }
  };

  const renderItems = ({ item, index }) => {
    const navigate = () => {
      navigation.navigate("Lesson", {
        itemid: item.id
      });
    };

    return (
      <TouchableOpacity
        className={`w-4/5 mx-auto h-24 flex flex-col items-center justify-center my-2 rounded-md ${item.colour ? item.colour : "bg-gray-300"}`}
        onPress={navigate}
        key={index}
      >
        <Text
          key={index}
          className="text-xl w-60 text-center tracking-wider font-medium"
          numberOfLines={1}
        >
          {item.name}
        </Text>
        {lessonCounts[index] === 0 ? (
          <View className="text-sm w-60 text-center tracking-wider items-center py-1 ">
            <Text className="text-base text-blue-500">Add Lesson</Text>
          </View>
        ) : (
          <Text className="text-sm w-60 text-center tracking-wider ">
            {`${lessonCounts[index]} Lessons`}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View className="h-full bg-gray-50">
      <View className="relative flex-row justify-evenly mt-4   w-4/5 mx-auto ">
        <View className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none -top-2 ">
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
          className="bg-transparent border border-gray-300 placeholder:tracking-widest hover:bg-blue-800  focus:outline-none focus:ring-blue-300 font-medium rounded-md  text-xl h-12 w-full  px-6  pl-16 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          placeholder="Search..."
          required
        />
      </View>

      <SafeAreaView className="w-full bg-gray-50 h-5/6 py-6 ">
      {coursedata && coursedata.length > 0 ? (
        <FlatList
          data={coursedata}
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
          {coursedata === null ? (
            <>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text>Loading...</Text>
            </>
          ) : (
            <Text>No courses available</Text>
          )}
        </View>
      )}
    </SafeAreaView>
    </View>
  );
}
