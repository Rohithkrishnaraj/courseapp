import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import Form from "../Utils/Form";
import { createCoursesTable, insertCourse, migrateExistingCourses } from "../../DB/DbStorage";

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
  
  const handleSave = async () => {
    await handleAddItem();
    setVisible(false);
    navigation.goBack();
  };

  const [selectedcolor, setselectedcolor] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Development');
  const [Formdata, setFormdata] = useState({
    CourseName: "",
    CourseDescription: " ",
  });

  const [FormdataArray, SetFormdataArray] = useState([]);

  const handleAddItem = async () => {
    if (Formdata.CourseName && Formdata.CourseDescription) {
      await insertCourse(
        Formdata.CourseName,
        Formdata.CourseDescription,
        selectedcolor,
        "draft",
        selectedCategory
      );
    }
    setFormdata({
      CourseName: "",
      CourseDescription: "",
    });
    setselectedcolor(null);
    setSelectedCategory('Development');
  };

  return (
    <View className="flex-1">
      <Form
        Tittle="Add Course"
        Name="Course Name"
        Description="Course Description"
        NameProps="CourseName"
        DescriptionProps="CourseDescription"
        Formdata={Formdata}
        setFormdata={setFormdata}
        FormdataArray={FormdataArray}
        SetFormdataArray={SetFormdataArray}
        handleAddItem={handleAddItem}
        setselectedcolor={setselectedcolor}
        handleSave={handleSave}
        setVisible={setVisible}
        visible={visible}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
    </View>
  );
}
