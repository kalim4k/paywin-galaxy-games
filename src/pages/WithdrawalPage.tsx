import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User, Wallet, CreditCard, Plus, Minus, LogOut, Edit, Eye, EyeOff, Phone, AtSign, TrendingDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileImageUpload } from '@/components/ProfileImageUpload';
import { supabase } from '@/integrations/supabase/client';

const WithdrawalPage = () => {
  const { profile, signOut, updateProfile } = useAuth();
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [rechargeCode, setRechargeCode] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [paymentAddress, setPaymentAddress] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: profile?.full_name || '',
    email: profile?.email || ''
  });
  const { toast } = useToast();

  const paymentMethods = [
    { id: 'moov', name: 'Moov Money', image: 'https://celinaroom.com/wp-content/uploads/2025/01/Moov_Money_Flooz.png', type: 'mobile' },
    { id: 'mtn', name: 'MTN Money', image: 'https://celinaroom.com/wp-content/uploads/2025/01/mtn-1-Copie.jpg', type: 'mobile' },
    { id: 'orange', name: 'Orange Money', image: 'https://celinaroom.com/wp-content/uploads/2025/01/Orange-Money-recrute-pour-ce-poste-22-Mars-2023.png', type: 'mobile' },
    { id: 'wave', name: 'Wave', image: 'https://celinaroom.com/wp-content/uploads/2025/02/Design-sans-titre4.png', type: 'mobile' },
    { id: 'mix', name: 'Mix by Yass', image: 'https://celinaroom.com/wp-content/uploads/2025/05/mixx-by-yas.jpg', type: 'mobile' },
    { id: 'paypal', name: 'PayPal', image: 'https://celinaroom.com/wp-content/uploads/2025/01/ENIGME3.png', type: 'email' },
    { id: 'ton', name: 'TON', image: 'https://celinaroom.com/wp-content/uploads/2025/01/toncoin-ton-logo.png', type: 'wallet' },
  ];

  const getPlaceholderText = (methodId: string) => {
    const method = paymentMethods.find(m => m.id === methodId);
    if (!method) return 'Entrez votre adresse';
    
    switch (method.type) {
      case 'mobile':
        return 'Entrez votre numéro de téléphone';
      case 'email':
        return 'Entrez votre adresse email';
      case 'wallet':
        return 'Entrez votre adresse wallet';
      default:
        return 'Entrez votre adresse';
    }
  };

  const getInputIcon = (methodId: string) => {
    const method = paymentMethods.find(m => m.id === methodId);
    if (!method) return null;
    
    switch (method.type) {
      case 'mobile':
        return <Phone className="w-4 h-4 text-gray-400" />;
      case 'email':
        return <AtSign className="w-4 h-4 text-gray-400" />;
      case 'wallet':
        return <Wallet className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const handleWithdrawal = async () => {
    const amount = parseFloat(withdrawalAmount);
    if (amount < 4000) {
      toast({
        title: "Montant invalide",
        description: "Le montant minimum de retrait est de 4000 FCFA",
        variant: "destructive"
      });
      return;
    }
    if (amount > (profile?.balance || 0)) {
      toast({
        title: "Solde insuffisant",
        description: "Votre solde est insuffisant pour ce retrait",
        variant: "destructive"
      });
      return;
    }
    if (!selectedPaymentMethod || !paymentAddress) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez sélectionner un moyen de paiement et entrer vos informations",
        variant: "destructive"
      });
      return;
    }

    try {
      // Mettre à jour le montant total retiré
      const newTotalWithdrawn = (profile?.total_withdrawn || 0) + amount;
      await updateProfile({ total_withdrawn: newTotalWithdrawn });

      toast({
        title: "Demande de retrait envoyée",
        description: `Retrait de ${amount} FCFA en cours de traitement`,
      });
      setWithdrawalAmount('');
      setPaymentAddress('');
      setShowAddressForm(false);
    } catch (error) {
      console.error('Erreur lors du retrait:', error);
    }
  };

  const handleDeposit = () => {
    window.open('https://odqwetyq.mychariow.com/prd_xoqblm/checkout', '_blank');
  };

  const handleRechargeCode = () => {
    if (rechargeCode.trim()) {
      toast({
        title: "Code de recharge",
        description: "Code de recharge en cours de vérification",
      });
      setRechargeCode('');
    }
  };

  const selectPaymentMethod = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
    setShowAddressForm(true);
    setPaymentAddress('');
  };

  const handleLogout = async () => {
    await signOut();
  };

  const handleProfileEdit = async () => {
    if (isEditingProfile) {
      try {
        await updateProfile({
          full_name: editForm.full_name,
        });
        setIsEditingProfile(false);
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    } else {
      setEditForm({
        full_name: profile?.full_name || '',
        email: profile?.email || ''
      });
      setIsEditingProfile(true);
    }
  };

  const handleImageUpdate = async (avatarUrl: string) => {
    try {
      await updateProfile({ avatar_url: avatarUrl });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'avatar:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl">Chargement du profil...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <div className="space-y-4">
                  {/* Photo de profil */}
                  <ProfileImageUpload 
                    currentAvatarUrl={profile.avatar_url}
                    onImageUpdate={handleImageUpdate}
                  />
                  
                  {/* Informations de base */}
                  <div>
                    {isEditingProfile ? (
                      <Input
                        value={editForm.full_name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                        className="text-xl font-semibold text-gray-900 mb-2"
                        placeholder="Nom complet"
                      />
                    ) : (
                      <h2 className="text-xl font-semibold text-gray-900">{profile.full_name || 'Utilisateur'}</h2>
                    )}
                    <p className="text-gray-600">{profile.email}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Separator className="bg-gray-200" />

                {/* Profile Actions */}
                <div className="space-y-2">
                  <Button
                    onClick={() => setShowProfileDetails(!showProfileDetails)}
                    variant="outline"
                    className="w-full justify-start bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  >
                    {showProfileDetails ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                    {showProfileDetails ? 'Masquer les détails' : 'Voir les détails'}
                  </Button>

                  {showProfileDetails && (
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
                      <div className="text-sm text-gray-700">
                        Email: {profile.email}
                      </div>
                      <div className="text-sm text-gray-700">
                        Membre depuis: {formatDate(profile.created_at)}
                      </div>
                      <div className="text-sm text-gray-700">
                        Solde: {new Intl.NumberFormat('fr-FR').format(profile.balance)} FCFA
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <TrendingDown className="w-4 h-4 text-red-500" />
                        Total retiré: {new Intl.NumberFormat('fr-FR').format(profile.total_withdrawn || 0)} FCFA
                      </div>
                      <div className="text-sm text-gray-700">
                        Jeu favori: {profile.favorite_game || 'Mine'}
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleProfileEdit}
                    variant="outline"
                    className="w-full justify-start bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditingProfile ? 'Sauvegarder' : 'Modifier le profil'}
                  </Button>

                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full justify-start bg-white border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-400"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Se déconnecter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Deposit Section */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-600">
                  <Plus className="w-5 h-5" />
                  Dépôt d'argent
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button 
                  onClick={handleDeposit}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 h-auto shadow-sm"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Effectuer un dépôt
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-3 text-gray-500">ou</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Input
                    type="text"
                    placeholder="Code de recharge"
                    value={rechargeCode}
                    onChange={(e) => setRechargeCode(e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500"
                  />
                  <Button 
                    onClick={handleRechargeCode}
                    variant="outline"
                    className="w-full bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  >
                    Valider le code
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Withdrawal Section */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <Minus className="w-5 h-5" />
                  Retrait d'argent
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Input
                    type="number"
                    placeholder="Montant à retirer (min: 4000 FCFA)"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500"
                    min="4000"
                    max={profile.balance}
                  />
                  <p className="text-xs text-gray-500">
                    Montant minimum: 4000 FCFA | Solde disponible: {new Intl.NumberFormat('fr-FR').format(profile.balance)} FCFA
                  </p>
                </div>

                {/* Payment Methods Grid */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Choisir le moyen de paiement</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => selectPaymentMethod(method.id)}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                          selectedPaymentMethod === method.id
                            ? 'border-blue-500 bg-blue-50 shadow-sm'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <img
                          src={method.image}
                          alt={method.name}
                          className="w-10 h-10 mx-auto mb-2 rounded object-cover"
                        />
                        <p className="text-xs text-center text-gray-700 font-medium">{method.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Address Form */}
                {showAddressForm && selectedPaymentMethod && (
                  <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-sm font-medium text-gray-700">
                      Informations pour {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {getInputIcon(selectedPaymentMethod)}
                      </div>
                      <Input
                        type="text"
                        placeholder={getPlaceholderText(selectedPaymentMethod)}
                        value={paymentAddress}
                        onChange={(e) => setPaymentAddress(e.target.value)}
                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 pl-10"
                      />
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleWithdrawal}
                  disabled={!withdrawalAmount || !selectedPaymentMethod || !paymentAddress}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:hover:bg-gray-400 text-white font-medium py-3 h-auto shadow-sm"
                >
                  Demander le retrait
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default WithdrawalPage;
