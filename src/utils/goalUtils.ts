/**
 * Goal utility functions for consistent behavior across the app
 */

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
      return '#10B981';
    case 'inProgress':
      return '#3B82F6';
    case 'overdue':
      return '#EF4444';
    default:
      return '#F59E0B';
  }
};

export const getStatusText = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'Hoàn thành';
    case 'inProgress':
      return 'Đang thực hiện';
    case 'overdue':
      return 'Quá hạn';
    default:
      return 'Sắp tới';
  }
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const formatDateRelative = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return `Quá hạn ${Math.abs(diffDays)} ngày`;
  } else if (diffDays === 0) {
    return 'Hôm nay';
  } else if (diffDays === 1) {
    return 'Ngày mai';
  } else if (diffDays <= 7) {
    return `${diffDays} ngày nữa`;
  } else {
    return formatDate(dateString);
  }
};

export const getStatusIcon = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'checkmark-circle';
    case 'inProgress':
      return 'play-circle';
    case 'overdue':
      return 'warning';
    default:
      return 'time';
  }
};

export const calculateProgress = (completed: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

export const getProgressColor = (progress: number): string => {
  if (progress >= 100) return '#10B981'; // Green
  if (progress >= 75) return '#3B82F6';  // Blue
  if (progress >= 50) return '#F59E0B';  // Orange
  if (progress >= 25) return '#F97316';  // Amber
  return '#EF4444'; // Red
};

export type GoalStatus = 'completed' | 'inProgress' | 'overdue' | 'upcoming';
export type GoalStatusFilter = GoalStatus | 'all'; 