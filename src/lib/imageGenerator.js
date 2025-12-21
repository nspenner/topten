/**
 * Generates a downloadable image of the top 10 games list.
 * @param {Array} games - The list of games.
 * @param {Object} metadata - Metadata about the list (title, author).
 */
export async function generateListImage(games, metadata) {
  // Ensure fonts are loaded before drawing
  await document.fonts.ready;

  const width = 1080;
  const height = 1920;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const bodyFont = '"BBH Hegarty", sans-serif';

  // Background Gradient
  const bgGradient = ctx.createLinearGradient(0, 0, width, height);
  bgGradient.addColorStop(0, '#5a4ee5');
  bgGradient.addColorStop(1, '#3c69bf');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  // Header
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold 70px ${bodyFont}`;
  ctx.textAlign = 'center';
  ctx.letterSpacing = '4px'; // Added slight character spacing
  ctx.fillText(metadata.title || 'Top 10 Video Games', width / 2, 120);

  if (metadata.author) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = `36px ${bodyFont}`;
    ctx.letterSpacing = '2px'; // Added slight character spacing
    ctx.fillText(`by ${metadata.author}`, width / 2, 180);
  }
  ctx.letterSpacing = '0px'; // Reset for the rest of the text

  const top3Height = 320;
  const bottom7Height = 180;
  const startY = 210;

  // Helper to load image
  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      if (!src) {
        reject(new Error('No source provided'));
        return;
      }

      const img = new Image();
      
      if (src.startsWith('data:')) {
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
        return;
      }

      img.crossOrigin = 'anonymous';
      
      img.onload = () => resolve(img);
      img.onerror = () => {
        console.error(`Failed to load image: ${src}`);
        reject(new Error(`Failed to load image: ${src}`));
      };

      img.src = src;
    });
  };

  // Draw Top 3
  for (let i = 0; i < Math.min(3, games.length); i++) {
    const game = games[i];
    const y = startY + i * top3Height;
    
    // Background for item
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(40, y, width - 80, top3Height - 20);
    
    // Accent border
    ctx.fillStyle = '#ffa500';
    ctx.fillRect(width - 48, y, 8, top3Height - 20);

    // Screenshot if available
    if (game.screenshot) {
      try {
        const img = await loadImage(game.screenshot);
        const imgWidth = width - 80;
        const imgHeight = top3Height - 20;
        
        ctx.save();
        ctx.beginPath();
        ctx.rect(40, y, imgWidth, imgHeight);
        ctx.clip();
        
        ctx.filter = 'brightness(0.5)';
        
        const aspect = img.width / img.height;
        const targetAspect = imgWidth / imgHeight;
        let sx, sy, sw, sh;
        if (aspect > targetAspect) {
          sh = img.height;
          sw = img.height * targetAspect;
          sx = (img.width - sw) / 2;
          sy = 0;
        } else {
          sw = img.width;
          sh = img.width / targetAspect;
          sx = 0;
          sy = (img.height - sh) / 2;
        }
        
        ctx.drawImage(img, sx, sy, sw, sh, 40, y, imgWidth, imgHeight);
        ctx.restore();
        ctx.filter = 'none';
      } catch (e) {
        console.error('Failed to load screenshot', e);
      }
    }

    // Rank
    const rankX = 80; // Adjusted to fit inside image (radius is 80)
    const rankY = y + (top3Height - 20) / 2;
    
    ctx.beginPath();
    ctx.arc(rankX, rankY, 80, 0, Math.PI * 2);
    ctx.fillStyle = '#ffa500';
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(rankX, rankY, 72, 0, Math.PI * 2);
    const rankGradient = ctx.createLinearGradient(rankX - 60, rankY - 60, rankX + 60, rankY + 60);
    rankGradient.addColorStop(0, '#b185db');
    rankGradient.addColorStop(1, '#7546a3');
    ctx.fillStyle = rankGradient;
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = `bold 80px ${bodyFont}`;
    ctx.textAlign = 'center';
    ctx.fillText(i + 1, rankX, rankY + 30);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold 52px ${bodyFont}`;
    ctx.textAlign = 'left';
    ctx.shadowColor = 'rgba(0,0,0,0.9)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    const title = game.title;
    const maxWidth = game.screenshot ? width - 650 : width - 300;
    let words = title.split(' ');
    let line = '';
    let lines = [];
    for (let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + ' ';
      let metrics = ctx.measureText(testLine);
      let testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        lines.push(line);
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    // Truncate to ellipsis if more than 2 lines
    if (lines.length > 2) {
      let secondLine = lines[1].trim();
      while (ctx.measureText(secondLine + "...").width > maxWidth && secondLine.length > 0) {
        secondLine = secondLine.substring(0, secondLine.length - 1);
      }
      lines[1] = secondLine + "...";
    }

    const textY = y + (top3Height - 20) / 2 + (lines.length > 1 ? -15 : 20);
    for (let j = 0; j < Math.min(2, lines.length); j++) {
      ctx.fillText(lines[j], 190, textY + j * 60);
    }
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }

  // Draw Bottom 7
  const bottomStartY = startY + 3 * top3Height + 20;
  for (let i = 3; i < Math.min(10, games.length); i++) {
    const game = games[i];
    const index = i - 3;
    const col = index % 2;
    const row = Math.floor(index / 2);
    
    const x = 40 + col * (width / 2 - 20);
    const y = bottomStartY + row * bottom7Height;
    const itemWidth = width / 2 - 60;

    // Background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(x, y, itemWidth, bottom7Height - 20);
    
    // Screenshot as background with filter
    if (game.screenshot) {
      try {
        const img = await loadImage(game.screenshot);
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, itemWidth, bottom7Height - 20);
        ctx.clip();
        
        ctx.filter = 'blur(1px) brightness(0.5)';
        
        const aspect = img.width / img.height;
        const targetAspect = itemWidth / (bottom7Height - 20);
        let sx, sy, sw, sh;
        if (aspect > targetAspect) {
          sh = img.height;
          sw = img.height * targetAspect;
          sx = (img.width - sw) / 2;
          sy = 0;
        } else {
          sw = img.width;
          sh = img.width / targetAspect;
          sx = 0;
          sy = (img.height - sh) / 2;
        }
        
        ctx.drawImage(img, sx, sy, sw, sh, x, y, itemWidth, bottom7Height - 20);
        ctx.restore();
        ctx.filter = 'none';
      } catch (e) {
        console.error('Failed to load screenshot', e);
      }
    }

    // Rank
    const rankX = x + 15;
    const rankY = y + (bottom7Height - 20) / 2;

    ctx.beginPath();
    ctx.arc(rankX, rankY, 45, 0, Math.PI * 2);
    ctx.fillStyle = '#ffa500';
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(rankX, rankY, 39, 0, Math.PI * 2);
    const rankGradient = ctx.createLinearGradient(rankX - 30, rankY - 30, rankX + 30, rankY + 30);
    rankGradient.addColorStop(0, '#b185db');
    rankGradient.addColorStop(1, '#7546a3');
    ctx.fillStyle = rankGradient;
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = `bold 40px ${bodyFont}`;
    ctx.textAlign = 'center';
    ctx.fillText(i + 1, rankX, rankY + 15);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold 32px ${bodyFont}`;
    ctx.textAlign = 'left';
    ctx.shadowColor = 'rgba(0,0,0,0.9)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    const title = game.title;
    const maxWidth = itemWidth - 90;
    let words = title.split(' ');
    let line = '';
    let lines = [];
    for (let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + ' ';
      let metrics = ctx.measureText(testLine);
      let testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        lines.push(line);
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    // Truncate to ellipsis if more than 2 lines
    if (lines.length > 2) {
      let secondLine = lines[1].trim();
      while (ctx.measureText(secondLine + "...").width > maxWidth && secondLine.length > 0) {
        secondLine = secondLine.substring(0, secondLine.length - 1);
      }
      lines[1] = secondLine + "...";
    }

    const textY = y + (bottom7Height - 20) / 2 + (lines.length > 1 ? -5 : 10);
    for (let j = 0; j < Math.min(2, lines.length); j++) {
      ctx.fillText(lines[j], x + 80, textY + j * 40);
    }
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }

  // Prominent link in the empty space (4th row, 2nd column of bottom section)
  const linkX = 40 + 1 * (width / 2 - 20);
  const linkY = bottomStartY + 3 * bottom7Height;
  const linkWidth = width / 2 - 60;
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.fillRect(linkX, linkY, linkWidth, bottom7Height - 20);
  
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold 36px 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('Create yours at', linkX + linkWidth / 2, linkY + 60);
  
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold 48px ${bodyFont}`;
  ctx.fillText('mytopten.xyz', linkX + linkWidth / 2, linkY + 120);

  // Download
  const link = document.createElement('a');
  link.download = `${metadata.title || 'top10'}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

