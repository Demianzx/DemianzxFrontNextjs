"use client";

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchGames } from '../../store/slices/gamesSlice';
import { fetchCategories } from '../../store/slices/categoriesSlice';
import CategoryFilter from '../../components/domain/CategoryFilter';
import GameCard from '../../components/domain/GameCard';

const GamesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [activeCategory, setActiveCategory] = useState('All');

  const gamesData = useAppSelector(state => state.games);
  const categories = useAppSelector(state => state.categories.items);
  const isLoadingCategories = useAppSelector(state => state.categories.isLoading);

  // Cargar juegos y categorías al montar
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Cargar juegos (filtrando por categoría en el servidor cuando hay una activa)
  useEffect(() => {
    const categorySlug = activeCategory !== 'All'
      ? categories.find(c => c.name === activeCategory)?.slug
      : undefined;

    dispatch(fetchGames({ page: 1, pageSize: 12, categorySlug }));
  }, [dispatch, activeCategory, categories]);

  // Filtrado defensivo en el cliente (el servidor ya filtra por categoría)
  const displayedGames = activeCategory === 'All'
    ? gamesData.items
    : gamesData.items.filter(game =>
        game.categories.some(category => category.name === activeCategory)
      );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-8">🎮 Juegos</h1>
        <p className="text-gray-400 mb-6 max-w-2xl">
          Juegos web hechos con Unity que puedes jugar directamente aquí, sin salir de la página.
        </p>

        {isLoadingCategories ? (
          <div className="h-10 bg-gray-800 animate-pulse rounded-md w-96"></div>
        ) : (
          <CategoryFilter
            categories={['All', ...categories.map(category => category.name)]}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />
        )}
      </div>

      {gamesData.isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-80 bg-gray-800 animate-pulse rounded-lg"></div>
          ))}
        </div>
      ) : displayedGames.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedGames.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>

          {/* Paginación */}
          {gamesData.totalPages > 1 && (
            <div className="flex justify-center mt-10 gap-2">
              <button
                type="button"
                disabled={!gamesData.hasPreviousPage}
                onClick={() => dispatch(fetchGames({
                  page: gamesData.currentPage - 1,
                  pageSize: 12,
                  categorySlug: activeCategory !== 'All'
                    ? categories.find(c => c.name === activeCategory)?.slug
                    : undefined
                }))}
                className="px-4 py-2 bg-gray-800 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
              >
                Anterior
              </button>
              <span className="px-4 py-2 text-gray-400">
                Página {gamesData.currentPage} de {gamesData.totalPages}
              </span>
              <button
                type="button"
                disabled={!gamesData.hasNextPage}
                onClick={() => dispatch(fetchGames({
                  page: gamesData.currentPage + 1,
                  pageSize: 12,
                  categorySlug: activeCategory !== 'All'
                    ? categories.find(c => c.name === activeCategory)?.slug
                    : undefined
                }))}
                className="px-4 py-2 bg-gray-800 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🕹️</p>
          <p className="text-gray-400">Todavía no hay juegos publicados. ¡Vuelve pronto!</p>
        </div>
      )}
    </div>
  );
};

export default GamesPage;