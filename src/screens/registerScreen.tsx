// src/screens/RegisterScreen.js

import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { registerUser } from '../lib/supabase/auth/register';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);  // Untuk indikator loading

  const handleRegister = async () => {
    setLoading(true);  // Set loading saat proses registrasi
    setMessage('');  // Reset message sebelum mencoba registrasi
    try {
      const result = await registerUser(email, password, name);

      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/; // Contoh password minimal 8 karakter dengan angka
    if (!passwordRegex.test(password)) {
      Alert.alert("Error", "Password minimal 6 karakter dan mengandung angka.");
      return;
    }

      // Periksa apakah result.message adalah objek, dan akses properti yang diperlukan
      if (result && result.message) {
        // Jika message adalah objek, tampilkan properti tertentu
        setMessage(result.message.message || 'Registrasi berhasil!');
      } else {
        setMessage('Registrasi berhasil!');
      }
    } catch (error) {
      // Tangani error jika terjadi
      setMessage('Terjadi kesalahan, silakan coba lagi.');
    } finally {
      setLoading(false);  // Set loading ke false setelah proses selesai
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <Button title="Register" onPress={handleRegister} disabled={loading} />
      
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        message && <Text>{message}</Text>  // Tampilkan pesan yang sesuai
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
});

export default RegisterScreen;
