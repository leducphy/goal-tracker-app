import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootStackParamList } from '../../App';
import useTranslation from '../../i18n';
import useTheme from '../../styles/theme';

type CreateGoalScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface CategoryOption {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const CreateGoalScreen: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<CreateGoalScreenNavigationProp>();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [deadline, setDeadline] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [reminder, setReminder] = useState(false);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  
  const categories: CategoryOption[] = [
    { id: 'health', name: 'Thể chất', icon: 'fitness', color: theme.colors.success },
    { id: 'learning', name: 'Học tập', icon: 'book', color: theme.colors.warning },
    { id: 'finance', name: 'Tài chính', icon: 'cash', color: theme.colors.error },
    { id: 'mind', name: 'Tinh thần', icon: 'heart', color: theme.colors.primary },
    { id: 'work', name: 'Công việc', icon: 'briefcase', color: '#5856D6' },
    { id: 'social', name: 'Xã hội', icon: 'people', color: '#FF9500' },
  ];
  
  const getPriorityColor = (level: string) => {
    switch (level) {
      case 'high':
        return theme.colors.error;
      case 'medium':
        return theme.colors.warning;
      case 'low':
        return theme.colors.success;
      default:
        return theme.colors.textSecondary;
    }
  };
  
  const handleSaveGoal = () => {
    // Lưu mục tiêu và quay lại màn hình trước
    navigation.goBack();
  };
  
  const formatDate = (date: Date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDeadline(selectedDate);
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.header, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Tạo mục tiêu mới</Text>
            <TouchableOpacity 
              style={[
                styles.saveButton, 
                { 
                  backgroundColor: title.length > 0 ? theme.colors.primary : theme.colors.border,
                  opacity: title.length > 0 ? 1 : 0.5,
                }
              ]}
              onPress={handleSaveGoal}
              disabled={title.length === 0}
            >
              <Text style={styles.saveButtonText}>Lưu</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <ScrollView style={styles.content}>
          <View style={styles.formSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Thông tin cơ bản</Text>
            
            <View style={styles.formGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>Tiêu đề *</Text>
              <TextInput 
                style={[
                  styles.textInput, 
                  { 
                    backgroundColor: theme.colors.card,
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                  }
                ]}
                placeholder="Nhập tiêu đề mục tiêu của bạn"
                placeholderTextColor={theme.colors.textTertiary}
                value={title}
                onChangeText={setTitle}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>Mô tả</Text>
              <TextInput 
                style={[
                  styles.textAreaInput, 
                  { 
                    backgroundColor: theme.colors.card,
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                  }
                ]}
                placeholder="Mô tả mục tiêu của bạn (không bắt buộc)"
                placeholderTextColor={theme.colors.textTertiary}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>
          
          <View style={styles.formSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Danh mục</Text>
            <View style={styles.categoriesContainer}>
              {categories.map(category => (
                <TouchableOpacity 
                  key={category.id}
                  style={[
                    styles.categoryOption,
                    { 
                      backgroundColor: theme.colors.card,
                      borderColor: selectedCategory === category.id ? category.color : theme.colors.border,
                    }
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <View 
                    style={[
                      styles.categoryIcon, 
                      { 
                        backgroundColor: `${category.color}20`,
                      }
                    ]}
                  >
                    <Ionicons name={category.icon} size={24} color={category.color} />
                  </View>
                  <Text style={[styles.categoryName, { color: theme.colors.text }]}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.formSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Thời gian & mức độ ưu tiên</Text>
            
            <View style={styles.formGroup}>
              <View style={styles.labelContainer}>
                <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>Ngày hạn</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  <Text style={[styles.changeDateText, { color: theme.colors.primary }]}>Thay đổi</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={[
                  styles.datePickerButton, 
                  { 
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.border,
                  }
                ]}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar" size={20} color={theme.colors.primary} />
                <Text style={[styles.dateText, { color: theme.colors.text }]}>{formatDate(deadline)}</Text>
              </TouchableOpacity>
              
              {showDatePicker && (
                <DateTimePicker
                  value={deadline}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                  minimumDate={new Date()}
                />
              )}
            </View>
            
            <View style={styles.formGroup}>
              <View style={styles.labelContainer}>
                <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>Nhắc nhở</Text>
              </View>
              
              <View 
                style={[
                  styles.switchContainer, 
                  { 
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.border,
                  }
                ]}
              >
                <Text style={[styles.switchLabel, { color: theme.colors.text }]}>
                  {reminder ? 'Bật nhắc nhở' : 'Tắt nhắc nhở'}
                </Text>
                <Switch
                  value={reminder}
                  onValueChange={setReminder}
                  trackColor={{ false: theme.colors.border, true: `${theme.colors.primary}80` }}
                  thumbColor={reminder ? theme.colors.primary : '#f4f3f4'}
                />
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>Mức độ ưu tiên</Text>
              <View style={styles.priorityContainer}>
                {(['low', 'medium', 'high'] as const).map(level => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.priorityOption,
                      { 
                        backgroundColor: priority === level 
                          ? `${getPriorityColor(level)}20` 
                          : theme.colors.card,
                        borderColor: priority === level 
                          ? getPriorityColor(level) 
                          : theme.colors.border,
                      }
                    ]}
                    onPress={() => setPriority(level)}
                  >
                    <View 
                      style={[
                        styles.priorityDot, 
                        { backgroundColor: getPriorityColor(level) }
                      ]}
                    />
                    <Text 
                      style={[
                        styles.priorityText, 
                        { color: priority === level ? getPriorityColor(level) : theme.colors.text }
                      ]}
                    >
                      {level === 'low' ? 'Thấp' : level === 'medium' ? 'Trung bình' : 'Cao'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
  },
  textAreaInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    minHeight: 100,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryOption: {
    width: '48%',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  changeDateText: {
    fontSize: 14,
    fontWeight: '500',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  dateText: {
    marginLeft: 8,
    fontSize: 15,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  switchLabel: {
    fontSize: 15,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32%',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  priorityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default CreateGoalScreen; 