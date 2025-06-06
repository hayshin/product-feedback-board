# Product Feedback Board

A comprehensive application for collecting and managing user feedback, built with modern React and Next.js technologies.

## Features

### Basic Level (useState)
- Add feedback with form validation
- Display list of all feedback items
- Delete feedback functionality

### Intermediate Level (Zustand)
- Total feedback count tracking
- Voting system (upvote/downvote)
- Filter by popularity and date
- Sort by multiple criteria

### Advanced Level (Zustand + Extensions)
- Edit feedback in modal dialog
- Category support (UI, Performance, Feature, Bug)
- State persistence in localStorage
- Theme switching (light/dark mode)

### Bonus Features
- Card animations (Framer Motion)
- Drag-and-drop sorting (@dnd-kit)
- Weekly activity statistics
- Data export/import (JSON format)

## Technology Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first styling
- **Zustand** - State management
- **Framer Motion** - Animations
- **@dnd-kit** - Drag and drop
- **Shadcn/ui** - UI component library
- **date-fns** - Date manipulation

## Installation and Setup

### Prerequisites
- Node.js 18 or higher
- Package manager: bun, npm, yarn, or pnpm

### Install Dependencies

#### Using Bun (Recommended)
```bash
bun install
```

#### Using npm
```bash
npm install
```

### Development Server

#### Using Bun
```bash
bun run dev
```

#### Using npm
```bash
npm run dev
```

The application will be available at: http://localhost:3000

## Deployment

### Vercel (Recommended for Next.js)
1. Connect your repository to Vercel
2. Vercel will automatically detect Next.js settings
3. Deployment occurs automatically on each push

## Usage Guide

### Adding Feedback
1. Click the "Add Feedback" button
2. Fill out the form with title, description, and category
3. Click "Submit" to add the feedback

### Voting System
- Use upvote/downvote buttons to vote on feedback items
- Click again to remove your vote
- **Use can revote for demonstating purposes**

### Filtering and Sorting
- **Sorting**: By date, popularity, or category
- **Filtering**: By categories (UI, Performance, Feature, Bug)

### Editing Feedback
- Click the edit icon on any feedback card
- Modify the required fields and save changes

### Theme Switching
- Toggle between light and dark themes using the theme button

### Drag & Drop
- Card reordering functionality is temporarily unavailable
- Implementation planned for future releases

### Statistics
- Click "Statistics" to view weekly activity overview

### Data Management
- **Export**: Save all data to a JSON file
- **Import**: Load data from a JSON file

## Project Structure

```
product-feedback-board/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── ui/               # UI components (Shadcn)
│   ├── FeedbackForm.tsx  # Feedback form
│   ├── FeedbackItem.tsx  # Feedback card
│   ├── FeedbackList.tsx  # List with drag-and-drop
│   ├── FeedbackControls.tsx # Filters and controls
│   └── ThemeProvider.tsx # Theme provider
├── store/                # Zustand stores
│   └── feedback-store.ts # Main store
└── lib/                  # Utilities
    └── utils.ts         # Helper functions
```

## State Architecture

The application demonstrates three levels of state management:

1. **useState** - Local component state for forms
2. **Zustand** - Global application state
3. **Persist middleware** - localStorage persistence