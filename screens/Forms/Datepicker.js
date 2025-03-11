import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialIcons } from "@expo/vector-icons";

export default function Datepicker() {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || new Date();
    setShowTimePicker(Platform.OS === "ios");
    setTime(
      currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const toggleTimePicker = () => {
    setShowTimePicker(!showTimePicker);
  };

  return (
    <View>
      <View className="w-full   mt-2">
        <TouchableOpacity className="w-9/12 h-16 bg-white mx-3.5 my-3 border border-gray-400 rounded-md shadow-md flex flex-row items-center px-3" onPress={toggleDatePicker}>
          <MaterialIcons name="date-range" size={24} color="gray" />
          <View className="px-2">
            <Text className="text-sm text-[#6B7280]">Select Date</Text>
            <Text className="text-lg">{date.toDateString()}</Text>
          </View>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}
      </View>
      <View className="w-full    mt-2">
        <TouchableOpacity className="w-9/12 h-16 bg-white mx-3.5 my-3 border border-gray-400 rounded-md shadow-md flex flex-row items-center px-3" onPress={toggleTimePicker}>
          <MaterialIcons name="access-time" size={24} color="gray" />
          <View className="px-2">
            <Text className="text-sm text-[#6B7280]">Select Time</Text>
            <Text className="text-lg">{time}</Text>
          </View>
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
    </View>
  );
}
