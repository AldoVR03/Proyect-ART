import React from 'react';
import { StyleSheet, TextInput, Pressable, Text, View } from 'react-native';
import { getFirestore, query, collection, where, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../config/firebase-config';

const LoginForm = ({ navigation }) => {
  const [rut, setRut] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const handleSignIn = async () => {
    const q = query(collection(db, 'trabajadores'), where('RUT', '==', rut));

    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setError('RUT no encontrado');
        return;
      }

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.Password === password) {
          console.log('Inicio de sesión exitoso:', data);
          navigation.navigate('ART'); 
        } else {
          setError('Contraseña incorrecta');
        }
      });
    } catch (error) {
      console.error('Error al buscar el trabajador: ', error);
      setError('Error en la búsqueda, inténtalo de nuevo');
    }
  };

  return (
    <View style={styles.espacio}>
      <Text>Ingrese el RUT:</Text>
      <TextInput
        onChangeText={setRut}
        style={styles.input}
        placeholder='12345678-9'
      />
      <Text>Ingrese su contraseña:</Text>
      <TextInput
        onChangeText={setPassword}
        style={styles.input}
        placeholder='Contraseña'
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  espacio:{
    marginBottom:150
  },
  input: {
    borderWidth: 1,
    padding: 20,
    width: 200,
    height: 37,
    borderRadius: 30,
    marginTop: 20,
  },
  button: {
    backgroundColor: '#a63916',
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});

export default LoginForm;
