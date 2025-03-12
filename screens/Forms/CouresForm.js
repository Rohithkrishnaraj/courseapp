import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  TouchableOpacity,
  StatusBar,
  Alert 
} from "react-native";
import React, { useState, useEffect } from "react";
import { createCoursesTable, insertCourse, migrateExistingCourses } from "../../DB/DbStorage";
import PickColor from "../Utils/PickColor";
import Dialog from "../Utils/Dialog";
import { MaterialIcons } from "@expo/vector-icons";

const categories = [
  'Development',
  'Design',
  'Business',
  'Marketing',
  'Personal Development',
];

export default function CouresForm({ navigation, route }) {
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await createCoursesTable();
        await migrateExistingCourses();
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };
    
    initializeDatabase();
  }, []);

  const [visible, setVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState("bg-indigo-500");
  const [selectedCategory, setSelectedCategory] = useState('Development');
  const [Formdata, setFormdata] = useState({
    CourseName: "",
    CourseDescription: "",
  });

  const handleSave = async () => {
    if (!Formdata.CourseName.trim() || !Formdata.CourseDescription.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    
    try {
      await insertCourse(
        Formdata.CourseName.trim(),
        Formdata.CourseDescription.trim(),
        selectedColor,
        "draft",
        selectedCategory
      );
      setVisible(true);
    } catch (error) {
      console.error("Error saving course:", error);
      Alert.alert("Error", "Failed to save course");
    }
  };

  const handleInputChange = (key, value) => {
    setFormdata({
      ...Formdata,
      [key]: value,
    });
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#FFFFFF"
        animated={true}
      />

      {/* Header */}
      <View 
        className="px-4 pt-4 pb-2 bg-white flex-row justify-between items-center"
        style={{
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,
        }}
      >
        <Text 
          className="text-xl text-gray-900"
          style={{ 
            fontWeight: '500',
            letterSpacing: 0.15 
          }}
        >
          Create Course
        </Text>
        <TouchableOpacity
          accessible={true}
          accessibilityLabel="Close form"
          accessibilityHint="Double tap to discard changes and go back"
          accessibilityRole="button"
          onPress={() => navigation.goBack()}
          className="p-2 rounded-full"
          style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
        >
          <MaterialIcons name="close" size={24} color="#424242" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4">
        <View className="py-4">
          <Text 
            className="text-base font-medium mb-2 text-gray-900"
            style={{ letterSpacing: 0.15 }}
          >
            Course Name
          </Text>
          <TextInput
            value={Formdata.CourseName}
            placeholder="Enter the course name"
            onChangeText={(value) => handleInputChange("CourseName", value)}
            className="w-full rounded-lg bg-gray-50 py-3 px-4 text-gray-900"
            style={{
              elevation: 1,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.18,
              shadowRadius: 1.0,
            }}
            placeholderTextColor="#9E9E9E"
          />
        </View>

        <View className="py-4">
          <Text 
            className="text-base font-medium mb-2 text-gray-900"
            style={{ letterSpacing: 0.15 }}
          >
            Course Description
          </Text>
          <TextInput
            value={Formdata.CourseDescription}
            placeholder="Enter the course description"
            onChangeText={(value) => handleInputChange("CourseDescription", value)}
            multiline
            numberOfLines={4}
            className="w-full rounded-lg bg-gray-50 py-3 px-4 text-gray-900"
            style={{
              elevation: 1,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.18,
              shadowRadius: 1.0,
              textAlignVertical: 'top',
            }}
            placeholderTextColor="#9E9E9E"
          />
        </View>

        <View className="mb-6">
          <Text 
            className="text-base font-medium mb-3 text-gray-900"
            style={{ letterSpacing: 0.15 }}
          >
            Category
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => setSelectedCategory(category)}
                accessible={true}
                accessibilityRole="button"
                accessibilityState={{ selected: selectedCategory === category }}
                accessibilityLabel={`${category} category`}
                className={`mr-2 px-4 py-2 rounded-full ${
                  selectedCategory === category
                    ? 'bg-blue-600'
                    : 'bg-gray-100'
                }`}
              >
                <Text
                  className={`${
                    selectedCategory === category
                      ? 'text-white'
                      : 'text-gray-700'
                  } font-medium`}
                  style={{ letterSpacing: 0.25 }}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="mb-4">
          <Text 
            className="text-base font-medium mb-3 text-gray-900"
            style={{ letterSpacing: 0.15 }}
          >
            Theme Color
          </Text>
          <PickColor 
            selectedColor={selectedColor} 
            onColorSelect={setSelectedColor} 
          />
        </View>

        <View className="flex-row justify-end mt-6 mb-8">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
            accessibilityHint="Discard changes and go back"
            className="px-6 py-3 rounded-lg bg-gray-100 mr-3"
          >
            <Text 
              className="text-gray-700 font-medium"
              style={{ letterSpacing: 0.25 }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSave}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Save course"
            accessibilityHint="Save the course and go back"
            className="px-6 py-3 rounded-lg bg-blue-600"
            style={{
              elevation: 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.2,
              shadowRadius: 1.41,
            }}
          >
            <Text 
              className="text-white font-medium"
              style={{ letterSpacing: 0.25 }}
            >
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <Dialog
        visible={visible}
        setVisible={setVisible}
        handleSave={() => {
          setVisible(false);
          navigation.goBack();
        }}
      />
    </View>
  );
}
