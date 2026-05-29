import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { images } from "@/constants/images";

const { width } = Dimensions.get("window");

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View className="flex-1 px-6">
        {/* Logo header */}
        <View className="flex-row items-center justify-center mt-4">
          <Image source={images.mascotLogo} style={styles.logoImage} />
          <Text style={styles.logoText}>muolingo</Text>
        </View>

        {/* Headline */}
        <View className="mt-10">
          <Text style={styles.headline}>Your AI language</Text>
          <Text style={styles.headlinePurple}>teacher.</Text>
          <Text style={styles.subtitle}>
            Real conversations, personalized{"\n"}lessons, anytime, anywhere.
          </Text>
        </View>

        {/* Mascot illustration with speech bubbles */}
        <View style={styles.illustrationContainer}>
          {/* Hello! bubble — lower left */}
          <View style={[styles.bubble, styles.helloBubble]}>
            <Text style={styles.bubbleText}>Hello!</Text>
          </View>

          {/* ¡Hola! bubble — upper right */}
          <View style={[styles.bubble, styles.holaBubble]}>
            <Text style={styles.bubbleText}>¡Hola!</Text>
          </View>

          {/* 你好! bubble — mid right */}
          <View style={[styles.bubble, styles.nihaoBubble]}>
            <Text style={[styles.bubbleText, styles.bubbleTextRed]}>你好!</Text>
          </View>

          <Image source={images.mascotWelcome} style={styles.mascotImage} resizeMode="contain" />
        </View>

        {/* Get Started button */}
        <TouchableOpacity
          className="btn btn-primary flex-row mb-10"
          onPress={() => router.push("/sign-up")}
          activeOpacity={0.85}
        >
          <Text className="btn-label flex-1 text-center">Get Started</Text>
          <Text className="btn-label">›</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  logoImage: {
    width: 38,
    height: 38,
  },
  logoText: {
    fontSize: 20,
    fontFamily: "Poppins-SemiBold",
    color: "#001132",
    marginLeft: 8,
  },
  headline: {
    fontSize: 32,
    fontFamily: "Poppins-Bold",
    color: "#001132",
    lineHeight: 40,
  },
  headlinePurple: {
    fontSize: 32,
    fontFamily: "Poppins-Bold",
    color: "#6c4ef5",
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#6b7280",
    lineHeight: 22,
    marginTop: 8,
  },
  illustrationContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  mascotImage: {
    width: width * 0.72,
    height: width * 0.72,
  },
  bubble: {
    position: "absolute",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    zIndex: 10,
  },
  helloBubble: {
    left: 4,
    bottom: 60,
  },
  holaBubble: {
    right: 4,
    top: 24,
  },
  nihaoBubble: {
    right: 4,
    top: "48%",
  },
  bubbleText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#001132",
  },
  bubbleTextRed: {
    color: "#FF4D4F",
  },
});
