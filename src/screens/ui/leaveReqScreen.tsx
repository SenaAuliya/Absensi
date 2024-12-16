import React, { useState } from "react";
import { View, Text, Button, Alert, StyleSheet, ActivityIndicator, TextInput } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useUser } from "../../lib/supabase/context/userContext";
import supabase from "../../lib/supabase/init";

const LeaveRequest: React.FC = () => {
  const { user } = useUser();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleSubmitLeaveRequest = async () => {
    if (!user?.id) {
      Alert.alert("Error", "User data is missing or not logged in.");
      return;
    }
  
    try {
      const { error } = await supabase.from("leave_requests").insert([
        {
          user_id: user.id, // menggunakan user.id yang sudah ada
          start_date: startDate?.toISOString().split("T")[0],
          end_date: endDate?.toISOString().split("T")[0],
          reason,
          status: "pending",
        },
      ]);
    
      if (error) {
        console.error("Supabase Error:", error);
        throw error;
      }
    
      Alert.alert("Sukses", "Permintaan cuti berhasil diajukan");
    } catch (error:any) {
      console.error("Error:", error);
      Alert.alert("Error", error.message || "Gagal mengajukan permintaan cuti");
    }
  };
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leave Request</Text>

      <Button
        title={`Start Date: ${startDate ? startDate.toISOString().split("T")[0] : "Select"}`}
        onPress={() => setShowStartPicker(true)}
      />
      {showStartPicker && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowStartPicker(false);
            if (date) setStartDate(date);
          }}
        />
      )}

      <Button
        title={`End Date: ${endDate ? endDate.toISOString().split("T")[0] : "Select"}`}
        onPress={() => setShowEndPicker(true)}
      />
      {showEndPicker && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowEndPicker(false);
            if (date) setEndDate(date);
          }}
        />
      )}

      <Text style={styles.label}>Reason</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Reason for leave"
        value={reason}
        onChangeText={setReason}
        multiline
        numberOfLines={4}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Submit Leave Request" onPress={handleSubmitLeaveRequest} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  textArea: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 10,
    paddingHorizontal: 8,
    textAlignVertical: "top",
  },
});

export default LeaveRequest;
