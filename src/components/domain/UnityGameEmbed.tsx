"use client";

import React, { useState, useRef, useCallback } from 'react';

export interface UnityGameEmbedProps {
  /** URL del build Unity WebGL desplegado (http/https) */
  embedUrl: string;
  /** Aspect ratio del juego, ej. "16:9", "4:3", "1:1". Default 16:9 */
  aspectRatio?: string;
  /** Permitir pantalla completa */
  allowFullScreen?: boolean;
  /** URL de la imagen de portada del juego/post (thumbnail del post) */
  thumbnailUrl?: string;
  /** Título del juego (para overlays y accesibilidad) */
  title: string;
}

type LoadState = 'idle' | 'loading' | 'playing';

/**
 * Carga un juego Unity WebGL (build desplegado en una URL externa, ej. GitHub Pages)
 * embebido dentro de la página mediante un iframe. El juego solo se monta cuando el
 * usuario hace clic en "Jugar" (click-to-play) para evitar descargar decenas de MB
 * automáticamente al abrir el artículo.
 */
const UnityGameEmbed: React.FC<UnityGameEmbedProps> = ({
  embedUrl,
  aspectRatio = '16:9',
  allowFullScreen = true,
  thumbnailUrl,
  title
}) => {
  const [state, setState] = useState<LoadState>('idle');
  const [loadError, setLoadError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const loadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startGame = useCallback(() => {
    if (state !== 'idle') return;
    setState('loading');

    // Si el host bloquea el embed (X-Frame-Options) o la carga demora demasiado,
    // ofrecer abrir en una pestaña nueva.
    loadTimerRef.current = setTimeout(() => {
      setLoadError(true);
    }, 20000);
  }, [state]);

  const handleIframeLoad = useCallback(() => {
    if (loadTimerRef.current) {
      clearTimeout(loadTimerRef.current);
      loadTimerRef.current = null;
    }
    setLoadError(false);
    setState('playing');
    // Dar foco al iframe para que el teclado llegue al juego
    setTimeout(() => iframeRef.current?.focus(), 100);
  }, []);

  const toggleFullScreen = useCallback(() => {
    const container = iframeRef.current?.parentElement;
    if (!container) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => { });
    } else {
      container.requestFullscreen().catch(() => { });
    }
  }, []);

  const openInNewTab = useCallback(() => {
    window.open(embedUrl, '_blank', 'noopener,noreferrer');
  }, [embedUrl]);

  // La propiedad CSS aspect-ratio usa "/" (ej. "16/9"), mientras que guardamos el
  // valor con ":" (ej. "16:9"). Normalizamos y validamos antes de aplicar.
  const cssAspectRatio = (() => {
    const normalized = aspectRatio.trim().replace(':', '/');
    return /^\d{1,3}(?:\.\d+)?\/\d{1,3}(?:\.\d+)?$/.test(normalized) ? normalized : '16/9';
  })();

  return (
    <div className="unity-game-embed my-8">
      <div
        className="relative w-full overflow-hidden rounded-lg bg-black border border-gray-700"
        style={{ aspectRatio: cssAspectRatio }}
      >
        {state === 'idle' && (
          <button
            type="button"
            onClick={startGame}
            className="group absolute inset-0 flex flex-col items-center justify-center gap-4 w-full h-full cursor-pointer"
            aria-label={`Jugar a ${title}`}
          >
            {/* Thumbnail de fondo */}
            {thumbnailUrl && (
              <img
                src={thumbnailUrl}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity"
              />
            )}
            {/* Overlay oscuro para legibilidad */}
            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-colors" />

            <svg xmlns="http://www.w3.org/2000/svg" className="relative h-20 w-20 text-white drop-shadow-lg group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="11" fill="rgba(0,0,0,0.5)" stroke="currentColor" strokeWidth="1.5" />
              <path d="M9.5 7.5v9l8-4.5-8-4.5z" />
            </svg>
            <span className="relative text-xl md:text-2xl font-bold text-white drop-shadow-md">
              ▶ Jugar a {title}
            </span>
            <span className="relative text-sm text-gray-300">
              Haz clic para cargar el juego (puede tardar unos segundos)
            </span>
          </button>
        )}

        {state !== 'idle' && (
          <iframe
            ref={iframeRef}
            src={embedUrl}
            title={title}
            className={`absolute inset-0 w-full h-full ${state === 'loading' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            style={{ border: 'none' }}
            sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-popups"
            allow="autoplay; fullscreen; gamepad; xr-spatial-tracking"
            allowFullScreen={allowFullScreen}
            loading="lazy"
            onLoad={handleIframeLoad}
          />
        )}

        {state === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black">
            <div className="h-12 w-12 rounded-full border-4 border-purple-600 border-t-transparent animate-spin" aria-hidden="true" />
            <p className="text-gray-300">Cargando juego…</p>
            {loadError && (
              <div className="text-center px-4">
                <p className="text-sm text-red-400 mb-3">
                  El juego no se pudo cargar aquí. El sitio donde está alojado podría
                  bloquear la incrustación.
                </p>
                <button
                  type="button"
                  onClick={openInNewTab}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Abrir en una pestaña nueva
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controles secundarios */}
      <div className="flex items-center justify-between gap-2 mt-2 px-1">
        <button
          type="button"
          onClick={openInNewTab}
          className="text-sm text-gray-400 hover:text-purple-400 transition-colors inline-flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Abrir en pestaña nueva
        </button>
        {allowFullScreen && state === 'playing' && (
          <button
            type="button"
            onClick={toggleFullScreen}
            className="text-sm text-gray-400 hover:text-purple-400 transition-colors inline-flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            Pantalla completa
          </button>
        )}
      </div>
    </div>
  );
};

export default UnityGameEmbed;