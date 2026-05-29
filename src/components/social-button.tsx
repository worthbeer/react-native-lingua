import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  label: string;
  iconLetter: string;
  iconBg?: string;
  iconColor?: string;
  onPress?: () => void;
};

export default function SocialButton({
  label,
  iconLetter,
  iconBg = "#ffffff",
  iconColor = "#4285F4",
  onPress,
}: Props) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        <Text style={[styles.iconText, { color: iconColor }]}>{iconLetter}</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.spacer} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "#ffffff",
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  iconText: {
    fontSize: 13,
    fontFamily: "Poppins-Bold",
    lineHeight: 16,
  },
  label: {
    flex: 1,
    textAlign: "center",
    fontSize: 15,
    fontFamily: "Poppins-Medium",
    color: "#001132",
  },
  spacer: {
    width: 28,
  },
});
