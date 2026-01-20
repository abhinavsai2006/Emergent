/**
 * Chip Component - Category tags, filters
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { colors } from '../../theme/colors';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: React.ReactNode;
  size?: 'small' | 'medium';
  style?: ViewStyle;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onPress,
  icon,
  size = 'medium',
  style,
}) => {
  const { theme, isDark } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const chipStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: size === 'small' ? spacing.xs : spacing.sm,
    paddingHorizontal: size === 'small' ? spacing.sm : spacing.lg,
    borderRadius: borderRadius.full,
    backgroundColor: selected 
      ? colors.primary[500] 
      : isDark ? theme.background.tertiary : theme.background.secondary,
    borderWidth: selected ? 0 : 1,
    borderColor: theme.border.light,
  };

  const textStyle = {
    ...(size === 'small' ? typography.labelSmall : typography.labelMedium),
    color: selected ? colors.neutral[0] : theme.text.primary,
  };

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
      style={[chipStyle, animatedStyle, style]}
    >
      {icon && <>{icon}</>}
      <Text style={[textStyle, icon && { marginLeft: spacing.xs }]}>{label}</Text>
    </AnimatedTouchable>
  );
};
