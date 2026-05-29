import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { images } from "@/constants/images";
import SocialButton from "@/components/social-button";
import VerificationModal from "@/components/verification-modal";

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>

        {/* Header */}
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to continue your journey ✨</Text>

        {/* Mascot */}
        <View style={styles.mascotContainer}>
          <Image
            source={images.mascotAuth}
            style={styles.mascotImage}
            resizeMode="contain"
          />
        </View>

        {/* Email */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="alex@gmail.com"
            placeholderTextColor="#9ca3af"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Sign In */}
        <TouchableOpacity
          className="btn btn-primary mt-6"
          onPress={() => setModalVisible(true)}
          activeOpacity={0.85}
        >
          <Text className="btn-label">Sign In</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social */}
        <SocialButton label="Continue with Google" iconLetter="G" iconBg="#ffffff" iconColor="#4285F4" />
        <SocialButton label="Continue with Facebook" iconLetter="f" iconBg="#1877F2" iconColor="#ffffff" />
        <SocialButton label="Continue with Apple" iconLetter="" iconBg="#000000" iconColor="#ffffff" />

        {/* Sign up link */}
        <View style={styles.signUpRow}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.replace("/sign-up")}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <VerificationModal
        visible={modalVisible}
        email={email}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  backButton: {
    marginTop: 4,
    marginBottom: 20,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    fontSize: 28,
    color: "#001132",
    fontFamily: "Poppins-Regular",
    lineHeight: 34,
  },
  title: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    color: "#001132",
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#6b7280",
    lineHeight: 22,
    marginTop: 6,
  },
  mascotContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  mascotImage: {
    width: 140,
    height: 140,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: "#ffffff",
  },
  inputLabel: {
    fontSize: 11,
    fontFamily: "Poppins-Medium",
    color: "#6b7280",
    marginBottom: 2,
  },
  input: {
    fontSize: 15,
    fontFamily: "Poppins-Regular",
    color: "#001132",
    padding: 0,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e7eb",
  },
  dividerText: {
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    color: "#6b7280",
    marginHorizontal: 12,
  },
  signUpRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  signUpText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#6b7280",
  },
  signUpLink: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: "#6c4ef5",
  },
});
