'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

interface ArcData {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string[];
}

// Dynamic import for Globe to avoid SSR issues
const Globe = dynamic(() => import('react-globe.gl'), { 
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center text-cobalt font-mono text-xs animate-pulse">Initializing Global Intelligence...</div>
});

const GlobeMap = () => {
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [arcsData, setArcsData] = useState<ArcData[]>([]);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    // Enable auto-rotation
    if (globeRef.current) {
      const controls = globeRef.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
      controls.enableZoom = false; // Disable zoom to prevent scroll issues on mobile
    }

    // Sample data for cybersecurity arcs
    const data = [
      { startLat: 40.7128, startLng: -74.0060, endLat: 51.5074, endLng: -0.1278, color: ['#2E5BFF', '#00F5FF'] }, // NY -> London
      { startLat: 51.5074, startLng: -0.1278, endLat: -8.8390, endLng: 13.2894, color: ['#00F5FF', '#2E5BFF'] }, // London -> Luanda
      { startLat: 35.6762, startLng: 139.6503, endLat: 51.5074, endLng: -0.1278, color: ['#2E5BFF', '#00F5FF'] }, // Tokyo -> London
      { startLat: -23.5505, startLng: -46.6333, endLat: 40.7128, endLng: -74.0060, color: ['#00F5FF', '#2E5BFF'] }, // São Paulo -> NY
    ];
    setArcsData(data);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center overflow-hidden transition-transform duration-700 hover:scale-105 touch-none">
      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        backgroundColor="rgba(0,0,0,0)"
        width={dimensions.width}
        height={dimensions.height}
        
        // Arcs (Data flows)
        arcsData={arcsData}
        arcColor={'color'}
        arcDashLength={0.4}
        arcDashGap={4}
        arcDashAnimateTime={2000}
        arcStroke={0.5}
        
        // Points (Nodes)
        pointsData={[
          { lat: 40.7128, lng: -74.0060, size: 0.1, color: '#fff' },
          { lat: 51.5074, lng: -0.1278, size: 0.1, color: '#fff' },
          { lat: -8.8390, lng: 13.2894, size: 0.12, color: '#00F5FF' },
          { lat: 35.6762, lng: 139.6503, size: 0.1, color: '#fff' },
        ]}
        pointColor={'color'}
        pointAltitude={0.01}
        pointRadius={'size'}
        
        // Atmosphere
        showAtmosphere={true}
        atmosphereColor="#2E5BFF"
      />
    </div>
  );
};

export default GlobeMap;
