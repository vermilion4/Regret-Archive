# Regret Archive

A safe, anonymous platform for sharing regrets and life lessons. Connect with others who understand your experiences and turn regrets into collective wisdom.

## 🌟 Features

### Core Features
- **Anonymous Sharing**: Share regrets without revealing your identity
- **Category-based Browsing**: Filter regrets by life areas (career, relationships, money, etc.)
- **Support System**: React with "Me Too", "Hugs", and "Wisdom"
- **Comment System**: Add supportive comments, share similar experiences, or offer advice
- **Sliding Doors**: Vote on alternate timelines and "what if" scenarios

### Advanced Features
- **Real-time Updates**: Live reactions and comments
- **Insights Dashboard**: Community analytics and patterns
- **Responsive Design**: Beautiful UI that works on all devices
- **Dark Theme**: Contemplative, easy-on-the-eyes design

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui for consistent design system
- **Backend**: Appwrite (Database, Auth, Real-time)
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Appwrite account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd regret-archive
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_APPWRITE_ENDPOINT=your_appwrite_endpoint
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
   ```

4. **Set up Appwrite Database**
   
   Create the following collections in your Appwrite project:

   **Collection: `regrets`**
   ```json
   {
     "title": "string",
     "story": "string", 
     "lesson": "string",
     "category": "string",
     "age_when_happened": "integer",
     "years_ago": "integer", 
     "anonymous_id": "string",
     "reactions": "object",
     "comment_count": "integer",
     "sliding_doors": "object",
     "created_at": "string",
     "updated_at": "string",
     "is_featured": "boolean"
   }
   ```

   **Collection: `comments`**
   ```json
   {
     "regret_id": "string",
     "content": "string",
     "anonymous_id": "string", 
     "comment_type": "string",
     "reactions": "object",
     "created_at": "string"
   }
   ```

   **Collection: `reactions`**
   ```json
   {
     "target_id": "string",
     "target_type": "string",
     "reaction_type": "string",
     "anonymous_id": "string",
     "created_at": "string"
   }
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
regret-archive/
├── src/
│   ├── app/
│   │   ├── globals.css              # Global styles and theme
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Home page
│   │   ├── submit/
│   │   │   └── page.tsx            # Submit regret form
│   │   ├── regret/
│   │   │   └── [id]/
│   │   │       └── page.tsx        # Individual regret view
│   │   └── insights/
│   │       └── page.tsx            # Analytics dashboard
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components
│   │   ├── Header.tsx              # Navigation header
│   │   ├── Footer.tsx              # Site footer
│   │   ├── RegretCard.tsx          # Regret display card
│   │   ├── RegretForm.tsx          # Multi-step submission form
│   │   ├── CategoryFilter.tsx      # Category filtering
│   │   ├── CommentSection.tsx      # Comments and replies
│   │   ├── SupportReactions.tsx    # Reaction buttons
│   │   └── SlidingDoorsModal.tsx   # Alternate timeline voting
│   └── lib/
│       ├── appwrite.ts             # Appwrite configuration
│       ├── types.ts                # TypeScript type definitions
│       └── utils.ts                # Utility functions
├── public/                         # Static assets
└── package.json
```

## 🎨 Design System

### Color Palette
- **Primary**: Sage green (#22c55e) - represents growth and support
- **Background**: Dark theme for contemplative experience
- **Categories**: Color-coded badges for easy identification

### Typography
- **Headlines**: Serif font for warmth and readability
- **Body**: Sans-serif for clean, modern feel
- **Quotes**: Italic serif for emphasis

### Components
- **Cards**: Clean, bordered containers with hover effects
- **Buttons**: Consistent styling with clear hierarchy
- **Forms**: Multi-step process with validation feedback

## 🔧 Configuration

### Appwrite Setup
1. Create a new Appwrite project
2. Set up the database and collections as specified above
3. Configure permissions for anonymous access
4. Add your project credentials to environment variables

### Customization
- **Categories**: Modify `CATEGORIES` array in `src/lib/types.ts`
- **Styling**: Update CSS variables in `src/app/globals.css`
- **Validation**: Adjust form schemas in component files

## 📱 Pages & Features

### Home Page (`/`)
- Featured regret showcase
- Category filtering
- Sort by recent/popular
- Infinite scroll pagination

### Submit Page (`/submit`)
- Multi-step form process
- Category selection with descriptions
- Story and lesson input
- Optional context fields
- Sliding doors alternate timeline

### Regret Detail Page (`/regret/[id]`)
- Full story display
- Support reactions
- Comment section
- Sliding doors voting
- Related regrets

### Insights Page (`/insights`)
- Community analytics
- Category breakdown
- Age demographics
- Engagement metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with compassion for those processing regrets
- Inspired by the power of shared experiences
- Designed to foster empathy and growth

## 🆘 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

**Remember**: Every regret shared helps someone else feel less alone. Your story matters. 💚