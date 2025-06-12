import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import useTheme from '../../styles/theme';
import useTranslation from '../../i18n';

// Mock data
const featuredUsers = [
  { id: '1', name: 'Alex Johnson', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', goals: 4 },
  { id: '2', name: 'Sarah Williams', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', goals: 6 },
  { id: '3', name: 'James Chen', avatar: 'https://randomuser.me/api/portraits/men/46.jpg', goals: 3 },
  { id: '4', name: 'Mia Lopez', avatar: 'https://randomuser.me/api/portraits/women/65.jpg', goals: 5 },
];

const socialPosts = [
  { 
    id: '1', 
    user: 'Alex Johnson', 
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    time: '45m ago',
    content: 'Just completed my morning run goal! 🏃‍♂️ 5km done!',
    likes: 24,
    comments: 8
  },
  { 
    id: '2', 
    user: 'Sarah Williams', 
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    time: '2h ago',
    content: 'Finished reading "Atomic Habits". Highly recommend for anyone working on personal development goals!',
    likes: 36,
    comments: 12
  },
];

const SocialScreen: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const renderUser = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.userCard}>
      <Image
        source={{ uri: item.avatar }}
        style={styles.avatar}
      />
      <Text style={[styles.userName, { color: theme.colors.text }]} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={[styles.userGoals, { color: theme.colors.textSecondary }]}>
        {item.goals} {item.goals === 1 ? 'Goal' : 'Goals'}
      </Text>
    </TouchableOpacity>
  );

  const renderPost = ({ item }: { item: any }) => (
    <View style={[styles.postCard, { backgroundColor: theme.colors.card }]}>
      <View style={styles.postHeader}>
        <Image 
          source={{ uri: item.avatar }}
          style={styles.postAvatar}
        />
        <View style={styles.postHeaderInfo}>
          <Text style={[styles.postUser, { color: theme.colors.text }]}>{item.user}</Text>
          <Text style={[styles.postTime, { color: theme.colors.textTertiary }]}>{item.time}</Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.postContent, { color: theme.colors.text }]}>
        {item.content}
      </Text>
      
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="heart-outline" size={22} color={theme.colors.textSecondary} />
          <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>{item.likes}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={22} color={theme.colors.textSecondary} />
          <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>{item.comments}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-outline" size={22} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          {t('social')}
        </Text>
        <TouchableOpacity style={styles.notifications}>
          <Ionicons name="notifications-outline" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Featured People Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Featured People</Text>
            <TouchableOpacity>
              <Text style={[styles.viewAll, { color: theme.colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={featuredUsers}
            keyExtractor={(item) => item.id}
            renderItem={renderUser}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.usersList}
          />
        </View>
        
        {/* Community Card */}
        <TouchableOpacity>
          <LinearGradient
            colors={['#6366F1', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.communityCard}
          >
            <View style={styles.communityContent}>
              <Text style={styles.communityTitle}>Join Goal Groups</Text>
              <Text style={styles.communityDescription}>
                Connect with like-minded people who share similar goals.
              </Text>
              <View style={styles.communityButton}>
                <Text style={styles.communityButtonText}>Explore Groups</Text>
              </View>
            </View>
            <View style={styles.communityImageContainer}>
              <Ionicons name="people" size={80} color="rgba(255,255,255,0.3)" style={styles.communityIcon} />
            </View>
          </LinearGradient>
        </TouchableOpacity>
        
        {/* Posts Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Latest Updates</Text>
            <TouchableOpacity>
              <Text style={[styles.viewAll, { color: theme.colors.primary }]}>Refresh</Text>
            </TouchableOpacity>
          </View>
          
          {socialPosts.map(post => renderPost({ item: post }))}
        </View>
        <View style={{ height: 100 }} />
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
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  notifications: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,122,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '500',
  },
  usersList: {
    paddingRight: 20,
  },
  userCard: {
    alignItems: 'center',
    marginRight: 20,
    width: 80,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  userName: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
    width: 75,
  },
  userGoals: {
    fontSize: 12,
    marginTop: 2,
  },
  communityCard: {
    flexDirection: 'row',
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 10,
    height: 140,
    overflow: 'hidden',
  },
  communityContent: {
    flex: 2,
    padding: 20,
    justifyContent: 'center',
  },
  communityTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  communityDescription: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginBottom: 16,
  },
  communityButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  communityButtonText: {
    color: '#6366F1',
    fontWeight: '600',
    fontSize: 14,
  },
  communityImageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  communityIcon: {
    opacity: 0.8,
  },
  postCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  postHeaderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  postUser: {
    fontSize: 16,
    fontWeight: '600',
  },
  postTime: {
    fontSize: 12,
    marginTop: 2,
  },
  moreButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postContent: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    fontSize: 14,
    marginLeft: 6,
  },
});

export default SocialScreen; 