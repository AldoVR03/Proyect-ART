import React from 'react';
import { View, StyleSheet } from 'react-native';
import WorkFrom from '../components/WorkFrom';

const FormScreen = () => {
  return (
    <View style={styles.container}>
      <WorkFrom />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
});

export default FormScreen;
