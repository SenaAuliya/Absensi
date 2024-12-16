import React, { useState, useEffect } from "react";
import { View, TextInput, Button, Text, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import supabase from "../lib/supabase/init";
import { useUser } from "../lib/supabase/context/userContext";

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, "Login">;

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { setUser } = useUser();

  useEffect(() => {
    const checkLogin = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.user) {
        navigation.navigate(session.session.user.role === "admin" ? "AdminDashboard" : "EmployeeDashboard");
      }
    };

    checkLogin();
  }, [navigation]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email dan Password harus diisi.");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Format email tidak valid.");
      return;
    }

    setLoading(true);
    try {
      const { data: session, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) throw new Error("Login gagal: " + loginError.message);

      if (!session?.user?.id) throw new Error("User ID tidak ditemukan setelah login.");

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("name, role")
        .eq("id", session.user.id)
        .single();

      if (userError) throw new Error("Error fetching user role: " + userError.message);

      const role = userData?.role;
      setUser({ id: session.user.id, name: userData?.name || session.user.email, role });

      Alert.alert("Login Berhasil", "Selamat datang!");
      navigation.navigate(role === "admin" ? "AdminDashboard" : "EmployeeDashboard");
    } catch (error: any) {
      console.error("Login Error:", error);
      Alert.alert("Login Error", error.message || "Terjadi kesalahan saat login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={{
          marginBottom: 10,
          width: "100%",
          padding: 10,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
        }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          marginBottom: 10,
          width: "100%",
          padding: 10,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
        }}
      />
      <TouchableOpacity onPress={() => navigation.navigate("Register")} style={{ marginTop: 20 }}>
        <Text style={{ color: "blue", fontSize: 16 }}>Belum punya akun? Daftar di sini</Text>
      </TouchableOpacity>

      <Button title="Login" onPress={handleLogin} disabled={loading} />
      {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}
    </View>
  );
};

export default LoginScreen;
