"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LngLatBounds, Map, Marker, NavigationControl, setWorkerUrl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Offer } from "@/data/offers";
import { demoLocations } from "@/data/demo-locations";
import { formatPrice } from "./OfferCard";

setWorkerUrl(new URL("maplibre-gl/dist/maplibre-gl-worker.mjs", import.meta.url).toString());

type MapPoint = { id: string; title: string; price: number; href: string; coordinates: [number, number] };

export default function OfferMap({ offers, hrefFor }: { offers: Offer[]; hrefFor: (offer: Offer) => string }) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [attempt, setAttempt] = useState(0);
  // Stable across the catalogue clock ticks; recreate markers only when results change.
  const pointsJSON = JSON.stringify(offers.filter(offer => demoLocations[offer.id]).map(offer => ({
    id: offer.id, title: offer.title, price: offer.price, href: hrefFor(offer), coordinates: demoLocations[offer.id],
  })));

  useEffect(() => {
    if (!container.current) return;
    let instance: Map | undefined;
    let disposed = false;
    const timeout = window.setTimeout(() => { if (!disposed) setFailed(true); }, 15000);
    try {
      instance = new Map({
        container: container.current,
        style: "https://tiles.openfreemap.org/styles/liberty",
        center: [71.434, 51.145], zoom: 11, cooperativeGestures: true,
        locale: { "NavigationControl.ZoomIn": "Приблизить", "NavigationControl.ZoomOut": "Отдалить", "NavigationControl.ResetBearing": "Повернуть на север", "AttributionControl.ToggleAttribution": "Источники карты", "Map.Title": "Демонстрационные предложения в Астане" },
      });
      map.current = instance;
      instance.addControl(new NavigationControl({ showCompass: false }), "top-right");
      instance.on("load", () => { window.clearTimeout(timeout); setLoaded(true); setFailed(false); });
      instance.on("error", () => setFailed(true));
    } catch {
      queueMicrotask(() => { if (!disposed) setFailed(true); });
    }
    return () => { disposed = true; window.clearTimeout(timeout); instance?.remove(); map.current = null; };
  }, [attempt]);

  useEffect(() => {
    if (!map.current) return;
    const points: MapPoint[] = JSON.parse(pointsJSON);
    const bounds = new LngLatBounds();
    const markers = points.map(point => {
      const link = document.createElement("a");
      link.className = "map-price-pin";
      link.href = point.href;
      link.textContent = formatPrice(point.price);
      link.setAttribute("aria-label", `${point.title}, ${formatPrice(point.price)}. Открыть предложение`);
      bounds.extend(point.coordinates);
      return new Marker({ element: link }).setLngLat(point.coordinates).addTo(map.current!);
    });
    if (points.length) map.current.fitBounds(bounds, { padding: 70, maxZoom: 13, duration: 0 });
    return () => markers.forEach(marker => marker.remove());
  }, [pointsJSON, attempt]);

  return <div className="map-view">
    <p className="map-disclaimer">Точки на карте условные и не соответствуют подтверждённым адресам заведений.</p>
    <div className="map-frame"><div ref={container} className="offer-map" aria-label="Карта демонстрационных предложений в Астане" />
      {!loaded && !failed && <p className="map-status" role="status">Загружаем карту…</p>}
      {failed && <div className="map-status" role="status"><p>Не удалось полностью загрузить карту. Предложения доступны в списке ниже.</p><button className="text-link" onClick={() => { setFailed(false); setLoaded(false); setAttempt(value => value + 1); }}>Попробовать ещё раз</button></div>}
    </div>
    <ul className="map-offer-list" aria-label="Предложения на карте">{offers.map(offer => <li key={offer.id}><Link href={hrefFor(offer)}><span><strong>{offer.title}</strong><small>{offer.venue} · {offer.district}</small></span><b>{formatPrice(offer.price)}</b></Link></li>)}</ul>
  </div>;
}
