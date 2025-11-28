# Contributing to Student Offers Platform

Thank you for your interest in contributing to the Student Offers Platform! We welcome contributions from the community.

## Tech Stack

This project is built with a modern frontend stack:

- **Framework**: [React](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest) (React Query)
- **Routing**: [React Router](https://reactrouter.com/)
- **Analytics**: [PostHog](https://posthog.com/)
- **Backend/Database**: [Supabase](https://supabase.com/)

## Project Structure

- `src/components`: Reusable UI components
  - `src/components/ui`: Core UI primitives (shadcn/ui)
  - `src/components/layout`: Layout components (Header, Footer, etc.)
  - `src/components/offers`: Offer-related components
- `src/pages`: Route components (pages)
- `src/lib`: Utility functions, helpers, and configurations
- `src/hooks`: Custom React hooks
- `src/providers`: Context providers (Theme, Auth, etc.)
- `src/types`: TypeScript type definitions

## How to Contribute

### Reporting Issues
- Use GitHub Issues to report bugs or suggest features
- Provide clear descriptions and steps to reproduce issues
- Include screenshots if relevant

### Submitting Offers
- Use the built-in submission form on the website
- Ensure offers are legitimate and student-focused
- Include all required information

### Code Contributions

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
   - Follow existing code style
   - Add comments for complex logic
   - Test your changes locally
4. **Commit your changes**
   ```bash
   git commit -m "Add: brief description of your changes"
   ```
5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Create a Pull Request**
   - Provide a clear description of changes
   - Reference any related issues
   - Wait for review and feedback

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/student-offers-platform.git
   cd student-offers-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Required variables:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_ADMIN_EMAIL=your_admin_email
   VITE_PUBLIC_POSTHOG_KEY=your_posthog_key
   VITE_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Test the consent system**
   - Clear localStorage to see the cookie banner
   - Test different consent options
   - Verify analytics tracking works correctly

## Code Style

- **TypeScript**: Use TypeScript for all new code with proper type definitions
- **Naming**: Follow existing camelCase/PascalCase conventions
- **Styling**: Use Tailwind CSS classes, avoid inline styles
- **Components**: Keep components small, focused, and reusable
- **Error Handling**: Add proper error handling and user feedback
- **Privacy**: Always check consent before adding analytics/tracking code
- **Accessibility**: Include ARIA labels, keyboard navigation, and screen reader support

## Areas for Contribution

### Content & Offers
- **New Offers**: Submit verified student offers & discounts
- **Offer Verification**: Help verify and update existing offers
- **Category Organization**: Improve offer categorization and tagging

### Technical Improvements
- **UI/UX Enhancements**: Improve user interface and experience
- **Performance Optimization**: Optimize loading times and responsiveness
- **Accessibility**: Enhance accessibility features and compliance
- **Mobile Experience**: Improve mobile responsiveness and touch interactions

### Privacy & Compliance
- **Consent System**: Enhance cookie consent management features
- **Privacy Features**: Add new privacy protection mechanisms
- **Legal Compliance**: Help maintain GDPR/CCPA/DPDP compliance
- **Analytics**: Improve privacy-compliant analytics implementation

### Development & Testing
- **Testing**: Add unit tests, integration tests, and E2E tests
- **Documentation**: Improve guides, API docs, and code comments
- **DevOps**: Enhance build processes and deployment workflows
- **Code Quality**: Refactor code, improve TypeScript types, optimize performance

### Special Focus Areas
- **Cookie Consent System**: Located in `src/lib/consentManager.ts` and `src/components/layout/`
- **Privacy-First Analytics**: PostHog integration with consent management
- **Responsive Design**: Ensure all components work across all device sizes
- **Cross-Browser Compatibility**: Test and fix issues across different browsers

## Questions?

Feel free to reach out:
- Email: [hello@studentoffers.co](mailto:hello@studentoffers.co)
- GitHub Issues: For technical questions
- GitHub Discussions: For general discussions

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help create a welcoming environment for all contributors
- Follow GitHub's community guidelines

Thank you for helping make education more accessible for students! 🎓