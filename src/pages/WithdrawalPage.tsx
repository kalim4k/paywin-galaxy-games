import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User, Wallet, CreditCard, Plus, Minus, LogOut, Edit, Eye, EyeOff, Phone, AtSign, TrendingDown, Calendar, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileImageUpload } from '@/components/ProfileImageUpload';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { LoadingSpinner } from '@/components/LoadingSpinner';
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
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
              <CardHeader className="pb-6">
                <div className="flex flex-col items-center space-y-4">
                  {/* Photo de profil */}
                  <ProfileImageUpload 
                    currentAvatarUrl={profile.avatar_url}
                    onImageUpdate={handleImageUpdate}
                  />
                  
                  {/* Nom et email */}
                  <div className="text-center space-y-2 w-full">
                    {isEditingProfile ? (
                      <Input
                        value={editForm.full_name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                        className="text-lg font-semibold text-center bg-white/20 border-white/30 text-white placeholder:text-white/70"
                        placeholder="Nom complet"
                      />
                    ) : (
                      <h2 className="text-xl font-semibold text-white">
                        {profile.full_name || 'Utilisateur'}
                      </h2>
                    )}
                    <p className="text-white/70 text-sm">{profile.email}</p>
                  </div>

                  {/* Balance */}
                  <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-lg p-4 w-full border border-emerald-400/30">
                    <p className="text-xs text-emerald-200 text-center mb-1">Solde disponible</p>
                    <p className="text-2xl font-bold text-emerald-300 text-center">
                      {new Intl.NumberFormat('fr-FR').format(profile.balance)} FCFA
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <Separator className="bg-white/20" />

                {/* Actions du profil */}
                <div className="space-y-3">
                  <Button
                    onClick={() => setShowProfileDetails(!showProfileDetails)}
                    variant="outline"
                    className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    {showProfileDetails ? <EyeOff className="w-4 h-4 mr-3" /> : <Eye className="w-4 h-4 mr-3" />}
                    {showProfileDetails ? 'Masquer les détails' : 'Voir les détails'}
                  </Button>

                  {showProfileDetails && (
                    <div className="bg-white/5 rounded-lg p-4 space-y-3 border border-white/10">
                      <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                        <User className="w-4 h-4 text-blue-400" />
                        <div>
                          <p className="text-xs text-white/60">Email</p>
                          <p className="text-sm text-white">{profile.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                        <Calendar className="w-4 h-4 text-purple-400" />
                        <div>
                          <p className="text-xs text-white/60">Membre depuis</p>
                          <p className="text-sm text-white">{formatDate(profile.created_at)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-red-500/10 rounded-lg border border-red-400/20">
                        <TrendingDown className="w-4 h-4 text-red-400" />
                        <div>
                          <p className="text-xs text-red-200/70">Total retiré</p>
                          <p className="text-sm text-red-300 font-medium">
                            {new Intl.NumberFormat('fr-FR').format(profile.total_withdrawn || 0)} FCFA
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-400/20">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <div>
                          <p className="text-xs text-yellow-200/70">Jeu favori</p>
                          <p className="text-sm text-yellow-300">{profile.favorite_game || 'Mine'}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleProfileEdit}
                    variant="outline"
                    className="w-full justify-start bg-blue-500/10 border-blue-400/30 text-blue-200 hover:bg-blue-500/20"
                  >
                    <Edit className="w-4 h-4 mr-3" />
                    {isEditingProfile ? 'Sauvegarder' : 'Modifier le profil'}
                  </Button>

                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full justify-start bg-red-500/10 border-red-400/30 text-red-200 hover:bg-red-500/20"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Se déconnecter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Deposit Section */}
            <Card className="bg-black/20 backdrop-blur-md border border-white/10 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-400">
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
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-transparent px-3 text-white/70">ou</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Input
                    type="text"
                    placeholder="Code de recharge"
                    value={rechargeCode}
                    onChange={(e) => setRechargeCode(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400"
                  />
                  <Button 
                    onClick={handleRechargeCode}
                    variant="outline"
                    className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
                  >
                    Valider le code
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Withdrawal Section */}
            <Card className="bg-black/20 backdrop-blur-md border border-white/10 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-400">
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
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400"
                    min="4000"
                    max={profile.balance}
                  />
                  <p className="text-xs text-white/60">
                    Montant minimum: 4000 FCFA | Solde disponible: {new Intl.NumberFormat('fr-FR').format(profile.balance)} FCFA
                  </p>
                </div>

                {/* Payment Methods Grid */}
                <div>
                  <h3 className="text-sm font-medium text-white/70 mb-4">Choisir le moyen de paiement</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => selectPaymentMethod(method.id)}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                          selectedPaymentMethod === method.id
                            ? 'border-blue-400 bg-blue-500/20 shadow-sm'
                            : 'border-white/20 hover:border-white/30 bg-white/5'
                        }`}
                      >
                        <img
                          src={method.image}
                          alt={method.name}
                          className="w-10 h-10 mx-auto mb-2 rounded object-cover"
                        />
                        <p className="text-xs text-center text-white font-medium">{method.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Address Form */}
                {showAddressForm && selectedPaymentMethod && (
                  <div className="space-y-3 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                    <div className="text-sm font-medium text-white/70">
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
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400 pl-10"
                      />
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleWithdrawal}
                  disabled={!withdrawalAmount || !selectedPaymentMethod || !paymentAddress}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:hover:bg-gray-600 text-white font-medium py-3 h-auto shadow-sm"
                >
                  Demander le retrait
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Navigation />
      <PWAInstallPrompt />
    </div>
  );
};

export default WithdrawalPage;
