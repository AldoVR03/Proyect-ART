import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, FlatList, KeyboardAvoidingView, TouchableOpacity, ScrollView, Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firestore } from '../config/firebase-config';
import { collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';

const WorkForm = () => {
  // Paso 1
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const [supervisor, setSupervisor] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [gerencia, setGerencia] = useState('');
  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaTermino, setHoraTermino] = useState('');
  const [lugar, setLugar] = useState('');
  const [trabajo, setTrabajo] = useState('');
  // Paso 2
  const [pregunta1, setPregunta1] = useState(false)
  const [nombreProcedimiento, setNombreProcedimiento] = useState('');
  const [pregunta2, setPregunta2] = useState(false);
  const [pregunta3, setPregunta3] = useState(false);
  const [pregunta4, setPregunta4] = useState(false);
  const [pregunta5, setPregunta5] = useState(false);
  const [pregunta6, setPregunta6] = useState(false);
  // Paso 3
  const [riesgosCriticos, setRiesgosCriticos] = useState([{ 
    nombre: '', codigo: '', numero:'', numeros:  [{ respuesta: '' }] }
  ]);
  const agregarRiesgoCritico = () => {
    setRiesgosCriticos([...riesgosCriticos, { nombre: '', codigo: '', numero:'', numeros: [{ respuesta: '' }] }]);
  };
  const agregarNumero = (indice) => {
    const nuevosRiesgos = riesgosCriticos.map((riesgo, i) =>
      i === indice
        ? { ...riesgo, numeros: [...riesgo.numeros, { respuesta: '' }] }
        : riesgo
    );

    setRiesgosCriticos(nuevosRiesgos);
  };
  
  const actualizarNombreOCodigo = (indice, campo, valor) => {
    const nuevosRiesgos = riesgosCriticos.map((riesgo, i) =>
      i === indice ? { ...riesgo, [campo]: valor } : riesgo
    );
    setRiesgosCriticos(nuevosRiesgos);
  };

  const actualizarRespuesta = (indiceRiesgo, indiceNumero, respuesta) => {
    const nuevosRiesgos = riesgosCriticos.map((riesgo, i) =>
      i === indiceRiesgo
        ? {
            ...riesgo,
            numeros: riesgo.numeros.map((num, j) =>
              j === indiceNumero ? { ...num, respuesta } : num
            ),
          }
        : riesgo
    );
    setRiesgosCriticos(nuevosRiesgos);
  };

  // Paso 4
  const [riesgos, setRiesgos] = useState([{ id: Date.now(), riesgo: '', medidaControl: '' }]);
  // Paso 5
  const [trabajosSimultaneos, setTrabajosSimultaneos] = useState(false);
  const [contextoTrabajoSimultaneo, setContextoTrabajoSimultaneo] = useState('');
  const [coordinacionLider, setCoordinacionLider] = useState(false);
  const [verificacionControles, setVerificacionControles] = useState(false);
  const [comunicacionAcciones, setComunicacionAcciones] = useState(false);
  // Paso 6
  const [nombre, setnombre]=useState(''); 
  const [paso5Cargo, setpaso5Cargo] = useState('');
  const [condicionesVerificadas, setCondicionesVerificadas] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  const handleNextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    try {
      const fileName = `${Date.now()}.jpg`;
      const imageUrl = await uploadImageToFirebase(imageUri, fileName);
      const data = {
        supervisor,
        empresa,
        gerencia,
        fecha,
        horaInicio,
        horaTermino,
        lugar,
        trabajo,
        pregunta1,
        nombreProcedimiento,
        pregunta2,
        pregunta3,
        pregunta4,
        pregunta5,
        pregunta6,
        riesgosCriticos,
        riesgos,
        trabajosSimultaneos,
        contextoTrabajoSimultaneo,
        coordinacionLider,
        verificacionControles,
        comunicacionAcciones,
        nombre,
        paso5Cargo,
        condicionesVerificadas,
        imageUrl, // URL de la imagen subida
      };
  
      // Guardar los datos del formulario en Firestore
      await addDoc(collection(firestore, 'formularios'), data);
      console.log('Datos enviados correctamente');
  
      // Navegar a la pantalla "ART"
      navigation.navigate('ART');
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    }
  };
