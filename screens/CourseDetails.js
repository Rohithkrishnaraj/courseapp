import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { getAllLessonsForCourse, getAllUnitsForLesson } from '../DB/DbStorage';
import { AntDesign } from '@expo/vector-icons';

export default function CourseDetails({ route, navigation }) {
  const { courseId, courseName, progress } = route.params;
  const [lessons, setLessons] = useState([]);
  const [lessonUnits, setLessonUnits] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedLessons, setExpandedLessons] = useState({});

  useEffect(() => {
    fetchLessonsAndUnits();
  }, [courseId]);

  const fetchLessonsAndUnits = async () => {
    try {
      setLoading(true);
      const fetchedLessons = await getAllLessonsForCourse(courseId);
      setLessons(fetchedLessons);

      const unitsMap = {};
      await Promise.all(
        fetchedLessons.map(async (lesson) => {
          const units = await getAllUnitsForLesson(lesson.id);
          unitsMap[lesson.id] = units;
        })
      );
      setLessonUnits(unitsMap);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching lessons and units:', error);
      setLoading(false);
    }
  };

  const toggleLesson = (lessonId) => {
    setExpandedLessons(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }));
  };

  const calculateLessonProgress = (lessonId) => {
    const units = lessonUnits[lessonId] || [];
    const completedUnits = units.filter(unit => unit.state === 'completed').length;
    return units.length > 0 ? Math.round((completedUnits / units.length) * 100) : 0;
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Course Header */}
      <View className="px-4 py-6 bg-white shadow-sm">
        <Text className="text-2xl font-bold text-gray-800">{courseName}</Text>
        <View className="mt-4">
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-gray-600">Overall Progress</Text>
            <Text className="text-sm font-bold text-gray-800">{progress.percentage}%</Text>
          </View>
          <View className="h-2 bg-gray-200 rounded-full">
            <View
              className="h-2 bg-green-500 rounded-full"
              style={{ width: `${progress.percentage}%` }}
            />
          </View>
        </View>
      </View>

      {/* Lessons List */}
      <View className="px-4 py-6">
        <Text className="text-xl font-semibold text-gray-800 mb-4">Course Content</Text>
        
        {lessons.map((lesson, index) => {
          const lessonProgress = calculateLessonProgress(lesson.id);
          const units = lessonUnits[lesson.id] || [];
          const isExpanded = expandedLessons[lesson.id];

          return (
            <View key={lesson.id} className="mb-4 bg-white rounded-xl shadow-sm">
              <TouchableOpacity
                onPress={() => toggleLesson(lesson.id)}
                className="p-4"
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="text-lg font-medium text-gray-800">
                      {index + 1}. {lesson.name}
                    </Text>
                    <Text className="text-sm text-gray-600 mt-1">
                      {units.length} units • {lessonProgress}% complete
                    </Text>
                  </View>
                  <AntDesign
                    name={isExpanded ? "up" : "down"}
                    size={20}
                    color="#4B5563"
                  />
                </View>

                <View className="mt-2">
                  <View className="h-1 bg-gray-200 rounded-full">
                    <View
                      className="h-1 bg-green-500 rounded-full"
                      style={{ width: `${lessonProgress}%` }}
                    />
                  </View>
                </View>
              </TouchableOpacity>

              {isExpanded && (
                <View className="px-4 pb-4">
                  {units.map((unit, unitIndex) => (
                    <TouchableOpacity
                      key={unit.id}
                      onPress={() => navigation.navigate('UnitPreview', {
                        unitId: unit.id,
                        lessonId: lesson.id,
                        unitName: unit.name,
                        unitDescription: unit.description
                      })}
                      className="flex-row items-center py-2"
                    >
                      <View className={`w-6 h-6 rounded-full ${unit.state === 'completed' ? 'bg-green-500' : 'bg-gray-200'} mr-3 items-center justify-center`}>
                        {unit.state === 'completed' && (
                          <AntDesign name="check" size={14} color="white" />
                        )}
                      </View>
                      <Text className={`flex-1 ${unit.state === 'completed' ? 'text-gray-600' : 'text-gray-800'}`}>
                        {unitIndex + 1}. {unit.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
} 