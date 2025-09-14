// src/pages/Lesson.jsx
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import './MathLesson.css';
import GeminiChatbot from "../components/GeminiChatBox";

// Import chapter thumbnails from the new maths_images folder
import chapter1Thumb from "../assets/maths_images/1.png";
import chapter2Thumb from "../assets/maths_images/2.png";
import chapter3Thumb from "../assets/maths_images/3.png";
import chapter4Thumb from "../assets/maths_images/4.png";
import chapter5Thumb from "../assets/maths_images/5.png";
import chapter6Thumb from "../assets/maths_images/6.png";
import chapter7Thumb from "../assets/maths_images/7.png";
import chapter8Thumb from "../assets/maths_images/8.png";
import chapter9Thumb from "../assets/maths_images/9.png";
import chapter10Thumb from "../assets/maths_images/10.png";
import chapter11Thumb from "../assets/maths_images/11.png";
import chapter12Thumb from "../assets/maths_images/12.png";
import chapter13Thumb from "../assets/maths_images/13.png";

export default function MathLesson() {
  const { id } = useParams();
  const subjectId = id || 'math';
  const displayId = (subjectId ?? 'math').toString().toUpperCase();

  // Pixelated square growth mini-canvas (like /squares)
  function MiniSquareGrowth(){
    const canvasRef = React.useRef(null);
    const containerRef = React.useRef(null);
    const visibleRef = React.useRef(false);
    const nRef = React.useRef(8);              // use ref to avoid rerenders
    const tRef = React.useRef(0);              // 0..1 fill progress
    const rafRef = React.useRef(0);
    const sizeRef = React.useRef({ W: 0, H: 0, DPR: 1 });

    React.useEffect(()=>{
      const cvs = canvasRef.current; if(!cvs) return;
      const ctx = cvs.getContext('2d');
      const ro = new ResizeObserver(()=>{
        const parent = cvs.parentElement;
        // keep DPR at 1 to reduce GPU load
        const DPR = 1;
        const W = Math.max(1, parent.clientWidth);
        const H = Math.max(1, parent.clientHeight);
        sizeRef.current = { W, H, DPR };
        cvs.width = W*DPR; cvs.height = H*DPR; cvs.style.width = '100%'; cvs.style.height = '100%';
        ctx.setTransform(DPR,0,0,DPR,0,0);
      });
      ro.observe(cvs.parentElement);

      // Intersection observer to pause animation when offscreen
      const io = new IntersectionObserver((entries)=>{
        const e = entries[0];
        visibleRef.current = !!(e && e.isIntersecting && e.intersectionRatio > 0.2);
      }, { root: null, threshold: [0,0.2,0.5,1] });
      if(containerRef.current) io.observe(containerRef.current);

      const draw = (t)=>{
        const { W, H } = sizeRef.current; if (!W || !H) return;
        ctx.clearRect(0,0,W,H);
        ctx.fillStyle = '#0b0720'; ctx.fillRect(0,0,W,H);
        const pad = 4;
        const n = Math.max(2, Math.min(16, Math.floor(nRef.current))); // clamp just in case
        const size = Math.min(W - pad*2, H - pad*2);
        const cell = Math.max(2, Math.floor(size / n));
        const gridSize = cell * n;
        const gx = Math.floor((W - gridSize)/2);
        const gy = Math.floor((H - gridSize)/2);
        // grid lines
        ctx.strokeStyle = '#f0abfc'; ctx.lineWidth = 1;
        for(let i=0;i<=n;i++){
          ctx.beginPath(); ctx.moveTo(gx, gy + i*cell); ctx.lineTo(gx + gridSize, gy + i*cell); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(gx + i*cell, gy); ctx.lineTo(gx + i*cell, gy + gridSize); ctx.stroke();
        }
        // outline
        ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 2; ctx.strokeRect(gx-1, gy-1, gridSize+2, gridSize+2);
        // progressive fill (spiral-ish order)
        const total = n * n; const cellsToFill = Math.floor(t * total);
        // spiral index mapping
        const coords=[]; let top=0, left=0, bottom=n-1, right=n-1;
        while(top<=bottom && left<=right){
          for(let j=left;j<=right;j++) coords.push([top,j]);
          for(let i2=top+1;i2<=bottom;i2++) coords.push([i2,right]);
          if(top<bottom) for(let j=right-1;j>=left;j--) coords.push([bottom,j]);
          if(left<right) for(let i2=bottom-1;i2>top;i2--) coords.push([i2,left]);
          top++; left++; bottom--; right--;
        }
        for(let k=0;k<cellsToFill && k<coords.length;k++){
          const r = coords[k][0], c = coords[k][1];
          ctx.fillStyle = (r+c)%2===0 ? '#ff5cdf' : '#a78bfa';
          ctx.fillRect(gx + c*cell + 1, gy + r*cell + 1, cell-2, cell-2);
        }
        // label n and progress
        ctx.fillStyle='#e9d5ff'; ctx.font='12px monospace'; ctx.textAlign='left';
        ctx.fillText(`n = ${n}`, gx, gy-8);
        ctx.textAlign='right'; ctx.fillText(`${Math.round(t*100)}%`, gx+gridSize, gy-8);
      };

      let last=0; let acc=0;
      const loop = (ts)=>{
        if(!last) last = ts;
        const dt = Math.min(0.05, (ts-last)/1000); last = ts;
        // animate fill
        tRef.current += dt*0.6; if(tRef.current>1) tRef.current = 0;
        // animate n smoothly between 4..12
        acc += dt; const k = (Math.sin(acc*0.7)+1)/2; const nn = 4 + (k*8);
        nRef.current = nn; // update ref, do not trigger React re-render
        draw(tRef.current);
        rafRef.current = requestAnimationFrame(loop);
      };
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(loop);
      return ()=> { cancelAnimationFrame(rafRef.current); ro.disconnect(); io.disconnect(); };
    }, []);

    return (
      <div ref={containerRef} style={{ height:'100%' }}>
        <canvas ref={canvasRef} style={{ imageRendering:'pixelated', background:'#0b0720', width:'100%' }} />
      </div>
    );
  }

  // Original-style widgets (restored), with DPR=1 and offscreen pause
  function useCanvasSetup(canvasRef, containerRef){
    const sizeRef = React.useRef({W:0,H:0,DPR:1});
    const visibleRef = React.useRef(false);
    React.useEffect(()=>{
      const cvs=canvasRef.current; if(!cvs) return;
      const ctx=cvs.getContext('2d');
      const ro=new ResizeObserver(()=>{ const p=cvs.parentElement; const DPR=1; const W=p.clientWidth||1, H=p.clientHeight||1; sizeRef.current={W,H,DPR}; cvs.width=W*DPR; cvs.height=H*DPR; cvs.style.width='100%'; cvs.style.height='100%'; ctx.setTransform(DPR,0,0,DPR,0,0); }); ro.observe(cvs.parentElement);
      const io=new IntersectionObserver((entries)=>{ const e=entries[0]; visibleRef.current=!!(e&&e.isIntersecting&&e.intersectionRatio>0.2); }, {threshold:[0,0.2,0.5,1]}); if(containerRef.current) io.observe(containerRef.current);
      return ()=>{ ro.disconnect(); io.disconnect(); };
    },[]);
    return { sizeRef: React.useRef({W:0,H:0,DPR:1}), visibleRef };
  }

  function MiniBars(){
    const canvasRef=React.useRef(null), containerRef=React.useRef(null), tRef=React.useRef(0), rafRef=React.useRef(0);
    const sizeRef=React.useRef({W:0,H:0,DPR:1}); const visibleRef=React.useRef(false);
    React.useEffect(()=>{
      const cvs=canvasRef.current; if(!cvs) return; const ctx=cvs.getContext('2d');
      const ro=new ResizeObserver(()=>{ const p=cvs.parentElement; const DPR=1; const W=p.clientWidth||1, H=p.clientHeight||1; sizeRef.current={W,H,DPR}; cvs.width=W*DPR; cvs.height=H*DPR; cvs.style.width='100%'; cvs.style.height='100%'; ctx.setTransform(DPR,0,0,DPR,0,0);}); ro.observe(cvs.parentElement);
      const io=new IntersectionObserver((entries)=>{ const e=entries[0]; visibleRef.current=!!(e&&e.isIntersecting&&e.intersectionRatio>0.2); },{threshold:[0,0.2,0.5,1]}); if(containerRef.current) io.observe(containerRef.current);
      const draw=(t)=>{ const {W,H}=sizeRef.current; if(!W||!H) return; ctx.clearRect(0,0,W,H); ctx.fillStyle='#0b0720'; ctx.fillRect(0,0,W,H); const N=7; const bw=Math.max(8, Math.floor(W/24)); const gap=Math.max(6, Math.floor(W/80)); const ox=12; const base=H-10; const data=Array.from({length:N},(_,i)=> 30+60*((Math.sin(t*0.8+i*0.7)+1)/2)); const avg=data.reduce((a,b)=>a+b,0)/N; data.forEach((h,i)=>{ const x=ox+i*(bw+gap); ctx.fillStyle=i%2?'#a78bfa':'#ff5cdf'; ctx.fillRect(x, base-h, bw, h);}); ctx.strokeStyle='#e9d5ff'; ctx.setLineDash([6,4]); ctx.beginPath(); ctx.moveTo(6, base-avg); ctx.lineTo(W-6, base-avg); ctx.stroke(); ctx.setLineDash([]); };
      let last=0; const loop=(ts)=>{ if(!last) last=ts; const dt=Math.min(0.06,(ts-last)/1000); last=ts; if(visibleRef.current){ tRef.current+=dt; draw(tRef.current);} rafRef.current=requestAnimationFrame(loop); };
      cancelAnimationFrame(rafRef.current); rafRef.current=requestAnimationFrame(loop);
      return ()=>{ cancelAnimationFrame(rafRef.current); ro.disconnect(); io.disconnect(); };
    },[]);
    return <div ref={containerRef} style={{height:'100%'}}><canvas ref={canvasRef} style={{ imageRendering:'pixelated', background:'#0b0720', width:'100%' }} /></div>;
  }

  function MiniRationalLine(){
    const canvasRef=React.useRef(null), containerRef=React.useRef(null), tRef=React.useRef(0), rafRef=React.useRef(0);
    const sizeRef=React.useRef({W:0,H:0,DPR:1}); const visibleRef=React.useRef(false);
    React.useEffect(()=>{ const cvs=canvasRef.current; if(!cvs) return; const ctx=cvs.getContext('2d'); const ro=new ResizeObserver(()=>{ const p=cvs.parentElement; const DPR=1; const W=p.clientWidth||1,H=p.clientHeight||1; sizeRef.current={W,H,DPR}; cvs.width=W*DPR; cvs.height=H*DPR; cvs.style.width='100%'; cvs.style.height='100%'; ctx.setTransform(DPR,0,0,DPR,0,0);}); ro.observe(cvs.parentElement); const io=new IntersectionObserver((entries)=>{ const e=entries[0]; visibleRef.current=!!(e&&e.isIntersecting&&e.intersectionRatio>0.2);},{threshold:[0,0.2,0.5,1]}); if(containerRef.current) io.observe(containerRef.current); const draw=(t)=>{ const {W,H}=sizeRef.current; if(!W||!H) return; ctx.clearRect(0,0,W,H); ctx.fillStyle='#0b0720'; ctx.fillRect(0,0,W,H); const cx=W*0.5, cy=H*0.6; const L=Math.min(W*0.8,H*0.5); ctx.strokeStyle='#a78bfa'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(cx-L/2,cy); ctx.lineTo(cx+L/2,cy); ctx.stroke(); const min=-2,max=2; const mapX=(v)=> cx+((v-min)/(max-min)-0.5)*L*2; ctx.fillStyle='#e9d5ff'; ctx.font='12px monospace'; ctx.textAlign='center'; for(let v=min; v<=max; v++){ const x=mapX(v); ctx.beginPath(); ctx.moveTo(x,cy-8); ctx.lineTo(x,cy+8); ctx.stroke(); ctx.fillText(String(v), x, cy+22);} ctx.strokeStyle='#7c3aed'; [-1.5,-1,-0.5,0.5,1,1.5].forEach(v=>{ const x=mapX(v); ctx.beginPath(); ctx.moveTo(x, cy-6); ctx.lineTo(x, cy+6); ctx.stroke(); }); const qs=[2,3,4,5]; qs.forEach((q,i)=>{ const phase=t*0.4+i*0.7; const p=Math.round(((Math.sin(phase)+1)/2)*(max*q-min*q)+min*q); const val=p/q; const x=mapX(val); const y=cy-20-i*12; ctx.fillStyle=i%2?'#a78bfa':'#ff5cdf'; ctx.beginPath(); ctx.arc(x,y,4,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#c4b5fd'; ctx.fillText(`${p}/${q}`, x, y-8);});}; let last=0; const loop=(ts)=>{ if(!last) last=ts; const dt=Math.min(0.06,(ts-last)/1000); last=ts; if(visibleRef.current){ tRef.current+=dt; draw(tRef.current);} rafRef.current=requestAnimationFrame(loop);}; cancelAnimationFrame(rafRef.current); rafRef.current=requestAnimationFrame(loop); return ()=>{ cancelAnimationFrame(rafRef.current); ro.disconnect(); io.disconnect(); }; },[]);
    return <div ref={containerRef} style={{height:'100%'}}><canvas ref={canvasRef} style={{ imageRendering:'pixelated', background:'#0b0720', width:'100%' }} /></div>;
  }

  function MiniQuadMorph(){
    const canvasRef=React.useRef(null), containerRef=React.useRef(null); const tRef=React.useRef(0), rafRef=React.useRef(0); const sizeRef=React.useRef({W:0,H:0,DPR:1}); const visibleRef=React.useRef(false);
    React.useEffect(()=>{ const cvs=canvasRef.current; if(!cvs) return; const ctx=cvs.getContext('2d'); const ro=new ResizeObserver(()=>{ const p=cvs.parentElement; const DPR=1; const W=p.clientWidth||1,H=p.clientHeight||1; sizeRef.current={W,H,DPR}; cvs.width=W*DPR; cvs.height=H*DPR; cvs.style.width='100%'; cvs.style.height='100%'; ctx.setTransform(DPR,0,0,DPR,0,0);}); ro.observe(cvs.parentElement); const io=new IntersectionObserver((entries)=>{ const e=entries[0]; visibleRef.current=!!(e&&e.isIntersecting&&e.intersectionRatio>0.2);},{threshold:[0,0.2,0.5,1]}); if(containerRef.current) io.observe(containerRef.current); const draw=(t)=>{ const {W,H}=sizeRef.current; if(!W||!H) return; ctx.clearRect(0,0,W,H); ctx.fillStyle='#0b0720'; ctx.fillRect(0,0,W,H); const cx=W/2, cy=H/2; const r=Math.min(W,H)*0.35; const n=4; ctx.strokeStyle='#7c3aed'; ctx.lineWidth=2; ctx.beginPath(); for(let i=0;i<n;i++){ const a=i*(Math.PI*2/n)+Math.sin(t*0.7)*0.2; const rad=r*(1+0.12*Math.sin(t*1.3+i)); const x=cx+Math.cos(a)*rad; const y=cy+Math.sin(a)*rad; if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);} ctx.closePath(); ctx.stroke();}; let last=0; const loop=(ts)=>{ if(!last) last=ts; const dt=Math.min(0.06,(ts-last)/1000); last=ts; if(visibleRef.current){ tRef.current+=dt; draw(tRef.current);} rafRef.current=requestAnimationFrame(loop);}; cancelAnimationFrame(rafRef.current); rafRef.current=requestAnimationFrame(loop); return ()=>{ cancelAnimationFrame(rafRef.current); ro.disconnect(); io.disconnect(); }; },[]);
    return <div ref={containerRef} style={{height:'100%'}}><canvas ref={canvasRef} style={{ imageRendering:'pixelated', background:'#0b0720', width:'100%' }} /></div>;
  }

  function MiniCubeSpin(){
    const canvasRef=React.useRef(null), containerRef=React.useRef(null); const tRef=React.useRef(0), rafRef=React.useRef(0); const sizeRef=React.useRef({W:0,H:0,DPR:1}); const visibleRef=React.useRef(false);
    React.useEffect(()=>{ const cvs=canvasRef.current; if(!cvs) return; const ctx=cvs.getContext('2d'); const ro=new ResizeObserver(()=>{ const p=cvs.parentElement; const DPR=1; const W=p.clientWidth||1,H=p.clientHeight||1; sizeRef.current={W,H,DPR}; cvs.width=W*DPR; cvs.height=H*DPR; cvs.style.width='100%'; cvs.style.height='100%'; ctx.setTransform(DPR,0,0,DPR,0,0);}); ro.observe(cvs.parentElement); const io=new IntersectionObserver((entries)=>{ const e=entries[0]; visibleRef.current=!!(e&&e.isIntersecting&&e.intersectionRatio>0.2);},{threshold:[0,0.2,0.5,1]}); if(containerRef.current) io.observe(containerRef.current); const draw=(t)=>{ const {W,H}=sizeRef.current; if(!W||!H) return; ctx.clearRect(0,0,W,H); ctx.fillStyle='#0b0720'; ctx.fillRect(0,0,W,H); const cx=W/2, cy=H/2; const s=Math.min(W,H)*0.28; const ang=t*0.8; const iso=(x,y,z)=>{ const ax=x*Math.cos(ang)-y*Math.sin(ang); const ay=x*Math.sin(ang)+y*Math.cos(ang); const px=cx+ax*1.0+z*0.6; const py=cy+ay*0.6-z*0.6; return [px,py];}; const pts=[[-s,-s,-s],[s,-s,-s],[s,s,-s],[-s,s,-s],[-s,-s,s],[s,-s,s],[s,s,s],[-s,s,s]]; const pp=pts.map(p=>iso(...p)); const edges=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]]; ctx.strokeStyle='#a78bfa'; ctx.lineWidth=2; edges.forEach(([i,j])=>{ ctx.beginPath(); ctx.moveTo(pp[i][0],pp[i][1]); ctx.lineTo(pp[j][0],pp[j][1]); ctx.stroke();});}; let last=0; const loop=(ts)=>{ if(!last) last=ts; const dt=Math.min(0.06,(ts-last)/1000); last=ts; if(visibleRef.current){ tRef.current+=dt; draw(tRef.current);} rafRef.current=requestAnimationFrame(loop);}; cancelAnimationFrame(rafRef.current); rafRef.current=requestAnimationFrame(loop); return ()=>{ cancelAnimationFrame(rafRef.current); ro.disconnect(); io.disconnect(); }; },[]);
    return <div ref={containerRef} style={{height:'100%'}}><canvas ref={canvasRef} style={{ imageRendering:'pixelated', background:'#0b0720', width:'100%' }} /></div>;
  }

  function MiniPercentPie(){
    const canvasRef=React.useRef(null), containerRef=React.useRef(null); const tRef=React.useRef(0), rafRef=React.useRef(0); const sizeRef=React.useRef({W:0,H:0,DPR:1}); const visibleRef=React.useRef(false);
    React.useEffect(()=>{ const cvs=canvasRef.current; if(!cvs) return; const ctx=cvs.getContext('2d'); const ro=new ResizeObserver(()=>{ const p=cvs.parentElement; const DPR=1; const W=p.clientWidth||1,H=p.clientHeight||1; sizeRef.current={W,H,DPR}; cvs.width=W*DPR; cvs.height=H*DPR; cvs.style.width='100%'; cvs.style.height='100%'; ctx.setTransform(DPR,0,0,DPR,0,0);}); ro.observe(cvs.parentElement); const io=new IntersectionObserver((entries)=>{ const e=entries[0]; visibleRef.current=!!(e&&e.isIntersecting&&e.intersectionRatio>0.2);},{threshold:[0,0.2,0.5,1]}); if(containerRef.current) io.observe(containerRef.current); const draw=(t)=>{ const {W,H}=sizeRef.current; if(!W||!H) return; ctx.clearRect(0,0,W,H); ctx.fillStyle='#0b0720'; ctx.fillRect(0,0,W,H); const cx=W/2, cy=H/2; const r=Math.min(W,H)*0.35; const p=(Math.sin(t*0.9)+1)/2; const a=p*Math.PI*2*0.85; ctx.fillStyle='#7c3aed'; ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+a,false); ctx.closePath(); ctx.fill(); ctx.fillStyle='#a78bfa'; ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,r,-Math.PI/2+a,-Math.PI/2+Math.PI*2*0.85,false); ctx.closePath(); ctx.fill();}; let last=0; const loop=(ts)=>{ if(!last) last=ts; const dt=Math.min(0.06,(ts-last)/1000); last=ts; if(visibleRef.current){ tRef.current+=dt; draw(tRef.current);} rafRef.current=requestAnimationFrame(loop);}; cancelAnimationFrame(rafRef.current); rafRef.current=requestAnimationFrame(loop); return ()=>{ cancelAnimationFrame(rafRef.current); ro.disconnect(); io.disconnect(); }; },[]);
    return <div ref={containerRef} style={{height:'100%'}}><canvas ref={canvasRef} style={{ imageRendering:'pixelated', background:'#0b0720', width:'100%' }} /></div>;
  }

  function MiniMensuration(){
    const canvasRef=React.useRef(null), containerRef=React.useRef(null); const tRef=React.useRef(0), rafRef=React.useRef(0); const sizeRef=React.useRef({W:0,H:0,DPR:1}); const visibleRef=React.useRef(false);
    React.useEffect(()=>{ const cvs=canvasRef.current; if(!cvs) return; const ctx=cvs.getContext('2d'); const ro=new ResizeObserver(()=>{ const p=cvs.parentElement; const DPR=1; const W=p.clientWidth||1,H=p.clientHeight||1; sizeRef.current={W,H,DPR}; cvs.width=W*DPR; cvs.height=H*DPR; cvs.style.width='100%'; cvs.style.height='100%'; ctx.setTransform(DPR,0,0,DPR,0,0);}); ro.observe(cvs.parentElement); const io=new IntersectionObserver((entries)=>{ const e=entries[0]; visibleRef.current=!!(e&&e.isIntersecting&&e.intersectionRatio>0.2);},{threshold:[0,0.2,0.5,1]}); if(containerRef.current) io.observe(containerRef.current); const draw=(t)=>{ const {W,H}=sizeRef.current; if(!W||!H) return; ctx.clearRect(0,0,W,H); ctx.fillStyle='#0b0720'; ctx.fillRect(0,0,W,H); const cx=W/2, cy=H/2; const baseW=Math.min(W*0.5,H*0.3); const k=(Math.sin(t*1.3)+1)/2; const BW=baseW*(0.8+0.3*k); const BH=BW*0.6; ctx.fillStyle='#7c3aed'; ctx.fillRect(cx-BW/2, cy-BH/2, BW, BH); ctx.fillStyle='#a78bfa'; ctx.globalAlpha=0.6; ctx.fillRect(cx-BW/2+12, cy-BH/2-10, BW, BH); ctx.globalAlpha=1;}; let last=0; const loop=(ts)=>{ if(!last) last=ts; const dt=Math.min(0.06,(ts-last)/1000); last=ts; if(visibleRef.current){ tRef.current+=dt; draw(tRef.current);} rafRef.current=requestAnimationFrame(loop);}; cancelAnimationFrame(rafRef.current); rafRef.current=requestAnimationFrame(loop); return ()=>{ cancelAnimationFrame(rafRef.current); ro.disconnect(); io.disconnect(); }; },[]);
    return <div ref={containerRef} style={{height:'100%'}}><canvas ref={canvasRef} style={{ imageRendering:'pixelated', background:'#0b0720', width:'100%' }} /></div>;
  }

  function MiniProportion(){
    const canvasRef=React.useRef(null), containerRef=React.useRef(null); const tRef=React.useRef(0), rafRef=React.useRef(0); const sizeRef=React.useRef({W:0,H:0,DPR:1}); const visibleRef=React.useRef(false);
    React.useEffect(()=>{ const cvs=canvasRef.current; if(!cvs) return; const ctx=cvs.getContext('2d'); const ro=new ResizeObserver(()=>{ const p=cvs.parentElement; const DPR=1; const W=p.clientWidth||1,H=p.clientHeight||1; sizeRef.current={W,H,DPR}; cvs.width=W*DPR; cvs.height=H*DPR; cvs.style.width='100%'; cvs.style.height='100%'; ctx.setTransform(DPR,0,0,DPR,0,0);}); ro.observe(cvs.parentElement); const io=new IntersectionObserver((entries)=>{ const e=entries[0]; visibleRef.current=!!(e&&e.isIntersecting&&e.intersectionRatio>0.2);},{threshold:[0,0.2,0.5,1]}); if(containerRef.current) io.observe(containerRef.current); const draw=(t)=>{ const {W,H}=sizeRef.current; if(!W||!H) return; ctx.clearRect(0,0,W,H); ctx.fillStyle='#0b0720'; ctx.fillRect(0,0,W,H); const base=H-8; const bw=Math.max(16, Math.floor(W/6)); const x1=W*0.25, x2=W*0.65; const a=(Math.sin(t*1.2)+1)/2; const h1=30+80*a; const h2=30+80*(1-a); ctx.fillStyle='#7c3aed'; ctx.fillRect(x1-bw/2, base-h1, bw, h1); ctx.fillStyle='#a78bfa'; ctx.fillRect(x2-bw/2, base-h2, bw, h2);}; let last=0; const loop=(ts)=>{ if(!last) last=ts; const dt=Math.min(0.06,(ts-last)/1000); last=ts; if(visibleRef.current){ tRef.current+=dt; draw(tRef.current);} rafRef.current=requestAnimationFrame(loop);}; cancelAnimationFrame(rafRef.current); rafRef.current=requestAnimationFrame(loop); return ()=>{ cancelAnimationFrame(rafRef.current); ro.disconnect(); io.disconnect(); }; },[]);
    return <div ref={containerRef} style={{height:'100%'}}><canvas ref={canvasRef} style={{ imageRendering:'pixelated', background:'#0b0720', width:'100%' }} /></div>;
  }

  function MiniFactorGrid(){
    const canvasRef=React.useRef(null), containerRef=React.useRef(null); const tRef=React.useRef(0), rafRef=React.useRef(0); const sizeRef=React.useRef({W:0,H:0,DPR:1}); const visibleRef=React.useRef(false);
    React.useEffect(()=>{ const cvs=canvasRef.current; if(!cvs) return; const ctx=cvs.getContext('2d'); const ro=new ResizeObserver(()=>{ const p=cvs.parentElement; const DPR=1; const W=p.clientWidth||1,H=p.clientHeight||1; sizeRef.current={W,H,DPR}; cvs.width=W*DPR; cvs.height=H*DPR; cvs.style.width='100%'; cvs.style.height='100%'; ctx.setTransform(DPR,0,0,DPR,0,0);}); ro.observe(cvs.parentElement); const io=new IntersectionObserver((entries)=>{ const e=entries[0]; visibleRef.current=!!(e&&e.isIntersecting&&e.intersectionRatio>0.2);},{threshold:[0,0.2,0.5,1]}); if(containerRef.current) io.observe(containerRef.current); const draw=(t)=>{ const {W,H}=sizeRef.current; if(!W||!H) return; ctx.clearRect(0,0,W,H); ctx.fillStyle='#0b0720'; ctx.fillRect(0,0,W,H); const a=3+Math.floor((Math.sin(t*0.9)+1)/2*3); const b=2+Math.floor((Math.cos(t*0.8)+1)/2*3); const pad=10; const cellW=(W-pad*2)/a; const cellH=(H-pad*2)/b; for(let r=0;r<b;r++){ for(let c=0;c<a;c++){ const x=pad+c*cellW, y=pad+r*cellH; ctx.fillStyle=((r+c)%2)?'#a78bfa':'#ff5cdf'; ctx.fillRect(x+1,y+1,cellW-2,cellH-2);}} }; let last=0; const loop=(ts)=>{ if(!last) last=ts; const dt=Math.min(0.06,(ts-last)/1000); last=ts; if(visibleRef.current){ tRef.current+=dt; draw(tRef.current);} rafRef.current=requestAnimationFrame(loop);}; cancelAnimationFrame(rafRef.current); rafRef.current=requestAnimationFrame(loop); return ()=>{ cancelAnimationFrame(rafRef.current); ro.disconnect(); io.disconnect(); }; },[]);
    return <div ref={containerRef} style={{height:'100%'}}><canvas ref={canvasRef} style={{ imageRendering:'pixelated', background:'#0b0720', width:'100%' }} /></div>;
  }

  function MiniAlgebraIdentity(){
    const canvasRef=React.useRef(null), containerRef=React.useRef(null); const tRef=React.useRef(0), rafRef=React.useRef(0); const sizeRef=React.useRef({W:0,H:0,DPR:1}); const visibleRef=React.useRef(false);
    React.useEffect(()=>{ const cvs=canvasRef.current; if(!cvs) return; const ctx=cvs.getContext('2d'); const ro=new ResizeObserver(()=>{ const p=cvs.parentElement; const DPR=1; const W=p.clientWidth||1,H=p.clientHeight||1; sizeRef.current={W,H,DPR}; cvs.width=W*DPR; cvs.height=H*DPR; cvs.style.width='100%'; cvs.style.height='100%'; ctx.setTransform(DPR,0,0,DPR,0,0);}); ro.observe(cvs.parentElement); const io=new IntersectionObserver((entries)=>{ const e=entries[0]; visibleRef.current=!!(e&&e.isIntersecting&&e.intersectionRatio>0.2);},{threshold:[0,0.2,0.5,1]}); if(containerRef.current) io.observe(containerRef.current); const draw=(t)=>{ const {W,H}=sizeRef.current; if(!W||!H) return; ctx.clearRect(0,0,W,H); ctx.fillStyle='#0b0720'; ctx.fillRect(0,0,W,H); const S=Math.min(W,H)*0.7; const cx=W/2, cy=H/2; const a=0.45+0.1*Math.sin(t*0.8); const b=1-a; const x=cx-S/2, y=cy-S/2; ctx.fillStyle='#7c3aed'; ctx.fillRect(x, y, S*a, S*a); ctx.fillStyle='#a78bfa'; ctx.fillRect(x+S*a, y+S*a, S*b, S*b); ctx.fillStyle='#ff5cdf'; ctx.fillRect(x+S*a, y, S*b, S*a); ctx.fillRect(x, y+S*a, S*a, S*b); ctx.strokeStyle='#e9d5ff'; ctx.lineWidth=2; ctx.strokeRect(x, y, S, S);}; let last=0; const loop=(ts)=>{ if(!last) last=ts; const dt=Math.min(0.06,(ts-last)/1000); last=ts; if(visibleRef.current){ tRef.current+=dt; draw(tRef.current);} rafRef.current=requestAnimationFrame(loop);}; cancelAnimationFrame(rafRef.current); rafRef.current=requestAnimationFrame(loop); return ()=>{ cancelAnimationFrame(rafRef.current); ro.disconnect(); io.disconnect(); }; },[]);
    return <div ref={containerRef} style={{height:'100%'}}><canvas ref={canvasRef} style={{ imageRendering:'pixelated', background:'#0b0720', width:'100%' }} /></div>;
  }

  function MiniGraph(){
    const canvasRef=React.useRef(null), containerRef=React.useRef(null); const tRef=React.useRef(0), rafRef=React.useRef(0); const sizeRef=React.useRef({W:0,H:0,DPR:1}); const visibleRef=React.useRef(false);
    React.useEffect(()=>{ const cvs=canvasRef.current; if(!cvs) return; const ctx=cvs.getContext('2d'); const ro=new ResizeObserver(()=>{ const p=cvs.parentElement; const DPR=1; const W=p.clientWidth||1,H=p.clientHeight||1; sizeRef.current={W,H,DPR}; cvs.width=W*DPR; cvs.height=H*DPR; cvs.style.width='100%'; cvs.style.height='100%'; ctx.setTransform(DPR,0,0,DPR,0,0);}); ro.observe(cvs.parentElement); const io=new IntersectionObserver((entries)=>{ const e=entries[0]; visibleRef.current=!!(e&&e.isIntersecting&&e.intersectionRatio>0.2);},{threshold:[0,0.2,0.5,1]}); if(containerRef.current) io.observe(containerRef.current); const draw=(t)=>{ const {W,H}=sizeRef.current; if(!W||!H) return; ctx.clearRect(0,0,W,H); ctx.fillStyle='#0b0720'; ctx.fillRect(0,0,W,H); ctx.strokeStyle='#3b1747'; ctx.lineWidth=1; for(let x=0;x<W;x+=20){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); } for(let y=0;y<H;y+=20){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); } ctx.strokeStyle='#7c3aed'; ctx.lineWidth=2; const a=0.6, b=H*0.7; const len=Math.min(1,(Math.sin(t*0.5)+1)/2); ctx.beginPath(); ctx.moveTo(0,b); ctx.lineTo(W*len, b - a*(W*len)); ctx.stroke();}; let last=0; const loop=(ts)=>{ if(!last) last=ts; const dt=Math.min(0.06,(ts-last)/1000); last=ts; if(visibleRef.current){ tRef.current+=dt; draw(tRef.current);} rafRef.current=requestAnimationFrame(loop);}; cancelAnimationFrame(rafRef.current); rafRef.current=requestAnimationFrame(loop); return ()=>{ cancelAnimationFrame(rafRef.current); ro.disconnect(); io.disconnect(); }; },[]);
    return <div ref={containerRef} style={{height:'100%'}}><canvas ref={canvasRef} style={{ imageRendering:'pixelated', background:'#0b0720', width:'100%' }} /></div>;
  }

  function MiniBalance(){
    const canvasRef=React.useRef(null), containerRef=React.useRef(null); const tRef=React.useRef(0), rafRef=React.useRef(0); const sizeRef=React.useRef({W:0,H:0,DPR:1}); const visibleRef=React.useRef(false);
    React.useEffect(()=>{ const cvs=canvasRef.current; if(!cvs) return; const ctx=cvs.getContext('2d'); const ro=new ResizeObserver(()=>{ const p=cvs.parentElement; const DPR=1; const W=p.clientWidth||1,H=p.clientHeight||1; sizeRef.current={W,H,DPR}; cvs.width=W*DPR; cvs.height=H*DPR; cvs.style.width='100%'; cvs.style.height='100%'; ctx.setTransform(DPR,0,0,DPR,0,0);}); ro.observe(cvs.parentElement); const io=new IntersectionObserver((entries)=>{ const e=entries[0]; visibleRef.current=!!(e&&e.isIntersecting&&e.intersectionRatio>0.2);},{threshold:[0,0.2,0.5,1]}); if(containerRef.current) io.observe(containerRef.current); const draw=(ang)=>{ const {W,H}=sizeRef.current; if(!W||!H) return; ctx.clearRect(0,0,W,H); ctx.fillStyle='#0b0720'; ctx.fillRect(0,0,W,H); const pad=6; const cx=W/2, cy=H*0.62; const beamLen=Math.min(W-pad*2,H*0.6); ctx.fillStyle='#7c3aed'; ctx.fillRect(pad, cy+20, W-pad*2, 6); ctx.fillStyle='#a78bfa'; ctx.fillRect(cx-2, cy-20, 4, 40); ctx.save(); ctx.translate(cx,cy); ctx.rotate(ang); ctx.fillStyle='#e9d5ff'; ctx.fillRect(-beamLen/2, -4, beamLen, 8); ctx.fillStyle='#ff5cdf'; ctx.fillRect(-beamLen/2+10, 8, 40, 10); ctx.fillStyle='#a78bfa'; ctx.fillRect(beamLen/2-50, 8, 40, 10); ctx.restore();}; let last=0; const loop=(ts)=>{ if(!last) last=ts; const dt=Math.min(0.06,(ts-last)/1000); last=ts; if(visibleRef.current){ tRef.current+=dt; const ang=Math.sin(tRef.current*1.2)*0.12; draw(ang);} rafRef.current=requestAnimationFrame(loop);}; cancelAnimationFrame(rafRef.current); rafRef.current=requestAnimationFrame(loop); return ()=>{ cancelAnimationFrame(rafRef.current); ro.disconnect(); io.disconnect(); }; },[]);
    return <div ref={containerRef} style={{height:'100%'}}><canvas ref={canvasRef} style={{ imageRendering:'pixelated', background:'#0b0720', width:'100%' }} /></div>;
  }

  function MiniExponentDots(){
    const canvasRef=React.useRef(null), containerRef=React.useRef(null); const tRef=React.useRef(0), rafRef=React.useRef(0); const sizeRef=React.useRef({W:0,H:0,DPR:1}); const visibleRef=React.useRef(false);
    React.useEffect(()=>{ const cvs=canvasRef.current; if(!cvs) return; const ctx=cvs.getContext('2d'); const ro=new ResizeObserver(()=>{ const p=cvs.parentElement; const DPR=1; const W=p.clientWidth||1,H=p.clientHeight||1; sizeRef.current={W,H,DPR}; cvs.width=W*DPR; cvs.height=H*DPR; cvs.style.width='100%'; cvs.style.height='100%'; ctx.setTransform(DPR,0,0,DPR,0,0);}); ro.observe(cvs.parentElement); const io=new IntersectionObserver((entries)=>{ const e=entries[0]; visibleRef.current=!!(e&&e.isIntersecting&&e.intersectionRatio>0.2);},{threshold:[0,0.2,0.5,1]}); if(containerRef.current) io.observe(containerRef.current); const draw=(k)=>{ const {W,H}=sizeRef.current; if(!W||!H) return; ctx.fillStyle='rgba(11,7,32,0.35)'; ctx.fillRect(0,0,W,H); const pad=10; const N=Math.min(256, 1<<k); const cols=Math.ceil(Math.sqrt(N)); const sz=Math.max(3, Math.min(12, Math.floor((W-pad*2)/cols))); const phase=(tRef.current%1); const highlight=Math.floor(phase*N); for(let i=0;i<N;i++){ const r=Math.floor(i/cols), c=i%cols; const x=pad+c*sz, y=pad+r*sz; const isHi=i<=highlight; ctx.fillStyle=isHi?'#ff5cdf':'#a78bfa'; ctx.fillRect(x+1,y+1,sz-2,sz-2);} ctx.fillStyle='#e9d5ff'; ctx.font='12px monospace'; ctx.textAlign='left'; ctx.fillText(`k = ${k}`, 8, H-20); ctx.textAlign='right'; ctx.fillText(`2^k = ${N}`, W-8, H-20);}; let k=3; let last=0; const loop=(ts)=>{ if(!last) last=ts; const dt=Math.min(0.06,(ts-last)/1000); last=ts; if(visibleRef.current){ tRef.current+=dt; k = 3 + Math.floor(((Math.sin(tRef.current*0.6)+1)/2)*5); draw(k);} rafRef.current=requestAnimationFrame(loop);}; cancelAnimationFrame(rafRef.current); rafRef.current=requestAnimationFrame(loop); return ()=>{ cancelAnimationFrame(rafRef.current); ro.disconnect(); io.disconnect(); }; },[]);
    return <div ref={containerRef} style={{height:'100%'}}><canvas ref={canvasRef} style={{ imageRendering:'pixelated', background:'#0b0720', width:'100%' }} /></div>;
  }

  // Map titles back to original widgets
  function RenderThumb({ title }){
    if (title.includes('Linear Equations')) return <MiniBalance />;
    if (title.includes('Squares and Square Roots')) return <MiniSquareGrowth />;
    if (title.includes('Data Handling')) return <MiniBars />;
    if (title.includes('Exponents')) return <MiniExponentDots />;
    if (title.includes('Rational Numbers')) return <MiniRationalLine />;
    if (title.includes('Understanding Quadrilaterals')) return <MiniQuadMorph />;
    if (title.includes('Cubes')) return <MiniCubeSpin />;
    if (title.includes('Comparing Quantities')) return <MiniPercentPie />;
    if (title.includes('Mensuration')) return <MiniMensuration />;
    if (title.includes('Direct and Inverse Proportions')) return <MiniProportion />;
    if (title.includes('Factorisation')) return <MiniFactorGrid />;
    if (title.includes('Algebraic Expressions')) return <MiniAlgebraIdentity />;
    if (title.includes('Introduction to Graphs')) return <MiniGraph />;
    return <MiniBars />;
  }

  // NCERT Class 8 Maths chapters (1-13)
  if (subjectId === "math") {
    const mathChapters = [
      { title: "Linear Equations in One Variable", icon: "➕", thumb: chapter1Thumb, linkTo: "/pdfs/chapter1.pdf", xp: 10, desc: "" },
      { title: "Rational Numbers", icon: "➗", thumb: chapter2Thumb, linkTo: "/pdfs/chapter2.pdf", xp: 10, desc: "" },
      { title: "Understanding Quadrilaterals", icon: "⬛", thumb: chapter3Thumb, linkTo: "/pdfs/chapter3.pdf", xp: 10, desc: "" },
      { title: "Cubes and Cube Roots", icon: "🧊", thumb: chapter4Thumb, linkTo: "/pdfs/chapter4.pdf", xp: 10, desc: "" },
      { title: "Data Handling", icon: "📊", thumb: chapter5Thumb, linkTo: "/pdfs/chapter5.pdf", xp: 10, desc: "" },
      { title: "Squares and Square Roots", icon: "√", thumb: chapter6Thumb, linkTo: "/math/squares", xp: 10, desc: "" },
      { title: "Comparing Quantities", icon: "⚖️", thumb: chapter7Thumb, linkTo: "/pdfs/chapter7.pdf", xp: 10, desc: "" },
      { title: "Algebraic Expressions and Identities", icon: "∑", thumb: chapter8Thumb, linkTo: "/pdfs/chapter8.pdf", xp: 10, desc: "" },
      { title: "Mensuration", icon: "📏", thumb: chapter9Thumb, linkTo: "/pdfs/chapter9.pdf", xp: 10, desc: "" },
      { title: "Exponents and Powers", icon: "^", thumb: chapter10Thumb, linkTo: "/pdfs/chapter10.pdf", xp: 10, desc: "" },
      { title: "Direct and Inverse Proportions", icon: "⇄", thumb: chapter11Thumb, linkTo: "/pdfs/chapter11.pdf", xp: 10, desc: "" },
      { title: "Factorisation", icon: "×", thumb: chapter12Thumb, linkTo: "/pdfs/chapter12.pdf", xp: 10, desc: "" },
      { title: "Introduction to Graphs", icon: "📈", thumb: chapter13Thumb, linkTo: "/pdfs/chapter13.pdf", xp: 10, desc: "" },
    ];

    return (
      <div className="pixel-theme math-lesson math-lesson-page" style={{ padding: "20px" }}>
        <h2 style={{ color:'#fff' }}>Mathematics (Class 8)</h2>
        <p style={{ color:'#c4b5fd' }}>Browse NCERT chapters. Play interactive widgets and unlock more content as you progress.</p>
        <div className="math-grid">
          {mathChapters.map((ch, idx) => {
            const isInternal = ch.linkTo.startsWith('/') && !ch.linkTo.endsWith('.pdf');
            const isSquares = ch.title === "Squares and Square Roots";
            const isLocked = !isSquares; // lock all except squares and square roots
            // Lightweight hover: small translate only (no box-shadow/rotate for perf)
            const tileHover = isLocked ? {} : { y: -3 };
            const Tile = (
              <motion.div className={`math-tile ${isLocked ? 'locked' : 'unlocked'}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.04 * idx, ease: 'easeOut' }}
                whileHover={tileHover}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`math-thumb ${isLocked ? 'locked' : ''}`}>
                  <RenderThumb title={ch.title} />
                  {!isLocked && (<><div className="symbol s1">∑</div><div className="symbol s2">√</div><div className="symbol s3">π</div></>)}
                </div>
                <div className="math-body">
                  <div className="math-title">{ch.title}</div>
                  <div style={{ marginTop: 10 }}>
                    {isLocked ? (
                      <span className="btn" style={{ opacity: 0.7, cursor:'not-allowed' }}>🔒 Locked</span>
                    ) : (
                      isInternal ? (<span className="btn">Open</span>) : (<span className="btn">Open PDF</span>)
                    )}
                    <span className="xp-pill math-xp">+{ch.xp} XP</span>
                  </div>
                </div>
                {!isLocked && (<div className="math-shine" />)}
                {isLocked && (<div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(11,7,32,0.35), rgba(11,7,32,0.65))', borderRadius:12, pointerEvents:'none' }} />)}
              </motion.div>
            );
            return (
              <div key={idx}>
                {isLocked ? (
                  <div style={{ textDecoration: 'none', cursor:'not-allowed' }}>{Tile}</div>
                ) : isInternal ? (
                  <Link to={ch.linkTo} style={{ textDecoration: 'none' }}>{Tile}</Link>
                ) : (
                  <a href={ch.linkTo} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>{Tile}</a>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <Link className="btn" to={`/game/${subjectId}`}>Play Game</Link>
          <Link style={{ marginLeft: 8 }} className="btn" to={`/quiz/${subjectId}`}>Take Quiz</Link>
        </div>
      </div>
    );
  }

  if (subjectId === "science") {
    const chapters = [
      { title: "Chapter 1", thumb: chapter1Thumb, linkTo: "/pdfs/chapter1.pdf" },
      { title: "Chapter 2", thumb: chapter2Thumb, linkTo: "/pdfs/chapter2.pdf" },
      { title: "Chapter 3", thumb: chapter3Thumb, linkTo: "/pdfs/chapter3.pdf" },
      { title: "Chapter 4", thumb: chapter4Thumb, linkTo: "/pdfs/chapter4.pdf" },
      { title: "Chapter 5", thumb: chapter5Thumb, linkTo: "/pdfs/chapter5.pdf" },
      { title: "Chapter 6", thumb: chapter6Thumb, linkTo: "/pdfs/chapter6.pdf" },
      { title: "Chapter 7", thumb: chapter7Thumb, linkTo: "/pdfs/chapter7.pdf" },
      { title: "Chapter 8", thumb: chapter8Thumb, linkTo: "/chapter8" }, // special route
      { title: "Chapter 9", thumb: chapter7Thumb, linkTo: "/pdfs/chapter9.pdf" },
      { title: "Chapter 10", thumb: chapter7Thumb, linkTo: "/pdfs/chapter10.pdf" },
      { title: "Chapter 11", thumb: chapter7Thumb, linkTo: "/pdfs/chapter11.pdf" },
      { title: "Chapter 12", thumb: chapter7Thumb, linkTo: "/pdfs/chapter12.pdf" },
      { title: "Chapter 13", thumb: chapter7Thumb, linkTo: "/pdfs/chapter13.pdf" },
      
    ];

    return (
      <div style={{ padding: "20px" }}>
        <h2>Science</h2>

        <h3>Chapters</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
            gap: "16px",
          }}
        >
          {chapters.map((ch, idx) =>
            ch.linkTo.startsWith("/") && !ch.linkTo.endsWith(".pdf") ? (
              <Link
                key={idx}
                to={ch.linkTo}
                style={{ textDecoration: "none", textAlign: "center" }}
              >
                <img
                  src={ch.thumb}
                  alt={ch.title}
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                  }}
                />
                <p style={{ marginTop: 8 }}>{ch.title}</p>
              </Link>
            ) : (
              <a
                key={idx}
                href={ch.linkTo}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", textAlign: "center" }}
              >
                <img
                  src={ch.thumb}
                  alt={ch.title}
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                  }}
                />
                <p style={{ marginTop: 8 }}>{ch.title}</p>
              </a>
            )
          )}
        </div>

        {/* Game & Quiz buttons */}
        <div style={{ marginTop: 20 }}>
          <Link className="btn" to={`/game/${subjectId}`}>
            Play Game
          </Link>
          <Link style={{ marginLeft: 8 }} className="btn" to={`/quiz/${subjectId}`}>
            Take Quiz
          </Link>
        </div>

        {/* Doubt assistant */}
        <GeminiChatbot />
      </div>
    );
  }

  // fallback for other subjects
  return (
    <div style={{ padding: "20px" }}>
      <h2>{displayId} Lesson</h2>
      <div style={{ marginTop: 8 }}>
        <Link className="btn" to={`/game/${subjectId}`}>
          Play Game
        </Link>
        <Link style={{ marginLeft: 8 }} className="btn" to={`/quiz/${subjectId}`}>
          Take Quiz
        </Link>
      </div>
      {/* Doubt assistant */}
      <GeminiChatbot />
    </div>
  );
}
