# Senior Frontend Developer Portfolio

A modern, interactive portfolio website built with Next.js, TypeScript, and Tailwind CSS showcasing 4+ years of experience in frontend development.

## Features

- **Interactive UI** with smooth animations using Framer Motion
- **Dark Mode Support** with system preference detection
- **Responsive Design** optimized for all devices
- **Dynamic Project Gallery** with filtering capabilities
- **Skills Visualization** with animated progress bars
- **Professional Timeline** showcasing work experience
- **Contact Form** for direct communication
- **Type Animation** for dynamic role display
- **Smooth Scrolling** navigation

## Tech Stack

- **Framework:** Next.js 15.5
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Type Animation:** React Type Animation
- **Intersection Observer:** React Intersection Observer

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
cd portfolio-website
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Customization

### Personal Information

Edit `/lib/data.ts` to update:
- Personal details (name, email, location)
- Social media links
- Skills and proficiency levels
- Projects with descriptions and technologies
- Work experience timeline
- Testimonials

### Styling

- Global styles: `/app/globals.css`
- Dark mode: Controlled via the navbar toggle
- Colors: Using Tailwind's gradient utilities

## Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
portfolio-website/
├── app/
│   ├── page.tsx           # Main page component
│   ├── layout.tsx         # Root layout with metadata
│   └── globals.css        # Global styles
├── components/
│   ├── Navbar.tsx         # Navigation with dark mode
│   ├── Hero.tsx           # Landing section
│   ├── Skills.tsx         # Skills visualization
│   ├── Projects.tsx       # Project gallery
│   ├── Experience.tsx     # Work timeline
│   ├── Contact.tsx        # Contact form
│   └── Footer.tsx         # Footer section
├── lib/
│   └── data.ts            # Portfolio data
└── public/
    └── ...                # Static assets
```

## Performance Optimizations

- **Code Splitting:** Automatic with Next.js
- **Image Optimization:** Using Next.js Image component
- **Lazy Loading:** Components load on scroll
- **SEO Ready:** Meta tags and Open Graph support
- **Responsive:** Mobile-first design approach

## Contact

For any questions or suggestions, please reach out through the contact form on the portfolio or via the provided social media links.