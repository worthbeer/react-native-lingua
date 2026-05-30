import { useAuth, useClerk } from "@clerk/expo";
import { Redirect } from "expo-router";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();
  const { signOut } = useClerk();

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6c4ef5" />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  // Authenticated home placeholder — will be replaced with full home in a future prompt
  return (
    <View className="flex-1 justify-center items-center bg-background px-6">
      <Text className="h1 text-center">Lingua</Text>
      <Text className="h2 text-center">Your language journey awaits</Text>
      <TouchableOpacity
        className="btn btn-primary mt-8 w-full"
        onPress={() => signOut()}
        activeOpacity={0.85}
      >
        <Text className="btn-label text-center">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
