import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ROUTES } from '../../constants/ROUTES';
import useTranslation from '../../i18n';
import useTheme from '../../styles/theme';

type LoanType = 'borrow' | 'lend';

const AddLoan: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  
  const [type, setType] = useState<LoanType>('borrow');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [personName, setPersonName] = useState('');
  const [category, setCategory] = useState('personal');
  const [creationDate, setCreationDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [interestRate, setInterestRate] = useState('0');
  
  // Mock categories
  const loanCategories = [
    { id: 'personal', label: t('personal'), icon: 'person' },
    { id: 'education', label: t('educationCategory'), icon: 'school' },
    { id: 'health', label: t('healthFinance'), icon: 'medkit' },
    { id: 'housing', label: t('housing'), icon: 'home' },
    { id: 'travel', label: t('entertainment'), icon: 'airplane' },
    { id: 'other', label: t('other'), icon: 'ellipsis-horizontal' },
  ];
  
  const handleSave = () => {
    // Logic to save the loan
    console.log({
      type,
      name,
      amount,
      personName,
      category,
      creationDate,
      dueDate,
      interestRate
    });
    
    // Navigate back to loan management screen
    // @ts-ignore
    navigation.navigate(ROUTES.LOAN_MANAGEMENT);
  };
  
  const handleBack = () => {
    navigation.goBack();
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t('newLoan')}</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={[styles.subtitle, { color: theme.colors.text }]}>{t('loanDetails')}</Text>
        
        {/* Loan Type */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>{t('loanType')}</Text>
          <View style={styles.segmentContainer}>
            <TouchableOpacity 
              style={[
                styles.segmentButton, 
                type === 'borrow' && [styles.segmentActive, { backgroundColor: theme.colors.primary }]
              ]}
              onPress={() => setType('borrow')}
            >
              <Text 
                style={[
                  styles.segmentText, 
                  type === 'borrow' && styles.segmentTextActive
                ]}
              >
                {t('borrow')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.segmentButton, 
                type === 'lend' && [styles.segmentActive, { backgroundColor: theme.colors.primary }]
              ]}
              onPress={() => setType('lend')}
            >
              <Text 
                style={[
                  styles.segmentText, 
                  type === 'lend' && styles.segmentTextActive
                ]}
              >
                {t('lend')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Loan Name */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>{t('loanName')}</Text>
          <TextInput
            style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
            value={name}
            onChangeText={setName}
            placeholder={t('loanNamePlaceholder')}
            placeholderTextColor={theme.colors.text + '80'}
          />
        </View>
        
        {/* Amount */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>{t('loanAmount')}</Text>
          <TextInput
            style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
            value={amount}
            onChangeText={setAmount}
            placeholder="0"
            keyboardType="numeric"
            placeholderTextColor={theme.colors.text + '80'}
          />
        </View>
        
        {/* Related Person */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>{t('relatedPerson')}</Text>
          <TextInput
            style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
            value={personName}
            onChangeText={setPersonName}
            placeholder={t('relatedPersonPlaceholder')}
            placeholderTextColor={theme.colors.text + '80'}
          />
        </View>
        
        {/* Category */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>{t('loanCategory')}</Text>
          <View style={styles.categoryGrid}>
            {loanCategories.map((cat) => (
              <TouchableOpacity 
                key={cat.id}
                style={[
                  styles.categoryItem,
                  category === cat.id && [styles.categoryActive, { borderColor: theme.colors.primary }]
                ]}
                onPress={() => setCategory(cat.id)}
              >
                <View style={[
                  styles.categoryIcon,
                  { backgroundColor: category === cat.id ? theme.colors.primary + '20' : theme.colors.card }
                ]}>
                  <Ionicons 
                    name={cat.icon as any} 
                    size={20} 
                    color={category === cat.id ? theme.colors.primary : theme.colors.text} 
                  />
                </View>
                <Text 
                  style={[
                    styles.categoryLabel, 
                    { color: category === cat.id ? theme.colors.primary : theme.colors.text }
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Creation Date */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>{t('creationDate')}</Text>
          <TouchableOpacity 
            style={[styles.dateButton, { borderColor: theme.colors.border }]}
          >
            <Text style={{ color: theme.colors.text }}>{creationDate}</Text>
            <Ionicons name="calendar" size={20} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
        
        {/* Due Date */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>{t('dueDateLoan')}</Text>
          <TouchableOpacity 
            style={[styles.dateButton, { borderColor: theme.colors.border }]}
          >
            <Text style={{ color: theme.colors.text }}>
              {dueDate || 'YYYY-MM-DD'}
            </Text>
            <Ionicons name="calendar" size={20} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
        
        {/* Interest Rate */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>{t('interestRate')}</Text>
          <TextInput
            style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
            value={interestRate}
            onChangeText={setInterestRate}
            placeholder={t('interestRatePlaceholder')}
            keyboardType="numeric"
            placeholderTextColor={theme.colors.text + '80'}
          />
        </View>
        
        {/* Save Button */}
        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>{t('createLoan')}</Text>
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
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  segmentContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  segmentActive: {
    backgroundColor: '#0070FF',
  },
  segmentText: {
    fontSize: 16,
    color: '#666',
  },
  segmentTextActive: {
    color: '#FFF',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  categoryItem: {
    width: '33%',
    paddingHorizontal: 4,
    marginBottom: 12,
    alignItems: 'center',
  },
  categoryActive: {
    borderRadius: 8,
    borderWidth: 1,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
  dateButton: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  saveButton: {
    height: 56,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  }
});

export default AddLoan; 