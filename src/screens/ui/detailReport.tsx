// pages/DetailLaporan.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import supabase from "../../lib/supabase/init";

const DetailLaporan: React.FC<{ route: any }> = ({ route }) => {
  const { laporanId } = route.params;
  const [laporanDetail, setLaporanDetail] = useState<any>(null);

  useEffect(() => {
    // Fetch detail laporan berdasarkan laporanId
    const fetchDetailLaporan = async () => {
      try {
        const { data, error } = await supabase
          .from("laporan")
          .select("*")
          .eq("id", laporanId)
          .single(); // Mengambil data berdasarkan id

        if (error) {
          console.error("Error fetching laporan detail:", error.message);
        } else {
          setLaporanDetail(data);
        }
      } catch (error) {
        console.error("Error fetching data from Supabase:", error);
      }
    };

    fetchDetailLaporan();
  }, [laporanId]);

  if (!laporanDetail) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{laporanDetail.judul}</Text>
      <Text style={styles.info}>Deskripsi: {laporanDetail.deskripsi}</Text>
      <Text style={styles.info}>Tanggal: {laporanDetail.tanggal}</Text>
      <Text style={styles.info}>Status: {laporanDetail.status}</Text>
      <Text style={styles.info}>Dibuat pada: {laporanDetail.created_at}</Text>
      <Text style={styles.info}>Terakhir diperbarui: {laporanDetail.updated_at}</Text>
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
  info: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default DetailLaporan;
