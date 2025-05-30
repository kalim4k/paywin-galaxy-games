
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
            {/* VIP Access Card */}
            <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-600/20 backdrop-blur-md border border-yellow-500/30 shadow-xl">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-yellow-400" />
                </div>
                <CardTitle className="text-xl text-white">Accès VIP Débloqué!</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-white/80 mb-6">
                  Félicitations! Votre solde de {profile?.balance?.toLocaleString()} FCFA vous donne accès aux jeux VIP exclusifs.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleVipGameClick('/rob')}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white p-6 rounded-xl transition-all transform hover:scale-105 shadow-lg"
                  >
                    <div className="flex items-center justify-center mb-3">
                      <Gem className="w-8 h-8 text-purple-300" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">ROB</h3>
                    <p className="text-sm text-white/80">Jeu VIP exclusif</p>
                  </button>
                  
                  <button
                    onClick={() => handleVipGameClick('/baz')}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white p-6 rounded-xl transition-all transform hover:scale-105 shadow-lg"
                  >
                    <div className="flex items-center justify-center mb-3">
                      <Zap className="w-8 h-8 text-green-300" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">BAZ</h3>
                    <p className="text-sm text-white/80">Jeu VIP exclusif</p>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Additional VIP Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-center mb-3">
                  <Clock className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Bonus quotidiens VIP</h3>
                <p className="text-sm text-white/70">Bonus spéciaux pour les membres VIP</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-center mb-3">
                  <Star className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Récompenses exclusives</h3>
                <p className="text-sm text-white/70">Accès aux jeux et bonus premium</p>
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
