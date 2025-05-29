
import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Wallet, CreditCard, Plus, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const WithdrawalPage = () => {
  const [balance] = useState(125000); // FCFA
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [rechargeCode, setRechargeCode] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [paymentAddress, setPaymentAddress] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const { toast } = useToast();

  const paymentMethods = [
    { id: 'moov', name: 'Moov Money', image: 'https://celinaroom.com/wp-content/uploads/2025/01/Moov_Money_Flooz.png' },
    { id: 'mtn', name: 'MTN Money', image: 'https://celinaroom.com/wp-content/uploads/2025/01/mtn-1-Copie.jpg' },
    { id: 'orange', name: 'Orange Money', image: 'https://celinaroom.com/wp-content/uploads/2025/01/Orange-Money-recrute-pour-ce-poste-22-Mars-2023.png' },
    { id: 'wave', name: 'Wave', image: 'https://celinaroom.com/wp-content/uploads/2025/02/Design-sans-titre4.png' },
    { id: 'mix', name: 'Mix by Yass', image: 'https://celinaroom.com/wp-content/uploads/2025/05/mixx-by-yas.jpg' },
    { id: 'paypal', name: 'PayPal', image: 'https://celinaroom.com/wp-content/uploads/2025/01/ENIGME3.png' },
    { id: 'ton', name: 'TON', image: 'https://celinaroom.com/wp-content/uploads/2025/01/toncoin-ton-logo.png' },
  ];

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
        description: "Veuillez sélectionner un moyen de paiement et entrer votre adresse",
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
    window.open('https://odqwetyq.mychariow.com/prd_xoqblm', '_blank');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Header with profile section */}
      <div className="relative pt-8 pb-6 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Profil Joueur</h1>
            <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Wallet className="w-5 h-5 text-yellow-400" />
                <span className="text-sm text-gray-300">Solde disponible</span>
              </div>
              <div className="text-3xl font-bold text-yellow-400">
                {balance.toLocaleString()} FCFA
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-24 space-y-6">
        {/* Deposit Section */}
        <Card className="bg-black/40 backdrop-blur-md border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-400">
              <Plus className="w-5 h-5" />
              Dépôt d'argent
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleDeposit}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 rounded-xl"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Effectuer un dépôt
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-black/40 px-3 text-gray-400">ou</span>
              </div>
            </div>

            <div className="space-y-3">
              <Input
                type="text"
                placeholder="Code de recharge"
                value={rechargeCode}
                onChange={(e) => setRechargeCode(e.target.value)}
                className="bg-black/60 border-white/20 text-white placeholder-gray-400"
              />
              <Button 
                onClick={handleRechargeCode}
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                Valider le code
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Withdrawal Section */}
        <Card className="bg-black/40 backdrop-blur-md border-white/10">
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
                className="bg-black/60 border-white/20 text-white placeholder-gray-400"
                min="4000"
              />
              <p className="text-xs text-gray-400">
                Montant minimum: 4000 FCFA
              </p>
            </div>

            {/* Payment Methods Grid */}
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-3">Choisir le moyen de paiement</h3>
              <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => selectPaymentMethod(method.id)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                      selectedPaymentMethod === method.id
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    <img
                      src={method.image}
                      alt={method.name}
                      className="w-12 h-12 mx-auto mb-2 rounded-lg object-cover"
                    />
                    <p className="text-xs text-center text-gray-300">{method.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Address Form */}
            {showAddressForm && selectedPaymentMethod && (
              <div className="space-y-3 p-4 bg-black/40 rounded-xl border border-white/10">
                <div className="text-sm text-gray-300">
                  Adresse pour {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}
                </div>
                <Input
                  type="text"
                  placeholder="Entrez votre adresse de retrait"
                  value={paymentAddress}
                  onChange={(e) => setPaymentAddress(e.target.value)}
                  className="bg-black/60 border-white/20 text-white placeholder-gray-400"
                />
              </div>
            )}

            <Button 
              onClick={handleWithdrawal}
              disabled={!withdrawalAmount || !selectedPaymentMethod || !paymentAddress}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 rounded-xl"
            >
              Demander le retrait
            </Button>
          </CardContent>
        </Card>
      </div>

      <Navigation />
    </div>
  );
};

export default WithdrawalPage;
