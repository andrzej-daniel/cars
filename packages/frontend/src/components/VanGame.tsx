import { useEffect, useRef, useState, useCallback } from "react";

const CANVAS_W = 800;
const CANVAS_H = 200;
const GROUND_Y = 160;
const GRAVITY = 1.0;
const JUMP_FORCE = -14.5;
const GAME_SPEED_INIT = 3;
const GAME_SPEED_INC = 0.001;

const VAN_W = 80;
const VAN_H = 50;
const CACTUS_W = 20;
const CACTUS_MIN_H = 30;
const CACTUS_MAX_H = 50;
const CACTUS_MIN_GAP = 200;
const CACTUS_MAX_GAP = 400;

interface Cactus {
  x: number;
  h: number;
}

export function VanGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"idle" | "playing" | "over">("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem("van-game-highscore");
    return saved ? parseInt(saved, 10) : 0;
  });

  const stateRef = useRef({
    vanY: GROUND_Y - VAN_H,
    velY: 0,
    isJumping: false,
    speed: GAME_SPEED_INIT,
    cacti: [] as Cactus[],
    nextCactus: 300,
    score: 0,
    gameState: "idle" as "idle" | "playing" | "over",
    animFrame: 0,
    wheelAngle: 0,
  });

  const drawVan = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, wheelAngle: number) => {
    // Van body
    ctx.fillStyle = "#1B3564";
    ctx.beginPath();
    ctx.roundRect(x, y + 8, 60, 32, 4);
    ctx.fill();

    // Cabin
    ctx.fillStyle = "#1B3564";
    ctx.beginPath();
    ctx.moveTo(x + 60, y + 15);
    ctx.lineTo(x + 75, y + 15);
    ctx.lineTo(x + 80, y + 25);
    ctx.lineTo(x + 80, y + 40);
    ctx.lineTo(x + 60, y + 40);
    ctx.closePath();
    ctx.fill();

    // Windshield
    ctx.fillStyle = "#6B8EC2";
    ctx.beginPath();
    ctx.moveTo(x + 62, y + 17);
    ctx.lineTo(x + 73, y + 17);
    ctx.lineTo(x + 78, y + 25);
    ctx.lineTo(x + 78, y + 30);
    ctx.lineTo(x + 62, y + 30);
    ctx.closePath();
    ctx.fill();

    // Green Q logo
    ctx.fillStyle = "#5BBF21";
    ctx.beginPath();
    ctx.arc(x + 25, y + 22, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 12px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Q", x + 25, y + 27);

    // Green stripe
    ctx.fillStyle = "#5BBF21";
    ctx.fillRect(x, y + 36, 60, 2);

    // Headlight
    ctx.fillStyle = "#FFD966";
    ctx.fillRect(x + 76, y + 28, 4, 3);

    // Bottom
    ctx.fillStyle = "#142847";
    ctx.fillRect(x, y + 40, 80, 3);

    // Wheels
    const drawWheel = (wx: number) => {
      ctx.save();
      ctx.translate(wx, y + 44);
      ctx.fillStyle = "#333";
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#666";
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();
      // Spoke
      ctx.strokeStyle = "#888";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(Math.cos(wheelAngle) * 4, Math.sin(wheelAngle) * 4);
      ctx.lineTo(-Math.cos(wheelAngle) * 4, -Math.sin(wheelAngle) * 4);
      ctx.stroke();
      ctx.restore();
    };
    drawWheel(x + 15);
    drawWheel(x + 65);
  }, []);

  const drawCactus = useCallback((ctx: CanvasRenderingContext2D, x: number, h: number) => {
    const y = GROUND_Y - h;
    // Main trunk
    ctx.fillStyle = "#2D8C2D";
    ctx.beginPath();
    ctx.roundRect(x + 6, y, 8, h, 3);
    ctx.fill();
    // Left arm
    ctx.fillStyle = "#38A338";
    ctx.beginPath();
    ctx.roundRect(x, y + 8, 6, 18, 3);
    ctx.fill();
    ctx.fillRect(x + 4, y + 8, 4, 4);
    // Right arm
    ctx.beginPath();
    ctx.roundRect(x + 14, y + 14, 6, 14, 3);
    ctx.fill();
    ctx.fillRect(x + 12, y + 14, 4, 4);
    // Spines
    ctx.strokeStyle = "#1E6B1E";
    ctx.lineWidth = 1;
    for (let i = 0; i < h; i += 6) {
      ctx.beginPath();
      ctx.moveTo(x + 10, y + i);
      ctx.lineTo(x + 10 + (i % 12 === 0 ? 3 : -3), y + i - 2);
      ctx.stroke();
    }
  }, []);

  const startGame = useCallback(() => {
    const s = stateRef.current;
    s.vanY = GROUND_Y - VAN_H;
    s.velY = 0;
    s.isJumping = false;
    s.speed = GAME_SPEED_INIT;
    s.cacti = [];
    s.nextCactus = 300;
    s.score = 0;
    s.gameState = "playing";
    s.wheelAngle = 0;
    setScore(0);
    setGameState("playing");
  }, []);

  const jump = useCallback(() => {
    const s = stateRef.current;
    if (s.gameState === "idle" || s.gameState === "over") {
      startGame();
      return;
    }
    if (!s.isJumping) {
      s.velY = JUMP_FORCE;
      s.isJumping = true;
    }
  }, [startGame]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [jump]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    const loop = () => {
      const s = stateRef.current;
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      // Sky gradient
      const grad = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
      grad.addColorStop(0, "#E8F0FE");
      grad.addColorStop(1, "#F4F6F8");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, CANVAS_W, GROUND_Y);

      // Ground
      ctx.fillStyle = "#D4D8DC";
      ctx.fillRect(0, GROUND_Y, CANVAS_W, 2);
      // Ground texture
      ctx.fillStyle = "#E8EAEC";
      ctx.fillRect(0, GROUND_Y + 2, CANVAS_W, CANVAS_H - GROUND_Y - 2);

      if (s.gameState === "playing") {
        // Physics
        s.velY += GRAVITY;
        s.vanY += s.velY;
        if (s.vanY >= GROUND_Y - VAN_H) {
          s.vanY = GROUND_Y - VAN_H;
          s.velY = 0;
          s.isJumping = false;
        }

        s.speed += GAME_SPEED_INC;
        s.wheelAngle += s.speed * 0.1;

        // Spawn cacti
        s.nextCactus -= s.speed;
        if (s.nextCactus <= 0) {
          const h = CACTUS_MIN_H + Math.random() * (CACTUS_MAX_H - CACTUS_MIN_H);
          s.cacti.push({ x: CANVAS_W + 20, h });
          s.nextCactus = CACTUS_MIN_GAP + Math.random() * (CACTUS_MAX_GAP - CACTUS_MIN_GAP);
        }

        // Move cacti
        for (const c of s.cacti) {
          c.x -= s.speed;
        }
        s.cacti = s.cacti.filter((c) => c.x > -CACTUS_W - 10);

        // Collision
        const vanLeft = 30;
        const vanRight = 30 + VAN_W - 10;
        const vanTop = s.vanY + 5;
        const vanBottom = s.vanY + VAN_H;
        for (const c of s.cacti) {
          const cLeft = c.x;
          const cRight = c.x + CACTUS_W;
          const cTop = GROUND_Y - c.h;
          if (vanRight > cLeft && vanLeft < cRight && vanBottom > cTop) {
            s.gameState = "over";
            setGameState("over");
            if (s.score > highScore) {
              setHighScore(s.score);
              localStorage.setItem("van-game-highscore", String(s.score));
            }
            break;
          }
        }

        // Score
        s.score += 1;
        if (s.score % 3 === 0) setScore(Math.floor(s.score / 3));
      }

      // Draw cacti
      for (const c of s.cacti) {
        drawCactus(ctx, c.x, c.h);
      }

      // Draw van
      drawVan(ctx, 30, s.vanY, s.wheelAngle);

      // UI overlay
      if (s.gameState === "idle") {
        ctx.fillStyle = "rgba(27, 53, 100, 0.7)";
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 24px Inter, system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Van Runner", CANVAS_W / 2, 80);
        ctx.font = "16px Inter, system-ui, sans-serif";
        ctx.fillStyle = "#5BBF21";
        ctx.fillText("Spacja / dotknij aby zacząć", CANVAS_W / 2, 120);
      }

      if (s.gameState === "over") {
        ctx.fillStyle = "rgba(27, 53, 100, 0.7)";
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 24px Inter, system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Game Over!", CANVAS_W / 2, 70);
        ctx.font = "18px Inter, system-ui, sans-serif";
        ctx.fillText(`Wynik: ${Math.floor(s.score / 3)}`, CANVAS_W / 2, 100);
        ctx.font = "14px Inter, system-ui, sans-serif";
        ctx.fillStyle = "#5BBF21";
        ctx.fillText("Spacja / dotknij aby zagrać ponownie", CANVAS_W / 2, 135);
      }

      // HUD
      if (s.gameState === "playing") {
        ctx.fillStyle = "#1B3564";
        ctx.font = "bold 16px Inter, system-ui, sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(`${Math.floor(s.score / 3)}`, CANVAS_W - 20, 30);
        if (highScore > 0) {
          ctx.fillStyle = "#999";
          ctx.font = "12px Inter, system-ui, sans-serif";
          ctx.fillText(`HI ${highScore}`, CANVAS_W - 20, 48);
        }
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [drawVan, drawCactus, highScore]);

  return (
    <div className="flex flex-col items-center gap-3">
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        className="w-full max-w-[800px] rounded-xl border border-gray-200 cursor-pointer bg-white shadow-sm"
        onClick={jump}
        onTouchStart={(e) => { e.preventDefault(); jump(); }}
      />
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span>Wynik: <strong className="text-alcar-blue">{score}</strong></span>
        {highScore > 0 && <span>Rekord: <strong className="text-q-green">{highScore}</strong></span>}
      </div>
    </div>
  );
}
