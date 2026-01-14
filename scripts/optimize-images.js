const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const IMAGE_DIR = path.join(__dirname, '../public/img');
const CACHE_FILE = path.join(__dirname, '../.image-optimization-cache.json');

// Configuration
const CONFIG = {
  screenshot: {
    width: 720,
    height: 300,
    quality: 75,
  },
  avatar: {
    width: 200,
    height: 200,
    quality: 85,
  },
  general: {
    quality: 80,
  }
};

// Statistics tracking
const stats = {
  processed: 0,
  skipped: 0,
  errors: 0,
  originalSize: 0,
  optimizedSize: 0
};

/**
 * Load cache of already optimized images
 */
async function loadCache() {
  try {
    const data = await fs.readFile(CACHE_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

/**
 * Save cache of optimized images
 */
async function saveCache(cache) {
  await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2));
}

/**
 * Get file hash
 */
async function getFileHash(filePath) {
  const buffer = await fs.readFile(filePath);
  return crypto.createHash('md5').update(buffer).digest('hex');
}

/**
 * Get all image files recursively
 */
async function getImageFiles(dir) {
  const files = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...await getImageFiles(fullPath));
      } else if (/\.(png|jpe?g)$/i.test(entry.name)) {
        files.push(fullPath);
      }
    }
  } catch (err) {
    console.warn(`Warning: Could not read directory ${dir}`);
  }

  return files;
}

/**
 * Determine optimization config based on filename
 */
function getOptimizationConfig(filename) {
  if (filename.includes('screenshot')) {
    return CONFIG.screenshot;
  } else if (filename.includes('avatar')) {
    return CONFIG.avatar;
  }
  return CONFIG.general;
}

/**
 * Optimize a single image in-place
 */
async function optimizeImage(inputPath, cache) {
  try {
    const filename = path.basename(inputPath);
    const relativePath = path.relative(IMAGE_DIR, inputPath);

    // Get file stats
    const inputStat = await fs.stat(inputPath);

    // Check cache - skip if already optimized with same hash
    const fileHash = await getFileHash(inputPath);
    if (cache[relativePath] === fileHash) {
      stats.skipped++;
      return;
    }

    stats.originalSize += inputStat.size;

    // Get optimization config
    const config = getOptimizationConfig(filename);

    // Create temp file path
    const tempPath = inputPath + '.tmp';

    // Load and optimize image
    let pipeline = sharp(inputPath);

    // Get image metadata
    const metadata = await pipeline.metadata();

    // Resize if needed (only downscale for screenshots, keep avatars for quality)
    if (filename.includes('screenshot') && config.width &&
        (metadata.width > config.width || metadata.height > config.height)) {
      pipeline = pipeline.resize(config.width, config.height, {
        fit: 'cover',
        position: 'center',
        withoutEnlargement: true
      });
    }

    // Optimize based on format
    const ext = path.extname(inputPath).toLowerCase();
    if (ext === '.png') {
      pipeline = pipeline.png({
        quality: config.quality,
        compressionLevel: 9,
        adaptiveFiltering: true,
        palette: true
      });
    } else if (ext === '.jpg' || ext === '.jpeg') {
      pipeline = pipeline.jpeg({
        quality: config.quality,
        progressive: true,
        mozjpeg: true
      });
    }

    // Save to temp file
    await pipeline.toFile(tempPath);

    // Check if optimization actually helped
    const tempStat = await fs.stat(tempPath);

    if (tempStat.size < inputStat.size) {
      // Replace original with optimized version
      await fs.unlink(inputPath);
      await fs.rename(tempPath, inputPath);

      stats.optimizedSize += tempStat.size;

      const savings = ((1 - tempStat.size / inputStat.size) * 100).toFixed(1);
      const beforeKB = (inputStat.size / 1024).toFixed(0);
      const afterKB = (tempStat.size / 1024).toFixed(0);
      console.log(`✓ ${relativePath} (${savings}% smaller: ${beforeKB}KB → ${afterKB}KB)`);

      // Update cache with new hash
      const newHash = await getFileHash(inputPath);
      cache[relativePath] = newHash;
    } else {
      // Keep original, delete temp
      await fs.unlink(tempPath);
      stats.optimizedSize += inputStat.size;
      console.log(`⊘ ${relativePath} (already optimal)`);

      // Mark as optimized in cache
      cache[relativePath] = fileHash;
    }

    stats.processed++;

  } catch (error) {
    stats.errors++;
    console.error(`✗ ${inputPath}: ${error.message}`);

    // Clean up temp file if it exists
    try {
      await fs.unlink(inputPath + '.tmp');
    } catch {}
  }
}

/**
 * Main optimization function
 */
async function main() {
  console.log('🖼️  Starting image optimization...\n');

  const startTime = Date.now();

  try {
    // Load cache
    const cache = await loadCache();

    // Get all image files
    const imageFiles = await getImageFiles(IMAGE_DIR);

    if (imageFiles.length === 0) {
      console.log('No images found to optimize.');
      return;
    }

    console.log(`Found ${imageFiles.length} images to check\n`);

    // Process images sequentially to avoid high memory usage
    for (const file of imageFiles) {
      await optimizeImage(file, cache);
    }

    // Save cache
    await saveCache(cache);

    // Print statistics
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    const originalMB = (stats.originalSize / 1024 / 1024).toFixed(2);
    const optimizedMB = (stats.optimizedSize / 1024 / 1024).toFixed(2);
    const savedMB = (originalMB - optimizedMB).toFixed(2);
    const savedPercent = stats.originalSize > 0
      ? ((1 - stats.optimizedSize / stats.originalSize) * 100).toFixed(1)
      : 0;

    console.log('\n' + '='.repeat(60));
    console.log('📊 Image Optimization Complete!');
    console.log('='.repeat(60));
    console.log(`✓ Processed:      ${stats.processed} images`);
    console.log(`⊘ Skipped:        ${stats.skipped} images (cached/already optimal)`);
    console.log(`✗ Errors:         ${stats.errors} images`);
    console.log(`⏱  Duration:       ${duration}s`);

    if (stats.processed > 0) {
      console.log(`💾 Original size:  ${originalMB} MB`);
      console.log(`💾 Optimized size: ${optimizedMB} MB`);
      console.log(`🎉 Saved:          ${savedMB} MB (${savedPercent}%)`);
    }

    console.log('='.repeat(60) + '\n');

    // Exit successfully
    process.exit(0);

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main };
