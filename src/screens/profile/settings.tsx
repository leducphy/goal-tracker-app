import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ROUTES } from '../../constants/ROUTES';
import { useAppContext } from '../../contexts/AppContext';
import useTranslation from '../../i18n';
import useTheme from '../../styles/theme';

type SettingsSectionProps = {
  title: string;
  children: React.ReactNode;
};

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, children }) => {
  const theme = useTheme();
  
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>{title}</Text>
      <View style={[styles.sectionContent, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        {children}
      </View>
    </View>
  );
};

type SettingsItemProps = {
  icon: string;
  iconColor: string;
  title: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  showBorder?: boolean;
};

const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  iconColor,
  title,
  rightElement,
  onPress,
  showBorder = true,
}) => {
  const theme = useTheme();
  
  return (
    <TouchableOpacity
      style={[
        styles.settingsItem,
        showBorder && { borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight },
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
        <Ionicons name={icon as any} size={22} color={iconColor} />
      </View>
      <Text style={[styles.settingsTitle, { color: theme.colors.text }]}>{title}</Text>
      <View style={styles.rightElement}>{rightElement}</View>
    </TouchableOpacity>
  );
};

const SettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { language, setLanguage, isDarkMode, toggleTheme } = useAppContext();
  const navigation = useNavigation();

  const handleNotificationsPress = () => {
    // @ts-ignore
    navigation.navigate(ROUTES.NOTIFICATIONS_SETTINGS);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.content}>
        <SettingsSection title={t('appSettings')}>
          <SettingsItem
            icon="moon"
            iconColor="#8E8E93"
            title={t('darkMode')}
            rightElement={
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: '#767577', true: `${theme.colors.primary}50` }}
                thumbColor={isDarkMode ? theme.colors.primary : '#f4f3f4'}
              />
            }
          />
          <SettingsItem
            icon="language"
            iconColor="#FF9500"
            title={t('language')}
            rightElement={
              <View style={styles.languageSelector}>
                <TouchableOpacity
                  style={[
                    styles.languageButton,
                    language === 'vi' && { backgroundColor: `${theme.colors.primary}20` },
                  ]}
                  onPress={() => setLanguage('vi')}
                >
                  <Text
                    style={[
                      styles.languageText,
                      { color: language === 'vi' ? theme.colors.primary : theme.colors.textSecondary },
                    ]}
                  >
                    VI
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.languageButton,
                    language === 'en' && { backgroundColor: `${theme.colors.primary}20` },
                  ]}
                  onPress={() => setLanguage('en')}
                >
                  <Text
                    style={[
                      styles.languageText,
                      { color: language === 'en' ? theme.colors.primary : theme.colors.textSecondary },
                    ]}
                  >
                    EN
                  </Text>
                </TouchableOpacity>
              </View>
            }
          />
          <SettingsItem
            icon="notifications"
            iconColor="#FF2D55"
            title={t('notifications')}
            rightElement={<Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />}
            onPress={handleNotificationsPress}
            showBorder={false}
          />
        </SettingsSection>

        <SettingsSection title={t('dataPrivacy')}>
          <SettingsItem
            icon="shield-checkmark"
            iconColor="#4CD964"
            title={t('dataPrivacy')}
            rightElement={<Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />}
            showBorder={false}
          />
        </SettingsSection>

        <SettingsSection title={t('aboutApp')}>
          <SettingsItem
            icon="information-circle"
            iconColor="#0070FF"
            title={t('aboutApp')}
            rightElement={<Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />}
            showBorder={false}
          />
        </SettingsSection>

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
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  sectionContent: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingsTitle: {
    fontSize: 16,
    flex: 1,
  },
  rightElement: {
    alignItems: 'flex-end',
  },
  languageSelector: {
    flexDirection: 'row',
  },
  languageButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageText: {
    fontWeight: '600',
    fontSize: 14,
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

export default SettingsScreen; 