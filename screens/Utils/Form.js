import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import backgroundClasses from "../../Data/colors";
import Dialog from "./Dialog";
import PickColor from "./PickColor";

const colors = [
  "bg-red-200",
  "bg-blue-200",
  "bg-green-200",
  "bg-yellow-200",
  "bg-purple-200",
  "bg-pink-200",
  "bg-indigo-200",
  "bg-gray-200",
];

export default function AddFolder({
  item,
  navigation,
  Tittle,
  Name,
  Description,
  colors = backgroundClasses,
  NameProps,
  DescriptionProps,
  Formdata,
  setFormdata,
  handleAddItem,
  handleSave,
  setselectedcolor,
  handleCancel,
  visible,
  setVisible,
  categories,
  selectedCategory,
  setSelectedCategory,
}) {
  console.log("dd",colors);

  // console.log("NN",NameProps)
  // console.log("DD",DescriptionProps)

  const showDialog = () => {
    setVisible(true);
  };

  // const handleSave = async () => {
  //   await handleAddItem();
  //   setVisible(false);
  // };

  const handleInputChange = (key, value) => {
    setFormdata({
      ...Formdata,
      [key]: value,
    });
  };

  const handleColorSelect = (color) => {
    // Update both the form data and the parent's selected color
    setFormdata({
      ...Formdata,
      color: color,
    });
    setselectedcolor(color);
  };

  const isSaveEnabled = () => {
    return Formdata[NameProps]?.trim()?.length > 0 && Formdata[DescriptionProps]?.trim()?.length > 0;
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 px-6 py-8">
      <Text className="text-2xl font-bold text-gray-800 mb-6">{Tittle}</Text>
      
      <View className="mb-6">
        <Text className="text-gray-700 text-base mb-2">{Name}</Text>
        <TextInput
          className="bg-white px-4 py-3 rounded-xl border border-gray-200"
          value={Formdata[NameProps]}
          onChangeText={(text) => handleInputChange(NameProps, text)}
          placeholder={`Enter ${Name.toLowerCase()}`}
        />
      </View>

      <View className="mb-6">
        <Text className="text-gray-700 text-base mb-2">{Description}</Text>
        <TextInput
          className="bg-white px-4 py-3 rounded-xl border border-gray-200"
          value={Formdata[DescriptionProps]}
          onChangeText={(text) => handleInputChange(DescriptionProps, text)}
          placeholder={`Enter ${Description.toLowerCase()}`}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      {categories && (
        <View className="mb-6">
          <Text className="text-gray-700 text-base mb-2">Category</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => setSelectedCategory(category)}
                className={`mr-2 px-4 py-2 rounded-full ${
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
            ))}
          </ScrollView>
        </View>
      )}

      <View className="mb-6">
        <Text className="text-gray-700 text-base mb-2">Choose Color</Text>
        <View className="flex-row flex-wrap">
          {colors.map((color, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setselectedcolor(color)}
              className={`w-12 h-12 ${color} rounded-full m-2`}
            />
          ))}
        </View>
      </View>

      <View className="flex-row justify-end mt-6">
        <TouchableOpacity
          onPress={() => setVisible(false)}
          className="px-6 py-3 rounded-xl bg-gray-200 mr-2"
        >
          <Text className="text-gray-700 font-medium">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSave}
          className="px-6 py-3 rounded-xl bg-blue-500"
        >
          <Text className="text-white font-medium">Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