//---------------------------------------------------------------------
const uploadImageToFirebase = async (imageUri, fileName) => {
  try {
    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB max size

    // Obtener la imagen desde la URI usando fetch y convertirla en un blob
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // Verificar el tamaño del archivo
    if (blob.size > MAX_SIZE) {
      console.error('El archivo es demasiado grande');
      throw new Error('El archivo es demasiado grande');
    }

    // Usar solo el nombre del archivo (por ejemplo, puedes usar un timestamp para asegurarte de que sea único)
    const fileName = `image_${Date.now()}.png`; // O usa cualquier nombre único que prefieras

    // Crear una referencia en Firebase Storage
    const storage = getStorage();
    const storageRef = ref(storage, 'images/' + fileName);

    // Subir el blob a Firebase Storage
    await uploadBytes(storageRef, blob);

    // Obtener la URL de descarga del archivo subido
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
    } catch (error) {
    console.error('Error al subir la imagen:', error.message);
    throw new Error('Error al subir la imagen');
    }
  };


const handleImagePicker = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled) {
    setImageUri(result.assets[0].uri); // Guardar la URI de la imagen seleccionada
  }
};

//--------------------------------------------------------------------
  const addRiesgo = () => {
    setRiesgos([...riesgos, { id: Date.now(), riesgo: '', medidaControl: '' }]);
  };

  const handleRiesgoChange = (text, id) => {
    setRiesgos(riesgos.map(r => (r.id === id ? { ...r, riesgo: text } : r)));
  };

  const handleMedidaControlChange = (text, id) => {
    setRiesgos(riesgos.map(r => (r.id === id ? { ...r, medidaControl: text } : r)));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.container}>
            <Text style={styles.title}>PASO 1: PLANIFICACIÓN DEL TRABAJO A REALIZAR</Text>

            <ScrollView style={styles.scrollContainer}>
              <View style={styles.formContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Supervisor que asigna el trabajo"
                  value={supervisor}
                  onChangeText={setSupervisor}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Empresa"
                  value={empresa}
                  onChangeText={setEmpresa}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Gerencia"
                  value={gerencia}
                  onChangeText={setGerencia}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Fecha"
                  value={fecha}
                  onChangeText={setFecha}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Hora Inicio"
                  value={horaInicio}
                  onChangeText={setHoraInicio}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Hora Término"
                  value={horaTermino}
                  onChangeText={setHoraTermino}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Lugar específico"
                  value={lugar}
                  onChangeText={setLugar}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Trabajo a realizar"
                  value={trabajo}
                  onChangeText={setTrabajo}
                />
              </View>
            </ScrollView>
            
            <View style={styles.buttonsContainer}>
              <TouchableOpacity 
                style={styles.button} 
                onPress={handleNextStep}>
                <Text style={styles.buttonText}>Siguiente</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.button} 
                onPress={() => navigation.navigate('ART')}>
                <Text style={styles.buttonText}>Volver</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.container}>
            <Text style={styles.title}>PASO 2: RIESGOS Y CONTROLES CRÍTICOS</Text>
        
            <ScrollView style={styles.scrollContainer}>
              <Text>¿El trabajo que asignaré cuenta con un estándar, procedimiento y/o instructivo?</Text>
              <Button title={pregunta1 ? 'Sí' : 'No'} onPress={() => setPregunta1(!pregunta1)} />
              <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={nombreProcedimiento}
                onChangeText={setNombreProcedimiento}/>
        
              <Text>¿El personal que asignaré para realizar el trabajo, cuenta con las capacitaciones, competencias, salud compatible y/o acreditaciones requeridas?</Text>
              <Button title={pregunta2 ? 'Sí' : 'No'} onPress={() => setPregunta2(!pregunta2)} />
        
              <Text>¿Durante la planificación del trabajo, me aseguro de solicitar los permisos para ingresar a las áreas, intervenir equipos y/o interactuar con energías?</Text>
              <Button title={pregunta3 ? 'Sí' : 'No'} onPress={() => setPregunta3(!pregunta3)} />
        
              <Text>¿Verifiqué que el personal cuenta con los elementos requeridos para realizar la segregación y señalización del área de trabajo, según diseño?</Text>
              <Button title={pregunta4 ? 'Sí' : 'No'} onPress={() => setPregunta4(!pregunta4)} />
        
              <Text>¿El personal a mi cargo cuenta con sistema de comunicación de acuerdo al protocolo de emergencia del área?</Text>
              <Button title={pregunta5 ? 'Sí' : 'No'} onPress={() => setPregunta5(!pregunta5)} />
        
              <Text>¿El personal que asignaré para realizar el trabajo, cuenta con los EPP definidos en el procedimiento de trabajo?</Text>
              <Button title={pregunta6 ? 'Sí' : 'No'} onPress={() => setPregunta6(!pregunta6)} />
            </ScrollView>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.button} onPress={handleNextStep}>
                <Text style={styles.buttonText}>Siguiente</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handlePreviousStep}>
                <Text style={styles.buttonText}>Volver</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.container}>
            <Text style={styles.title}>PASO 2: RIESGOS CRÍTICOS ESPECÍFICOS DEL TRABAJO</Text>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              
              {riesgosCriticos.map((riesgo, indiceRiesgo) => (
                <View key={indiceRiesgo} style={styles.section}>
                  <Text style={styles.label}>Nombre:</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Escribe el nombre aquí"
                    value={riesgo.nombre}
                    onChangeText={(valor) => actualizarNombreOCodigo(indiceRiesgo, 'nombre', valor)}
                  />
                  <Text style={styles.label}>Cód:</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Escribe el código aquí"
                    value={riesgo.codigo}
                    onChangeText={(valor) => actualizarNombreOCodigo(indiceRiesgo, 'codigo', valor)}
                  />
                  {riesgo.numeros.map((numero, indiceNumero) => (
                    <View style={styles.row} key={indiceNumero}>
                      <TextInput style={styles.numberInput} placeholder="N°" />
                      <TouchableOpacity
                        style={[
                          styles.optionButton,
                          numero.respuesta === 'Sí' && styles.selectedOption,
                        ]}
                        onPress={() => actualizarRespuesta(indiceRiesgo, indiceNumero, 'Sí')}
                      >
                        <Text style={styles.optionText}>Sí</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.optionButton,
                          numero.respuesta === 'No' && styles.selectedOption,
                        ]}
                        onPress={() => actualizarRespuesta(indiceRiesgo, indiceNumero, 'No')}
                      >
                        <Text style={styles.optionText}>No</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.optionButton,
                          numero.respuesta === 'No aplica' && styles.selectedOption,
                        ]}
                        onPress={() => actualizarRespuesta(indiceRiesgo, indiceNumero, 'No aplica')}
                      >
                        <Text style={styles.optionText}>No aplica</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                  <TouchableOpacity
                    style={styles.addNumberButton}
                    onPress={() => agregarNumero(indiceRiesgo)}
                  >
                    <Text style={styles.addNumberButtonText}>Añadir Número</Text>
                  </TouchableOpacity>
                </View>
              ))}
        
              <TouchableOpacity style={styles.addButton} onPress={agregarRiesgoCritico}>
                <Text style={styles.addButtonText}>Añadir Riesgo Crítico</Text>
              </TouchableOpacity>
            </ScrollView>
        
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleNextStep}>
                <Text style={styles.buttonText}>Siguiente</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handlePreviousStep}>
                <Text style={styles.buttonText}>Volver</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 4:
        return (
          <View style={styles.container}>
            <Text style={styles.title}>PASO 3: OTROS RIESGOS</Text>
      
            <FlatList
              data={riesgos}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.riesgoContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Riesgo"
                    value={item.riesgo}
                    onChangeText={(text) => handleRiesgoChange(text, item.id)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Medida de Control"
                    value={item.medidaControl}
                    onChangeText={(text) => handleMedidaControlChange(text, item.id)}
                  />
                </View>
              )}
            />

            <TouchableOpacity style={styles.button} onPress={addRiesgo}>
              <Text style={styles.buttonText}>Agregar Riesgo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleNextStep}>
              <Text style={styles.buttonText}>Siguiente</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handlePreviousStep}>
              <Text style={styles.buttonText}>Volver</Text>
            </TouchableOpacity>
          </View>
        );   
      case 5:
        return (
          <View style={styles.container}>
            <Text style={styles.title}>PASO 4: TRABAJOS EN SIMULTÁNEO</Text>
        
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <Text>¿Existen trabajos en simultáneo?</Text>
              <Button
                title={trabajosSimultaneos ? 'Sí' : 'No'}
                onPress={() => {
                  setTrabajosSimultaneos(!trabajosSimultaneos);
                  if (!trabajosSimultaneos) {
                    setContextoTrabajoSimultaneo('');
                    setCoordinacionLider(false);
                    setVerificacionControles(false);
                    setComunicacionAcciones(false);
                  }
                }}
              />
              {trabajosSimultaneos && (
                <View>
                  <TextInput
                    style={styles.input}
                    placeholder="Describa el contexto del trabajo en simultáneo"
                    value={contextoTrabajoSimultaneo}
                    onChangeText={setContextoTrabajoSimultaneo}
                  />
                  <Text>¿Se realizó la coordinación con el líder de la cuadrilla que realiza el trabajo en simultáneo?</Text>
                  <Button
                    title={coordinacionLider ? 'Sí' : 'No'}
                    onPress={() => setCoordinacionLider(!coordinacionLider)}
                  />
                  <Text>¿Se realizó la verificación cruzada de Controles Críticos?</Text>
                  <Button
                    title={verificacionControles ? 'Sí' : 'No'}
                    onPress={() => setVerificacionControles(!verificacionControles)}
                  />
                  <Text>¿Se comunicó a todos los trabajadores las acciones de control que deben aplicar en trabajos simultáneos?</Text>
                  <Button
                    title={comunicacionAcciones ? 'Sí' : 'No'}
                    onPress={() => setComunicacionAcciones(!comunicacionAcciones)}
                  />
                </View>
              )}
            </ScrollView>
        
            <TouchableOpacity style={styles.button} onPress={handleNextStep}>
              <Text style={styles.buttonText}>Siguiente</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handlePreviousStep}>
              <Text style={styles.buttonText}>Volver</Text>
            </TouchableOpacity>
          </View>
        );      
      case 6:
        return (
          <View style={styles.container}>
            <Text style={styles.title}>PASO 5: CONDICIONES FÍSICAS Y PSICOLÓGICAS</Text>
        
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <TextInput
                style={styles.input}
                placeholder="nombre"
                value={nombre}
                onChangeText={setnombre}
              />
              <TextInput
                style={styles.input}
                placeholder="Cargo"
                value={paso5Cargo}
                onChangeText={setpaso5Cargo}
              />
              
              <Text>¿Condiciones físicas y psicológicas verificadas?</Text>
              <Button title={condicionesVerificadas ? 'Sí' : 'No'} onPress={() => setCondicionesVerificadas(!condicionesVerificadas)} />

            </ScrollView>
        
            <Button title="Seleccionar Imagen" onPress={handleImagePicker} />
            {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200, }} />}
            
            <TouchableOpacity style={styles.button} onPress={handleFinish}>
              <Text style={styles.buttonText}>Terminar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handlePreviousStep}>
              <Text style={styles.buttonText}>Volver</Text>
            </TouchableOpacity>
          </View>
        );
        
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      {renderStepContent()}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    scrollContainer: {
      flexGrow: 1, 
      padding: 16, 
      backgroundColor: '#fff', 
      minHeight: '100%',
      width: '110%',
    },
  },
  
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: -45
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },

  riesgoContainer: {
    marginBottom: 15,
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  nameInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 16,
  },
  codeInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  numberInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    width: 40,
    marginRight: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginHorizontal: 4,
  },
  optionText: {
    fontSize: 14,
  },
   addNumberButtonText: {
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold', 
  },
  addButton: {
    backgroundColor: '#a63a15', 
    borderColor: '#fff', 
    borderWidth: 2, 
    borderRadius: 10, 
    padding: 10, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginVertical: 10, 
    width: '80%', 
    alignSelf: 'center', 
  },
  addButtonText: {
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold', 
  },
  addNumberButton: {
    backgroundColor: '#a63a15', 
    borderColor: '#fff', 
    borderWidth: 1,
    borderRadius: 10, 
    padding: 10, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginVertical: 10, 
    width: '80%', 
    alignSelf: 'center', 
  },
  addNumberButtonText: {
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold',
  },
});

export default WorkForm;
