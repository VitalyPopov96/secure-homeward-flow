import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MapPin, AlertCircle } from 'lucide-react';

const GlobalMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);

  // Mock remittance flow data
  const remittanceFlows = [
    { from: [-74.006, 40.7128] as [number, number], to: [77.1025, 28.7041] as [number, number], amount: 1200 }, // NYC to Delhi
    { from: [-0.1276, 51.5074] as [number, number], to: [121.4737, 31.2304] as [number, number], amount: 800 }, // London to Shanghai
    { from: [-118.2437, 34.0522] as [number, number], to: [14.4378, 50.0755] as [number, number], amount: 950 }, // LA to Prague
    { from: [2.3522, 48.8566] as [number, number], to: [31.2357, 30.0444] as [number, number], amount: 650 }, // Paris to Cairo
    { from: [-87.6298, 41.8781] as [number, number], to: [-99.1332, 19.4326] as [number, number], amount: 750 }, // Chicago to Mexico City
  ];

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        projection: 'globe',
        zoom: 1.5,
        center: [30, 15],
        pitch: 0,
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      // Add atmosphere and fog effects
      map.current.on('style.load', () => {
        if (!map.current) return;
        
        map.current.setFog({
          color: 'rgb(15, 23, 42)',
          'high-color': 'rgb(30, 41, 59)',
          'horizon-blend': 0.1,
        });

        // Add remittance flow lines
        remittanceFlows.forEach((flow, index) => {
          const flowId = `flow-${index}`;
          
          // Add source
          map.current!.addSource(flowId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: { amount: flow.amount },
              geometry: {
                type: 'LineString',
                coordinates: [flow.from, flow.to]
              }
            }
          });

          // Add line layer
          map.current!.addLayer({
            id: flowId,
            type: 'line',
            source: flowId,
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#06b6d4',
              'line-width': 3,
              'line-opacity': 0.8
            }
          });

          // Add markers for source and destination
          new mapboxgl.Marker({
            color: '#06b6d4',
            scale: 0.8
          })
            .setLngLat(flow.from)
            .addTo(map.current!);

          new mapboxgl.Marker({
            color: '#0ea5e9',
            scale: 0.6
          })
            .setLngLat(flow.to)
            .addTo(map.current!);
        });
      });

      // Rotation animation
      const secondsPerRevolution = 180;
      const maxSpinZoom = 4;
      let userInteracting = false;
      let spinEnabled = true;

      function spinGlobe() {
        if (!map.current) return;
        
        const zoom = map.current.getZoom();
        if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
          let distancePerSecond = 360 / secondsPerRevolution;
          const center = map.current.getCenter();
          center.lng -= distancePerSecond / 60; // Smooth animation
          map.current.easeTo({ center, duration: 1000, easing: (n) => n });
        }
      }

      // Event listeners
      map.current.on('mousedown', () => {
        userInteracting = true;
      });
      
      map.current.on('mouseup', () => {
        userInteracting = false;
        spinGlobe();
      });

      // Start spinning
      const spinInterval = setInterval(spinGlobe, 1000);

      return () => {
        clearInterval(spinInterval);
        map.current?.remove();
      };
    } catch (error) {
      console.error('Mapbox initialization error:', error);
      setShowTokenInput(true);
    }
  }, [mapboxToken]);

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const token = (e.target as HTMLFormElement).token.value;
    if (token) {
      setMapboxToken(token);
      setShowTokenInput(false);
    }
  };

  if (showTokenInput || !mapboxToken) {
    return (
      <Card className="p-6 bg-card border-border">
        <div className="text-center space-y-4">
          <div className="p-3 rounded-full bg-warning/20 w-fit mx-auto">
            <AlertCircle className="h-8 w-8 text-warning" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground mb-2">Mapbox Token Required</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Please enter your Mapbox public token to view the global remittance map
            </p>
          </div>
          <form onSubmit={handleTokenSubmit} className="space-y-3">
            <Input
              name="token"
              placeholder="pk.eyJ1..."
              className="bg-input border-border text-foreground"
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Load Map
            </button>
          </form>
          <p className="text-xs text-muted-foreground">
            Get your token at{' '}
            <a 
              href="https://mapbox.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute top-4 left-4 bg-card/80 backdrop-blur-sm border border-border rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-card-foreground">Live Remittance Flows</span>
        </div>
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span>Active Transfers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent"></div>
            <span>Destinations</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalMap;