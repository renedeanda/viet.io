# Image Optimization Script

This script automatically optimizes all images in the `public/img` directory at build time, eliminating the need for Vercel's image optimization service.

## Features

- **In-place optimization**: Optimizes images directly, no code changes needed
- **Smart caching**: Only processes changed images using MD5 hashing
- **Screenshot resizing**: Automatically resizes screenshots to 720x300 for consistency
- **Quality optimization**: Compresses PNGs and JPEGs with optimal settings
- **Zero runtime cost**: All optimization happens at build time

## Configuration

Edit `scripts/optimize-images.js` to adjust settings:

```javascript
const CONFIG = {
  screenshot: {
    width: 720,
    height: 300,
    quality: 75,  // 0-100
  },
  avatar: {
    width: 200,
    height: 200,
    quality: 85,  // Higher quality for avatars
  },
  general: {
    quality: 80,
  }
};
```

## Usage

The script runs automatically during build:

```bash
npm run build  # Runs optimization, then builds
```

Or run manually:

```bash
npm run optimize:images
```

## How It Works

1. **Scans** all PNG and JPEG files in `public/img/`
2. **Checks cache** to skip already optimized images
3. **Optimizes** images:
   - Screenshots: Resizes to 720x300 + compresses
   - Avatars: Compresses only (no resize to maintain quality)
   - Other images: Compresses with default settings
4. **Saves** optimized version only if smaller than original
5. **Caches** file hashes to skip unchanged images on next run

## Expected Results

For a typical site with 382MB of images:

- **Screenshots**: 40-60% size reduction (resizing + compression)
- **Avatars**: 20-30% size reduction (compression only)
- **Overall**: 30-50% total size reduction
- **Build time**: ~1-2 minutes for initial run, ~5-10 seconds for cached builds

## Benefits

✅ **No Vercel Image Optimization costs**
✅ **Faster deployments** (smaller bundle size)
✅ **Better performance** (smaller images = faster loading)
✅ **Predictable builds** (no runtime optimization)
✅ **No code changes required** (works with existing image paths)

## Cache File

The script maintains `.image-optimization-cache.json` to track optimized images. This file is:

- Automatically created on first run
- Updated after each optimization
- Ignored by git (in .gitignore)
- Safe to delete (script will regenerate it)

## Troubleshooting

### Images not being optimized

Delete the cache and run again:

```bash
rm .image-optimization-cache.json
npm run optimize:images
```

### Out of memory errors

The script processes images sequentially to avoid memory issues. If you still encounter problems, reduce the number of images or increase Node.js memory:

```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run optimize:images
```

### Build failures

The script will continue even if individual images fail. Check the error output for specific file issues.

## Technical Details

- **Library**: Sharp (fast Node.js image processing)
- **Optimization**: MozJPEG for JPEGs, pngquant for PNGs
- **Processing**: Sequential (to manage memory usage)
- **Caching**: MD5 hash-based (detects file changes)
- **Safety**: Creates temp files, only replaces if optimization succeeded

## Future Improvements

Potential enhancements:

- WebP format generation
- Parallel processing with worker threads
- Progressive image loading support
- Automatic art direction (different sizes for mobile/desktop)
