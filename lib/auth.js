import { supabase } from "./supabase";

export async function signOut(navigation) {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    // Navigate to login screen
    navigation.replace("Login");
  } catch (error) {
    console.error("Error signing out:", error.message);
  }
}