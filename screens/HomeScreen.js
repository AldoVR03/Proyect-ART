import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { firestore } from '../config/firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {
  const [arts, setArts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'formularios'));
        const artData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setArts(artData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Mostrar indicador de carga
  if (loading) {
    return <ActivityIndicator size="large" color="#a63916" style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ART Realizada</Text>
      
      <FlatList
        data={arts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text style={styles.cellTitle}>Empresa:</Text>
              <Text style={styles.cellValue}>{item.empresa || 'N/A'}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.cellTitle}>Gerencia:</Text>
              <Text style={styles.cellValue}>{item.gerencia || 'N/A'}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.cellTitle}>Fecha:</Text>
              <Text style={styles.cellValue}>{item.fecha || 'N/A'}</Text>
            </View>

            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() =>
                navigation.navigate('DetallesFormulario', { artId: item.id })
              }>
              <Text style={styles.detailsButtonText}>Más detalles</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay ARTs disponibles</Text>}
      />

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('Nuevo Formulario')}>
        <Text style={styles.createButtonText}>Crear Nueva ART</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableRow: {
    backgroundColor: '#fff',
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  tableCell: {
    marginBottom: 8,
  },
  cellTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  cellValue: {
    fontSize: 16,
    color: '#333',
  },
  detailsButton: {
    backgroundColor: '#a63916',
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  detailsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#a63916',
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
});

export default HomeScreen;
