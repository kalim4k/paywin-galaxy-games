import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User, Wallet, CreditCard, Plus, Minus, LogOut, Settings, Mail, Edit, Eye, EyeOff, Phone, AtSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const WithdrawalPage = () => {
  const [balance] = useState(125000); // FCFA
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [rechargeCode, setRechargeCode] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [paymentAddress, setPaymentAddress] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const { toast } = useToast();

  // Mock user data - in real app this would come from authentication context
  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    memberSince: "Janvier 2024",
    lastLogin: "Il y a 2 heures"
  };

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

  const handleWithdrawal = () => {
    const amount = parseFloat(withdrawalAmount);
    if (amount < 4000) {
      toast({
        title: "Montant invalide",
        description: "Le montant minimum de retrait est de 4000 FCFA",
        variant: "destructive"
      });
      return;
    }
    if (amount > balance) {
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

    toast({
      title: "Demande de retrait envoyée",
      description: `Retrait de ${amount} FCFA en cours de traitement`,
    });
    setWithdrawalAmount('');
    setPaymentAddress('');
    setShowAddressForm(false);
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

  const handleLogout = () => {
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès",
    });
  };

  const handleChangePassword = () => {
    toast({
      title: "Changement de mot de passe",
      description: "Un email de réinitialisation vous a été envoyé",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/50 backdrop-blur-xl border-gray-700/50 shadow-2xl">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">{userData.name}</h2>
                    <p className="text-gray-400">{userData.email}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Separator className="bg-gray-700/50" />

                {/* Profile Actions */}
                <div className="space-y-2">
                  <Button
                    onClick={() => setShowProfileDetails(!showProfileDetails)}
                    variant="outline"
                    className="w-full justify-start bg-slate-700/30 border-gray-600/50 text-gray-300 hover:bg-slate-600/50"
                  >
                    {showProfileDetails ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                    {showProfileDetails ? 'Masquer les détails' : 'Voir les détails'}
                  </Button>

                  {showProfileDetails && (
                    <div className="bg-slate-700/30 rounded-lg p-4 space-y-3 border border-gray-600/30">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-300">Email: {userData.email}</span>
                      </div>
                      <div className="text-sm text-gray-300">
                        Membre depuis: {userData.memberSince}
                      </div>
                      <div className="text-sm text-gray-300">
                        Dernière connexion: {userData.lastLogin}
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleChangePassword}
                    variant="outline"
                    className="w-full justify-start bg-slate-700/30 border-gray-600/50 text-gray-300 hover:bg-slate-600/50"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Changer le mot de passe
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start bg-slate-700/30 border-gray-600/50 text-gray-300 hover:bg-slate-600/50"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier le profil
                  </Button>

                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full justify-start bg-red-500/10 border-red-400/30 text-red-400 hover:bg-red-500/20 hover:border-red-400/50"
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
            <Card className="bg-slate-800/50 backdrop-blur-xl border-gray-700/50 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-400">
                  <Plus className="w-5 h-5" />
                  Dépôt d'argent
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button 
                  onClick={handleDeposit}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-medium py-3 h-auto shadow-lg"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Effectuer un dépôt
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600/50"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-slate-800 px-3 text-gray-400">ou</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Input
                    type="text"
                    placeholder="Code de recharge"
                    value={rechargeCode}
                    onChange={(e) => setRechargeCode(e.target.value)}
                    className="bg-slate-700/30 border-gray-600/50 text-white placeholder:text-gray-400 focus:border-blue-500"
                  />
                  <Button 
                    onClick={handleRechargeCode}
                    variant="outline"
                    className="w-full bg-slate-700/30 border-gray-600/50 text-gray-300 hover:bg-slate-600/50"
                  >
                    Valider le code
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Withdrawal Section */}
            <Card className="bg-slate-800/50 backdrop-blur-xl border-gray-700/50 shadow-2xl">
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
                    className="bg-slate-700/30 border-gray-600/50 text-white placeholder:text-gray-400 focus:border-blue-500"
                    min="4000"
                  />
                  <p className="text-xs text-gray-400">
                    Montant minimum: 4000 FCFA
                  </p>
                </div>

                {/* Payment Methods Grid */}
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-4">Choisir le moyen de paiement</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => selectPaymentMethod(method.id)}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-lg ${
                          selectedPaymentMethod === method.id
                            ? 'border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/25'
                            : 'border-gray-600/50 hover:border-gray-500/70 bg-slate-700/30'
                        }`}
                      >
                        <img
                          src={method.image}
                          alt={method.name}
                          className="w-10 h-10 mx-auto mb-2 rounded object-cover"
                        />
                        <p className="text-xs text-center text-gray-300 font-medium">{method.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Address Form */}
                {showAddressForm && selectedPaymentMethod && (
                  <div className="space-y-3 p-4 bg-slate-700/30 rounded-lg border border-gray-600/30">
                    <div className="text-sm font-medium text-gray-300">
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
                        className="bg-slate-600/30 border-gray-500/50 text-white placeholder:text-gray-400 focus:border-blue-500 pl-10"
                      />
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleWithdrawal}
                  disabled={!withdrawalAmount || !selectedPaymentMethod || !paymentAddress}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium py-3 h-auto shadow-lg"
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
