import { API_CONFIG } from '../../constants/API_CONSTANTS';
import { httpClient } from '../httpClient';

export type GoalStatus = 'completed' | 'inProgress' | 'upcoming' | 'overdue';
export type GoalStatusFilter = GoalStatus | 'all';
export type GoalType = 'daily' | 'short_term' | 'medium_term' | 'long_term';

// API Status mapping
export type ApiStatus = 'ACTIVE' | 'COMPLETED' | 'PENDING' | 'OVERDUE' | 'active' | 'completed' | 'pending' | 'overdue';

export interface Goal {
  id: number;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status: GoalStatus;
  type: GoalType;
  progress?: number;
  createdAt?: string;
  updatedAt?: string;
  // Legacy fields for backward compatibility
  title?: string;
  category?: string;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  deadline?: string;
}

export interface DailyGoal extends Goal {
  type: 'daily';
}

export interface MediumTermGoal extends Goal {
  type: 'medium_term';
}

export interface LongTermGoal extends Goal {
  type: 'long_term';
  notes?: any[];
  mediumTermGoals?: MediumTermGoal[];
  dailyGoals?: DailyGoal[];
}

export interface GoalsResponse {
  goals: Goal[];
  totalGoals: number;
  completedGoals: number;
  completionPercentage: number;
}

export interface DailyGoalsResponse extends GoalsResponse {
  goals: DailyGoal[];
}

export interface LongTermGoalsResponse extends GoalsResponse {
  goals: LongTermGoal[];
}

class GoalsService {
  async getDailyGoals(): Promise<DailyGoalsResponse> {
    try {
      console.log('📅 Fetching daily goals...');
      
      const response = await httpClient.get<any>(API_CONFIG.ENDPOINTS.DAILY_GOALS);
      const data = response.data;
      
      // Transform the response to match our expected format if needed
      const goals = (data.goals || data || []).map((goal: any) => ({
        ...goal,
        type: 'daily' as const,
        status: this.mapApiStatusToGoalStatus(goal.status),
      }));

      const completedGoals = goals.filter((g: DailyGoal) => g.status === 'completed');
      
      return {
        goals,
        totalGoals: data.totalGoals || goals.length,
        completedGoals: data.completedGoals || completedGoals.length,
        completionPercentage: data.completionPercentage || 
          Math.round((completedGoals.length / Math.max(goals.length, 1)) * 100),
      };
    } catch (error) {
      console.error('❌ Error fetching daily goals:', error);
      throw error;
    }
  }

  async getLongTermGoals(status?: GoalStatusFilter): Promise<LongTermGoalsResponse> {
    try {
      console.log('🎯 Fetching long term goals, status filter:', status);
      
      const params: any = {};
      if (status && status !== 'all') {
        params.status = this.mapGoalStatusToApi(status);
      }

      const response = await httpClient.get<any>(API_CONFIG.ENDPOINTS.LONG_TERM_GOALS, params);
      const data = response.data;
      
      console.log('🎯 Raw API response:', data);
      
      // Transform the response to match our expected format
      const goals = (Array.isArray(data) ? data : data.goals || []).map((goal: any) => ({
        ...goal,
        type: 'long_term' as const,
        status: this.mapApiStatusToGoalStatus(goal.status),
        progress: goal.progress || 0,
        // Map API fields to UI fields for compatibility
        title: goal.name || goal.title,
        category: goal.category || 'Mục tiêu dài hạn',
        deadline: goal.endDate || goal.deadline,
      }));

      const completedGoals = goals.filter((g: LongTermGoal) => g.status === 'completed');
      
      return {
        goals,
        totalGoals: goals.length,
        completedGoals: completedGoals.length,
        completionPercentage: Math.round((completedGoals.length / Math.max(goals.length, 1)) * 100),
      };
    } catch (error) {
      console.error('❌ Error fetching long term goals:', error);
      throw error;
    }
  }

  async getMediumTermGoals(status?: GoalStatusFilter): Promise<GoalsResponse> {
    try {
      console.log('🎯 Fetching medium term goals, status filter:', status);
      
      const params: any = {};
      if (status && status !== 'all') {
        params.status = this.mapGoalStatusToApi(status as GoalStatus);
      }

      const response = await httpClient.get<any>(API_CONFIG.ENDPOINTS.MEDIUM_TERM_GOALS, params);
      const data = response.data;
      
      const goals = (data.goals || data || []).map((goal: any) => ({
        ...goal,
        type: 'medium_term' as const,
        status: this.mapApiStatusToGoalStatus(goal.status),
        progress: goal.progress || this.calculateProgress(goal.currentValue, goal.targetValue),
      }));

      const completedGoals = goals.filter((g: Goal) => g.status === 'completed');
      
      return {
        goals,
        totalGoals: data.totalGoals || goals.length,
        completedGoals: data.completedGoals || completedGoals.length,
        completionPercentage: data.completionPercentage || 
          Math.round((completedGoals.length / Math.max(goals.length, 1)) * 100),
      };
    } catch (error) {
      console.error('❌ Error fetching medium term goals:', error);
      throw error;
    }
  }

