import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootStackParamList } from '../App';
import { ROUTES } from '../constants/ROUTES';
import useTranslation from '../i18n';
import useTheme from '../styles/theme';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type IconName = keyof typeof Ionicons.glyphMap;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { t } = useTranslation();
  const theme = useTheme();
  
  // Mock user data
  const user = {
    name: 'Nguyen Van A',
    email: 'nguyenvana@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    joinDate: '01/2023',
    completedGoals: 15,
  };

  const menuItems = [
    {
      id: 'account',
      title: t('accountInfo'),
      icon: 'person-circle' as IconName,
      color: '#0070FF',
      onPress: () => {},
    },
    {
      id: 'achievements',
      title: t('profileAchievements'),
      icon: 'trophy' as IconName,
      color: '#FFCC00',
      onPress: () => {},
    },
    {
      id: 'statistics',
      title: t('statisticsSection'),
      icon: 'stats-chart' as IconName,
      color: '#4CD964',
      onPress: () => {},
    },
    {
      id: 'settings',
      title: t('settings'),
      icon: 'settings' as IconName,
      color: '#8E8E93',
      onPress: () => navigation.navigate(ROUTES.SETTINGS),
    },
    {
      id: 'help',
      title: t('helpSupport'),
      icon: 'help-circle' as IconName,
      color: '#FF9500',
      onPress: () => {},
    },
  ];

  const handleLogout = () => {
    // Navigate back to login screen
    navigation.navigate(ROUTES.LOGIN);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t('profile')}</Text>
        <TouchableOpacity onPress={() => navigation.navigate(ROUTES.SETTINGS)}>
          <Ionicons name="settings-outline" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: theme.colors.card }]}>
          <Image 
            source={{ uri: user.avatar }} 
            style={styles.avatar} 
          />
          
          <View style={styles.profileInfo}>
            <Text style={[styles.name, { color: theme.colors.text }]}>{user.name}</Text>
            <Text style={[styles.email, { color: theme.colors.textSecondary }]}>{user.email}</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.primary }]}>{user.completedGoals}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>{t('completedGoals')}</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: theme.colors.divider }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.primary }]}>{user.joinDate}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>{t('joinedSince')}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={[styles.menuContainer, { backgroundColor: theme.colors.card }]}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={item.id} 
              style={[
                styles.menuItem, 
                index < menuItems.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight }
              ]}
              onPress={item.onPress}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: `${item.color}20` }]}>
                <Ionicons name={item.icon} size={22} color={item.color} />
              </View>
              <View style={styles.menuContent}>
                <Text style={[styles.menuTitle, { color: theme.colors.text }]}>{item.title}</Text>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: theme.colors.card }]} 
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color={theme.colors.error} />
          <Text style={[styles.logoutText, { color: theme.colors.error }]}>{t('logout')}</Text>
        </TouchableOpacity>

        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: theme.colors.textTertiary }]}>
            {t('version')} 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  statDivider: {
    width: 1,
    height: 16,
    marginHorizontal: 12,
  },
  menuContainer: {
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  versionText: {
    fontSize: 13,
  },
});

export default ProfileScreen; 