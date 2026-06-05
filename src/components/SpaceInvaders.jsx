import React, { useState, useEffect, useRef } from 'react';

const SpaceInvaders = () => {
  const canvasRef = useRef(null);
  const [userInput, setUserInput] = useState(false);
  
  const scoreRef = useRef(0);
  const gameStateRef = useRef('playing');
  const particlesRef = useRef([]);
  const resetTimeoutRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let width, height;
    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = 450;
    };
    resize();
    window.addEventListener('resize', resize);

    let player = { x: width / 2 - 20, y: height - 60, w: 40, h: 20, speed: 8 };
    let bullets = [];
    let invaderBullets = [];
    let invaders = [];
    let barriers = [];
    let direction = 1;
    let invaderSpeed = 0.4;
    let lastShot = 0;
    let frame = 0;

    const resetGame = () => {
      gameStateRef.current = 'playing';
      scoreRef.current = 0;
      invaderSpeed = 0.4;
      bullets = [];
      invaderBullets = [];
      particlesRef.current = [];
      initInvaders();
      initBarriers();
    };

    const initBarriers = () => {
      barriers = [];
      const numBarriers = 4;
      const spacing = width / (numBarriers + 1);
      for (let i = 0; i < numBarriers; i++) {
        const bx = (i + 1) * spacing - 40;
        const by = height - 120;
        for (let row = 0; row < 4; row++) {
          for (let col = 0; col < 10; col++) {
            barriers.push({ x: bx + col * 8, y: by + row * 8, w: 8, h: 8, hp: 1 });
          }
        }
      }
    };

    const initInvaders = () => {
      invaders = [];
      const cols = Math.min(Math.floor(width / 70), 12);
      const startX = (width - (cols * 60)) / 2;
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < cols; col++) {
          invaders.push({
            x: startX + col * 60,
            y: row * 35 + 60,
            w: 30,
            h: 22,
            alive: true,
            type: row === 0 ? 'squid' : (row < 3 ? 'crab' : 'octopus'),
            points: (4 - row) * 10
          });
        }
      }
    };

    initInvaders();
    initBarriers();

    const createExplosion = (x, y, color) => {
      for (let i = 0; i < 8; i++) {
        particlesRef.current.push({
          x, y,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          life: 1.0,
          color
        });
      }
    };

    const keys = {};
    const handleKeyDown = (e) => {
      if (['ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        if (e.key === ' ') e.preventDefault();
        setUserInput(true);
        keys[e.key] = true;
      }
    };
    const handleKeyUp = (e) => {
      if (['ArrowLeft', 'ArrowRight', ' '].includes(e.key)) keys[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const update = () => {
      if (gameStateRef.current !== 'playing') return;
      frame++;

      // Player
      if (userInput) {
        if (keys['ArrowLeft'] && player.x > 50) player.x -= player.speed;
        if (keys['ArrowRight'] && player.x < width - player.w - 50) player.x += player.speed;
        if (keys[' '] && Date.now() - lastShot > 400) {
          bullets.push({ x: player.x + player.w / 2, y: player.y, speed: 9 });
          lastShot = Date.now();
        }
      } else {
        // AI: Move and Shoot
        const aliveInvaders = invaders.filter(inv => inv.alive);
        if (aliveInvaders.length > 0) {
          const target = aliveInvaders.sort((a, b) => b.y - a.y || Math.abs(a.x - player.x) - Math.abs(b.x - player.x))[0];
          const targetX = target.x + target.w/2;
          if (Math.abs(player.x + player.w/2 - targetX) > 5) {
            player.x += (player.x + player.w/2 < targetX ? 5 : -5);
          }
          if (Math.abs(player.x + player.w/2 - targetX) < 20 && Date.now() - lastShot > 350) {
            bullets.push({ x: player.x + player.w / 2, y: player.y, speed: 9 });
            lastShot = Date.now();
          }
        }
      }

      // Player Bullets
      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.y -= b.speed;
        if (b.y < 0) bullets.splice(i, 1);
        
        // Barrier hit
        barriers.forEach((bar, bi) => {
          if (b.x > bar.x && b.x < bar.x + bar.w && b.y > bar.y && b.y < bar.y + bar.h) {
            barriers.splice(bi, 1);
            bullets.splice(i, 1);
          }
        });
      }

      // Invader Bullets
      for (let i = invaderBullets.length - 1; i >= 0; i--) {
        const b = invaderBullets[i];
        b.y += b.speed;
        if (b.y > height) invaderBullets.splice(i, 1);

        // Hit Player
        if (b.x > player.x && b.x < player.x + player.w && b.y > player.y && b.y < player.y + player.h) {
          gameStateRef.current = 'gameover';
          resetTimeoutRef.current = setTimeout(resetGame, 2000);
        }

        // Hit Barrier
        barriers.forEach((bar, bi) => {
          if (b.x > bar.x && b.x < bar.x + bar.w && b.y > bar.y && b.y < bar.y + bar.h) {
            barriers.splice(bi, 1);
            invaderBullets.splice(i, 1);
          }
        });
      }

      // Invaders Move & Shoot
      let edgeReached = false;
      invaders.forEach(inv => {
        if (!inv.alive) return;
        inv.x += direction * invaderSpeed;
        if (inv.x > width - 60 || inv.x < 60) edgeReached = true;
        if (inv.y + inv.h > player.y) {
          gameStateRef.current = 'gameover';
          resetTimeoutRef.current = setTimeout(resetGame, 2000);
        }

        // Shooting
        if (Math.random() < 0.001) {
          invaderBullets.push({ x: inv.x + inv.w/2, y: inv.y + inv.h, speed: 4 });
        }
      });

      if (edgeReached) {
        direction *= -1;
        invaders.forEach(inv => inv.y += 15);
      }

      // Collisions: Player Bullet -> Invader
      bullets.forEach((b, bi) => {
        invaders.forEach((inv, ii) => {
          if (inv.alive && b.x > inv.x && b.x < inv.x + inv.w && b.y > inv.y && b.y < inv.y + inv.h) {
            inv.alive = false;
            bullets.splice(bi, 1);
            scoreRef.current += inv.points;
            createExplosion(inv.x + inv.w/2, inv.y + inv.h/2, getInvaderColor(inv.type));
          }
        });
      });

      // Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx; p.y += p.vy; p.life -= 0.03;
        if (p.life <= 0) particlesRef.current.splice(i, 1);
      }

      if (invaders.every(i => !i.alive)) { invaderSpeed += 0.1; initInvaders(); }
    };

    const getInvaderColor = (type) => {
      if (type === 'squid') return '#ff3b30';
      if (type === 'crab') return '#007aff';
      return '#34c759';
    };

    const drawClassicInvader = (inv) => {
      const { x, y, w, h, type } = inv;
      const color = getInvaderColor(type);
      ctx.fillStyle = color;
      ctx.shadowBlur = 5; ctx.shadowColor = color;
      
      if (type === 'squid') {
        ctx.fillRect(x + 10, y, 10, 4);
        ctx.fillRect(x + 5, y + 4, 20, 4);
        ctx.fillRect(x, y + 8, 30, 8);
        ctx.fillRect(x + 5, y + 16, 5, 4);
        ctx.fillRect(x + 20, y + 16, 5, 4);
      } else if (type === 'crab') {
        ctx.fillRect(x + 5, y, 20, 4);
        ctx.fillRect(x, y + 4, 30, 8);
        ctx.fillRect(x + 5, y + 12, 20, 4);
        ctx.fillRect(x, y + 16, 5, 4);
        ctx.fillRect(x + 25, y + 16, 5, 4);
      } else {
        ctx.fillRect(x + 5, y, 20, 8);
        ctx.fillRect(x, y + 8, 30, 4);
        ctx.fillRect(x + 5, y + 12, 20, 4);
        ctx.fillRect(x + 2, y + 16, 6, 4);
        ctx.fillRect(x + 22, y + 16, 6, 4);
      }
      ctx.shadowBlur = 0;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      if (gameStateRef.current === 'gameover') {
        ctx.fillStyle = '#ff3b30';
        ctx.font = 'bold 30px "JetBrains Mono"';
        ctx.textAlign = 'center';
        ctx.shadowBlur = 10; ctx.shadowColor = '#ff3b30';
        ctx.fillText("SYSTEM CRITICAL: REBOOTING", width / 2, height / 2);
        ctx.shadowBlur = 0;
        return;
      }

      // Barriers
      ctx.fillStyle = 'rgba(39, 201, 63, 0.6)';
      barriers.forEach(b => ctx.fillRect(b.x, b.y, b.w, b.h));

      // Player
      ctx.fillStyle = '#fff';
      ctx.shadowBlur = 10; ctx.shadowColor = '#fff';
      ctx.fillRect(player.x, player.y, player.w, player.h);
      ctx.fillRect(player.x + 15, player.y - 8, 10, 8);
      ctx.shadowBlur = 0;

      // Bullets
      ctx.fillStyle = '#fff';
      bullets.forEach(b => ctx.fillRect(b.x - 1, b.y, 2, 10));
      ctx.fillStyle = '#ff3b30';
      invaderBullets.forEach(b => ctx.fillRect(b.x - 1, b.y, 2, 10));

      // Invaders
      invaders.forEach(inv => { if (inv.alive) drawClassicInvader(inv); });

      // Particles
      particlesRef.current.forEach(p => {
        ctx.fillStyle = `rgba(${hexToRgb(p.color)}, ${p.life})`;
        ctx.fillRect(p.x, p.y, 2, 2);
      });

      // HUD
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '12px "JetBrains Mono"';
      ctx.textAlign = 'left';
      ctx.fillText(`SCORE: ${scoreRef.current.toString().padStart(6, '0')}`, 60, 40);
      ctx.textAlign = 'right';
      ctx.fillText(userInput ? "MANUAL_CONTROL" : "AI_AUTO_PILOT", width - 60, 40);
    };

    const hexToRgb = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `${r}, ${g}, ${b}`;
    };

    let animationFrame;
    const loop = () => { update(); draw(); animationFrame = requestAnimationFrame(loop); };
    loop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', resize);
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
      cancelAnimationFrame(animationFrame);
    };
  }, [userInput]);

  return (
    <div className="space-invaders-wrap">
      <canvas ref={canvasRef} className="game-canvas" />
    </div>
  );
};

export default SpaceInvaders;
