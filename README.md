# Goal Tracker

A mobile application built with React Native and Expo to help users track their goals, finances, and overall progress.

## Features

- **Login Screen**: Simple authentication flow
- **Curved Bottom Tab Navigation**: Beautiful curved tab bar with 4 main sections
- **Overview Screen**: Dashboard showing goal progress and statistics
- **Goals Screen**: Manage and track various goals with categories
- **Finance Screen**: Track financial goals and transactions 
- **Profile Screen**: User profile management

## Technologies

- React Native
- Expo
- TypeScript
- React Navigation
- React Native Curved Bottom Bar

## Project Structure

```
/src
  /components        # Reusable UI components
  /constants         # App constants (theme, configurations)
  /navigation        # Navigation configuration
  /screens           # App screens
    - LoginScreen.tsx
    - OverviewScreen.tsx
    - GoalsScreen.tsx
    - FinanceScreen.tsx
    - ProfileScreen.tsx
  /utils             # Utility functions
  App.tsx            # Main App component
```

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```

## Screenshots

*Screenshots will be added when available*

## Development Roadmap

- Add actual authentication
- Implement data persistence with AsyncStorage
- Connect to a backend API
- Add push notifications for goal reminders
