import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";

export default function Register({navigation}) {
  const [mobile, setmobile] = useState(null);
  const [IsError, setIsError] = useState(false);
  const pattern = new RegExp(/^\d{1,10}$/);
  console.log(mobile)
  return (
    <View className="bg-gray-100 h-screen flex items-center my-32">
      <View className="bg-white  h-1/4 w-4/5 rounded-lg shadow-lg flex items-center">
        <Text className="text-xl font-bold  pt-6 ">Mobile Number</Text>
        <TextInput
          className="block w-3/5 rounded-md border py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-4 mb-1"
          keyboardType="numeric"
          onChangeText={(value) => {
            setmobile(value);
            if (!pattern.test(value)) setIsError(true);
            else setIsError(false);
          }}
        />
        <View className="mb-3">
        {IsError &&  <Text className="text-red-400">Invalid mobile Number</Text>}
        </View>
       
        <TouchableOpacity className="bg-blue-500 hover:bg-blue-600 text-white font-bold w-28 h-8 rounded-full flex items-center justify-center " onPress={()=>navigation.navigate("Profile")}>
          <Text className="text-lg text-white font-medium">Get OTP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
