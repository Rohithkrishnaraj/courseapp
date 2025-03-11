import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getAllCourses, getAllLessonsForCourse } from '../DB/DbStorage';
import Icon from 'react-native-vector-icons/EvilIcons';
import { AntDesign } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const categories = [
  'All',
  'Development',
  'Design',
  'Business',
  'Marketing',
  'Personal Development',
];

export default function CourseList({ navigation }) {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [lessonCounts, setLessonCounts] = useState({});

  useEffect(() => {
    const focusHandler = navigation.addListener('focus', () => {
      fetchCourses();
    });
    return focusHandler;
  }, [navigation]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const fetchedCourses = await getAllCourses();
      setCourses(fetchedCourses);
      setFilteredCourses(fetchedCourses);
      
      // Fetch lesson counts for all courses
      const counts = {};
      await Promise.all(
        fetchedCourses.map(async (course) => {
          const lessons = await getAllLessonsForCourse(course.id);
          counts[course.id] = lessons.length;
        })
      );
      setLessonCounts(counts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    filterCourses();
  }, [searchQuery, selectedCategory, courses]);

  const filterCourses = () => {
    let filtered = [...courses];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    setFilteredCourses(filtered);
  };

  const renderCourseCard = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Lesson', { itemid: item.id })}
      className="mb-4"
      style={{ width: CARD_WIDTH }}
    >
      <LinearGradient
        colors={[item.colour || '#f0f0f0', item.colour || '#e0e0e0']}
        className="rounded-xl p-4 h-48 shadow-md"
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800 mb-2" numberOfLines={2}>
            {item.name}
          </Text>
          <Text className="text-sm text-gray-600 mb-2" numberOfLines={2}>
            {item.description || 'No description available'}
          </Text>
          <View className="mt-auto flex-row items-center justify-between">
            <View className="flex-row items-center">
              <AntDesign name="book" size={16} color="#4B5563" />
              <Text className="ml-1 text-gray-600">
                {lessonCounts[item.id] || 0} Lessons
              </Text>
            </View>
            <AntDesign name="right" size={16} color="#4B5563" />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderCategoryChip = (category) => (
    <TouchableOpacity
      key={category}
      onPress={() => setSelectedCategory(category)}
      className={`px-4 py-2 rounded-full mr-2 ${
        selectedCategory === category
          ? 'bg-blue-500'
          : 'bg-gray-200'
      }`}
    >
      <Text
        className={`${
          selectedCategory === category
            ? 'text-white'
            : 'text-gray-700'
        } font-medium`}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Search Bar */}
      <View className="px-6 pt-4">
        <View className="relative">
          <View className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="search" size={24} color="#9CA3AF" />
          </View>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search courses..."
            className="bg-white h-12 px-4 pl-10 pr-4 rounded-xl text-gray-800 w-full border border-gray-200"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Categories */}
      <View className="mt-4 px-6">
        <Text className="text-lg font-bold text-gray-800 mb-3">Categories</Text>
        <FlatList
          data={categories}
          renderItem={({ item }) => renderCategoryChip(item)}
          horizontal
          showsHorizontalScrollIndicator={false}
          className="pb-2"
        />
      </View>

      {/* Course Grid */}
      <FlatList
        data={filteredCourses}
        renderItem={renderCourseCard}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 24 }}
        contentContainerStyle={{ paddingTop: 24, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-8">
            <Text className="text-gray-500 text-lg">No courses found</Text>
          </View>
        }
      />

      {/* Add Course FAB */}
      <TouchableOpacity
        onPress={() => navigation.navigate('CouresForm')}
        className="absolute bottom-6 right-6 w-14 h-14 bg-blue-500 rounded-full justify-center items-center shadow-lg"
      >
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
} 