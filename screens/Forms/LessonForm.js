import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  StatusBar 
} from "react-native";
import React, { useState, useEffect } from "react";
import { createLessonsTable, insertLesson, updateLesson } from "../../DB/DbStorage";
import PickColor from "../Utils/PickColor";
import Dialog from "../Utils/Dialog";
import { MaterialIcons } from "@expo/vector-icons";

export default function LessonForm({ navigation, route }) {
  const [visible, setVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedColor, setSelectedColor] = useState("bg-indigo-500");
  
  const courseId = route.params?.CourseId;
  const isEditing = route.params?.isEditing;
  const lessonData = route.params?.lessonData;

  const [Formdata, setFormdata] = useState({
    LessonName: "",
    LessonDescription: "",
  });

  useEffect(() => {
    const setupTable = async () => {
      try {
        await createLessonsTable();
      } catch (error) {
        console.error("Error creating lessons table:", error);
        Alert.alert("Error", "Failed to initialize lessons table");
      }
    };
    
    setupTable();

    if (isEditing && lessonData) {
      setFormdata({
        LessonName: lessonData.name || "",
        LessonDescription: lessonData.description || "",
      });
      setSelectedColor(lessonData.colour || "bg-indigo-500");
    }
  }, [isEditing, lessonData]);

  const handleSave = async () => {
    if (!Formdata.LessonName.trim()) {
      Alert.alert("Error", "Lesson name is required");
      return;
    }

    if (!courseId && !isEditing) {
      Alert.alert("Error", "Course ID is missing. Please try again.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateLesson(
          lessonData.id,
          Formdata.LessonName.trim(),
          Formdata.LessonDescription.trim(),
          selectedColor,
          lessonData.state || "draft"
        );
      } else {
        await insertLesson(
          courseId,
          Formdata.LessonName.trim(),
          Formdata.LessonDescription.trim(),
          selectedColor,
          "draft"
        );
      }
      setVisible(true);
    } catch (error) {
      console.error("Error saving lesson:", error);
      Alert.alert(
        "Error",
        isEditing ? "Failed to update lesson" : "Failed to create lesson"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (key, value) => {
    setFormdata({
      ...Formdata,
      [key]: value,
    });
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      
      {/* Header */}
      <View 
        className="px-6 pt-4 pb-2 bg-white flex-row justify-between items-center border-b border-gray-100"
        style={{
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,
        }}
      >
        <View>
          <Text 
            className="text-2xl font-bold text-gray-800"
            style={{ letterSpacing: 0.15 }}
          >
            {isEditing ? 'Edit Lesson' : 'Create Lesson'}
          </Text>
          <Text className="text-base text-gray-600">
            {isEditing ? 'Update lesson details' : 'Add a new lesson'}
          </Text>
        </View>
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

      <ScrollView className="flex-1 px-6">
        <View className="py-6">
          <Text 
            className="text-base font-medium mb-2 text-gray-900"
            style={{ letterSpacing: 0.15 }}
          >
            Lesson Name
          </Text>
          <TextInput
            value={Formdata.LessonName}
            placeholder="Enter the lesson name"
            onChangeText={(value) => handleInputChange("LessonName", value)}
            className="w-full bg-white rounded-lg py-3 px-4 text-gray-900 mb-1"
            style={{
              elevation: 1,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.18,
              shadowRadius: 1.0,
            }}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View className="py-4">
          <Text 
            className="text-base font-medium mb-2 text-gray-900"
            style={{ letterSpacing: 0.15 }}
          >
            Lesson Description
          </Text>
          <TextInput
            value={Formdata.LessonDescription}
            placeholder="Enter the lesson description"
            onChangeText={(value) => handleInputChange("LessonDescription", value)}
            multiline
            numberOfLines={4}
            className="w-full bg-white rounded-lg py-3 px-4 text-gray-900"
            style={{
              elevation: 1,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.18,
              shadowRadius: 1.0,
              textAlignVertical: 'top',
              minHeight: 120,
            }}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View className="py-4">
          <Text 
            className="text-base font-medium mb-4 text-gray-900"
            style={{ letterSpacing: 0.15 }}
          >
            Theme Color
          </Text>
          <PickColor 
            selectedColor={selectedColor} 
            onColorSelect={setSelectedColor} 
          />
        </View>

        <View className="flex-row justify-end py-6">
          <TouchableOpacity
            accessible={true}
            accessibilityLabel="Cancel"
            accessibilityHint="Discard changes and go back"
            accessibilityRole="button"
            onPress={() => navigation.goBack()}
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
            accessible={true}
            accessibilityLabel={isSubmitting ? "Saving lesson" : "Save lesson"}
            accessibilityHint="Save the lesson and return"
            accessibilityRole="button"
            onPress={handleSave}
            disabled={isSubmitting}
            className={`px-6 py-3 rounded-lg ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600'}`}
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
              {isSubmitting ? 'Saving...' : 'Save'}
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
