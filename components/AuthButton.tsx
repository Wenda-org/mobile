import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';

type Props = {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export default function AuthButton({ title, onPress, style, textStyle }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-full bg-primary rounded-lg py-3 items-center justify-center"
      style={style}
    >
      <Text className="text-white font-semibold text-base" style={textStyle}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
