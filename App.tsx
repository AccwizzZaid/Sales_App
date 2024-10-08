import React from 'react';
import Login from './src/Screens/Login';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/Screens/Home';
import Preview from './src/Components/Preview';
import 'react-native-get-random-values';
import Toast from 'react-native-toast-message'; // Import Toast

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Preview" component={Preview} />
      </Stack.Navigator>
      
      {/* Include Toast Component at the root */}
      <Toast ref  = {(ref) => Toast.setRef(ref) } style={{ zIndex: 9999 }} />
    </NavigationContainer>
  );
};

export default App;
