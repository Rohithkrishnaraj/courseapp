import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Image,
  SafeAreaView,
  FlatList,
  Dimensions,
  StyleSheet,
} from "react-native";
import React, { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { getAllCourses, getAllLessonsForCourse } from "../DB/DbStorage";



const { width } = Dimensions.get("window");
const itemWidth = width/2
console.log("itemWidth", itemWidth);
export default function Home({ navigation ,route}) {
  const [coursedata, setcoursedata] = useState([]);
  const [lessonCounts, setLessonCounts] = useState([]);




  useEffect(() => {
    const focusHandler = navigation.addListener('focus', () => {
      Fetchcoursedata()
      fetchLessonCounts()
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


























  
  // console.log("Window width:", width);

  const renderitems = ({ item, index }) => {
    return (
      <TouchableOpacity
        className={`w-40 h-32 ${item.colour?item.colour:"bg-gray-300"} shadow-sm border border-gray-100 shadow-[#cddbe8] mx-2 rounded-md flex flex-col items-center justify-center `}
        key={index}
        onPress={()=>navigation.navigate("Lesson", { itemid: item.id })}
      >
        <Text
          className="py-1 w-24 text-center text-base text-blue-900"
          numberOfLines={1}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={["#dfe9f3", "#f8fbff"]} className="h-screen flex items-center justify-start">
    {/* Profile Section */}
    <View className="mt-12 flex items-center">
      <View className="w-24 h-24 bg-white shadow-lg rounded-full flex items-center justify-center">
        <Image
          source={require(`../assets/Profile/Male.jpg`)}
          className="w-20 h-20 rounded-full"
        />
      </View>
      <Text className="text-lg text-gray-700 font-semibold py-2">Hey, John 👋</Text>
    </View>

    {/* Action Buttons */}
    <View className="w-full px-6 mt-8">


      <TouchableOpacity
        onPress={() => navigation.navigate('OneClick')}
        className="bg-white p-4 rounded-xl shadow-md flex-row items-center justify-between"
      >
        <View className="flex-row items-center">
          <View className="w-12 h-12 bg-indigo-100 rounded-full items-center justify-center mr-4">
            <AntDesign name="home" size={24} color="#6366F1" />
          </View>
          <View>
            <Text className="text-lg font-semibold text-gray-800">View Course</Text>
            <Text className="text-sm text-gray-600">Explore course content</Text>
          </View>
        </View>
        <AntDesign name="right" size={20} color="#4B5563" />
      </TouchableOpacity>
    </View>

    {/* Heading */}
    <View className="w-4/5 text-center mt-4">
      <Text className="text-3xl font-extrabold text-center text-gray-800 leading-10">
        What do you want to learn today?
      </Text>
    </View>

    {/* Courses Section */}
    <SafeAreaView className="mt-8 w-full px-6">
      <View className="flex flex-row items-center justify-between">
        <Text className="font-bold text-lg tracking-wide text-blue-900">Courses</Text>
        <TouchableOpacity onPress={() => navigation.navigate("OneClick")} className="flex flex-row items-center">
          <Text className="text-blue-500 font-semibold">See all</Text>
          <AntDesign name="right" size={16} color="#53a2ff" />
        </TouchableOpacity>
      </View>

      {/* Course Cards */}
      <View className="w-full h-52 mt-6">
        <FlatList
          data={coursedata}
          renderItem={renderitems}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>

    {/* Add Course Button */}
    <TouchableOpacity
      className="bg-[#53a2ff] hover:bg-blue-700 text-white w-20 h-20 shadow-lg rounded-full flex items-center justify-center mt-10"
      onPress={() => navigation.navigate("CouresForm")}
    >
      <Feather name="plus" size={28} color="white" />
    </TouchableOpacity>
  </LinearGradient>
  );
}

