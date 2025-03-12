import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { supabase } from "../lib/supabase";

export default function SessionProvider({ navigation }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) throw error;

      if (session) {
        // Check email and redirect accordingly
        const userEmail = session.user.email.toLowerCase();
        if (userEmail === "rohithkrishnaraj@gmail.com") {
          navigation.replace("Home");
        } else {
          navigation.replace("UserDashboard");
        }
      } else {
        navigation.replace("Login");
      }
    } catch (error) {
      console.error("Error checking session:", error.message);
      navigation.replace("Login");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0284c7" />
      </View>
    );
  }

  return null;
}