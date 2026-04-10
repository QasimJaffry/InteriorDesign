import React from "react";
import Toast, { BaseToast } from "react-native-toast-message";

import { palette, fontFamily } from "@/constants/theme";

const base = {
  backgroundColor: palette.surface,
  borderLeftWidth: 4,
  borderRadius: 12,
  height: "auto" as const,
  minHeight: 52,
};

const text1 = {
  fontFamily: fontFamily.sansSemiBold,
  fontSize: 15,
  color: palette.text,
};
const text2 = {
  fontFamily: fontFamily.sans,
  fontSize: 13,
  color: palette.textSecondary,
};

export const toastConfig: React.ComponentProps<typeof Toast>["config"] = {
  success: (props) => (
    <BaseToast
      {...props}
      style={[base, { borderLeftColor: palette.sage }]}
      text1Style={[text1, props.text1Style]}
      text2Style={[text2, props.text2Style]}
    />
  ),
  error: (props) => (
    <BaseToast
      {...props}
      style={[base, { borderLeftColor: palette.danger }]}
      text1Style={[text1, props.text1Style]}
      text2Style={[text2, props.text2Style]}
    />
  ),
  info: (props) => (
    <BaseToast
      {...props}
      style={[base, { borderLeftColor: palette.ice }]}
      text1Style={[text1, props.text1Style]}
      text2Style={[text2, props.text2Style]}
    />
  ),
};
