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
  Alert,
  Pressable,
  Platform,
  UIManager,
  LayoutAnimation,
} from "react-native";
import React, { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { getAllCourses, getAllLessonsForCourse, deleteCourse as deleteCourseFromDB } from "../DB/DbStorage";
import { supabase } from "../lib/supabase";

const { width } = Dimensions.get("window");

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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
  const [userEmail, setUserEmail] = useState("");

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
    getUserEmail();
    const focusHandler = navigation.addListener("focus", () => {
      setLoading(true);
      Promise.all([Fetchcoursedata(), fetchLessonCounts()]).finally(() =>
        setLoading(false)
      );
    });
    return focusHandler;
  }, [navigation]);

  const getUserEmail = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;
      if (session) {
        setUserEmail(session.user.email);
      }
    } catch (error) {
      console.error("Error fetching user email:", error.message);
    }
  };

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
        accessibilityHint="Double tap to view course details, long press for more options"
        className="w-full mb-4 overflow-hidden px-4"
        onPress={() => navigation.navigate("Lesson", { itemid: item.id })}
        onLongPress={() => handleLongPress(item)}
        delayLongPress={300}
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

  const handleLongPress = (item) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Alert.alert(
      "Course Options",
      "What would you like to do with this course?",
      [
        {
          text: "Edit",
          onPress: () => handleEditCourse(item),
          style: "default",
        },
        {
          text: "Delete",
          onPress: () => confirmDelete(item),
          style: "destructive",
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const confirmDelete = (item) => {
    Alert.alert(
      "Delete Course",
      "Are you sure you want to delete this course? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => deleteCourse(item.id),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const deleteCourse = async (courseId) => {
    try {
      await deleteCourseFromDB(courseId);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setcoursedata(prevData => prevData.filter(course => course.id !== courseId));
      // Refresh lesson counts after deletion
      fetchLessonCounts();
      Alert.alert(
        "Success",
        "Course deleted successfully",
        [{ text: "OK" }],
        { cancelable: false }
      );
    } catch (error) {
      console.error("Delete course error:", error);
      Alert.alert(
        "Error",
        "Failed to delete course. Please try again.",
        [{ text: "OK" }],
        { cancelable: false }
      );
    }
  };

  const handleEditCourse = (item) => {
    console.log('Home: Editing course item:', item);
    const courseData = {
      id: item.id,
      name: item.name,
      description: item.description,
      colour: item.colour,
      state: item.state,
      category: item.category
    };
    console.log('Home: Passing course data to form:', courseData);
    navigation.navigate("CouresForm", {  // Fixed component name
      courseData,
      isEditing: true 
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      {/* Header */}
      <View className="px-6 pt-4 pb-2 flex-row justify-between items-center bg-white border-b border-gray-100">
        <View className="flex-row items-center">
          <View className="mr-3  p-2 rounded-xl w-16 h-14 items-center justify-center">
            <Image
              source={require("../assets/icon.png")}
              className="w-full h-full rounded-full"
              resizeMode="cover"
            />
          </View>

          <View>
            <Text className="text-2xl font-bold text-gray-800">
            Welcome back 👋 
            </Text>
            <Text className="text-base text-gray-600">{userEmail || "Loading..."}</Text>
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
        className="flex-1 mt-2"
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
        onPress={() => navigation.navigate("CouresForm")}  // Fixed component name
      >
        <View className="w-14 h-14 rounded-full bg-blue-500 shadow-lg justify-center items-center">
          <Feather name="plus" size={24} color="white" />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
