import React from 'react';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift, Clock, Star, Gem, Zap } from 'lucide-react';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const BonusPage = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const hasVipAccess = profile && profile.balance >= 150000;

  const handleVipGameClick = (gamePath: string) => {
    navigate(gamePath);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8 pb-20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Bonus & Récompenses</h1>
          <p className="text-white/70">Découvrez vos bonus et récompenses disponibles</p>
        </div>

        {hasVipAccess ? (
          <div className="space-y-6">
            {/* VIP Access Card - Improved design */}
            <Card className="bg-gradient-to-br from-amber-400/30 via-yellow-500/20 to-orange-500/30 backdrop-blur-lg border-2 border-amber-400/50 shadow-2xl relative overflow-hidden">
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-orange-500/10 animate-pulse"></div>
              
              <CardHeader className="text-center pb-6 relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg ring-4 ring-amber-400/30">
                  <Star className="w-10 h-10 text-white drop-shadow-lg" />
                </div>
                <CardTitle className="text-2xl font-bold text-white drop-shadow-lg">
                  🎉 Accès VIP Débloqué! 🎉
                </CardTitle>
                <div className="mt-2 px-4 py-2 bg-amber-400/20 rounded-full border border-amber-400/40">
                  <span className="text-amber-200 font-semibold text-sm">
                    STATUT PREMIUM ACTIVÉ
                  </span>
                </div>
              </CardHeader>
              
              <CardContent className="text-center relative z-10">
                <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 mb-6 border border-amber-400/30">
                  <p className="text-white font-medium text-lg mb-2">
                    🏆 Félicitations! Votre solde de{' '}
                    <span className="text-amber-300 font-bold text-xl">
                      {profile?.balance?.toLocaleString()} FCFA
                    </span>
                  </p>
                  <p className="text-amber-200">
                    vous donne accès aux jeux VIP exclusifs.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button
                    onClick={() => handleVipGameClick('/rob')}
                    className="group bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 hover:from-purple-500 hover:via-purple-600 hover:to-indigo-600 text-white p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-purple-500/25 border border-purple-400/20"
                  >
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-12 h-12 bg-purple-400/20 rounded-full flex items-center justify-center group-hover:bg-purple-300/30 transition-colors">
                        <Gem className="w-7 h-7 text-purple-200 group-hover:text-purple-100" />
                      </div>
                    </div>
                    <h3 className="font-bold text-xl mb-2 text-white">ROB</h3>
                    <p className="text-sm text-purple-200 group-hover:text-purple-100">
                      Jeu VIP exclusif - Gains élevés
                    </p>
                  </button>
                  
                  <button
                    onClick={() => handleVipGameClick('/baz')}
                    className="group bg-gradient-to-br from-emerald-600 via-green-700 to-teal-700 hover:from-emerald-500 hover:via-green-600 hover:to-teal-600 text-white p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-emerald-500/25 border border-emerald-400/20"
                  >
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-12 h-12 bg-emerald-400/20 rounded-full flex items-center justify-center group-hover:bg-emerald-300/30 transition-colors">
                        <Zap className="w-7 h-7 text-emerald-200 group-hover:text-emerald-100" />
                      </div>
                    </div>
                    <h3 className="font-bold text-xl mb-2 text-white">BAZ</h3>
                    <p className="text-sm text-emerald-200 group-hover:text-emerald-100">
                      Jeu VIP exclusif - Action rapide
                    </p>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Additional VIP Benefits - Improved design */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-xl p-6 border border-blue-400/30 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-300" />
                  </div>
                </div>
                <h3 className="font-bold text-white mb-3 text-lg">Bonus quotidiens VIP</h3>
                <p className="text-blue-200">Bonus spéciaux pour les membres VIP</p>
              </div>
              
              <div className="bg-gradient-to-br from-amber-600/20 to-yellow-600/20 backdrop-blur-sm rounded-xl p-6 border border-amber-400/30 hover:border-amber-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-amber-300" />
                  </div>
                </div>
                <h3 className="font-bold text-white mb-3 text-lg">Récompenses exclusives</h3>
                <p className="text-amber-200">Accès aux jeux et bonus premium</p>
              </div>
            </div>
          </div>
        ) : (
          <Card className="bg-black/20 backdrop-blur-md border border-white/10 shadow-xl">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-white/60" />
              </div>
              <CardTitle className="text-xl text-white">Aucun bonus disponible</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-white/70 mb-6">
                Il n'y a pas de bonus disponible pour le moment. Revenez plus tard pour découvrir de nouvelles offres !
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-center mb-3">
                    <Clock className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Bonus quotidiens</h3>
                  <p className="text-sm text-white/70">Revenez chaque jour pour des bonus spéciaux</p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-center mb-3">
                    <Star className="w-6 h-6 text-yellow-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Récompenses VIP</h3>
                  <p className="text-sm text-white/70">Jouez plus pour débloquer des récompenses exclusives</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Navigation />
      <PWAInstallPrompt />
    </div>
  );
};

export default BonusPage;
