"use client";

import React, { useState } from 'react';
import { GameSummary } from '../../services/api/adapters/gameAdapter';

export interface GameSectionData {
  embedUrl: string;
  aspectRatio: string;
  allowFullScreen: boolean;
  instructions: string;
}

interface GameSectionFormProps {
  /** Juego existente asociado al post (en edición), si lo hay */
  existingGame?: GameSummary;
  /** Callback con los datos del juego; embedUrl vacío significa "sin juego" */
  onChange: (data: GameSectionData) => void;
}

const ASPECT_RATIOS = ['16:9', '4:3', '1:1'];

/**
 * Sección del formulario de post para adjuntar un juego Unity WebGL embebido.
 * Si la URL se vacía en edición, el juego se elimina del post.
 */
const GameSectionForm: React.FC<GameSectionFormProps> = ({ existingGame, onChange }) => {
  const [enabled, setEnabled] = useState(!!existingGame);
  const [embedUrl, setEmbedUrl] = useState(existingGame?.embedUrl || '');
  const [aspectRatio, setAspectRatio] = useState(existingGame?.aspectRatio || '16:9');
  const [allowFullScreen, setAllowFullScreen] = useState(existingGame?.allowFullScreen !== false);
  const [instructions, setInstructions] = useState(existingGame?.instructions || '');

  const notifyChange = (
    nextUrl: string = embedUrl,
    nextRatio: string = aspectRatio,
    nextFullScreen: boolean = allowFullScreen,
    nextInstructions: string = instructions
  ) => {
    if (!enabled || !nextUrl.trim()) {
      onChange({ embedUrl: '', aspectRatio: nextRatio, allowFullScreen: nextFullScreen, instructions: nextInstructions });
      return;
    }
    onChange({
      embedUrl: nextUrl.trim(),
      aspectRatio: nextRatio,
      allowFullScreen: nextFullScreen,
      instructions: nextInstructions
    });
  };

  const handleToggle = () => {
    const next = !enabled;
    setEnabled(next);
    if (next) {
      // Se activó: enviar datos actuales
      notifyChange();
    } else {
      // Se desactivó: el juego se quitará del post
      onChange({ embedUrl: '', aspectRatio, allowFullScreen, instructions: '' });
    }
  };

  const isValidUrl = (url: string) => {
    if (!url) return false;
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const showUrlError = enabled && embedUrl.length > 0 && !isValidUrl(embedUrl);

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
      {/* Header con toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg" aria-hidden="true">🎮</span>
          <label className="text-lg font-medium">Juego embebido (Unity WebGL)</label>
        </div>
        <label className="flex items-center cursor-pointer gap-2 text-sm text-gray-300">
          <input
            type="checkbox"
            checked={enabled}
            onChange={handleToggle}
            className="h-4 w-4 accent-purple-600"
          />
          {existingGame ? 'Este post tiene un juego' : 'Adjuntar un juego a este post'}
        </label>
      </div>

      {enabled && (
        <div className="space-y-4">
          {/* URL del juego */}
          <div>
            <label htmlFor="gameEmbedUrl" className="block text-sm mb-1">
              URL del juego desplegado <span className="text-red-400">*</span>
            </label>
            <input
              type="url"
              id="gameEmbedUrl"
              value={embedUrl}
              onChange={(e) => {
                setEmbedUrl(e.target.value);
                notifyChange(e.target.value);
              }}
              className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="https://usuario.github.io/mi-juego/"
            />
            <p className="text-xs text-gray-400 mt-1">
              URL pública del build WebGL (ej. GitHub Pages, Netlify, Vercel). Debe empezar con http:// o https://
            </p>
            {showUrlError && (
              <p className="text-xs text-red-400 mt-1">
                La URL no es válida. Debe ser una URL http/https absoluta.
              </p>
            )}
          </div>

          {/* Aspect ratio y fullscreen */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="gameAspectRatio" className="block text-sm mb-1">Aspect ratio</label>
              <select
                id="gameAspectRatio"
                value={aspectRatio}
                onChange={(e) => {
                  setAspectRatio(e.target.value);
                  notifyChange(embedUrl, e.target.value);
                }}
                className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                {ASPECT_RATIOS.map(ratio => (
                  <option key={ratio} value={ratio}>{ratio}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center cursor-pointer gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={allowFullScreen}
                  onChange={(e) => {
                    setAllowFullScreen(e.target.checked);
                    notifyChange(embedUrl, aspectRatio, e.target.checked);
                  }}
                  className="h-4 w-4 accent-purple-600"
                />
                Permitir pantalla completa
              </label>
            </div>
          </div>

          {/* Instrucciones */}
          <div>
            <label htmlFor="gameInstructions" className="block text-sm mb-1">
              Controles / Cómo jugar (opcional, markdown)
            </label>
            <textarea
              id="gameInstructions"
              value={instructions}
              onChange={(e) => {
                setInstructions(e.target.value);
                notifyChange(embedUrl, aspectRatio, allowFullScreen, e.target.value);
              }}
              className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 min-h-[80px]"
              placeholder={"Ej: **WASD** para moverte, **Espacio** para saltar, **R** para reiniciar"}
            />
            <p className="text-xs text-gray-400 mt-1">
              Se mostrará debajo del juego en la página del post. Máximo 2000 caracteres.
            </p>
          </div>

          {existingGame && (
            <p className="text-xs text-gray-400">
              Si dejas la URL vacía y guardas, el juego se eliminará de este post.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default GameSectionForm;