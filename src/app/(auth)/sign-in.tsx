import { useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { isClerkAPIResponseError, useSSO } from "@clerk/expo";
import { useSignIn } from "@clerk/expo/legacy";
import { colors, fontSize, lineHeight } from "@/theme";
import { images } from "@/constants/images";
import SocialButton from "@/components/social-button";
import VerificationModal from "@/components/verification-modal";

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const { startSSOFlow } = useSSO();
  const [email, setEmail] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  // stored so prepareFirstFactor can be called again on resend
  const emailAddressIdRef = useRef<string | null>(null);

  const handleOAuth = async (strategy: "oauth_google" | "oauth_apple" | "oauth_facebook") => {
    setError(undefined);
    try {
      const { createdSessionId, setActive: ssoSetActive } = await startSSOFlow({
        strategy,
        redirectUrl: Linking.createURL("/"),
      });
      if (createdSessionId && ssoSetActive) {
        await ssoSetActive({ session: createdSessionId });
        router.replace("/");
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setError(err.errors[0]?.longMessage ?? err.errors[0]?.message ?? "OAuth sign-in failed.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(JSON.stringify(err));
      }
    }
  };

  const handleSignIn = async () => {
    if (!isLoaded) return;
    setError(undefined);
    setIsLoading(true);
    try {
      const { supportedFirstFactors } = await signIn.create({ identifier: email });
      const emailFactor = supportedFirstFactors?.find((f) => f.strategy === "email_code");
      if (!emailFactor || !("emailAddressId" in emailFactor)) {
        setError("Email code sign-in is not enabled for this account.");
        return;
      }
      const emailAddressId = emailFactor.emailAddressId as string;
      emailAddressIdRef.current = emailAddressId;
      await signIn.prepareFirstFactor({ strategy: "email_code", emailAddressId });
      setModalVisible(true);
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setError(err.errors[0]?.longMessage ?? err.errors[0]?.message ?? "Sign in failed.");
      } else {
        setError("Something went wrong. Check your connection and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (code: string) => {
    if (!isLoaded) return;
    setError(undefined);
    try {
      const result = await signIn.attemptFirstFactor({ strategy: "email_code", code });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/");
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setError(err.errors[0]?.longMessage ?? err.errors[0]?.message ?? "Invalid code.");
      } else {
        setError("Verification failed. Please try again.");
      }
    }
  };

  const handleResend = async () => {
    if (!isLoaded || !emailAddressIdRef.current) return;
    setError(undefined);
    try {
      await signIn.prepareFirstFactor({
        strategy: "email_code",
        emailAddressId: emailAddressIdRef.current,
      });
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setError(err.errors[0]?.message ?? "Could not resend code.");
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to continue your journey ✨</Text>

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

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          className="btn btn-primary mt-6"
          onPress={handleSignIn}
          activeOpacity={0.85}
          disabled={isLoading || !email}
          style={isLoading || !email ? { opacity: 0.5 } : undefined}
        >
          <Text className="btn-label">{isLoading ? "Sending code…" : "Sign In"}</Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        <SocialButton label="Continue with Google" iconLetter="G" iconBg="#ffffff" iconColor="#4285F4" onPress={() => handleOAuth("oauth_google")} />
        <SocialButton label="Continue with Facebook" iconLetter="f" iconBg="#1877F2" iconColor="#ffffff" onPress={() => handleOAuth("oauth_facebook")} />
        <SocialButton label="Continue with Apple" iconLetter="" iconBg="#000000" iconColor="#ffffff" onPress={() => handleOAuth("oauth_apple")} />

        <View style={styles.signUpRow}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.replace("/sign-up")}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>

      <VerificationModal
        visible={modalVisible}
        email={email}
        onClose={() => setModalVisible(false)}
        onVerify={handleVerify}
        onResend={handleResend}
        error={error}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  flex: {
    flex: 1,
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
  errorText: {
    fontSize: fontSize.bodySmall,
    fontFamily: "Poppins-Regular",
    color: colors.error,
    marginTop: 8,
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
  signUpRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  signUpText: {
    fontSize: fontSize.bodyMedium,
    fontFamily: "Poppins-Regular",
    color: "#6b7280",
  },
  signUpLink: {
    fontSize: fontSize.bodyMedium,
    fontFamily: "Poppins-SemiBold",
    color: colors.linguaPurple,
  },
});
