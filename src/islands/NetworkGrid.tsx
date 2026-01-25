import { useEffect, useRef, useCallback, useState } from 'react';

interface NetworkGridProps {
  className?: string;
  nodeCount?: number;
  connectionDistance?: number;
  nodeColor?: string;
  lineColor?: string;
  nodeSize?: number;
  speed?: number;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
}

export function NetworkGrid({
  className = '',
  nodeCount = 60,
  connectionDistance = 150,
  nodeColor = '#fcd34d',
  lineColor = '#fcd34d',
  nodeSize = 2,
  speed = 0.5,
}: NetworkGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const nodesRef = useRef<Node[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const sizeRef = useRef({ w: 0, h: 0 });
  const animationRef = useRef<number>();
  const dprRef = useRef(1);
  const configRef = useRef({ nodeCount, connectionDistance, nodeSize });

  const hexToRgb = useCallback((hex: string): [number, number, number] => {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
      hex = hex.split('').map((c) => c + c).join('');
    }
    const num = parseInt(hex, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }, []);

  const getResponsiveConfig = useCallback(() => {
    const width = sizeRef.current.w;

    // Mobile: < 640px
    if (width < 640) {
      return {
        nodeCount: Math.min(nodeCount, 25),
        connectionDistance: Math.min(connectionDistance, 100),
        nodeSize: nodeSize * 0.8,
      };
    }
    // Tablet: 640px - 1024px
    if (width < 1024) {
      return {
        nodeCount: Math.min(nodeCount, 40),
        connectionDistance: Math.min(connectionDistance, 120),
        nodeSize: nodeSize * 0.9,
      };
    }
    // Desktop
    return {
      nodeCount,
      connectionDistance,
      nodeSize,
    };
  }, [nodeCount, connectionDistance, nodeSize]);

  const createNode = useCallback((canvasWidth: number, canvasHeight: number): Node => {
    const config = configRef.current;
    return {
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      radius: Math.random() * config.nodeSize + 1,
      alpha: Math.random() * 0.5 + 0.3,
    };
  }, [speed]);

  const initNodes = useCallback(() => {
    const { w, h } = sizeRef.current;
    const config = getResponsiveConfig();
    configRef.current = config;

    nodesRef.current = [];
    for (let i = 0; i < config.nodeCount; i++) {
      nodesRef.current.push(createNode(w, h));
    }
  }, [createNode, getResponsiveConfig]);

  const resizeCanvas = useCallback(() => {
    if (!containerRef.current || !canvasRef.current || !contextRef.current) return;

    sizeRef.current.w = containerRef.current.offsetWidth;
    sizeRef.current.h = containerRef.current.offsetHeight;

    canvasRef.current.width = sizeRef.current.w * dprRef.current;
    canvasRef.current.height = sizeRef.current.h * dprRef.current;
    canvasRef.current.style.width = `${sizeRef.current.w}px`;
    canvasRef.current.style.height = `${sizeRef.current.h}px`;
    contextRef.current.scale(dprRef.current, dprRef.current);

    initNodes();
  }, [initNodes]);

  const animate = useCallback(() => {
    const ctx = contextRef.current;
    const { w, h } = sizeRef.current;
    const nodes = nodesRef.current;
    const mouse = mouseRef.current;
    const config = configRef.current;

    if (!ctx || w === 0 || h === 0) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    ctx.clearRect(0, 0, w, h);

    const nodeRgb = hexToRgb(nodeColor);
    const lineRgb = hexToRgb(lineColor);

    // Update and draw nodes
    nodes.forEach((node) => {
      // Move node
      node.x += node.vx;
      node.y += node.vy;

      // Bounce off edges
      if (node.x < 0 || node.x > w) node.vx *= -1;
      if (node.y < 0 || node.y > h) node.vy *= -1;

      // Keep in bounds
      node.x = Math.max(0, Math.min(w, node.x));
      node.y = Math.max(0, Math.min(h, node.y));

      // Mouse/touch interaction - nodes move away slightly
      const dx = node.x - mouse.x;
      const dy = node.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100 && dist > 0) {
        const force = (100 - dist) / 100 * 0.5;
        node.x += (dx / dist) * force;
        node.y += (dy / dist) * force;
      }
    });

    // Draw connections
    const connDist = config.connectionDistance;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connDist) {
          const alpha = (1 - dist / connDist) * 0.4;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${lineRgb.join(',')}, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }

      // Draw connections to mouse/touch
      if (mouse.x > 0 && mouse.y > 0) {
        const mdx = nodes[i].x - mouse.x;
        const mdy = nodes[i].y - mouse.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < connDist * 1.5) {
          const alpha = (1 - mDist / (connDist * 1.5)) * 0.6;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${lineRgb.join(',')}, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    nodes.forEach((node) => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${nodeRgb.join(',')}, ${node.alpha})`;
      ctx.fill();

      // Glow effect
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius * 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${nodeRgb.join(',')}, ${node.alpha * 0.2})`;
      ctx.fill();
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [hexToRgb, lineColor, nodeColor]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Limit DPR on mobile for better performance
    const isMobile = window.innerWidth < 640;
    dprRef.current = isMobile ? Math.min(window.devicePixelRatio || 1, 2) : (window.devicePixelRatio || 1);

    if (canvasRef.current) {
      contextRef.current = canvasRef.current.getContext('2d');
    }

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    const initTimeout = setTimeout(() => {
      resizeCanvas();
      animationRef.current = requestAnimationFrame(animate);
    }, 100);

    // Mouse events
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    // Touch events for mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (!containerRef.current || !e.touches[0]) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = e.touches[0].clientX - rect.left;
      mouseRef.current.y = e.touches[0].clientY - rect.top;
    };

    const handleTouchEnd = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    containerRef.current?.addEventListener('mouseleave', handleMouseLeave);
    containerRef.current?.addEventListener('touchmove', handleTouchMove, { passive: true });
    containerRef.current?.addEventListener('touchend', handleTouchEnd);

    return () => {
      clearTimeout(initTimeout);
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, resizeCanvas]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
}

export default NetworkGrid;
