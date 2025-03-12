import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import ListBox from "./Utils/ListBoxButton";
import { getAllLessonsForCourse, getAllUnitsForLesson, deleteLesson } from "../DB/DbStorage";
import Icon from "react-native-vector-icons/EvilIcons";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

// Helper function to get gradient colors
const getGradientColors = (colour) => {
  if (!colour) return ['#E3F2FD', '#BBDEFB'];
  
  const colorMap = {
    'bg-teal-300': ['#B2DFDB', '#80CBC4'],
    'bg-blue-300': ['#E3F2FD', '#BBDEFB'],
    'bg-green-300': ['#C8E6C9', '#A5D6A7'],
    'bg-yellow-300': ['#FFF9C4', '#FFF59D'],
    'bg-purple-300': ['#E1BEE7', '#CE93D8'],
    'bg-pink-300': ['#F8BBD0', '#F48FB1'],
  };

  return colorMap[colour] || ['#E3F2FD', '#BBDEFB'];
};

export default function Lesson({ navigation, route }) {
  const [searchText, setSearchText] = useState("");
  const [lessondata, setlessondata] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
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

  // Add search filter effect
  useEffect(() => {
    if (!lessondata) return;
    
    const filtered = lessondata.filter(lesson => {
      const searchLower = searchText.toLowerCase();
      const nameLower = lesson.name.toLowerCase();
      const descLower = lesson.description ? lesson.description.toLowerCase() : '';
      
      return nameLower.includes(searchLower) || descLower.includes(searchLower);
    });
    
    setFilteredLessons(filtered);
  }, [searchText, lessondata]);

  const fetchlessondata = async () => {
    try {
      const fetch = await getAllLessonsForCourse(itemid);
      setlessondata(fetch);
      setFilteredLessons(fetch); // Initialize filtered lessons
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
        lessonid: item.id
      });
    };
    
    const navigateunits = () => {
      navigation.navigate("ContentForm", { 
        lessonid: item.id 
      });
    };

    return (
      <TouchableOpacity
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`${item.name} lesson with ${unitsCount[index]} units`}
        accessibilityHint={unitsCount[index] === 0 ? "Double tap to add units" : "Double tap to view units"}
        className="px-4 mb-3"
        onPress={unitsCount[index] === 0 ? navigateunits : navigate}
      >
        <LinearGradient
          colors={getGradientColors(item.colour)}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="p-4 rounded-xl shadow-sm"
          style={{
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
          }}
        >
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text
                className="text-lg font-medium text-gray-800 mb-1"
                numberOfLines={1}
                style={{ letterSpacing: 0.15 }}
              >
                {item.name}
              </Text>
              {unitsCount[index] === 0 ? (
                <Text className="text-sm text-blue-600" style={{ letterSpacing: 0.25 }}>
                  Add Unit
                </Text>
              ) : (
                <Text className="text-sm text-gray-600" style={{ letterSpacing: 0.25 }}>
                  {`${unitsCount[index]} Units`}
                </Text>
              )}
            </View>

            <View className="flex-row items-center space-x-3">
              <TouchableOpacity
                accessible={true}
                accessibilityLabel={`Edit ${item.name}`}
                accessibilityRole="button"
                onPress={() => handleEdit(item)}
                className="p-2 rounded-full bg-white/30"
              >
                <MaterialIcons name="edit" size={20} color="#4B5563" />
              </TouchableOpacity>
              
              <TouchableOpacity
                accessible={true}
                accessibilityLabel={`Delete ${item.name}`}
                accessibilityRole="button"
                onPress={() => handleDelete(item.id, item.name)}
                className="p-2 rounded-full bg-white/30"
              >
                <MaterialIcons name="delete" size={20} color="#EF4444" />
              </TouchableOpacity>
              
              <View className="p-2 rounded-full bg-white/30">
                <MaterialIcons name="chevron-right" size={20} color="#6B7280" />
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      


      {/* Search Bar */}
      <View className="px-4 pt-4">
        <View className="relative">
          <MaterialIcons 
            name="search" 
            size={24} 
            color="#9CA3AF" 
            style={{ 
              position: 'absolute',
              left: 12,
              top: 10
            }}
          />
          <TextInput
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
            className="bg-white border border-gray-200 rounded-lg pl-12 pr-4 py-2 text-base text-gray-900"
            placeholder="Search by lesson name or description..."
            placeholderTextColor="#9CA3AF"
            style={{
              elevation: 1,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.18,
              shadowRadius: 1.0,
            }}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchText ? (
            <TouchableOpacity 
              onPress={() => setSearchText('')}
              className="absolute right-2 top-2 p-2"
              accessible={true}
              accessibilityLabel="Clear search"
              accessibilityHint="Clears the search text"
            >
              <MaterialIcons name="close" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Lesson List */}
      <View className="flex-1 pt-4">
        {lessondata ? (
          filteredLessons.length > 0 ? (
            <FlatList
              data={filteredLessons}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItems}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View className="flex-1 justify-center items-center px-4">
              <MaterialIcons name="search-off" size={48} color="#9CA3AF" />
              <Text className="mt-4 text-lg text-gray-900 font-medium">No matches found</Text>
              <Text className="mt-2 text-gray-600 text-center">
                Try adjusting your search to find what you're looking for
              </Text>
            </View>
          )
        ) : (
          <View className="flex-1 justify-center items-center px-4">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="mt-4 text-gray-600">Loading lessons...</Text>
          </View>
        )}
      </View>

      {/* Add Lesson FAB */}
      <TouchableOpacity
        accessible={true}
        accessibilityLabel="Add new lesson"
        accessibilityHint="Double tap to create a new lesson"
        className="absolute bottom-6 right-6"
        onPress={handleAddLesson}
      >
        <View 
          className="w-14 h-14 rounded-full bg-blue-500 shadow-lg justify-center items-center"
          style={{
            elevation: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}
        >
          <Feather name="plus" size={24} color="white" />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
