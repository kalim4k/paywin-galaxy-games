
import React from 'react';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift, Clock, Star, Bomb } from 'lucide-react';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const BonusPage = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  const handleDynamitAccess = () => {
    if (profile && profile.balance >= 150000) {
      navigate('/dynamit');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8 pb-20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Bonus & Récompenses</h1>
          <p className="text-white/70">Découvrez vos bonus et récompenses disponibles</p>
        </div>

        {/* VIP Dynamit Game Access */}
        {profile && (
          <Card className="bg-black/20 backdrop-blur-md border border-white/10 shadow-xl mb-6">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                <Bomb className="w-8 h-8 text-red-400" />
              </div>
              <CardTitle className="text-xl text-white flex items-center justify-center gap-2">
                <span>💥</span>
                Jeu VIP - Dynamit
                <span>👑</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-white/70 mb-4">
                Version explosive du jeu Mine réservée aux joueurs VIP
              </p>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 mb-6">
                <p className="text-sm text-white/60 mb-2">Solde requis : 150,000 FCFA</p>
                <p className="text-lg text-white font-semibold">
                  Votre solde : {profile.balance.toLocaleString()} FCFA
                </p>
                {profile.balance >= 150000 && (
                  <p className="text-green-400 text-sm mt-2">✅ Accès autorisé</p>
                )}
                {profile.balance < 150000 && (
                  <p className="text-red-400 text-sm mt-2">
                    ❌ Il vous manque {(150000 - profile.balance).toLocaleString()} FCFA
                  </p>
                )}
              </div>

              <Button 
                onClick={handleDynamitAccess}
                disabled={profile.balance < 150000}
                className={`w-full py-3 text-lg font-bold ${
                  profile.balance >= 150000 
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white' 
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {profile.balance >= 150000 ? '🎮 Jouer à Dynamit' : '🔒 Accès VIP Requis'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* No Other Bonus Available Card */}
        <Card className="bg-black/20 backdrop-blur-md border border-white/10 shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-white/60" />
            </div>
            <CardTitle className="text-xl text-white">Autres bonus</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-white/70 mb-6">
              Aucun autre bonus disponible pour le moment. Revenez plus tard pour découvrir de nouvelles offres !
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
      </div>

      <Navigation />
      <PWAInstallPrompt />
    </div>
  );
};

export default BonusPage;
