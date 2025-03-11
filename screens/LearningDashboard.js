import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getAllCourses, getAllLessonsForCourse, getAllUnitsForLesson } from '../DB/DbStorage';
import { AntDesign } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const getGradientColors = (colour) => {
  if (!colour) return ['#f0f0f0', '#e0e0e0'];
  const baseColor = colour.replace('bg-', '').replace('-200', '');
  const colorMap = {
    'red': ['#FEE2E2', '#FECACA'],
    'blue': ['#DBEAFE', '#BFDBFE'],
    'green': ['#DCFCE7', '#BBF7D0'],
    'yellow': ['#FEF9C3', '#FEF08A'],
    'purple': ['#F3E8FF', '#E9D5FF'],
    'pink': ['#FCE7F3', '#FBCFE8'],
    'indigo': ['#E0E7FF', '#C7D2FE'],
    'gray': ['#F3F4F6', '#E5E7EB'],
  };
  return colorMap[baseColor] || ['#f0f0f0', '#e0e0e0'];
};

export default function LearningDashboard({ navigation }) {
  const [courses, setCourses] = useState([]);
  const [courseProgress, setCourseProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const focusHandler = navigation.addListener('focus', () => {
      fetchCoursesWithProgress();
    });
    return focusHandler;
  }, [navigation]);

  const fetchCoursesWithProgress = async () => {
    try {
      setLoading(true);
      const fetchedCourses = await getAllCourses();
      
      // Calculate progress for each course
      const progress = {};
      await Promise.all(
        fetchedCourses.map(async (course) => {
          const lessons = await getAllLessonsForCourse(course.id);
          let totalUnits = 0;
          let completedUnits = 0;
          
          await Promise.all(
            lessons.map(async (lesson) => {
              const units = await getAllUnitsForLesson(lesson.id);
              totalUnits += units.length;
              completedUnits += units.filter(unit => unit.state === 'completed').length;
            })
          );
          
          progress[course.id] = {
            totalLessons: lessons.length,
            totalUnits,
            completedUnits,
            percentage: totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0
          };
        })
      );
      
      setCourses(fetchedCourses);
      setCourseProgress(progress);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setLoading(false);
    }
  };

  const renderCourseCard = ({ item }) => {
    const progress = courseProgress[item.id] || { percentage: 0, totalLessons: 0 };
    const gradientColors = getGradientColors(item.colour);
    
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('CourseDetails', { 
          courseId: item.id,
          courseName: item.name,
          progress: progress
        })}
        className="mb-4 mx-4"
      >
        <LinearGradient
          colors={gradientColors}
          className="rounded-xl overflow-hidden shadow-md"
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View className="p-4">
            <Text className="text-xl font-bold text-gray-800 mb-2">
              {item.name}
            </Text>
            <Text className="text-sm text-gray-600 mb-4" numberOfLines={2}>
              {item.description || 'No description available'}
            </Text>
            
            {/* Progress Section */}
            <View className="mt-2">
              <View className="flex-row justify-between mb-2">
                <Text className="text-sm text-gray-600">Progress</Text>
                <Text className="text-sm font-bold text-gray-800">
                  {progress.percentage}%
                </Text>
              </View>
              <View className="h-2 bg-gray-200 rounded-full">
                <View
                  className="h-2 bg-green-500 rounded-full"
                  style={{ width: `${progress.percentage}%` }}
                />
              </View>
            </View>

            {/* Course Stats */}
            <View className="flex-row justify-between mt-4">
              <View className="flex-row items-center">
                <AntDesign name="book" size={16} color="#4B5563" />
                <Text className="ml-1 text-gray-600">
                  {progress.totalLessons} Lessons
                </Text>
              </View>
              <View className="flex-row items-center">
                <AntDesign name="checkcircle" size={16} color="#4B5563" />
                <Text className="ml-1 text-gray-600">
                  {progress.completedUnits} / {progress.totalUnits} Units
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-4 py-6">
        <Text className="text-2xl font-bold text-gray-800">My Learning</Text>
        <Text className="text-gray-600 mt-1">Track your course progress</Text>
      </View>

      <FlatList
        data={courses}
        renderItem={renderCourseCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-8">
            <Text className="text-gray-500 text-lg">No courses found</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('OneClick')}
              className="mt-4 bg-blue-500 px-6 py-3 rounded-full"
            >
              <Text className="text-white font-medium">Browse Courses</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
} 