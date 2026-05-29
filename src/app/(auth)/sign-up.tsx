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
import { colors, fontSize, lineHeight } from "@/theme";
import { images } from "@/constants/images";
import SocialButton from "@/components/social-button";
import VerificationModal from "@/components/verification-modal";

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>Start your language journey today ✨</Text>

        <View style={styles.mascotContainer}>
          <Image
            source={images.mascotAuth}
            style={styles.mascotImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="alex@gmail.com"
            placeholderTextColor={colors.textPlaceholder}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={[styles.inputContainer, styles.inputSpacing]}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={colors.textPlaceholder}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword((v) => !v)}
              style={styles.eyeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.eyeIcon}>{showPassword ? "🙈" : "👁"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          className="btn btn-primary mt-6"
          onPress={() => setModalVisible(true)}
          activeOpacity={0.85}
        >
          <Text className="btn-label">Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        <SocialButton label="Continue with Google" iconLetter="G" iconBg="#ffffff" iconColor="#4285F4" />
        <SocialButton label="Continue with Facebook" iconLetter="f" iconBg="#1877F2" iconColor="#ffffff" />
        <SocialButton label="Continue with Apple" iconLetter="" iconBg="#000000" iconColor="#ffffff" />

        <View style={styles.signInRow}>
          <Text style={styles.signInText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/sign-in")}>
            <Text style={styles.signInLink}>Log in</Text>
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
    fontSize: fontSize.h2,
    fontFamily: "Poppins-Bold",
    color: "#001132",
    lineHeight: lineHeight.h2,
  },
  subtitle: {
    fontSize: fontSize.bodyMedium,
    fontFamily: "Poppins-Regular",
    color: "#6b7280",
    lineHeight: lineHeight.bodyMedium,
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
  inputSpacing: {
    marginTop: 12,
  },
  inputLabel: {
    fontSize: fontSize.caption,
    fontFamily: "Poppins-Medium",
    color: "#6b7280",
    marginBottom: 2,
  },
  input: {
    fontSize: fontSize.bodyLarge,
    fontFamily: "Poppins-Regular",
    color: "#001132",
    padding: 0,
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    fontSize: fontSize.bodyLarge,
    fontFamily: "Poppins-Regular",
    color: "#001132",
    padding: 0,
  },
  eyeButton: {
    paddingLeft: 8,
  },
  eyeIcon: {
    fontSize: 16,
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
    fontSize: fontSize.bodySmall,
    fontFamily: "Poppins-Regular",
    color: "#6b7280",
    marginHorizontal: 12,
  },
  signInRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  signInText: {
    fontSize: fontSize.bodyMedium,
    fontFamily: "Poppins-Regular",
    color: "#6b7280",
  },
  signInLink: {
    fontSize: fontSize.bodyMedium,
    fontFamily: "Poppins-SemiBold",
    color: "#6c4ef5",
  },
});
