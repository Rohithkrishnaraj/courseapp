import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const Signup = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (email === "admin@gmail.com" && password === "admin123") {
      navigation.replace("Home");
    } else if (email === "user@gmail.com" && password === "user123") {
      navigation.replace("UserDashboard");
    } else {
      Alert.alert("Error", "Invalid credentials. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <View className="flex-1 justify-center px-5">
        <Text className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Welcome Back
        </Text>
        <Text className="text-base text-gray-600 mb-8 text-center">
          Sign in to continue
        </Text>

        <View className="mb-6">
          <TextInput
            className="bg-gray-100 p-4 rounded-xl mb-4 text-base"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <View className="relative flex-row items-center bg-gray-100 rounded-xl">
            <TextInput
              className="flex-1 p-4 text-base"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              className="absolute right-2 p-2"
              onPress={() => setShowPassword(!showPassword)}
            >
              <MaterialIcons
                name={showPassword ? "visibility" : "visibility-off"}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-xl items-center"
          onPress={handleLogin}
        >
          <Text className="text-white text-lg font-semibold">Login</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-5">
          <Text className="text-base text-gray-600">
            Don't have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text className="text-base text-blue-500 font-semibold">
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Signup;
