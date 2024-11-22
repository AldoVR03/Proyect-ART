import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { firestore } from '../config/firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const DetallesFormulario = ({ route }) => {
  const { artId } = route.params; // ID del formulario
  const [formulario, setFormulario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFormulario = async () => {
      try {
        const docRef = doc(firestore, 'formularios', artId); // Referencia al documento
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data(); // Extraemos los datos del documento
          console.log('Datos del formulario:', data); // Verifica qué se está obteniendo
          setFormulario(data); // Guardamos los datos en el estado
        } else {
          console.log('No se encontró el formulario.');
        }
      } catch (error) {
        console.error('Error al obtener detalles del formulario:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFormulario();
  }, [artId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#a63916" style={styles.loading} />;
  }

  if (!formulario) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No se encontraron detalles del formulario.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles del Formulario</Text>
      <ScrollView style={styles.container}>
        <View style={styles.section}>
            <Text style={styles.fieldTitle}>Supervisor:</Text>
            <Text style={styles.fieldValue}>{formulario.supervisor || 'N/A'}</Text>
        </View>
        <View style={styles.section}>
            <Text style={styles.fieldTitle}>Empresa:</Text>
            <Text style={styles.fieldValue}>{formulario.empresa || 'N/A'}</Text>
        </View>
        <View style={styles.section}>
            <Text style={styles.fieldTitle}>Gerencia:</Text>
            <Text style={styles.fieldValue}>{formulario.gerencia || 'N/A'}</Text>
        </View>
        <View style={styles.section}>
            <Text style={styles.fieldTitle}>Fecha:</Text>
            <Text style={styles.fieldValue}>{formulario.fecha || 'N/A'}</Text>
        </View>
        <View style={styles.section}>
            <Text style={styles.fieldTitle}>Hora inicio:</Text>
            <Text style={styles.fieldValue}>{formulario.horaInicio || 'N/A'}</Text>
        </View>
        <View style={styles.section}>
            <Text style={styles.fieldTitle}>Hora termino:</Text>
            <Text style={styles.fieldValue}>{formulario.horaTermino || 'N/A'}</Text>
        </View>
        <View style={styles.section}>
            <Text style={styles.fieldTitle}>Lugar:</Text>
            <Text style={styles.fieldValue}>{formulario.lugar || 'N/A'}</Text>
        </View>
        <View style={styles.section}>
            <Text style={styles.fieldTitle}>Trabajo:</Text>
            <Text style={styles.fieldValue}>{formulario.trabajo || 'N/A'}</Text>
        </View>
        <View style={styles.section}>
            <Text style={styles.fieldTitle}>¿El trabajo que asignaré cuenta con un estándar, procedimiento y/o instructivo?</Text>
            <Text style={styles.fieldValue}>
                {formulario.pregunta1 === true ? 'Sí' : formulario.pregunta1 === false ? 'No' : 'N/A'}
            </Text>
        </View>
        <View style={styles.section}>
            <Text style={styles.fieldTitle}>Nombre:</Text>
            <Text style={styles.fieldValue}>{formulario.nombre || 'N/A'}</Text>
        </View>
        <View style={styles.section}>
            <Text style={styles.fieldTitle}>¿El personal que asignaré para realizar el trabajo, cuenta con las capacitaciones, competencias, salud compatible y/o acreditaciones requeridas?</Text>
            <Text style={styles.fieldValue}>
                {formulario.pregunta2 === true ? 'Sí' : formulario.pregunta2 === false ? 'No' : 'N/A'}
            </Text>
        </View>
        <View style={styles.section}>
            <Text style={styles.fieldTitle}>¿Durante la planificación del trabajo, me aseguro de solicitar los permisos para ingresar a las áreas, intervenir equipos y/o interactuar con energías?</Text>
            <Text style={styles.fieldValue}>
                {formulario.pregunta3 === true ? 'Sí' : formulario.pregunta3 === false ? 'No' : 'N/A'}
            </Text>
        </View>
        <View style={styles.section}>
            <Text style={styles.fieldTitle}>¿Verifiqué que el personal cuenta con los elementos requeridos para realizar la segregación y señalización del área de trabajo, según diseño?</Text>
            <Text style={styles.fieldValue}>
                {formulario.pregunta4 === true ? 'Sí' : formulario.pregunta4 === false ? 'No' : 'N/A'}
            </Text>
        </View>
        <View style={styles.section}>
            <Text style={styles.fieldTitle}>¿El personal a mi cargo cuenta con sistema de comunicación de acuerdo al protocolo de emergencia del área?</Text>
            <Text style={styles.fieldValue}>
                {formulario.pregunta5 === true ? 'Sí' : formulario.pregunta5 === false ? 'No' : 'N/A'}
            </Text>
        </View>
        <View style={styles.section}>
            <Text style={styles.fieldTitle}>¿El personal que asignaré para realizar el trabajo, cuenta con los EPP definidos en el procedimiento de trabajo?</Text>
            <Text style={styles.fieldValue}>
                {formulario.pregunta6 === true ? 'Sí' : formulario.pregunta6 === false ? 'No' : 'N/A'}
            </Text>
        </View>
        {formulario.riesgosCriticos && formulario.riesgosCriticos.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.fieldTitle}>Riesgos Críticos:</Text>
            {formulario.riesgosCriticos.map((riesgo, index) => (
              <View key={index} style={styles.riesgoContainer}>
                <Text style={styles.fieldTitle}>Código:</Text>
                <Text style={styles.fieldValue}>{riesgo.codigo || 'N/A'}</Text>
                <Text style={styles.fieldTitle}>Nombre:</Text>
                <Text style={styles.fieldValue}>{riesgo.nombre || 'N/A'}</Text>

                {riesgo.numeros && riesgo.numeros.length > 0 ? (
                  <View>
                    <Text style={styles.fieldTitle}>Números:</Text>
                    {riesgo.numeros.map((numeros, numIndex) => (
                      <Text key={numIndex} style={styles.fieldValue}>
                        Respuesta: {numeros.respuesta || 'N/A'}
                      </Text>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.emptyText}>No hay números disponibles</Text>
                )}
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>No hay riesgos críticos disponibles</Text>
        )}
        {formulario.riesgos && formulario.riesgos.length > 0 ? (
        <View style={styles.section}>
            <Text style={styles.fieldTitle}>Riesgos:</Text>
            {formulario.riesgos.map((riesgo, index) => (
            <View key={index} style={styles.riesgoContainer}>
                
                <Text style={styles.fieldTitle}>Riesgo:</Text>
                <Text style={styles.fieldValue}>{riesgo.riesgo || 'N/A'}</Text>
                
                <Text style={styles.fieldTitle}>Medida de Control:</Text>
                <Text style={styles.fieldValue}>{riesgo.medidaControl || 'N/A'}</Text>
            </View>
            ))}
        </View>
        ) : (
        <Text style={styles.emptyText}>No hay riesgos disponibles</Text>
        )}
        <View style={styles.section}>
            <Text style={styles.fieldTitle}>¿Existen trabajos en simultáneo?</Text>
            <Text style={styles.fieldValue}>
                {formulario.trabajosSimultaneos === true ? 'Sí' : formulario.trabajosSimultaneos === false ? 'No' : 'N/A'}
            </Text>
        </View>
        <View style={styles.section}>
            <Text style={styles.fieldTitle}>Si su respuesta es SI, describa el contexto deltrabajo en simultáneo y verifique:</Text>
            <Text style={styles.fieldValue}>{formulario.contextoTrabajoSimultaneo || 'N/A'}</Text>
        </View>
        <View style={styles.section}>
            <Text style={styles.fieldTitle}>¿Se realizó la coordinación con el líder de la cuadrilla que realiza el trabajo en simultáneo?</Text>
            <Text style={styles.fieldValue}>
                {formulario.coordinacionLider === true ? 'Sí' : formulario.coordinacionLider === false ? 'No' : 'N/A'}
            </Text>
        </View>
        <View style={styles.section}>
            <Text style={styles.fieldTitle}>¿Se realizó la verificación cruzada de Controles Críticos?</Text>
            <Text style={styles.fieldValue}>
                {formulario.verificacionControles === true ? 'Sí' : formulario.verificacionControles === false ? 'No' : 'N/A'}
            </Text>
        </View>
        <View style={styles.section}>
            <Text style={styles.fieldTitle}>¿Se comunicó a todos los trabajadores las acciones de control que debe aplicar en trabajos simultáneos?</Text>
            <Text style={styles.fieldValue}>
                {formulario.comunicacionAcciones === true ? 'Sí' : formulario.comunicacionAcciones === false ? 'No' : 'N/A'}
            </Text>
        </View>
        <View style={styles.section}>
            <Text style={styles.fieldTitle}>Nombre:</Text>
            <Text style={styles.fieldValue}>{formulario.nombre || 'N/A'}</Text>
        </View>
        <View style={styles.section}>
            <Text style={styles.fieldTitle}>Cargo:</Text>
            <Text style={styles.fieldValue}>{formulario.paso5Cargo || 'N/A'}</Text>
        </View>
        <View style={styles.section}>
            <Text style={styles.fieldTitle}>¿Verifiqué las condiciones físicas y psicológicas de todo el Equipo Ejecutor del Trabajo?</Text>
            <Text style={styles.fieldValue}>
                {formulario.condicionesVerificadas === true ? 'Sí' : formulario.condicionesVerificadas === false ? 'No' : 'N/A'}
            </Text>
        </View>
      </ScrollView>

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
  section: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  fieldTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    color: '#333',
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
});

export default DetallesFormulario;
