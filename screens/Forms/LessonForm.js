import { View, Text, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import Form from "../Utils/Form";
import { createLessonsTable, insertLesson, updateLesson } from "../../DB/DbStorage";

export default function LessonForm({ navigation, route }) {
  const [visible, setVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get courseId directly from route.params
  const courseId = route.params?.CourseId;
  const isEditing = route.params?.isEditing;
  const lessonData = route.params?.lessonData;

  // Debug log
  useEffect(() => {
    console.log("LessonForm Mount - Route Params:", {
      courseId,
      isEditing,
      lessonData,
      fullParams: route.params
    });
  }, []);

  const handleSave = async () => {
    console.log("handleSave called with:", {
      courseId,
      isEditing,
      formData: Formdata,
      selectedcolor
    });

    if (!Formdata.LessonName.trim()) {
      Alert.alert("Error", "Lesson name is required");
      return;
    }

    if (!courseId && !isEditing) {
      console.error("CourseId missing:", route.params);
      Alert.alert("Error", "Course ID is missing. Please try again.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await handleEditItem();
      } else {
        const result = await handleAddItem();
        console.log("Add lesson result:", result);
      }
      setVisible(false);
      navigation.goBack();
    } catch (error) {
      console.error("Error saving lesson:", error);
      Alert.alert(
        "Error",
        isEditing ? "Failed to update lesson" : "Failed to create lesson. Please check the console for details."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setVisible(false);
    navigation.goBack();
  };

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
      setselectedcolor(lessonData.colour);
    }
  }, [isEditing, lessonData]);

  const [selectedcolor, setselectedcolor] = useState(null);
  const [Formdata, setFormdata] = useState({
    LessonName: "",
    LessonDescription: "",
  });

  const [FormdataArray, SetFormdataArray] = useState([]);

  const handleAddItem = async () => {
    console.log("handleAddItem called with:", {
      courseId,
      formData: Formdata,
      selectedcolor
    });

    if (!courseId || !Formdata.LessonName.trim()) {
      const error = new Error("Missing required fields");
      console.error(error, { courseId, lessonName: Formdata.LessonName });
      throw error;
    }

    try {
      const result = await insertLesson(
        courseId,
        Formdata.LessonName.trim(),
        Formdata.LessonDescription.trim() || "",
        selectedcolor,
        "draft"
      );

      if (!result) {
        throw new Error("Failed to insert lesson - no result returned");
      }

      console.log("Lesson inserted successfully:", result);

      setFormdata({
        LessonName: "",
        LessonDescription: "",
      });
      return result;
    } catch (error) {
      console.error("Error in handleAddItem:", error);
      throw error;
    }
  };

  const handleEditItem = async () => {
    if (!lessonData?.id || !Formdata.LessonName.trim()) {
      throw new Error("Missing required fields");
    }

    try {
      await updateLesson(
        lessonData.id,
        Formdata.LessonName.trim(),
        Formdata.LessonDescription.trim() || "",
        selectedcolor,
        lessonData.state || "draft"
      );
    } catch (error) {
      console.error("Error in handleEditItem:", error);
      throw error;
    }
  };

  return (
    <View className="">
      <Form
        Tittle={isEditing ? "Edit Lesson" : "Add Lesson"}
        Name="Lesson Name"
        Description="Lesson Description"
        NameProps="LessonName"
        DescriptionProps="LessonDescription"
        Formdata={Formdata}
        setFormdata={setFormdata}
        FormdataArray={FormdataArray}
        SetFormdataArray={SetFormdataArray}
        handleAddItem={handleAddItem}
        setselectedcolor={setselectedcolor}
        handleCancel={handleCancel}
        setVisible={setVisible}
        visible={visible}
        handleSave={handleSave}
        selectedcolor={selectedcolor}
        isSubmitting={isSubmitting}
      />
    </View>
  );
}
