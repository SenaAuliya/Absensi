import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, Text, Button, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { useUser } from "../lib/supabase/context/userContext";
import supabase from "../lib/supabase/init";
import { logoutUser } from "../lib/supabase/auth/logout";

type EmployeeDashboardNavigationProp = StackNavigationProp<RootStackParamList, "EmployeeDashboard">;

interface LeaveRequest {
  id: number;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
}

const EmployeeDashboard: React.FC = () => {
  const navigation = useNavigation<EmployeeDashboardNavigationProp>();
  const { user } = useUser();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user?.id) {
      fetchLeaveRequests();
    }
  }, [user?.id]);

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      navigation.replace("Login"); // Arahkan user ke halaman login setelah logout
    } else {
      Alert.alert("Error", result.message);
    }
  };

  const fetchLeaveRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("leave_requests")
        .select("id, start_date, end_date, reason, status")
        .eq("user_id", user?.id);
      if (!error) {
        setLeaveRequests(data || []);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "EmployeeDashboard",
      headerRight: () => (
        <TouchableOpacity style={styles.headerButton} onPress={handleLogout}>
          <Text style={styles.headerButtonText}>Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const renderLeaveRequestItem = ({ item }: { item: LeaveRequest }) => (
    <View style={styles.leaveRequestItem}>
      <Text style={styles.leaveRequestText}>
        <Text style={styles.bold}>Start:</Text> {item.start_date}
      </Text>
      <Text style={styles.leaveRequestText}>
        <Text style={styles.bold}>End:</Text> {item.end_date}
      </Text>
      <Text style={styles.leaveRequestText}>
        <Text style={styles.bold}>Reason:</Text> {item.reason}
      </Text>
      <Text style={[styles.leaveRequestText, { color: item.status === "approved" ? "green" : "red" }]}>
        <Text style={styles.bold}>Status:</Text> {item.status}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Logo Perusahaan */}
      {/* <Image source={{ uri: "https://via.placeholder.com/150" }} style={styles.logo} /> */}

      {/* Nama Karyawan */}
      <Text style={styles.welcomeText}>Welcome, {user?.name}!</Text>

      {/* Menu Navigasi */}
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("LeaveRequest")}>
          <Text style={styles.menuText}>Leave Request</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Absence")}>
          <Text style={styles.menuText}>Absensi</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Schedule")}>
          <Text style={styles.menuText}>Jadwal</Text>
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Report")}>
          <Text style={styles.menuText}>Laporan</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Settings")}>
          <Text style={styles.menuText}>Pengaturan</Text>
        </TouchableOpacity> */}
      </View>

      {/* Leave Request Section */}
      <Text style={styles.sectionTitle}>Leave Request Status</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : leaveRequests.length === 0 ? (
        <Text style={styles.noLeaveRequestText}>No leave requests found.</Text>
      ) : (
        <FlatList
          data={leaveRequests}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderLeaveRequestItem}
        />
      )}

      {/* Check-in/Check-out & Logout */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  menuContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  menuItem: {
    backgroundColor: "#007bff",
    padding: 15,
    margin: 5,
    borderRadius: 8,
    width: "45%",
    alignItems: "center",
  },
  menuText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  leaveRequestItem: {
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  leaveRequestText: {
    fontSize: 14,
    color: "#555",
  },
  bold: {
    fontWeight: "bold",
  },
  noLeaveRequestText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
  },
  bottomButtonContainer: {
    marginTop: 20,
  },
  headerButton: {
    marginRight: 10,
    backgroundColor: "red",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  headerButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default EmployeeDashboard;
