import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { fontSize, lineHeight } from "@/theme";

type Props = {
  visible: boolean;
  email: string;
  onClose: () => void;
};

export default function VerificationModal({ visible, email, onClose }: Props) {
  const [code, setCode] = useState("");
  const inputRef = useRef<TextInput>(null);
  const router = useRouter();

  useEffect(() => {
    if (visible) {
      setCode("");
      const t = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [visible]);

  const handleCodeChange = (text: string) => {
    const digits = text.replace(/[^0-9]/g, "").slice(0, 6);
    setCode(digits);
    if (digits.length === 6) {
      setTimeout(() => {
        onClose();
        router.replace("/");
      }, 300);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <Text style={styles.title}>Check your email</Text>
          <Text style={styles.subtitle}>
            We sent a 6-digit code to{"\n"}
            <Text style={styles.emailHighlight}>{email || "your email"}</Text>
            {"\n"}Enter it below to continue.
          </Text>

          {/* Hidden real input captures keyboard */}
          <TextInput
            ref={inputRef}
            value={code}
            onChangeText={handleCodeChange}
            keyboardType="number-pad"
            maxLength={6}
            style={styles.hiddenInput}
            caretHidden
          />

          {/* Tap anywhere on the digit row to focus the hidden input */}
          <TouchableOpacity
            onPress={() => inputRef.current?.focus()}
            style={styles.codeRow}
            activeOpacity={1}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.codeBox,
                  code.length > i && styles.codeBoxFilled,
                  code.length === i && styles.codeBoxActive,
                ]}
              >
                <Text style={styles.codeChar}>{code[i] ?? ""}</Text>
              </View>
            ))}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 48,
    alignItems: "center",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#e5e7eb",
    marginBottom: 28,
  },
  title: {
    fontSize: fontSize.h3,
    fontFamily: "Poppins-Bold",
    color: "#001132",
    lineHeight: lineHeight.h3,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  emailHighlight: {
    fontFamily: "Poppins-SemiBold",
    color: "#001132",
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    width: 1,
    height: 1,
  },
  codeRow: {
    flexDirection: "row",
    gap: 10,
  },
  codeBox: {
    width: 46,
    height: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    backgroundColor: "#f6f7fb",
    alignItems: "center",
    justifyContent: "center",
  },
  codeBoxFilled: {
    backgroundColor: "#ffffff",
    borderColor: "#6c4ef5",
  },
  codeBoxActive: {
    borderColor: "#6c4ef5",
    borderWidth: 2,
    backgroundColor: "#ffffff",
  },
  codeChar: {
    fontSize: 22,
    fontFamily: "Poppins-Bold",
    color: "#001132",
  },
});
