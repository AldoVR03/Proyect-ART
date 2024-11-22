import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import FormScreen from '../screens/FormScreen'; 
import DetallesFormulario from '../screens/DetallesFormulario';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Inicio de sesión">
        <Stack.Screen name="Inicio de sesión" component={LoginScreen}/>
        <Stack.Screen name="ART" component={HomeScreen}/>
        <Stack.Screen name="DetallesFormulario" component={DetallesFormulario} />
        <Stack.Screen name="Nuevo Formulario" component={FormScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
