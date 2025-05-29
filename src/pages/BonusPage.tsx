
import React from 'react';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift, Clock, Star } from 'lucide-react';

const BonusPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bonus & Récompenses</h1>
          <p className="text-gray-600">Découvrez vos bonus et récompenses disponibles</p>
        </div>

        {/* No Bonus Available Card */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-gray-400" />
            </div>
            <CardTitle className="text-xl text-gray-900">Aucun bonus disponible</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              Il n'y a pas de bonus disponible pour le moment. Revenez plus tard pour découvrir de nouvelles offres !
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-center mb-3">
                  <Clock className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Bonus quotidiens</h3>
                <p className="text-sm text-gray-600">Revenez chaque jour pour des bonus spéciaux</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-center mb-3">
                  <Star className="w-6 h-6 text-yellow-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Récompenses VIP</h3>
                <p className="text-sm text-gray-600">Jouez plus pour débloquer des récompenses exclusives</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Navigation />
    </div>
  );
};

export default BonusPage;
