import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { getAllLessonsForCourse, getAllUnitsForLesson, resetProgress } from "../DB/DbStorage";
import { AntDesign, MaterialIcons, Ionicons } from "@expo/vector-icons";

export default function CourseDetails({ route, navigation }) {
  const { course } = route.params;
  console.log("Course data received:", course); // Debug log
  const [lessons, setLessons] = useState([]);
  const [lessonUnits, setLessonUnits] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedLessons, setExpandedLessons] = useState({});
  const [overallProgress, setOverallProgress] = useState(0);
  const [lessonStats, setLessonStats] = useState({});

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchLessonsAndUnits();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchLessonsAndUnits = async () => {
    try {
      setLoading(true);
      const fetchedLessons = await getAllLessonsForCourse(course.id);
      setLessons(fetchedLessons);

      const unitsMap = {};
      const statsMap = {};
      let completedUnitsTotal = 0;
      let totalUnits = 0;

      await Promise.all(
        fetchedLessons.map(async (lesson) => {
          const units = await getAllUnitsForLesson(lesson.id);
          unitsMap[lesson.id] = units;
          
          const completedUnits = units.filter(unit => unit.state === "completed").length;
          const totalLessonUnits = units.length;
          
          statsMap[lesson.id] = {
            total: totalLessonUnits,
            completed: completedUnits,
            progress: totalLessonUnits > 0 ? Math.round((completedUnits / totalLessonUnits) * 100) : 0
          };

          completedUnitsTotal += completedUnits;
          totalUnits += totalLessonUnits;
        })
      );

      setLessonUnits(unitsMap);
      setLessonStats(statsMap);
      setOverallProgress(
        totalUnits > 0 ? Math.round((completedUnitsTotal / totalUnits) * 100) : 0
      );
      setLoading(false);
    } catch (error) {
      console.error("Error fetching lessons and units:", error);
      setLoading(false);
    }
  };

  const toggleLesson = (lessonId) => {
    setExpandedLessons((prev) => ({
      ...prev,
      [lessonId]: !prev[lessonId],
    }));
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-blue-500";
  };

  const handleResetProgress = async () => {
    Alert.alert(
      "Reset Progress",
      "Are you sure you want to reset all progress? This cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await resetProgress();
              await fetchLessonsAndUnits(); // Refresh the data
              Alert.alert("Success", "Progress has been reset successfully!");
            } catch (error) {
              console.error("Error resetting progress:", error);
              Alert.alert("Error", "Failed to reset progress");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
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
    <ScrollView className="flex-1 pt-5 bg-gray-50" showsVerticalScrollIndicator={false}
    showsHorizontalScrollIndicator={false}>
      {/* Course Header */}
      <View className="bg-white shadow-sm">
        <View className="px-4 pt-6 pb-4">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-1 mr-4">
              <Text className="text-2xl font-bold  text-gray-800">
                {course?.name || course?.title || "Course Details"}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleResetProgress}
              className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center"
              style={{ elevation: 2 }}
            >
              <Ionicons name="refresh" size={22} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <Text className="text-base text-gray-600">
            {course?.description || "No description available"}
          </Text>
        </View>
        
        {/* Overall Progress Card */}
        <View className="px-4 pb-6">
          <View className="bg-gray-50 rounded-xl p-4">
            <View className="flex-row justify-between items-center mb-3">
              <View className="flex-row items-center">
                <MaterialIcons name="insights" size={24} color="#4B5563" />
                <Text className="text-lg font-semibold text-gray-800 ml-2">Overall Progress</Text>
              </View>
              <View className="bg-white px-3 py-1 rounded-full shadow-sm">
                <Text className="text-sm font-bold text-gray-700">{overallProgress}%</Text>
              </View>
            </View>
            <View className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <View
                className={`h-3 ${getProgressColor(overallProgress)} rounded-full`}
                style={{ width: `${overallProgress}%` }}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Lessons List */}
      <View className="px-4 py-6">
        <Text className="text-xl font-semibold text-gray-800 mb-4">Course Content</Text>

        {lessons.length === 0 ? (
          <View className="py-8 items-center">
            <Text className="text-gray-500 text-lg">No lessons available yet</Text>
          </View>
        ) : (
          lessons.map((lesson, index) => {
            const stats = lessonStats[lesson.id] || { total: 0, completed: 0, progress: 0 };
            const units = lessonUnits[lesson.id] || [];
            const isExpanded = expandedLessons[lesson.id];

            return (
              <View key={lesson.id} className="mb-4 bg-white rounded-xl shadow-sm overflow-hidden">
                <TouchableOpacity
                  onPress={() => toggleLesson(lesson.id)}
                  className="p-4"
                >
                  <View className="flex-row justify-between items-center">
                    <View className="flex-1">
                      <Text className="text-lg font-medium text-gray-800">
                        {index + 1}. {lesson.name}
                      </Text>
                      <View className="flex-row items-center mt-1">
                        <MaterialIcons name="library-books" size={16} color="#6B7280" />
                        <Text className="text-sm text-gray-600 ml-1">
                          {stats.completed}/{stats.total} units completed
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center">
                      <Text className="text-sm font-medium text-gray-700 mr-2">
                        {stats.progress}%
                      </Text>
                      <AntDesign
                        name={isExpanded ? "up" : "down"}
                        size={20}
                        color="#4B5563"
                      />
                    </View>
                  </View>

                  <View className="mt-3">
                    <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <View
                        className={`h-2 ${getProgressColor(stats.progress)} rounded-full`}
                        style={{ width: `${stats.progress}%` }}
                      />
                    </View>
                  </View>
                </TouchableOpacity>

                {isExpanded && (
                  <View className="px-4 pb-4 border-t border-gray-100">
                    {units.map((unit, unitIndex) => (
                      <TouchableOpacity
                        key={unit.id}
                        onPress={() =>
                          navigation.navigate("UnitPreview", {
                            unitId: unit.id,
                            lessonId: lesson.id,
                            unitName: unit.name,
                            unitDescription: unit.description,
                          })
                        }
                        className="flex-row items-center py-3 border-b border-gray-100 last:border-b-0"
                      >
                        <View
                          className={`w-8 h-8 rounded-full ${
                            unit.state === "completed"
                              ? "bg-green-500"
                              : "bg-gray-200"
                          } mr-3 items-center justify-center`}
                        >
                          {unit.state === "completed" ? (
                            <MaterialIcons name="check" size={16} color="white" />
                          ) : (
                            <Text className="text-xs text-gray-600">{unitIndex + 1}</Text>
                          )}
                        </View>
                        <View className="flex-1">
                          <Text
                            className={`${
                              unit.state === "completed"
                                ? "text-gray-600"
                                : "text-gray-800"
                            } font-medium`}
                          >
                            {unit.name}
                          </Text>
                          {unit.state === "completed" && (
                            <Text className="text-xs text-green-600 mt-1">Completed</Text>
                          )}
                        </View>
                        <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}
