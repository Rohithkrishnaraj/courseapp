import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function Reminder({
  handleInputChange,
  handlesubmit,
  item,
  itemarray,
  toggleTimePicker,
  onChangeTime,
  showTimePicker,
  time,
}) {


    
  console.log("sss", time);
  return (
    <View className="flex flex-col px-4 border py-2 rounded-lg border-gray-300">
      <Text className=" py-2">Add Reminder</Text>
      <TextInput
        value={item.Reminder}
        placeholder="Enter Reminder here"
        onChangeText={(value) => handleInputChange("Reminder", value)}
        className="block w-4/5 rounded-md border border-gray-400 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-1 mb-1"
      />
      <View className="w-full mt-2">
        <TouchableOpacity
          className="w-20 h-6 bg-blue-200 rounded-3xl flex items-center justify-center"
          onPress={toggleTimePicker}
        >
          <Text className="text-blue-900 font-medium">Select Time</Text>
        </TouchableOpacity>

        {showTimePicker && (
          <DateTimePicker
            testID="timePicker"
            value={new Date()}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onChangeTime}
          />
        )}
      </View>
      <View className="px-2 py-2 ">
        {itemarray.map(({ Reminder, Time }) => (
          <View>
            <View className="flex flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-green-500"></View>
              <Text className="text-lg px-1">{Reminder}</Text>
            </View>
            <Text>{time}</Text>
          </View>
        ))}
      </View>
      <View className="flex flex-row items-center justify-between">
        <TouchableOpacity className="bg-gray-100 hover:bg-blue-600 text-white font-bold w-2/5 h-10 rounded-md flex items-center justify-center mt-6">
          <Text className="text-gray-800 tracking-wider">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handlesubmit}
          className="bg-blue-400 hover:bg-blue-600 text-white font-bold w-2/5 h-10 rounded-md flex items-center justify-center mt-6"
        >
          <Text className="text-gray-50 tracking-wider">Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
