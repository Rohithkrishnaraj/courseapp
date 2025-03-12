import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { getAllCourses, getAllLessonsForCourse } from "../DB/DbStorage";
import { supabase } from "../lib/supabase";

const UserDashboard = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showSortModal, setShowSortModal] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lessonCounts, setLessonCounts] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const [userEmail, setUserEmail] = useState("");
  const coursesPerPage = 4;

  useEffect(() => {
    getUserEmail();
    const focusHandler = navigation.addListener("focus", () => {
      fetchCourses();
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

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const fetchedCourses = await getAllCourses();

      // Fetch lesson counts for all courses
      const counts = {};
      await Promise.all(
        fetchedCourses.map(async (course) => {
          const lessons = await getAllLessonsForCourse(course.id);
          counts[course.id] = lessons.length;
        })
      );
      setLessonCounts(counts);

      // Transform the course data to match the expected format
      const transformedCourses = fetchedCourses.map((course) => ({
        id: course.id,
        title: course.name,
        description: course.description,
        lessons: counts[course.id] || 0,
        duration: "Not specified", // You might want to add duration to your database schema
        colour: course.colour,
        category: course.category,
        status: course.status, // Assuming course.status is available in the database
      }));

      // Extract unique categories
      const uniqueCategories = [
        "All",
        ...new Set(
          transformedCourses.map((course) => course.category).filter(Boolean)
        ),
      ];
      setCategories(uniqueCategories);

      setCourses(transformedCourses);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigation.replace("Login");
  };

  // Sort courses function
  const sortCourses = (coursesToSort) => {
    return [...coursesToSort].sort((a, b) => {
      let compareA, compareB;

      switch (sortBy) {
        case "title":
          compareA = a.title.toLowerCase();
          compareB = b.title.toLowerCase();
          break;
        case "lessons":
          compareA = a.lessons;
          compareB = b.lessons;
          break;
        case "duration":
          compareA = parseInt(a.duration) || 0;
          compareB = parseInt(b.duration) || 0;
          break;
        default:
          compareA = a.title.toLowerCase();
          compareB = b.title.toLowerCase();
      }

      if (sortOrder === "asc") {
        return compareA > compareB ? 1 : -1;
      } else {
        return compareA < compareB ? 1 : -1;
      }
    });
  };

  const handleSort = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("asc");
    }
    setShowSortModal(false);
  };

  // Filter and sort courses
  const filteredCourses = sortCourses(
    courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || course.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const startIndex = (currentPage - 1) * coursesPerPage;
  const paginatedCourses = filteredCourses.slice(
    startIndex,
    startIndex + coursesPerPage
  );

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Reset to first page when search query changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const getSortIcon = () => {
    switch (sortBy) {
      case "title":
        return "sort-by-alpha";
      case "lessons":
        return "format-list-numbered";
      case "duration":
        return "access-time";
      default:
        return "sort";
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#007AFF" />
        <Text className="mt-4 text-gray-600">Loading courses...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white pt-5">
      <View className="flex-row justify-between items-center px-5 mt-5 pb-5 border-b border-gray-100">
        <View className="flex-row items-center">
          <View className="mr-3  p-2 rounded-xl w-12 h-12 items-center justify-center">
            <Image
              source={require("../assets/icon.png")}
              className="w-full h-full rounded-full"
              resizeMode="cover"
            />
          </View>
          <View>
            <Text className="text-base text-gray-600">Welcome,</Text>
            <Text className="text-xl font-bold text-gray-800">
            {userEmail || "Loading..."}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleLogout} className="p-2">
          <MaterialIcons name="logout" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <View className="px-5 py-4">
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 mb-4">
          <MaterialIcons name="search" size={20} color="#666" />
          <TextInput
            className="flex-1 p-3 text-base text-gray-800"
            placeholder="Search courses..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#666"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <MaterialIcons name="close" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        {/* Categories Tab */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4"
        >
          <View className="flex-row space-x-2">
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1); // Reset to first page when changing category
                }}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === category ? "bg-blue-500" : "bg-gray-100"
                }`}
              >
                <Text
                  className={`${
                    selectedCategory === category
                      ? "text-white font-semibold"
                      : "text-gray-600"
                  }`}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-gray-800">
            Available Courses
            {searchQuery.length > 0 && (
              <Text className="text-base font-normal text-gray-600">
                {" "}
                ({filteredCourses.length} results)
              </Text>
            )}
          </Text>
          <TouchableOpacity
            onPress={() => setShowSortModal(true)}
            className="flex-row items-center bg-gray-100 px-3 py-2 rounded-lg"
          >
            <MaterialIcons name={getSortIcon()} size={20} color="#666" />
            <MaterialIcons
              name={sortOrder === "asc" ? "arrow-upward" : "arrow-downward"}
              size={20}
              color="#666"
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="px-5">
        {filteredCourses.length === 0 ? (
          <View className="items-center justify-center py-8">
            <MaterialIcons name="search-off" size={48} color="#666" />
            <Text className="text-gray-600 text-lg mt-4 text-center">
              {courses.length === 0
                ? "No courses available yet"
                : `No courses found matching "${searchQuery}"`}
            </Text>
          </View>
        ) : (
          <>
            {paginatedCourses.map((course) => (
              <TouchableOpacity
                key={course.id}
                className="bg-white rounded-xl mb-4 shadow-sm"
                style={{
                  elevation: 3,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                }}
                onPress={() => navigation.navigate("CourseDetails", { course })}
              >
                <View className={`p-4 ${course.colour ? course.colour : ""}`}>
                  <Text className="text-lg font-semibold text-gray-800 mb-2">
                    {course.title}
                  </Text>
                  <Text className="text-sm text-gray-600 mb-3">
                    {course.description.length > 50
                      ? `${course.description.substring(0, 50)}...`
                      : course.description}
                  </Text>

                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row gap-4">
                      <View className="flex-row items-center gap-1">
                        <MaterialIcons name="book" size={16} color="#666" />
                        <Text className="text-sm text-gray-600">
                          {course.lessons} Lessons
                        </Text>
                      </View>
                      {course.category && (
                        <View className="flex-row items-center gap-1">
                          <MaterialIcons name="category" size={16} color="#666" />
                          <Text className="text-sm text-gray-600">
                            {course.category}
                          </Text>
                        </View>
                      )}
                    </View>
                    
                    {/* Course Status Badge */}
                    <View className={`px-3 py-1 rounded-full ${
                      course.status === 'completed' ? 'bg-green-100' :
                      course.status === 'in_progress' ? 'bg-yellow-100' :
                      'bg-gray-100'
                    }`}>
                      <Text className={`text-sm font-medium ${
                        course.status === 'completed' ? 'text-green-700' :
                        course.status === 'in_progress' ? 'text-yellow-700' :
                        'text-gray-700'
                      }`}>
                        {course.status === 'completed' ? 'Completed' :
                         course.status === 'in_progress' ? 'In Progress' :
                         'Not Started'}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            {/* Pagination Controls */}
            <View className="flex-row justify-between items-center py-4 px-2 mb-4">
              <TouchableOpacity
                onPress={handlePrevPage}
                disabled={currentPage === 1}
                className={`flex-row items-center ${
                  currentPage === 1 ? "opacity-50" : ""
                }`}
              >
                <MaterialIcons
                  name="chevron-left"
                  size={24}
                  color={currentPage === 1 ? "#999" : "#007AFF"}
                />
                <Text
                  className={`ml-1 ${
                    currentPage === 1 ? "text-gray-400" : "text-blue-500"
                  }`}
                >
                  Previous
                </Text>
              </TouchableOpacity>

              <Text className="text-gray-600">
                Page {currentPage} of {totalPages}
              </Text>

              <TouchableOpacity
                onPress={handleNextPage}
                disabled={currentPage === totalPages}
                className={`flex-row items-center ${
                  currentPage === totalPages ? "opacity-50" : ""
                }`}
              >
                <Text
                  className={`mr-1 ${
                    currentPage === totalPages
                      ? "text-gray-400"
                      : "text-blue-500"
                  }`}
                >
                  Next
                </Text>
                <MaterialIcons
                  name="chevron-right"
                  size={24}
                  color={currentPage === totalPages ? "#999" : "#007AFF"}
                />
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      {/* Sort Modal */}
      <Modal
        transparent={true}
        visible={showSortModal}
        onRequestClose={() => setShowSortModal(false)}
        animationType="fade"
      >
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-center items-center"
          activeOpacity={1}
          onPress={() => setShowSortModal(false)}
        >
          <View className="bg-white rounded-xl w-80 overflow-hidden">
            <Text className="text-lg font-semibold text-gray-800 p-4 border-b border-gray-100">
              Sort By
            </Text>
            <TouchableOpacity
              className="p-4 flex-row items-center justify-between border-b border-gray-100"
              onPress={() => handleSort("title")}
            >
              <View className="flex-row items-center">
                <MaterialIcons name="sort-by-alpha" size={20} color="#666" />
                <Text className="text-gray-800 ml-3">Title</Text>
              </View>
              {sortBy === "title" && (
                <MaterialIcons
                  name={sortOrder === "asc" ? "arrow-upward" : "arrow-downward"}
                  size={20}
                  color="#007AFF"
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              className="p-4 flex-row items-center justify-between border-b border-gray-100"
              onPress={() => handleSort("lessons")}
            >
              <View className="flex-row items-center">
                <MaterialIcons
                  name="format-list-numbered"
                  size={20}
                  color="#666"
                />
                <Text className="text-gray-800 ml-3">Number of Lessons</Text>
              </View>
              {sortBy === "lessons" && (
                <MaterialIcons
                  name={sortOrder === "asc" ? "arrow-upward" : "arrow-downward"}
                  size={20}
                  color="#007AFF"
                />
              )}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default UserDashboard;
