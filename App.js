import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { AuthProvider } from "./src/contexts/AuthContext";
import { ExerciciosProvider } from "./src/contexts/ExerciciosContext";
import { CriacaoSerieProvider } from "./src/contexts/SeriesContext";
import { StatusTreinoProvider } from "./src/contexts/StatusTreinoContext";
import { ErrorProvider, ErrorContext } from "./src/contexts/ErrorContext";
import { registerErrorHandler } from "./src/utils/showError";
import ErrorBanner from "./src/components/ErrorBanner";
import RootNavigator from "./src/navigation/RootNavigator";
import { colors } from "./src/theme/colors";

function ErrorBridge({ children }) {
  const { showError } = React.useContext(ErrorContext);
  useEffect(() => {
    registerErrorHandler(showError);
  }, [showError]);
  return children;
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <ErrorProvider>
          <AuthProvider>
            <ExerciciosProvider>
              <CriacaoSerieProvider>
                <StatusTreinoProvider>
                  <ErrorBridge>
                    <StatusBar style="light" />
                    <ErrorBanner />
                    <RootNavigator />
                  </ErrorBridge>
                </StatusTreinoProvider>
              </CriacaoSerieProvider>
            </ExerciciosProvider>
          </AuthProvider>
        </ErrorProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
