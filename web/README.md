# PRO CORP 2.0 - Website

This is the Next.js implementation of the PRO CORP 2.0 website, featuring a scroll-driven hero, premium minimalist design, and full responsive layout.

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation






1. Navigate to the `web` directory:
   ```bash
   cd web
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Running Locally

To start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Hero Video Asset

The Home page features a scroll-driven video effect.

**Current Status:**
- A **WebP fallback** is currently in place (`web/public/hero-fallback.webp`).
- The code is ready to use a high-quality MP4 (`web/public/hero-scroll.mp4`) if available, which allows for smoother scrubbing.

### How to Change the Hero Asset

1. **Scroll-Scrubbing Video (Recommended)**:
   - Convert your animation to a high-quality MP4.
   - Name it `hero-scroll.mp4`.
   - Place it in `web/public/`.
   - The site will automatically detect and use it for the scrubbing effect.

   *FFmpeg Command for conversion (if you have the source frames or high-res WebP):*
   ```bash
   ffmpeg -i input.webp -c:v libx264 -crf 20 -pix_fmt yuv420p web/public/hero-scroll.mp4
   ```

2. **Animated WebP (Current Fallback)**:
   - If you prefer to use an animated WebP (no scrubbing, just playback/parallax), replace `web/public/hero-fallback.webp`.

## Deployment

This project is a standard Next.js application and can be deployed easily on Vercel or Netlify.

```bash
npm run build
```

## Structure

- `src/app`: Page routes (Home, Projects, Studio, Journal, Contact).
- `src/components/layout`: Global components (Navbar, Footer).
- `src/components/home`: Home-specific sections (ScrollHero, Manifesto, etc.).
- `src/styles`: Tailwind configuration and global CSS.
