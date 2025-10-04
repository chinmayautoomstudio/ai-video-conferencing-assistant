import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import FlashMessage from 'react-native-flash-message';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import JoinScreen from './src/screens/JoinScreen';
import MeetingScreen from './src/screens/MeetingScreen';
import ChatScreen from './src/screens/ChatScreen';
import ParticipantsScreen from './src/screens/ParticipantsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Theme
import { theme } from './src/theme/theme';

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <NavigationContainer>
            <StatusBar barStyle="light-content" backgroundColor="#1f2937" />
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{
                headerStyle: {
                  backgroundColor: '#1f2937',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            >
              <Stack.Screen 
                name="Home" 
                component={HomeScreen}
                options={{ title: 'Video Conference' }}
              />
              <Stack.Screen 
                name="Join" 
                component={JoinScreen}
                options={{ title: 'Join Meeting' }}
              />
              <Stack.Screen 
                name="Meeting" 
                component={MeetingScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="Chat" 
                component={ChatScreen}
                options={{ title: 'Chat' }}
              />
              <Stack.Screen 
                name="Participants" 
                component={ParticipantsScreen}
                options={{ title: 'Participants' }}
              />
              <Stack.Screen 
                name="Settings" 
                component={SettingsScreen}
                options={{ title: 'Settings' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
          <FlashMessage position="top" />
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
