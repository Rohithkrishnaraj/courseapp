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
import { getAllCourses, getAllLessonsForCourse, createCoursesTable, migrateExistingCourses } from '../DB/DbStorage';
import Icon from 'react-native-vector-icons/EvilIcons';
import { AntDesign } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

// Predefined gradients for courses
const GRADIENTS = [
  ['#FF6B6B', '#FFE66D'],
  ['#4ECDC4', '#556270'],
  ['#556270', '#4ECDC4'],
  ['#5C258D', '#4389A2'],
  ['#134E5E', '#71B280'],
];

// Get a gradient based on index
const getGradient = (index) => {
  return GRADIENTS[index % GRADIENTS.length];
};

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
    const initializeDatabase = async () => {
      try {
        await createCoursesTable();
        await migrateExistingCourses();
        fetchCourses();
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };

    const focusHandler = navigation.addListener('focus', () => {
      initializeDatabase();
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

  const renderCourseCard = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('LearningDashboard', { itemid: item.id })}
      style={{ 
        width: CARD_WIDTH,
        marginBottom: 16,
      }}
    >
      <LinearGradient
        colors={getGradient(index)}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 12,
          padding: 16,
          height: 192,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ 
            fontSize: 18, 
            fontWeight: 'bold',
            color: '#FFFFFF',
            marginBottom: 8,
          }} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={{ 
            fontSize: 14,
            color: '#FFFFFF',
            opacity: 0.9,
            marginBottom: 8,
          }} numberOfLines={2}>
            {item.description || 'No description available'}
          </Text>
          <View style={{ 
            marginTop: 'auto',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AntDesign name="book" size={16} color="#FFFFFF" />
              <Text style={{ 
                marginLeft: 4,
                color: '#FFFFFF',
                opacity: 0.9
              }}>
                {lessonCounts[item.id] || 0} Lessons
              </Text>
            </View>
            <AntDesign name="right" size={16} color="#FFFFFF" />
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
        renderItem={({ item, index }) => renderCourseCard({ item, index })}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={{ 
          justifyContent: 'space-between', 
          paddingHorizontal: 24 
        }}
        contentContainerStyle={{ 
          paddingTop: 24, 
          paddingBottom: 24 
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ 
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center', 
            paddingVertical: 32 
          }}>
            <Text style={{ 
              fontSize: 16, 
              color: '#6B7280' 
            }}>
              No courses found
            </Text>
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