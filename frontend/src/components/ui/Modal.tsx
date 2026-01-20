/**
 * Premium Modal Component
 * Smooth animations, backdrop blur effect
 */

import React from 'react';
import {
  Modal as RNModal,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { spacing, borderRadius, shadows } from '../../theme/spacing';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  type?: 'bottom-sheet' | 'center' | 'fullscreen';
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  children,
  type = 'bottom-sheet',
}) => {
  const { theme } = useTheme();
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 200 });
      translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
    } else {
      opacity.value = withTiming(0, { duration: 150 });
      translateY.value = withTiming(SCREEN_HEIGHT, { duration: 200 });
    }
  }, [visible]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const contentStyle = useAnimatedStyle(() => {
    if (type === 'bottom-sheet') {
      return { transform: [{ translateY: translateY.value }] };
    }
    return { opacity: opacity.value };
  });

  const getContainerStyle = () => {
    switch (type) {
      case 'bottom-sheet':
        return styles.bottomSheetContainer;
      case 'center':
        return styles.centerContainer;
      case 'fullscreen':
        return styles.fullscreenContainer;
      default:
        return styles.bottomSheetContainer;
    }
  };

  const getContentStyle = () => {
    const baseStyle = {
      backgroundColor: theme.surface.modal,
      ...shadows.xl,
    };

    switch (type) {
      case 'bottom-sheet':
        return {
          ...baseStyle,
          borderTopLeftRadius: borderRadius['2xl'],
          borderTopRightRadius: borderRadius['2xl'],
          maxHeight: SCREEN_HEIGHT * 0.9,
        };
      case 'center':
        return {
          ...baseStyle,
          borderRadius: borderRadius.xl,
          margin: spacing['2xl'],
          maxHeight: SCREEN_HEIGHT * 0.8,
        };
      case 'fullscreen':
        return {
          ...baseStyle,
          flex: 1,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={[styles.overlay, getContainerStyle()]}>
          <TouchableWithoutFeedback onPress={onClose}>
            <Animated.View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: theme.surface.overlay },
                backdropStyle,
              ]}
            />
          </TouchableWithoutFeedback>
          
          <Animated.View style={[getContentStyle(), contentStyle]}>
            {type === 'bottom-sheet' && (
              <View style={styles.handleContainer}>
                <View style={[styles.handle, { backgroundColor: theme.border.default }]} />
              </View>
            )}
            {children}
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  bottomSheetContainer: {
    justifyContent: 'flex-end',
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenContainer: {
    flex: 1,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
});
