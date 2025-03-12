import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  FlatList,
  Dimensions,
  StatusBar,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { getAllCourses, getAllLessonsForCourse } from "../DB/DbStorage";

const { width } = Dimensions.get("window");

// Helper function to convert Tailwind classes to color codes
const getGradientColors = (colour) => {
  if (!colour) return ["#f3f4f6", "#ffffff"];

  // Map of Tailwind color classes to actual color codes
  const colorMap = {
    "bg-blue-200": ["#bfdbfe", "#dbeafe"],
    "bg-red-200": ["#fecaca", "#fee2e2"],
    "bg-green-200": ["#bbf7d0", "#dcfce7"],
    "bg-yellow-200": ["#fef08a", "#fef9c3"],
    "bg-purple-200": ["#e9d5ff", "#f3e8ff"],
    "bg-pink-200": ["#fbcfe8", "#fce7f3"],
    "bg-indigo-200": ["#c7d2fe", "#e0e7ff"],
    "bg-gray-200": ["#e5e7eb", "#f3f4f6"],
  };

  return colorMap[colour] || ["#f3f4f6", "#ffffff"];
};

export default function Home({ navigation, route }) {
  const [coursedata, setcoursedata] = useState([]);
  const [lessonCounts, setLessonCounts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    navigation.replace("Login");
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([Fetchcoursedata(), fetchLessonCounts()]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
    setRefreshing(false);
  }, []);

  useEffect(() => {
    const focusHandler = navigation.addListener("focus", () => {
      setLoading(true);
      Promise.all([Fetchcoursedata(), fetchLessonCounts()]).finally(() =>
        setLoading(false)
      );
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
    } catch (err) {
      console.error("Error fetching course data:", err);
    }
  };

  const renderitems = ({ item, index }) => {
    const lessonCount = lessonCounts[index] || 0;
    return (
      <TouchableOpacity
        accessible={true}
        accessibilityLabel={`${item.name} course with ${lessonCount} lessons`}
        accessibilityHint="Double tap to view course details"
        className="w-full mb-4 overflow-hidden px-4"
        onPress={() => navigation.navigate("Lesson", { itemid: item.id })}
      >
        <LinearGradient
          colors={getGradientColors(item.colour)}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="p-4 rounded-xl shadow-sm border border-gray-300"
        >
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text
                className="text-lg font-semibold text-gray-800 mb-1"
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <Text className="text-sm text-gray-600">
                {lessonCount} {lessonCount === 1 ? "Lesson" : "Lessons"}
              </Text>
            </View>
            <View className="bg-white/30 p-2 rounded-full">
              <AntDesign name="right" size={16} color="#4B5563" />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      {/* Header */}
      <View className="px-6 pt-4 pb-2 flex-row justify-between items-center bg-white border-b border-gray-100">
        <View className="flex-row items-center">
          <View className="mr-3  p-2 rounded-xl w-16 h-14 items-center justify-center">
            <Image
              source={require("../assets/AppIcon/icondemo.png")}
              className="w-full h-full rounded-full"
              resizeMode="cover"
            />
          </View>

          <View>
            <Text className="text-2xl font-bold text-gray-800">
              Create Your Course
            </Text>
            <Text className="text-base text-gray-600">Welcome back 👋</Text>
          </View>
        </View>
        <TouchableOpacity
          accessible={true}
          accessibilityLabel="Logout button"
          accessibilityHint="Double tap to log out of your account"
          onPress={handleLogout}
          className="p-2 rounded-full bg-gray-100"
        >
          <MaterialIcons name="logout" size={24} color="#4B5563" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <FlatList
        className="flex-1"
        data={coursedata}
        renderItem={renderitems}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4B5563"]}
            tintColor="#4B5563"
          />
        }
        ListEmptyComponent={
          !loading && (
            <View className="flex-1 justify-center items-center py-8">
              <Text className="text-gray-500 text-lg mb-2">No courses yet</Text>
              <Text className="text-gray-400 text-base text-center px-4">
                Start by adding your first course using the button below
              </Text>
            </View>
          )
        }
      />

      {/* Add Course FAB */}
      <TouchableOpacity
        accessible={true}
        accessibilityLabel="Add new course"
        accessibilityHint="Double tap to create a new course"
        className="absolute bottom-6 right-6"
        onPress={() => navigation.navigate("CouresForm")}
      >
        <View className="w-14 h-14 rounded-full bg-blue-500 shadow-lg justify-center items-center">
          <Feather name="plus" size={24} color="white" />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
