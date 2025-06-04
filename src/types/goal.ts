export type GoalStatus = 'active' | 'completed' | 'paused' | 'cancelled' | 'overdue';
export type GoalPriority = 'low' | 'medium' | 'high' | 'urgent';
export type GoalCategory = 'health' | 'finance' | 'career' | 'education' | 'personal' | 'relationship' | 'hobby' | 'travel' | 'other';
export type GoalType = 'daily' | 'short_term' | 'medium_term' | 'long_term';
export type GoalFrequency = 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

export interface Goal {
  id: number;
  title: string;
  description?: string;
  type: GoalType;
  category: GoalCategory;
  status: GoalStatus;
  priority: GoalPriority;
  progress: number; // 0-100
  target_value?: number;
  current_value?: number;
  unit?: string;
  start_date: string;
  end_date?: string;
  reminder_enabled: boolean;
  reminder_time?: string;
  frequency: GoalFrequency;
  streak_count: number;
  is_public: boolean;
  tags: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
  user_id: number;
}

export interface DailyGoal {
  id: number;
  title: string;
  description?: string;
  category: GoalCategory;
  status: 'pending' | 'completed' | 'skipped';
  priority: GoalPriority;
  target_value?: number;
  current_value?: number;
  unit?: string;
  reminder_time?: string;
  completed_at?: string;
  date: string; // YYYY-MM-DD
  streak_count: number;
  tags: string[];
  created_at: string;
  updated_at: string;
  user_id: number;
}

export interface GoalProgress {
  id: number;
  goal_id: number;
  date: string;
  progress_value: number;
  notes?: string;
  created_at: string;
}

export interface GoalMilestone {
  id: number;
  goal_id: number;
  title: string;
  description?: string;
  target_date: string;
  completed_date?: string;
  is_completed: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface GoalGroup {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  member_count: number;
  is_public: boolean;
  category: GoalCategory;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface GoalGroupMember {
  id: number;
  group_id: number;
  user_id: number;
  role: 'member' | 'moderator' | 'admin';
  joined_at: string;
  user: {
    id: number;
    full_name: string;
    avatar?: string;
  };
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  category: string;
  condition: string;
  points: number;
  is_rare: boolean;
  created_at: string;
}

export interface UserAchievement {
  id: number;
  user_id: number;
  achievement_id: number;
  unlocked_at: string;
  achievement: Achievement;
}

// Request/Response interfaces
export interface CreateGoalRequest {
  title: string;
  description?: string;
  type: GoalType;
  category: GoalCategory;
  priority: GoalPriority;
  target_value?: number;
  unit?: string;
  start_date: string;
  end_date?: string;
  reminder_enabled: boolean;
  reminder_time?: string;
  frequency: GoalFrequency;
  is_public: boolean;
  tags: string[];
  notes?: string;
  milestones?: Omit<GoalMilestone, 'id' | 'goal_id' | 'created_at' | 'updated_at'>[];
}

export interface UpdateGoalRequest {
  title?: string;
  description?: string;
  category?: GoalCategory;
  priority?: GoalPriority;
  target_value?: number;
  unit?: string;
  end_date?: string;
  reminder_enabled?: boolean;
  reminder_time?: string;
  frequency?: GoalFrequency;
  is_public?: boolean;
  tags?: string[];
  notes?: string;
}

export interface UpdateGoalProgressRequest {
  progress?: number;
  current_value?: number;
  notes?: string;
}

export interface GoalStatsResponse {
  total_goals: number;
  completed_goals: number;
  active_goals: number;
  completion_rate: number;
  current_streak: number;
  longest_streak: number;
  total_points: number;
  achievements_count: number;
  goals_by_category: Record<GoalCategory, number>;
  goals_by_status: Record<GoalStatus, number>;
  monthly_progress: {
    month: string;
    completed: number;
    created: number;
  }[];
}

export interface GoalFilters {
  status?: GoalStatus[];
  category?: GoalCategory[];
  type?: GoalType[];
  priority?: GoalPriority[];
  tags?: string[];
  date_from?: string;
  date_to?: string;
  search?: string;
  sort_by?: 'created_at' | 'updated_at' | 'priority' | 'progress' | 'end_date';
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedGoalsResponse {
  goals: Goal[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
} 