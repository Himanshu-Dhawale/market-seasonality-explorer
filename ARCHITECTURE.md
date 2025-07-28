# Architecture Documentation

## Overview

The Market Seasonality Explorer follows a modern React architecture with clear separation of concerns and unidirectional data flow.

## Architecture Patterns

### Component Architecture
- **Presentation Components**: Pure UI components with props
- **Container Components**: Data-fetching and state management
- **Compound Components**: Complex UI patterns (Calendar, Dashboard)

### State Management Strategy
- **Global State**: Zustand for app-wide state (filters, preferences)
- **Server State**: TanStack Query for API data caching
- **Local State**: React useState for component-specific state

### Data Flow Pattern
\`\`\`
User Action → Store Update → Hook Refetch → Component Re-render
\`\`\`

## Core Systems

### 1. Calendar System
- **MarketCalendar**: Main calendar grid
- **CalendarCell**: Individual date cells with metrics
- **Navigation**: Month-by-month browsing

### 2. Data Management
- **API Layer**: Binance integration with error handling
- **Cache Layer**: TanStack Query with smart invalidation
- **State Layer**: Zustand with persistence

### 3. Visualization System
- **Charts**: Recharts integration for historical data
- **Metrics**: Color-coded visual indicators
- **Responsive**: Adaptive layouts for all screen sizes

## Design Decisions

### Why Zustand?
- Minimal boilerplate compared to Redux
- TypeScript-first design
- Built-in persistence support
- Excellent DevTools integration

### Why TanStack Query?
- Automatic caching and background updates
- Built-in loading and error states
- Optimistic updates and mutations
- Perfect for API-heavy applications

### Why shadcn/ui?
- Consistent design system
- Accessible components
- Customizable with Tailwind
- Copy-paste friendly

## Performance Considerations

### Data Fetching
- Prefetch adjacent months for smooth navigation
- Stale-while-revalidate for better UX
- Exponential backoff for failed requests

### Rendering Optimization
- Memoized calendar calculations
- Virtualized large datasets (if needed)
- Optimized re-renders with proper dependencies

### Bundle Optimization
- Tree-shaking for unused code
- Dynamic imports for heavy components
- Optimized build with Next.js

## Error Boundaries

### API Errors
- Network connectivity issues
- Rate limiting (429 errors)
- Invalid parameters (400 errors)
- Server errors (500 errors)

### Data Validation
- Type checking with TypeScript
- Runtime validation for API responses
- Graceful handling of missing data

## Testing Strategy

### Unit Tests
- Pure functions and utilities
- Component rendering logic
- State management actions

### Integration Tests
- API integration layer
- Component interactions
- Data flow scenarios

### E2E Tests
- Critical user journeys
- Cross-browser compatibility
- Performance benchmarks
