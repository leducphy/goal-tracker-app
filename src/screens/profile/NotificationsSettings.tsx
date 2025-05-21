import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import useTranslation from '../../i18n';
import useTheme from '../../styles/theme';

type NotificationItemProps = {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  theme: any;
};

const NotificationItem: React.FC<NotificationItemProps> = ({
  title,
  description,
  value,
  onValueChange,
  theme,
}) => {
  return (
    <View style={[styles.notificationItem, { borderBottomColor: theme.colors.borderLight }]}>
      <View style={styles.notificationTextContainer}>
        <Text style={[styles.notificationTitle, { color: theme.colors.text }]}>{title}</Text>
        <Text style={[styles.notificationDescription, { color: theme.colors.textSecondary }]}>
          {description}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#767577', true: `${theme.colors.primary}50` }}
        thumbColor={value ? theme.colors.primary : '#f4f3f4'}
      />
    </View>
  );
};

const NotificationsSettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const theme = useTheme();
  
  // State for notification toggles
  const [goalReminders, setGoalReminders] = useState(true);
  const [groupNotifications, setGroupNotifications] = useState(true);
  const [achievementNotifications, setAchievementNotifications] = useState(true);
  const [financialNotifications, setFinancialNotifications] = useState(false);
  
  const handleSave = () => {
    // Save notification settings
    console.log({
      goalReminders,
      groupNotifications,
      achievementNotifications,
      financialNotifications
    });
    
    navigation.goBack();
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t('notifications')}</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={[styles.description, { color: theme.colors.text }]}>
          {t('notificationSettings')}
        </Text>
        
        <View style={[styles.settingsContainer, { backgroundColor: theme.colors.card }]}>
          <NotificationItem 
            title={t('goalReminders')}
            description={t('receiveGoalReminders')}
            value={goalReminders}
            onValueChange={setGoalReminders}
            theme={theme}
          />
          
          <NotificationItem 
            title={t('groupNotifications')}
            description={t('receiveGroupNotifications')}
            value={groupNotifications}
            onValueChange={setGroupNotifications}
            theme={theme}
          />
          
          <NotificationItem 
            title={t('achievementNotifications')}
            description={t('receiveAchievementNotifications')}
            value={achievementNotifications}
            onValueChange={setAchievementNotifications}
            theme={theme}
          />
          
          <NotificationItem 
            title={t('financialNotifications')}
            description={t('receiveFinancialNotifications')}
            value={financialNotifications}
            onValueChange={setFinancialNotifications}
            theme={theme}
            />
        </View>
        
        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>{t('saveChanges')}</Text>
        </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
  },
  settingsContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 32,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  notificationTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
  },
  saveButton: {
    height: 56,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

export default NotificationsSettingsScreen; 