import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import supabase from '../../lib/supabase/init'; // Pastikan path sesuai struktur proyek Anda

const AbsenceScreen = () => {
  const [loading, setLoading] = useState(false);
  const [attendance, setAttendance] = useState<any>(null);
  const navigation = useNavigation();

  const fetchAttendance = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;

      const user = session?.user;
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];
      const { data, error: fetchError } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      if (fetchError) {
        if (fetchError.message !== 'Row not found') throw fetchError;
        setAttendance(null); // Tidak ada absensi
      } else {
        setAttendance(data);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Gagal memuat data absensi');
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
  
      const user = session?.user;
      if (!user) throw new Error('Anda harus login terlebih dahulu');
  
      const today = new Date().toISOString().split('T')[0];
      const currentTime = new Date().toLocaleTimeString('en-GB', { hour12: false });
  
      if (attendance) {
        Alert.alert('Error', 'Anda sudah melakukan check-in hari ini');
        return;
      }
  
      const { data, error: insertError } = await supabase
        .from('attendance')
        .insert([{ user_id: user.id, date: today, check_in: currentTime }]);
  
      if (insertError) throw insertError;
  
      // Perbarui status attendance setelah check-in berhasil
      setAttendance(data ? data[0] : null);
      Alert.alert('Sukses', 'Check-in berhasil');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message || 'Gagal melakukan check-in');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCheckOut = async () => {
    setLoading(true);
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
  
      const user = session?.user;
      if (!user) throw new Error('Anda harus login terlebih dahulu');
  
      if (!attendance || !attendance.check_in) {
        Alert.alert('Error', 'Anda belum melakukan check-in hari ini');
        return;
      }
  
      const currentTime = new Date().toLocaleTimeString('en-GB', { hour12: false });
  
      const { data, error: updateError } = await supabase
        .from('attendance')
        .update({ check_out: currentTime })
        .eq('id', attendance.id);
  
      if (updateError) throw updateError;
  
      // Perbarui status attendance setelah check-out berhasil
      setAttendance({ ...attendance, check_out: currentTime });
  
      Alert.alert('Sukses', 'Check-out berhasil');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message || 'Gagal melakukan check-out');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Absen Sekarang</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : attendance ? (
        <>
          <Text>Check-in: {attendance.check_in || 'Belum Check-in'}</Text>
          <Text>Check-out: {attendance.check_out || 'Belum Check-out'}</Text>
          {attendance.check_out ? (
            <Text>Terima kasih, Anda sudah selesai bekerja untuk hari ini.</Text>
          ) : (
            <Button title="Check-out" onPress={handleCheckOut} />
          )}
        </>
      ) : (
        <Button title="Check-in" onPress={handleCheckIn} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default AbsenceScreen;