  private calculateProgress(currentValue?: number, targetValue?: number): number {
    if (!currentValue || !targetValue) return 0;
    return Math.min(Math.round((currentValue / targetValue) * 100), 100);
  }

  private mapApiStatusToGoalStatus(apiStatus: string): GoalStatus {
    switch (apiStatus?.toUpperCase()) {
      case 'COMPLETED':
        return 'completed';
      case 'ACTIVE':
      case 'INPROGRESS':
      case 'IN_PROGRESS':
        return 'inProgress';
      case 'PENDING':
      case 'NOTSTARTED':
      case 'NOT_STARTED':
      case 'UPCOMING':
        return 'upcoming';
      case 'OVERDUE':
        return 'overdue';
      default:
        return 'upcoming';
    }
  }

  private mapGoalStatusToApi(status: GoalStatus): string {
    switch (status) {
      case 'completed':
        return 'COMPLETED';
      case 'inProgress':
        return 'ACTIVE';
      case 'upcoming':
        return 'PENDING';
      case 'overdue':
        return 'OVERDUE';
      default:
        return 'PENDING';
    }
  }

  async updateGoalStatus(goalId: string, status: GoalStatus): Promise<Goal> {
    try {
      console.log('🔄 Updating goal status:', goalId, status);
      
      const response = await httpClient.patch<any>(`/goals/${goalId}/status`, {
        status: this.mapGoalStatusToApi(status)
      });

      return {
        ...response.data,
        status: this.mapApiStatusToGoalStatus(response.data.status),
      };
    } catch (error) {
      console.error('❌ Error updating goal status:', error);
      throw error;
    }
  }

  async updateGoalProgress(goalId: number, updateData: any): Promise<LongTermGoal> {
    try {
      console.log('📊 Updating goal progress:', goalId, updateData);
      
      const response = await httpClient.patch<any>(`/goals/${goalId}/progress`, updateData);
      const data = response.data;

      return {
        ...data,
        type: 'long_term' as const,
        status: this.mapApiStatusToGoalStatus(data.status),
        title: data.name || data.title,
        category: data.category || 'Mục tiêu dài hạn',
        deadline: data.endDate || data.deadline,
        progress: data.progress || 0,
      };
    } catch (error) {
      console.error('❌ Error updating goal progress:', error);
      throw error;
    }
  }

  async getGoalById(goalId: number): Promise<LongTermGoal> {
    try {
      console.log('🎯 Fetching goal by ID:', goalId);
      
      const response = await httpClient.get<any>(`${API_CONFIG.ENDPOINTS.LONG_TERM_GOALS}/${goalId}`);
      const data = response.data;
      
      return {
        ...data,
        type: 'long_term' as const,
        status: this.mapApiStatusToGoalStatus(data.status),
        progress: data.progress || 0,
        title: data.name || data.title,
        category: data.category || 'Mục tiêu dài hạn',
        deadline: data.endDate || data.deadline,
      };
    } catch (error) {
      console.error('❌ Error fetching goal by ID:', error);
      throw error;
    }
  }

  async getGoalMilestones(goalId: number): Promise<any[]> {
    try {
      console.log('🎯 Fetching goal milestones:', goalId);
      
      // For now, return milestones from mediumTermGoals if available
      const goal = await this.getGoalById(goalId);
      return goal.mediumTermGoals || [];
    } catch (error) {
      console.error('❌ Error fetching goal milestones:', error);
      return [];
    }
  }

  async getGoalProgress(goalId: number): Promise<any[]> {
    try {
      console.log('🎯 Fetching goal progress:', goalId);
      
      // Return empty array for now - implement when progress endpoint is available
      return [];
    } catch (error) {
      console.error('❌ Error fetching goal progress:', error);
      return [];
    }
  }

  async addGoalProgress(goalId: number, progressData: any): Promise<any> {
    try {
      console.log('📊 Adding goal progress:', goalId, progressData);
      
      // Implement when progress endpoint is available
      return { success: true };
    } catch (error) {
      console.error('❌ Error adding goal progress:', error);
      throw error;
    }
  }

  async completeGoalMilestone(goalId: number, milestoneId: number): Promise<any> {
    try {
      console.log('✅ Completing milestone:', goalId, milestoneId);
      
      // Implement when milestone completion endpoint is available
      return { success: true };
    } catch (error) {
      console.error('❌ Error completing milestone:', error);
      throw error;
    }
  }

  async deleteGoal(goalId: number): Promise<any> {
    try {
      console.log('🗑️ Deleting goal:', goalId);
      
      await httpClient.delete(`${API_CONFIG.ENDPOINTS.LONG_TERM_GOALS}/${goalId}`);
      return { success: true };
    } catch (error) {
      console.error('❌ Error deleting goal:', error);
      throw error;
    }
  }
}

export const goalsService = new GoalsService(); 