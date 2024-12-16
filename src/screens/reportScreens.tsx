// pages/Laporan.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity } from "react-native";
import supabase from "../lib/supabase/init";

const Laporan: React.FC = ({ navigation }: any) => {
  const [laporanList, setLaporanList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch data laporan dari Supabase
    const fetchLaporan = async () => {
      try {
        const { data, error } = await supabase
          .from("laporan") // Tabel 'laporan'
          .select("*") // Mengambil semua kolom
          .order("tanggal", { ascending: false }); // Urutkan berdasarkan tanggal

        if (error) {
          console.error("Error fetching laporan:", error.message);
        } else {
          setLaporanList(data);
        }
      } catch (error) {
        console.error("Error fetching data from Supabase:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLaporan();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.judul}</Text>
      <Text style={styles.cell}>{item.deskripsi}</Text>
      <Text style={styles.cell}>{item.tanggal}</Text>
      <Text style={styles.cell}>{item.status}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("DetailReport", { laporanId: item.id })}
      >
        <Text style={styles.buttonText}>Lihat Detail</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Laporan</Text>

      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={laporanList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.cell}>Judul</Text>
              <Text style={styles.cell}>Deskripsi</Text>
              <Text style={styles.cell}>Tanggal</Text>
              <Text style={styles.cell}>Status</Text>
            </View>
          }
        />
      )}

      <Button
        title="Tambah Laporan"
        onPress={() => navigation.navigate("AddReport")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  cell: {
    flex: 1,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
});

export default Laporan;
