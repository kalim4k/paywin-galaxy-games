
import React from 'react';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Clock, Star, Bomb, Pickaxe } from 'lucide-react';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const BonusPage = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const hasVipAccess = profile && profile.balance >= 150000;

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
            {/* VIP Games Section */}
            <Card className="bg-black/20 backdrop-blur-md border border-gold/20 shadow-xl">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-gold/20 to-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-gold" />
                </div>
                <CardTitle className="text-xl text-gold">Jeux VIP Exclusifs</CardTitle>
                <p className="text-white/70">Accès exclusif aux jeux premium</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 backdrop-blur-sm rounded-lg p-4 border border-red-500/20">
                    <div className="flex items-center justify-center mb-3">
                      <Bomb className="w-8 h-8 text-red-400" />
                    </div>
                    <h3 className="font-semibold text-white mb-2 text-center">ROB</h3>
                    <p className="text-sm text-white/70 mb-4 text-center">Jeu exclusif de mines premium</p>
                    <Button 
                      onClick={() => navigate('/rob')}
                      className="w-full bg-red-500 hover:bg-red-600 text-white"
                    >
                      Jouer à ROB
                    </Button>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 backdrop-blur-sm rounded-lg p-4 border border-purple-500/20">
                    <div className="flex items-center justify-center mb-3">
                      <Pickaxe className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-white mb-2 text-center">BAZ</h3>
                    <p className="text-sm text-white/70 mb-4 text-center">Jeu exclusif de mines avancé</p>
                    <Button 
                      onClick={() => navigate('/baz')}
                      className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                    >
                      Jouer à BAZ
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Regular Bonus Section */}
            <Card className="bg-black/20 backdrop-blur-md border border-white/10 shadow-xl">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-white/60" />
                </div>
                <CardTitle className="text-xl text-white">Bonus Généraux</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-white/70 mb-6">
                  Continuez à jouer pour débloquer plus de récompenses !
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
        ) : (
          /* No Bonus Available Card */
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
