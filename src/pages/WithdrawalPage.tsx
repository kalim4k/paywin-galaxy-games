import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Wallet, ArrowUpRight, ArrowDownLeft, LogOut, Settings, Phone, AtSign, ChevronDown, Sparkles } from 'lucide-react';
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
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showRechargeCodePurchase, setShowRechargeCodePurchase] = useState(false);
  const [activeTab, setActiveTab] = useState<'withdraw' | 'history'>('withdraw');
  const [editForm, setEditForm] = useState({
    full_name: profile?.full_name || '',
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
      case 'mobile': return <Phone className="w-4 h-4 text-muted-foreground" />;
      case 'email': return <AtSign className="w-4 h-4 text-muted-foreground" />;
      default: return <Wallet className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount);
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
      setEditForm({ full_name: profile?.full_name || '' });
      setIsEditingProfile(true);
    }
  };

  const handleImageUpdate = async (avatarUrl: string) => {
    try { await updateProfile({ avatar_url: avatarUrl }); } catch (error) { console.error(error); }
  };

  if (!profile) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Header />

      <div className="max-w-md mx-auto px-4 py-6 pb-28 space-y-5">
        
        {/* Profile Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 p-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />
          
          <div className="relative flex items-center gap-4">
            <ProfileImageUpload currentAvatarUrl={profile.avatar_url} onImageUpdate={handleImageUpdate} />
            <div className="flex-1 min-w-0">
              {isEditingProfile ? (
                <Input
                  value={editForm.full_name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                  className="text-lg font-semibold bg-slate-800/50 border-slate-600 text-white"
                  placeholder="Votre nom"
                  onBlur={handleProfileEdit}
                  onKeyDown={(e) => e.key === 'Enter' && handleProfileEdit()}
                />
              ) : (
                <h2 
                  onClick={() => setIsEditingProfile(true)}
                  className="text-xl font-bold text-white truncate cursor-pointer hover:text-emerald-400 transition-colors"
                >
                  {profile.full_name || 'Utilisateur'}
                </h2>
              )}
              <p className="text-sm text-slate-400 truncate">{profile.email}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-red-500/20 border border-slate-700/50 hover:border-red-500/50 transition-all group"
            >
              <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-400 transition-colors" />
            </button>
          </div>
        </div>

        {/* Balance Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-700 p-6 shadow-lg shadow-emerald-500/20">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Wallet className="w-4 h-4 text-emerald-200" />
              <span className="text-sm font-medium text-emerald-100">Solde disponible</span>
            </div>
            <p className="text-4xl font-bold text-white tracking-tight mb-4">
              {formatAmount(profile.balance)} <span className="text-xl font-normal text-emerald-200">FCFA</span>
            </p>
            
            <div className="flex gap-3">
              <Button 
                onClick={() => window.open('https://cryptofluxexh.netlify.app/#echange', '_blank')}
                className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0 font-medium py-5 rounded-xl backdrop-blur-sm"
              >
                <ArrowDownLeft className="w-4 h-4 mr-2" />
                Recharger
              </Button>
              <Button 
                onClick={() => setActiveTab('withdraw')}
                variant="outline"
                className="flex-1 bg-transparent hover:bg-white/10 text-white border-white/30 font-medium py-5 rounded-xl"
              >
                <ArrowUpRight className="w-4 h-4 mr-2" />
                Retirer
              </Button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 p-1.5 bg-slate-800/50 rounded-2xl border border-slate-700/50">
          <button
            onClick={() => setActiveTab('withdraw')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'withdraw' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Nouveau retrait
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'history' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Historique
          </button>
        </div>

        {activeTab === 'withdraw' ? (
          <div className="space-y-5">
            {/* Amount Input */}
            <div className="rounded-3xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-5">
              <label className="text-sm font-medium text-slate-300 mb-3 block">Montant du retrait</label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  className="text-3xl font-bold h-16 pr-20 bg-slate-900/50 border-slate-700 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  min="7000"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">FCFA</span>
              </div>
              <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Minimum 7 000 FCFA
              </p>
            </div>

            {/* Payment Methods */}
            <div className="rounded-3xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-5">
              <label className="text-sm font-medium text-slate-300 mb-4 block">Mode de paiement</label>
              <div className="grid grid-cols-3 gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => selectPaymentMethod(method.id)}
                    className={`relative p-4 rounded-2xl border-2 transition-all duration-200 ${
                      selectedPaymentMethod === method.id
                        ? 'border-emerald-500 bg-emerald-500/10 scale-[1.02]'
                        : 'border-slate-700 hover:border-slate-600 bg-slate-900/30'
                    }`}
                  >
                    {selectedPaymentMethod === method.id && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                    <img
                      src={method.image}
                      alt={method.name}
                      className="w-12 h-12 mx-auto mb-2 rounded-xl object-cover"
                    />
                    <p className="text-[11px] text-center text-slate-400 font-medium leading-tight">{method.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Address Input */}
            {showAddressForm && selectedPaymentMethod && (
              <div className="rounded-3xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-5 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-sm font-medium text-slate-300 mb-3 block">
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
                    className="pl-12 h-14 bg-slate-900/50 border-slate-700 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              onClick={handleWithdrawal}
              disabled={!withdrawalAmount || !selectedPaymentMethod || !paymentAddress}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 text-white font-semibold py-6 rounded-2xl text-base shadow-lg shadow-emerald-500/20 disabled:shadow-none transition-all"
            >
              Confirmer le retrait
            </Button>
          </div>
        ) : (
          <WithdrawalHistory />
        )}
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
