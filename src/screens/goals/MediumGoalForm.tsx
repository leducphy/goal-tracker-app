import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Alert,
  ToastAndroid,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';

import { RootStackParamList } from '../../App';
import useTheme from '../../styles/theme';
import useTranslation from '../../i18n';
import { useToast } from '../../components/ToastProvider';
import { goalsService } from '../../api/services/goalsService';
import { ROUTES } from '../../constants/ROUTES';

type MediumGoalFormRouteProp = RouteProp<RootStackParamList, typeof ROUTES.MEDIUM_GOAL_FORM>;
type MediumGoalFormNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface FormData {
  title: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  isPublic: boolean;
}

const MediumGoalForm: React.FC = () => {
  const route = useRoute<MediumGoalFormRouteProp>();
  const navigation = useNavigation<MediumGoalFormNavigationProp>();
  const theme = useTheme();
  const { t } = useTranslation();
  const { showSuccess, showError } = useToast();
  
  const { longTermGoalId, longTermGoalName, mode, goalId } = route.params || {};
  const isEditMode = mode === 'edit';
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    startDate: new Date(),
    endDate: null,
    isPublic: false,
  });
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    console.log('MediumGoalForm mounted with params:', route.params);
    
    if (isEditMode && goalId) {
      loadGoalData();
    }
  }, [isEditMode, goalId]);

  const loadGoalData = async () => {
    try {
      setLoading(true);
      const goalData = await goalsService.getMediumGoalById(goalId);
      
      setFormData({
        title: goalData.title || '',
        description: goalData.description || '',
        startDate: goalData.startDate ? new Date(goalData.startDate) : new Date(),
        endDate: goalData.endDate ? new Date(goalData.endDate) : null,
        isPublic: goalData.isPublic || false,
      });
    } catch (error) {
      console.error('Error loading goal data:', error);
      showError(t('loadGoalError'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Log submit attempt for debugging
    console.log('Attempting to submit form data:', formData);
    
    // Validate form
    if (!formData.title.trim()) {
      showError(t('titleRequired'));
      return;
    }

    if (formData.endDate && formData.startDate && formData.endDate < formData.startDate) {
      showError(t('endDateBeforeStart'));
      return;
    }

    try {
      setSubmitting(true);
      
      const goalData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        startDate: formData.startDate?.toISOString(),
        endDate: formData.endDate?.toISOString(),
        isPublic: formData.isPublic,
        longTermGoalId: longTermGoalId,
      };

      // Show platform-specific feedback
      if (Platform.OS === 'android') {
        ToastAndroid.show(
          isEditMode ? t('updatingGoal') : t('creatingGoal'), 
          ToastAndroid.SHORT
        );
      }

      if (isEditMode) {
        await goalsService.updateMediumGoal(goalId, goalData);
        showSuccess(t('goalUpdated'));
      } else {
        await goalsService.createMediumGoal(goalData);
        showSuccess(t('goalCreated'));
      }

      navigation.goBack();
    } catch (error) {
      console.error('Error saving goal:', error);
      showError(isEditMode ? t('updateGoalError') : t('createGoalError'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleChangeDate = (event: any, selectedDate?: Date, dateType?: 'start' | 'end') => {
    if (event.type === 'dismissed') {
      if (Platform.OS === 'android') {
        setShowStartDatePicker(false);
        setShowEndDatePicker(false);
      }
      return;
    }

    const currentDate = selectedDate || (dateType === 'start' ? formData.startDate : formData.endDate);
    
    if (Platform.OS === 'android') {
      setShowStartDatePicker(false);
      setShowEndDatePicker(false);
    }
    
    if (dateType === 'start') {
      setFormData({ ...formData, startDate: currentDate });
    } else {
      setFormData({ ...formData, endDate: currentDate });
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return t('notSet');
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            {t('loadingGoal')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={28} color={theme.colors.primary} />
          </TouchableOpacity>
          
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            {isEditMode ? t('editMediumGoal') : t('createMediumGoal')}
          </Text>
          
          <TouchableOpacity
            style={[
              styles.saveButton, 
              { backgroundColor: theme.colors.primary },
              submitting && { opacity: 0.7 }
            ]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.saveButtonText}>{t('save')}</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={[styles.parentGoalContainer, { backgroundColor: theme.colors.cardBackground }]}>
          <Ionicons name="git-branch-outline" size={20} color={theme.colors.textSecondary} />
          <Text style={[styles.parentGoalText, { color: theme.colors.textSecondary }]}>
            {t('partOf')} <Text style={{ fontWeight: '600', color: theme.colors.text }}>{longTermGoalName}</Text>
          </Text>
        </View>

        <ScrollView 
          style={styles.formContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.formContent}
        >
          <View style={styles.formSection}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
              {t('title')} <Text style={{ color: theme.colors.error }}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: theme.colors.cardBackground,
                  color: theme.colors.text,
                  borderColor: theme.colors.border
                }
              ]}
              placeholder={t('enterMediumGoalTitle')}
              placeholderTextColor={theme.colors.textSecondary}
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              maxLength={100}
            />

            <Text style={[styles.inputLabel, { color: theme.colors.text, marginTop: 20 }]}>
              {t('description')}
            </Text>
            <TextInput
              style={[
                styles.textArea,
                { 
                  backgroundColor: theme.colors.cardBackground,
                  color: theme.colors.text,
                  borderColor: theme.colors.border
                }
              ]}
              placeholder={t('enterMediumGoalDescription')}
              placeholderTextColor={theme.colors.textSecondary}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>

          <View style={[styles.divider, { backgroundColor: theme.colors.border + '20' }]} />

          <View style={styles.formSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              {t('timeframe')}
            </Text>
            
            <TouchableOpacity 
              style={[
                styles.datePickerButton,
                { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }
              ]}
              onPress={() => setShowStartDatePicker(true)}
            >
              <View style={styles.datePickerButtonContent}>
                <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
                <Text style={[styles.datePickerLabel, { color: theme.colors.text }]}>
                  {t('startDate')}
                </Text>
              </View>
              <Text style={[styles.dateText, { color: theme.colors.text }]}>
                {formatDate(formData.startDate)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.datePickerButton,
                { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }
              ]}
              onPress={() => setShowEndDatePicker(true)}
            >
              <View style={styles.datePickerButtonContent}>
                <Ionicons name="flag-outline" size={20} color={theme.colors.primary} />
                <Text style={[styles.datePickerLabel, { color: theme.colors.text }]}>
                  {t('targetDate')}
                </Text>
              </View>
              <Text style={[styles.dateText, { color: theme.colors.text }]}>
                {formatDate(formData.endDate)}
              </Text>
            </TouchableOpacity>

            {Platform.OS === 'ios' && showStartDatePicker && (
              <View style={[styles.datePickerContainer, { backgroundColor: theme.colors.cardBackground }]}>
                <View style={[styles.datePickerHeader, { borderBottomColor: theme.colors.border }]}>
                  <TouchableOpacity onPress={() => setShowStartDatePicker(false)}>
                    <Text style={{ color: theme.colors.primary }}>{t('cancel')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setShowStartDatePicker(false)}>
                    <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>{t('done')}</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={formData.startDate || new Date()}
                  mode="date"
                  display="spinner"
                  onChange={(e, date) => handleChangeDate(e, date, 'start')}
                  textColor={theme.colors.text}
                />
              </View>
            )}

            {Platform.OS === 'ios' && showEndDatePicker && (
              <View style={[styles.datePickerContainer, { backgroundColor: theme.colors.cardBackground }]}>
                <View style={[styles.datePickerHeader, { borderBottomColor: theme.colors.border }]}>
                  <TouchableOpacity onPress={() => setShowEndDatePicker(false)}>
                    <Text style={{ color: theme.colors.primary }}>{t('cancel')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setShowEndDatePicker(false)}>
                    <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>{t('done')}</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={formData.endDate || new Date()}
                  mode="date"
                  display="spinner"
                  onChange={(e, date) => handleChangeDate(e, date, 'end')}
                  minimumDate={formData.startDate || undefined}
                  textColor={theme.colors.text}
                />
              </View>
            )}

            {Platform.OS === 'android' && showStartDatePicker && (
              <DateTimePicker
                value={formData.startDate || new Date()}
                mode="date"
                display="default"
                onChange={(e, date) => handleChangeDate(e, date, 'start')}
              />
            )}

            {Platform.OS === 'android' && showEndDatePicker && (
              <DateTimePicker
                value={formData.endDate || new Date()}
                mode="date"
                display="default"
                onChange={(e, date) => handleChangeDate(e, date, 'end')}
                minimumDate={formData.startDate || undefined}
              />
            )}
          </View>

          <View style={[styles.divider, { backgroundColor: theme.colors.border + '20' }]} />

          <View style={styles.formSection}>
            <View style={styles.switchRow}>
              <View style={styles.switchLabelContainer}>
                <Text style={[styles.switchLabel, { color: theme.colors.text }]}>
                  {t('publicGoal')}
                </Text>
                <Text style={[styles.switchDescription, { color: theme.colors.textSecondary }]}>
                  {t('publicGoalDescription')}
                </Text>
              </View>
              <Switch
                value={formData.isPublic}
                onValueChange={(value) => setFormData({ ...formData, isPublic: value })}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : formData.isPublic ? theme.colors.primaryDark : '#f4f3f4'}
              />
            </View>
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
        
        {/* Submit button at bottom for easier access on larger phones */}
        <TouchableOpacity
          style={[
            styles.submitButton, 
            { backgroundColor: theme.colors.primary },
            submitting && { opacity: 0.7 }
          ]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <Ionicons name="save-outline" size={20} color="white" />
              <Text style={styles.submitButtonText}>
                {isEditMode ? t('updateGoal') : t('createGoal')}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  parentGoalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  parentGoalText: {
    fontSize: 14,
    flex: 1,
  },
  formContainer: {
    flex: 1,
  },
  formContent: {
    paddingBottom: 80, // Extra space for floating action button
  },
  formSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  textArea: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    minHeight: 120,
  },
  divider: {
    height: 8,
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  datePickerButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  datePickerLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 16,
  },
  datePickerContainer: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginHorizontal: -20,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabelContainer: {
    flex: 1,
    marginRight: 20,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 14,
  },
  bottomSpacing: {
    height: 40,
  },
  submitButton: {
    position: 'absolute',
    bottom: 20,
    left: 20, 
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default MediumGoalForm; 