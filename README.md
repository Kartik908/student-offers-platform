# 🎓 Student Offers & Discounts Platform

> A curated directory of student discounts and free tools/services to help students save money and access premium resources.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/student-offers-platform)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)

## ✨ Features

- 🔍 **Smart Search & Filtering** - Find offers by category, company, or keywords
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🎯 **Category Navigation** - Browse offers organized by type (Software, Education, Entertainment, etc.)
- 📝 **Community Submissions** - Users can submit new offers for review
- 🛡️ **Admin Dashboard** - Secure admin panel for managing offers and submissions
- 📊 **Privacy-First Analytics** - Consent-aware PostHog integration with granular controls
- 🍪 **Advanced Cookie Consent** - GDPR/CCPA/India DPDP compliant with 4-tier consent system
- 🔒 **Privacy by Design** - No tracking without explicit consent, IP masking, PII protection
- ⚡ **Fast Performance** - Built with Vite for lightning-fast development and builds

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Radix UI Components
- **Backend**: Supabase (Database + Authentication)
- **Analytics**: PostHog (consent-aware)
- **Privacy**: Custom consent management system
- **Deployment**: Vercel
- **State Management**: React Hooks + Context
- **Routing**: React Router DOM

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

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
   
   Edit `.env` with your actual values:
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

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **One-click deploy**
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/student-offers-platform)

2. **Manual deployment**
   ```bash
   npm run build
   vercel --prod
   ```

3. **Environment Variables**
   Set the following in your Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_EMAIL`
   - `VITE_PUBLIC_POSTHOG_KEY`
   - `VITE_PUBLIC_POSTHOG_HOST`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── admin/          # Admin dashboard components
│   ├── categories/     # Category navigation
│   ├── contact/        # Contact form components
│   ├── feedback/       # Feedback system
│   ├── hero/          # Landing page hero section
│   ├── layout/        # Layout components (header, footer, cookie banner)
│   ├── nav/           # Navigation components
│   ├── offers/        # Offer display components
│   └── ui/            # Base UI components (buttons, modals, etc.)
├── hooks/             # Custom React hooks (including useConsent)
├── lib/               # Utility functions and configurations
│   ├── consentManager.ts    # Cookie consent logic
│   ├── posthogConsent.ts    # PostHog privacy integration
│   └── trackingManager.ts   # Consent-aware analytics
├── pages/             # Page components
├── services/          # API service functions
└── types/             # TypeScript type definitions
```

## 🍪 Cookie Consent & Privacy System

This platform implements a comprehensive, privacy-first cookie consent system that's compliant with GDPR, CCPA, and India's DPDP Act.

### Features
- **4-Tier Consent System**: Necessary, Functional, Analytics, Marketing
- **Privacy by Design**: No tracking without explicit user consent
- **Cross-Tab Sync**: Consent preferences synchronized across browser tabs
- **Granular Controls**: Users can enable/disable specific cookie categories
- **Persistent Management**: Easy access to modify preferences anytime
- **Legal Compliance**: Built for global privacy regulations

### Cookie Categories

| Category | Always Active | Description | Examples |
|----------|---------------|-------------|----------|
| **Necessary** | ✅ | Essential site functionality | Session management, security, basic errors |
| **Functional** | ❌ | Enhanced user experience | Theme preferences, UI settings, session recording |
| **Analytics** | ❌ | Usage insights (anonymized) | Page views, feature usage, performance metrics |
| **Marketing** | ❌ | Campaign attribution | UTM tracking, referral sources, social sharing |

### Implementation Details
- **PostHog Integration**: Consent-aware analytics with automatic feature toggling
- **IP Masking**: All analytics data is anonymized and IP-masked
- **PII Protection**: No personal information collected without explicit consent
- **Event Buffering**: Analytics events queued until consent is given
- **Storage Management**: Preferences stored in localStorage with cross-tab sync

### For Developers
```typescript
// Check consent status
import { hasConsentFor } from '@/lib/consentManager';

if (hasConsentFor('analytics')) {
  // Track analytics event
  trackPageView('/dashboard');
}

// Use the consent hook
import { useConsent } from '@/hooks/useConsent';

const { preferences, consentGiven, updateConsent } = useConsent();
```

See [docs/CONSENT_SYSTEM.md](./docs/CONSENT_SYSTEM.md) for complete documentation.

## 🔒 Security

- See [SECURITY.md](./SECURITY.md) for detailed security setup
- **Never commit `.env` files** to version control
- Admin access requires environment variable configuration
- All user inputs are sanitized and validated
- Supabase Row Level Security (RLS) policies implemented
- **Privacy-first analytics** with consent management and IP masking

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | ✅ |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | ✅ |
| `VITE_ADMIN_EMAIL` | Admin email for dashboard access | ✅ |
| `VITE_PUBLIC_POSTHOG_KEY` | PostHog analytics key | ✅ |
| `VITE_PUBLIC_POSTHOG_HOST` | PostHog host URL (default: US region) | ✅ |

## 🗺️ Roadmap

### Privacy & Compliance
- [x] GDPR/CCPA/India DPDP compliant consent system
- [x] Privacy-first PostHog analytics integration
- [x] Granular cookie consent management
- [ ] Geolocation-based consent requirements
- [ ] Automated compliance reporting

### Features
- [ ] User authentication and profiles
- [ ] Offer expiration tracking
- [ ] Email notifications for new offers
- [ ] Mobile app (React Native)
- [ ] API for third-party integrations
- [ ] Advanced filtering and sorting options

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) for the backend infrastructure
- [Tailwind CSS](https://tailwindcss.com/) for the styling system
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [PostHog](https://posthog.com/) for analytics
- All the students who contribute offers to help their peers

## 📞 Support

- 📧 Email: [hello@studentoffers.co](mailto:hello@studentoffers.co)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/student-offers-platform/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/student-offers-platform/discussions)

---

Made with ❤️ for students!
# Force rebuild
