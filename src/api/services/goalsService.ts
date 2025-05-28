import { API_CONFIG, API_HEADERS } from '../../constants/api';

export type GoalStatus = 'completed' | 'inProgress' | 'upcoming' | 'overdue';

export interface DailyGoal {
  id: string;
  title: string;
  category: string;
  status: GoalStatus;
  description?: string;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  deadline?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DailyGoalsResponse {
  goals: DailyGoal[];
  totalGoals: number;
  completedGoals: number;
  completionPercentage: number;
}

class GoalsService {
  private baseURL = API_CONFIG.BASE_URL;

  async getDailyGoals(): Promise<DailyGoalsResponse> {
    try {
      const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.DAILY_GOALS}`, {
        method: 'GET',
        headers: API_HEADERS,
      });
      console.log(response);
      

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform the response to match our expected format if needed
      const goals = (data.goals || data || []).map((goal: any) => ({
        ...goal,
        // Map API status to component status if needed
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
      console.error('Error fetching daily goals:', error);
      throw error;
    }
  }

  private mapApiStatusToGoalStatus(apiStatus: string): GoalStatus {
    switch (apiStatus) {
      case 'completed':
        return 'completed';
      case 'inProgress':
      case 'in_progress':
        return 'inProgress';
      case 'notStarted':
      case 'not_started':
      case 'upcoming':
        return 'upcoming';
      case 'overdue':
        return 'overdue';
      default:
        return 'upcoming';
    }
  }

  private mapGoalStatusToApi(status: GoalStatus): string {
    switch (status) {
      case 'completed':
        return 'completed';
      case 'inProgress':
        return 'inProgress';
      case 'upcoming':
        return 'notStarted';
      case 'overdue':
        return 'overdue';
      default:
        return 'notStarted';
    }
  }

  async updateGoalStatus(goalId: string, status: GoalStatus): Promise<DailyGoal> {
    try {
      const response = await fetch(`${this.baseURL}/goals/${goalId}/status`, {
        method: 'PATCH',
        headers: API_HEADERS,
        body: JSON.stringify({ status: this.mapGoalStatusToApi(status) }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        ...data,
        status: this.mapApiStatusToGoalStatus(data.status),
      };
    } catch (error) {
      console.error('Error updating goal status:', error);
      throw error;
    }
  }
}

export const goalsService = new GoalsService(); 