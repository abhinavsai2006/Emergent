/**
 * Skeleton Loader Component
 * Smooth shimmer animation for loading states
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { borderRadius } from '../../theme/spacing';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: keyof typeof borderRadius;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius: radius = 'sm',
  style,
}) => {
  const { theme, isDark } = useTheme();
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          shimmer.value,
          [0, 1],
          [-200, 200]
        ),
      },
    ],
  }));

  const baseColor = isDark ? '#2A2A2A' : '#E5E5E5';
  const highlightColor = isDark ? '#3A3A3A' : '#F5F5F5';

  return (
    <View
      style={[
        {
          width: width as any,
          height,
          borderRadius: borderRadius[radius],
          backgroundColor: baseColor,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <LinearGradient
          colors={[baseColor, highlightColor, baseColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};

// Pre-built skeleton patterns
export const SkeletonCard: React.FC<{ style?: ViewStyle }> = ({ style }) => (
  <View style={[{ padding: 16 }, style]}>
    <Skeleton width="100%" height={140} borderRadius="lg" />
    <View style={{ marginTop: 12 }}>
      <Skeleton width="70%" height={18} />
      <Skeleton width="40%" height={14} style={{ marginTop: 8 }} />
    </View>
  </View>
);

export const SkeletonMenuItem: React.FC<{ style?: ViewStyle }> = ({ style }) => (
  <View style={[{ flexDirection: 'row', padding: 16 }, style]}>
    <View style={{ flex: 1 }}>
      <Skeleton width="80%" height={18} />
      <Skeleton width="60%" height={14} style={{ marginTop: 8 }} />
      <Skeleton width="30%" height={16} style={{ marginTop: 12 }} />
    </View>
    <Skeleton width={80} height={80} borderRadius="md" />
  </View>
);
