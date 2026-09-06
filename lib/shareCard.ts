const COLOR_HEX: Record<string, string> = {
  crimson: '#ff1f3d',
  gold: '#ffb020',
  violet: '#8b5cf6',
  magenta: '#ff2e88',
};

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ');
  let line = '';
  let curY = y;
  for (const word of words) {
    const test = `${line}${word} `;
    if (ctx.measureText(test).width > maxWidth && line !== '') {
      ctx.fillText(line.trim(), x, curY);
      line = `${word} `;
      curY += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line.trim(), x, curY);
  return curY;
}

interface ShareCardOptions {
  title: string;
  subtitle: string;
  username: string;
  color: keyof typeof COLOR_HEX | string;
}

export async function shareOtakuCard({ title, subtitle, username, color }: ShareCardOptions): Promise<'shared' | 'downloaded' | 'failed'> {
  const hex = COLOR_HEX[color] || color;
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 840;
  const ctx = canvas.getContext('2d');
  if (!ctx) return 'failed';

  ctx.fillStyle = '#0a0808';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const grad = ctx.createRadialGradient(320, 300, 40, 320, 300, 480);
  grad.addColorStop(0, `${hex}44`);
  grad.addColorStop(1, '#0a080800');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = hex;
  ctx.lineWidth = 6;
  ctx.strokeRect(24, 24, canvas.width - 48, canvas.height - 48);

  ctx.textAlign = 'center';
  ctx.fillStyle = hex;
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('OTAKU WARS', canvas.width / 2, 100);

  ctx.fillStyle = '#f5efe6';
  ctx.font = 'bold 52px sans-serif';
  const titleEndY = wrapText(ctx, title, canvas.width / 2, 380, 480, 60);

  ctx.fillStyle = hex;
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText(subtitle, canvas.width / 2, titleEndY + 60);

  ctx.fillStyle = '#a89a91';
  ctx.font = '22px sans-serif';
  ctx.fillText(`@${username}`, canvas.width / 2, canvas.height - 90);

  const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  if (!blob) return 'failed';

  const file = new File([blob], 'otaku-wars-card.png', { type: 'image/png' });

  if (typeof navigator.share === 'function' && typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title, text: `${title} — débloqué sur Otaku Wars !` });
      return 'shared';
    } catch {
      // annulé par l'utilisateur ou échec silencieux — on retombe sur le téléchargement
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'otaku-wars-card.png';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  return 'downloaded';
}
