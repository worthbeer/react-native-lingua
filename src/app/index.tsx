import { Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center bg-background px-6">
      <Text className="h1 text-center">Lingua</Text>
      <Text className="h2 text-center">Learn a language</Text>

      <TouchableOpacity
        className="btn btn-primary mt-8 w-full"
        onPress={() => router.push("/onboarding")}
        activeOpacity={0.85}
      >
        <Text className="btn-label text-center">Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}
