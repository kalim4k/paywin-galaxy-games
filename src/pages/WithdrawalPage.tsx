import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Wallet, Plus, Minus, LogOut, Edit, ChevronRight, Phone, AtSign, TrendingDown, Calendar, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileImageUpload } from '@/components/ProfileImageUpload';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { WithdrawalHistory } from '@/components/WithdrawalHistory';
import { useWithdrawals } from '@/hooks/useWithdrawals';
import { useGameBalance } from '@/hooks/useGameBalance';
import { RechargeCodePurchase } from '@/components/RechargeCodePurchase';

const WithdrawalPage = () => {
  const { profile, signOut, updateProfile } = useAuth();
  const { updateBalance } = useGameBalance();
  const { createWithdrawal } = useWithdrawals();
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [paymentAddress, setPaymentAddress] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showRechargeCodePurchase, setShowRechargeCodePurchase] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: profile?.full_name || '',
    email: profile?.email || ''
  });
  const { toast } = useToast();

  const paymentMethods = [
    { id: 'moov', name: 'Moov Money', image: 'https://bienetrechien.com/wp-content/uploads/2025/08/Moov_Money_Flooz.png', type: 'mobile' },
    { id: 'mtn', name: 'MTN Money', image: 'https://bienetrechien.com/wp-content/uploads/2025/08/mtn-1.jpg', type: 'mobile' },
    { id: 'orange', name: 'Orange Money', image: 'https://bienetrechien.com/wp-content/uploads/2025/08/Orange-Money-recrute-pour-ce-poste-22-Mars-2023.png', type: 'mobile' },
    { id: 'wave', name: 'Wave', image: 'https://bienetrechien.com/wp-content/uploads/2025/08/wave.png', type: 'mobile' },
    { id: 'mix', name: 'Mix by Yass', image: 'https://bienetrechien.com/wp-content/uploads/2025/08/mix-by-yass.jpg', type: 'mobile' },
    { id: 'paypal', name: 'PayPal', image: 'https://bienetrechien.com/wp-content/uploads/2025/08/paypal1.png', type: 'email' },
  ];

  const getPlaceholderText = (methodId: string) => {
    const method = paymentMethods.find(m => m.id === methodId);
    if (!method) return 'Entrez votre adresse';
    switch (method.type) {
      case 'mobile': return 'Numéro de téléphone';
      case 'email': return 'Adresse email';
      default: return 'Adresse';
    }
  };

  const getInputIcon = (methodId: string) => {
    const method = paymentMethods.find(m => m.id === methodId);
    if (!method) return null;
    switch (method.type) {
      case 'mobile': return <Phone className="w-5 h-5 text-gray-400" />;
      case 'email': return <AtSign className="w-5 h-5 text-gray-400" />;
      default: return <Wallet className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount);
  };

  const formatAmountShort = (amount: number) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)}k`;
    return `${amount}`;
  };

  const handleWithdrawal = async () => {
    const amount = parseFloat(withdrawalAmount);
    if (amount < 7000) {
      toast({ title: "Montant invalide", description: "Minimum 7 000 FCFA", variant: "destructive" });
      return;
    }
    if (amount > (profile?.balance || 0)) {
      toast({ title: "Solde insuffisant", variant: "destructive" });
      return;
    }
    if (!selectedPaymentMethod || !paymentAddress) {
      toast({ title: "Informations manquantes", variant: "destructive" });
      return;
    }

    try {
      const success = await createWithdrawal(amount, selectedPaymentMethod, paymentAddress);
      if (success) {
        const newBalance = (profile?.balance || 0) - amount;
        const newTotalWithdrawn = (profile?.total_withdrawn || 0) + amount;
        await updateBalance(newBalance, 'game_loss', amount, `Retrait via ${selectedPaymentMethod}`);
        await updateProfile({ total_withdrawn: newTotalWithdrawn });
        toast({ title: "Demande envoyée", description: `${formatAmount(amount)} FCFA en traitement` });
        setWithdrawalAmount('');
        setPaymentAddress('');
        setShowAddressForm(false);
        setSelectedPaymentMethod(null);
      }
    } catch (error) {
      toast({ title: "Erreur", variant: "destructive" });
    }
  };

  const selectPaymentMethod = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
    setShowAddressForm(true);
    setPaymentAddress('');
  };

  const handleLogout = async () => { await signOut(); };

  const handleProfileEdit = async () => {
    if (isEditingProfile) {
      try {
        await updateProfile({ full_name: editForm.full_name });
        setIsEditingProfile(false);
      } catch (error) { console.error(error); }
    } else {
      setEditForm({ full_name: profile?.full_name || '', email: profile?.email || '' });
      setIsEditingProfile(true);
    }
  };

  const handleImageUpdate = async (avatarUrl: string) => {
    try { await updateProfile({ avatar_url: avatarUrl }); } catch (error) { console.error(error); }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (!profile) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-[#F2F2F7]">
      <Header />

      <div className="max-w-lg mx-auto px-4 py-6 pb-24 space-y-6">
        
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 flex items-center gap-4">
            <ProfileImageUpload currentAvatarUrl={profile.avatar_url} onImageUpdate={handleImageUpdate} />
            <div className="flex-1 min-w-0">
              {isEditingProfile ? (
                <Input
                  value={editForm.full_name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                  className="text-lg font-semibold border-gray-200"
                  placeholder="Votre nom"
                />
              ) : (
                <h2 className="text-lg font-semibold text-gray-900 truncate">
                  {profile.full_name || 'Utilisateur'}
                </h2>
              )}
              <p className="text-sm text-gray-500 truncate">{profile.email}</p>
            </div>
            <button onClick={handleProfileEdit} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Edit className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          
          {/* Balance */}
          <div className="px-6 pb-6">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white">
              <p className="text-emerald-100 text-sm font-medium mb-1">Solde disponible</p>
              <p className="text-3xl font-bold tracking-tight">{formatAmount(profile.balance)} <span className="text-lg font-medium opacity-80">FCFA</span></p>
            </div>
          </div>

          {/* Profile Details Toggle */}
          <button 
            onClick={() => setShowProfileDetails(!showProfileDetails)}
            className="w-full px-6 py-4 flex items-center justify-between border-t border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <span className="text-gray-600 font-medium">Détails du profil</span>
            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${showProfileDetails ? 'rotate-90' : ''}`} />
          </button>

          {showProfileDetails && (
            <div className="px-6 pb-4 space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <User className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Calendar className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-xs text-gray-500">Membre depuis</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(profile.created_at)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl">
                <TrendingDown className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-xs text-gray-500">Total retiré</p>
                  <p className="text-sm font-medium text-red-600">{formatAmount(profile.total_withdrawn || 0)} FCFA</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
                <Star className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="text-xs text-gray-500">Jeu favori</p>
                  <p className="text-sm font-medium text-gray-900">{profile.favorite_game || 'Mine'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recharge Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <Plus className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Recharger</h3>
            </div>
            <Button 
              onClick={() => setShowRechargeCodePurchase(true)}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 rounded-xl text-base shadow-sm"
            >
              Recharger mon compte
            </Button>
          </div>
        </div>

        {/* Withdrawal Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Minus className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Retrait</h3>
            </div>

            {/* Amount Input */}
            <div className="mb-5">
              <label className="text-sm font-medium text-gray-600 mb-2 block">Montant</label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  className="text-2xl font-semibold h-14 pr-16 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="7000"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">FCFA</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Min. 7 000 FCFA • Disponible: {formatAmountShort(profile.balance)} FCFA
              </p>
            </div>

            {/* Payment Methods */}
            <div className="mb-5">
              <label className="text-sm font-medium text-gray-600 mb-3 block">Mode de paiement</label>
              <div className="grid grid-cols-3 gap-2">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => selectPaymentMethod(method.id)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      selectedPaymentMethod === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-100 hover:border-gray-200 bg-gray-50'
                    }`}
                  >
                    <img
                      src={method.image}
                      alt={method.name}
                      className="w-10 h-10 mx-auto mb-1.5 rounded-lg object-cover"
                    />
                    <p className="text-[10px] text-center text-gray-600 font-medium leading-tight">{method.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Address Input */}
            {showAddressForm && selectedPaymentMethod && (
              <div className="mb-5">
                <label className="text-sm font-medium text-gray-600 mb-2 block">
                  {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    {getInputIcon(selectedPaymentMethod)}
                  </div>
                  <Input
                    type="text"
                    placeholder={getPlaceholderText(selectedPaymentMethod)}
                    value={paymentAddress}
                    onChange={(e) => setPaymentAddress(e.target.value)}
                    className="pl-12 h-12 border-gray-200 rounded-xl"
                  />
                </div>
              </div>
            )}

            <Button 
              onClick={handleWithdrawal}
              disabled={!withdrawalAmount || !selectedPaymentMethod || !paymentAddress}
              className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-4 rounded-xl text-base shadow-sm transition-colors"
            >
              Demander le retrait
            </Button>
          </div>
        </div>

        {/* Withdrawal History */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <WithdrawalHistory />
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full py-4 text-red-500 font-semibold text-center hover:bg-red-50 rounded-2xl transition-colors"
        >
          Se déconnecter
        </button>
      </div>

      <Navigation />
      <PWAInstallPrompt />
      <RechargeCodePurchase 
        isOpen={showRechargeCodePurchase}
        onClose={() => setShowRechargeCodePurchase(false)}
      />
    </div>
  );
};

export default WithdrawalPage;
