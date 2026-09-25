"use client";

import React from 'react';
import Link from 'next/link';
import Card from '../common/Card';
import { GameListItem } from '../../services/api/adapters/gameAdapter';

interface GameCardProps {
  game: GameListItem;
}

/**
 * Tarjeta de juego para el listado de /games.
 * El título del post asociado es el nombre del juego y su thumbnail la portada.
 */
const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const gameUrl = `/articles/${game.slug || game.postId}`;

  return (
    <Card className="h-full overflow-hidden">
      <Link href={gameUrl} className="block group">
        <div className="relative h-48 overflow-hidden">
          <img
            src={game.thumbnailImageUrl || `https://picsum.photos/seed/${game.slug || game.id}/640/360`}
            alt={game.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          {/* Badge Jugable */}
          <span className="absolute top-2 left-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded">
            🎮 JUGABLE
          </span>
        </div>
        <div className="p-4">
          <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">
            {game.title}
          </h3>
          <div className="flex justify-between text-sm text-gray-400">
            <span>{game.authorName || 'Anónimo'}</span>
            {game.publishedDate && (
              <span>{new Date(game.publishedDate).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}</span>
            )}
          </div>
          {game.categories.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {game.categories.map(cat => (
                <span
                  key={cat.id}
                  className="text-xs bg-gray-800 text-purple-300 px-2 py-1 rounded"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          )}
          <div className="mt-4 flex items-center justify-center bg-purple-600/90 group-hover:bg-purple-600 text-white py-2 rounded font-semibold transition-colors">
            ▶ Jugar
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default GameCard;