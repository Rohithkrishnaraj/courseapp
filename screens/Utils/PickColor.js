import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import React from 'react';
import { MaterialIcons } from "@expo/vector-icons";

const colors = [
  { color: 'bg-indigo-500', selected: true },
  { color: 'bg-violet-400', selected: false },
  { color: 'bg-purple-500', selected: false },
  { color: 'bg-fuchsia-400', selected: false },
  { color: 'bg-blue-500', selected: false },
  { color: 'bg-blue-400', selected: false },
  { color: 'bg-cyan-400', selected: false },
  { color: 'bg-sky-400', selected: false },
  { color: 'bg-green-500', selected: false },
  { color: 'bg-green-400', selected: false },
  { color: 'bg-orange-500', selected: false },
  { color: 'bg-orange-400', selected: false },
  { color: 'bg-pink-500', selected: false },
  { color: 'bg-pink-400', selected: false },
  { color: 'bg-red-500', selected: false },
  { color: 'bg-red-400', selected: false },
];

export default function PickColor({ selectedColor, onColorSelect }) {
  const renderItem = ({ item }) => {
    const isSelected = selectedColor === item.color;
    
    return (
      <TouchableOpacity
        onPress={() => onColorSelect(item.color)}
        className={`w-10 h-10 ${item.color} rounded-full m-1 justify-center items-center shadow-sm`}
      >
        {isSelected && (
          <MaterialIcons name="check" size={24} color="white" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View className="w-full">
      <Text className="text-lg font-medium mb-2 px-1">Color</Text>
      <View className="flex-row flex-wrap justify-start">
        <FlatList
          data={colors}
          renderItem={renderItem}
          keyExtractor={(item) => item.color}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 4 }}
        />
      </View>
    </View>
  );
}