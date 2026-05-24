import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center bg-background px-6">
      {/* Typography utilities */}
      <Text className="h1 text-center">Lingua</Text>
      <Text className="h2 text-center">Learn a language</Text>

      {/* Color token examples — bg-*, text-*, border-* all work */}
      <Text className="body-md text-lingua-purple">text-lingua-purple</Text>
      <Text className="body-md text-success">text-success</Text>
      <Text className="body-md text-streak">text-streak</Text>
      <Text className="body-md text-text-secondary">text-text-secondary</Text>

      {/* Badge examples */}
      <View className="flex-row gap-2 mt-4">
        <View className="badge badge-success">
          <Text className="badge-label">XP</Text>
        </View>
        <View className="badge badge-streak">
          <Text className="badge-label">🔥 5</Text>
        </View>
        <View className="badge badge-error">
          <Text className="badge-label">Miss</Text>
        </View>
      </View>
    </View>
  );
}
