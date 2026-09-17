import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '@/lib/store';
import { Colors } from '@/lib/theme';

import LoginScreen from '@/screens/LoginScreen';
import DashboardScreen from '@/screens/DashboardScreen';
import CaseListScreen from '@/screens/CaseListScreen';
import CaseDetailScreen from '@/screens/CaseDetailScreen';
import CreateCaseScreen from '@/screens/CreateCaseScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const DashboardStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="DashboardHome" component={DashboardScreen} options={{ title: 'Beranda' }} />
  </Stack.Navigator>
);

const CaseStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="CaseList" component={CaseListScreen} options={{ title: 'Permohonan' }} />
    <Stack.Screen name="CaseDetail" component={CaseDetailScreen} options={{ title: 'Detail Permohonan' }} />
    <Stack.Screen name="CreateCase" component={CreateCaseScreen} options={{ title: 'Buat Permohonan Baru' }} />
  </Stack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let icon = '📄';
        if (route.name === 'Beranda') icon = '🏠';
        else if (route.name === 'Permohonan') icon = '📁';
        else if (route.name === 'Tugas') icon = '✅';
        else if (route.name === 'Notifikasi') icon = '🔔';
        else if (route.name === 'Profil') icon = '👤';
        return <Text style={{ fontSize: size - 4, color }}>{icon}</Text>;
      },
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: Colors.textSecondary,
      headerShown: false,
    })}
  >
    <Tab.Screen name="Beranda" component={DashboardStack} />
    <Tab.Screen name="Permohonan" component={CaseStack} />
    <Tab.Screen name="Tugas" component={PlaceholderScreen} />
    <Tab.Screen name="Notifikasi" component={PlaceholderScreen} />
    <Tab.Screen name="Profil" component={PlaceholderScreen} />
  </Tab.Navigator>
);

const PlaceholderScreen = () => (
  <View style={styles.center}><Text>Dalam Pengembangan</Text></View>
);

export default function App() {
  const { user, isInitialized, initialize } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      await initialize();
      setLoading(false);
    };
    initApp();
  }, [initialize]);

  if (loading || !isInitialized) {
    return (
      <View style={styles.splashContainer}>
        <Text style={styles.splashTitle}>HARM</Text>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="MainTabs" component={MainTabs} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  splashTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
