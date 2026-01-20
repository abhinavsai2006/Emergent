/**
 * Profile Screen - User settings and preferences
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../src/hooks/useTheme';
import { useSettingsStore } from '../../src/store/settingsStore';
import { useAuthStore } from '../../src/store/authStore';
import { typography } from '../../src/theme/typography';
import { spacing, borderRadius, shadows } from '../../src/theme/spacing';
import { colors } from '../../src/theme/colors';
import { Card, Button } from '../../src/components/ui';

const menuItems = [
  {
    id: 'addresses',
    icon: 'location',
    title: 'Saved Addresses',
    subtitle: 'Home, Hostel, etc.',
  },
  {
    id: 'payments',
    icon: 'card',
    title: 'Payment Methods',
    subtitle: 'Cards, UPI, Wallet',
  },
  {
    id: 'favorites',
    icon: 'heart',
    title: 'Favorites',
    subtitle: 'Your liked restaurants',
  },
  {
    id: 'notifications',
    icon: 'notifications',
    title: 'Notifications',
    subtitle: 'Order updates, offers',
  },
  {
    id: 'help',
    icon: 'help-circle',
    title: 'Help & Support',
    subtitle: 'FAQs, Contact us',
  },
  {
    id: 'about',
    icon: 'information-circle',
    title: 'About',
    subtitle: 'Version 1.0.0',
  },
];

export default function ProfileScreen() {
  const { theme, isDark } = useTheme();
  const { isDarkMode, toggleDarkMode } = useSettingsStore();
  const { user, logout } = useAuthStore();

  // Mock user data
  const mockUser = {
    name: 'Rahul Sharma',
    email: 'rahul.sharma@iitd.ac.in',
    phone: '+91 98765 43210',
    university: 'IIT Delhi',
    hostelBlock: 'Nilgiri',
    roomNumber: '234',
    isProMember: false,
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background.primary,
    },
    header: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: spacing.lg,
    },
    title: {
      ...typography.headlineLarge,
      color: theme.text.primary,
    },
    profileCard: {
      marginHorizontal: spacing.lg,
      marginBottom: spacing.xl,
      borderRadius: borderRadius.xl,
      backgroundColor: theme.surface.card,
      ...shadows.md,
      overflow: 'hidden',
    },
    profileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.lg,
    },
    avatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.primary[100],
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      ...typography.headlineMedium,
      color: colors.primary[600],
    },
    profileInfo: {
      flex: 1,
      marginLeft: spacing.lg,
    },
    userName: {
      ...typography.titleLarge,
      color: theme.text.primary,
    },
    userEmail: {
      ...typography.bodySmall,
      color: theme.text.secondary,
      marginTop: spacing.xxs,
    },
    editButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.background.secondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    universityBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.background.secondary,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.border.light,
    },
    universityText: {
      ...typography.labelMedium,
      color: theme.text.secondary,
      marginLeft: spacing.sm,
    },
    hostelInfo: {
      ...typography.labelMedium,
      color: theme.text.primary,
      marginLeft: 'auto',
    },
    proBanner: {
      marginHorizontal: spacing.lg,
      marginBottom: spacing.xl,
      borderRadius: borderRadius.xl,
      overflow: 'hidden',
    },
    proBannerContent: {
      padding: spacing.xl,
    },
    proTitle: {
      ...typography.headlineSmall,
      color: colors.neutral[0],
    },
    proSubtitle: {
      ...typography.bodyMedium,
      color: colors.neutral[200],
      marginTop: spacing.xs,
    },
    proFeatures: {
      flexDirection: 'row',
      marginTop: spacing.lg,
      gap: spacing.lg,
    },
    proFeature: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    proFeatureText: {
      ...typography.labelSmall,
      color: colors.neutral[200],
      marginLeft: spacing.xs,
    },
    proButton: {
      backgroundColor: colors.neutral[0],
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.full,
      alignSelf: 'flex-start',
      marginTop: spacing.lg,
    },
    proButtonText: {
      ...typography.labelMedium,
      color: colors.primary[600],
      fontWeight: '600',
    },
    sectionTitle: {
      ...typography.titleMedium,
      color: theme.text.secondary,
      marginHorizontal: spacing.lg,
      marginBottom: spacing.md,
    },
    menuCard: {
      marginHorizontal: spacing.lg,
      marginBottom: spacing.xl,
      borderRadius: borderRadius.xl,
      backgroundColor: theme.surface.card,
      ...shadows.sm,
      overflow: 'hidden',
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.border.light,
    },
    menuItemLast: {
      borderBottomWidth: 0,
    },
    menuIcon: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.md,
      backgroundColor: theme.background.secondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuItemContent: {
      flex: 1,
      marginLeft: spacing.md,
    },
    menuItemTitle: {
      ...typography.titleMedium,
      color: theme.text.primary,
    },
    menuItemSubtitle: {
      ...typography.bodySmall,
      color: theme.text.tertiary,
      marginTop: spacing.xxs,
    },
    darkModeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      marginHorizontal: spacing.lg,
      marginBottom: spacing.xl,
      borderRadius: borderRadius.xl,
      backgroundColor: theme.surface.card,
      ...shadows.sm,
    },
    darkModeLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    darkModeIcon: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.md,
      backgroundColor: theme.background.secondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    darkModeText: {
      ...typography.titleMedium,
      color: theme.text.primary,
      marginLeft: spacing.md,
    },
    logoutButton: {
      marginHorizontal: spacing.lg,
      marginBottom: spacing['3xl'],
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* Profile Card */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {mockUser.name.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.userName}>{mockUser.name}</Text>
                <Text style={styles.userEmail}>{mockUser.email}</Text>
              </View>
              <TouchableOpacity style={styles.editButton}>
                <Ionicons name="pencil" size={18} color={theme.text.secondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.universityBadge}>
              <Ionicons name="school" size={18} color={theme.text.tertiary} />
              <Text style={styles.universityText}>{mockUser.university}</Text>
              <Text style={styles.hostelInfo}>
                {mockUser.hostelBlock} - Room {mockUser.roomNumber}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Campus Pro Banner */}
        {!mockUser.isProMember && (
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <LinearGradient
              colors={[colors.primary[600], colors.primary[500], colors.primary[400]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.proBanner}
            >
              <View style={styles.proBannerContent}>
                <Text style={styles.proTitle}>Campus Pro</Text>
                <Text style={styles.proSubtitle}>
                  Unlock premium benefits for students
                </Text>
                <View style={styles.proFeatures}>
                  <View style={styles.proFeature}>
                    <Ionicons name="checkmark-circle" size={16} color={colors.neutral[200]} />
                    <Text style={styles.proFeatureText}>Free Delivery</Text>
                  </View>
                  <View style={styles.proFeature}>
                    <Ionicons name="checkmark-circle" size={16} color={colors.neutral[200]} />
                    <Text style={styles.proFeatureText}>Priority Orders</Text>
                  </View>
                  <View style={styles.proFeature}>
                    <Ionicons name="checkmark-circle" size={16} color={colors.neutral[200]} />
                    <Text style={styles.proFeatureText}>Exclusive Deals</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.proButton}>
                  <Text style={styles.proButtonText}>Get Pro - ₹49/month</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Animated.View>
        )}

        {/* Dark Mode Toggle */}
        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <View style={styles.darkModeRow}>
            <View style={styles.darkModeLeft}>
              <View style={styles.darkModeIcon}>
                <Ionicons 
                  name={isDarkMode ? 'moon' : 'sunny'} 
                  size={20} 
                  color={theme.text.secondary} 
                />
              </View>
              <Text style={styles.darkModeText}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: theme.border.default, true: colors.primary[500] }}
              thumbColor={colors.neutral[0]}
            />
          </View>
        </Animated.View>

        {/* Menu Items */}
        <Text style={styles.sectionTitle}>SETTINGS</Text>
        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <View style={styles.menuCard}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  index === menuItems.length - 1 && styles.menuItemLast,
                ]}
                activeOpacity={0.7}
              >
                <View style={styles.menuIcon}>
                  <Ionicons
                    name={item.icon as any}
                    size={20}
                    color={theme.text.secondary}
                  />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.text.tertiary} />
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Logout Button */}
        <View style={styles.logoutButton}>
          <Button
            title="Log Out"
            variant="outline"
            onPress={() => logout()}
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
