import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import supabase from "../../lib/supabase/init";
import { useUser } from "../../lib/supabase/context/userContext";

const TambahLaporan: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [judul, setJudul] = useState<string>("");
  const [deskripsi, setDeskripsi] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const { user } = useUser(); // Ambil data pengguna dari context

  // Fungsi untuk menambah laporan ke Supabase
  const handleSubmit = async () => {
    if (!judul || !deskripsi || !status) {
      Alert.alert("Semua field harus diisi!");
      return;
    }

    // Periksa apakah data pengguna ada di context
    if (!user?.id) {
      Alert.alert("Error", "User data is missing or not logged in.");
      return;
    }

    try {
      // Menyisipkan data ke tabel laporan dengan menggunakan ID pengguna dari context
      const { error } = await supabase.from("laporan").insert([
        {
          judul,
          deskripsi,
          status,
          tanggal: new Date(),
          user_id: user.id, // Gunakan ID pengguna yang ada di context
        },
      ]);

      if (error) {
        console.error("Supabase Error:", error);
        throw error;
      }

      Alert.alert("Sukses", "Laporan berhasil ditambahkan!");
      navigation.goBack(); // Kembali ke halaman sebelumnya setelah sukses
    } catch (error: any) {
      console.error("Error:", error);
      Alert.alert("Error", error.message || "Gagal mengajukan laporan");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tambah Laporan</Text>

      <TextInput
        style={styles.input}
        placeholder="Judul Laporan"
        value={judul}
        onChangeText={setJudul}
      />

      <TextInput
        style={styles.input}
        placeholder="Deskripsi"
        value={deskripsi}
        onChangeText={setDeskripsi}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Status"
        value={status}
        onChangeText={setStatus}
      />

      <Button title="Simpan Laporan" onPress={handleSubmit} />

      <Button title="Batal" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default TambahLaporan;
