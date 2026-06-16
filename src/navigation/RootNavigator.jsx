import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../hooks/useAuth";
import { colors } from "../theme/colors";

import TelaBemvindo from "../pages/TelaBemvindo";
import TelaAutenticacao from "../pages/TelaAutenticacao";
import Wizard from "../pages/Wizard";
import TelaHome from "../pages/TelaHome";
import TelaDashboard from "../pages/TelaDashboard";
import TelaTreino from "../pages/TelaTreino";
import TelaTreinos from "../pages/TelaTreinos";
import TelaListaTreinos from "../pages/TelaListaTreinos";
import TelaExercicio from "../pages/TelaExercicio";
import CriarSerie from "../pages/CriarSerie";
import TelaPerfil from "../pages/TelaPerfil";

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();
const TreinoStack = createNativeStackNavigator();

function TreinoStackNavigator() {
  return (
    <TreinoStack.Navigator
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    >
      <TreinoStack.Screen name="TreinoHub" component={TelaTreino} />
      <TreinoStack.Screen name="TreinosList" component={TelaTreinos} />
      <TreinoStack.Screen name="SeriesDetail" component={TelaListaTreinos} />
      <TreinoStack.Screen name="Consultar" component={TelaExercicio} />
      <TreinoStack.Screen name="CriarSerie" component={CriarSerie} />
    </TreinoStack.Navigator>
  );
}

function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      screenOptions={{
        swipeEnabled: true,
        tabBarStyle: [
          styles.tabBar, 
          { 
            paddingBottom: 8 + insets.bottom,
            minHeight: 65 + insets.bottom 
          }
        ],
        tabBarActiveTintColor: colors.amarelo,
        tabBarInactiveTintColor: colors.textoSuave,
        tabBarLabelStyle: styles.tabLabel,
        tabBarShowIcon: true,
        tabBarIndicatorStyle: { backgroundColor: "transparent" },
        tabBarIconStyle: {
          width: 24,
          height: 24,
          justifyContent: "center",
          alignItems: "center",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={TelaHome}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Treino"
        component={TreinoStackNavigator}
        options={{
          tabBarLabel: "Treinos",
          tabBarIcon: ({ color }) => (
            <Ionicons name="barbell" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Dashboard"
        component={TelaDashboard}
        options={{
          tabBarLabel: "Dashboard",
          tabBarIcon: ({ color }) => (
            <Ionicons name="stats-chart" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={TelaPerfil}
        options={{
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={22} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: "fade" }}>
      <Stack.Screen name="Bemvindo" component={TelaBemvindo} />
      <Stack.Screen name="Auth" component={TelaAutenticacao} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { carregando, estaAutenticado, completouWizard } = useAuth();

  if (carregando) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.amarelo} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!estaAutenticado ? (
          <Stack.Screen name="AuthFlow" component={AuthStack} />
        ) : !completouWizard ? (
          <Stack.Screen name="Wizard" component={Wizard} />
        ) : (
          <Stack.Screen name="Main" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: "center",
    alignItems: "center",
  },
  tabBar: {
    backgroundColor: colors.card,
    borderTopColor: colors.borda,
    borderTopWidth: 1,
    minHeight: 65,
    paddingTop: 8,
    paddingBottom: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
});

export default RootNavigator;
