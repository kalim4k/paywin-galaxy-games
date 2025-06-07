
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Send, User, Search, Loader2 } from 'lucide-react';
import { useMoneyTransfer } from '@/hooks/useMoneyTransfer';
import { useAuth } from '@/contexts/AuthContext';

export const MoneyTransfer = () => {
  const { profile } = useAuth();
  const { loading, searchResults, searchLoading, searchUsers, transferMoney, clearSearch } = useMoneyTransfer();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<{ email: string; name: string } | null>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleUserSelect = (user: any) => {
    setSelectedUser({
      email: user.email,
      name: user.full_name || user.email
    });
    setSearchQuery(user.full_name || user.email);
    clearSearch();
  };

  const handleTransfer = async () => {
    if (!selectedUser || !amount) return;

    const amountNum = parseInt(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return;
    }

    const success = await transferMoney(selectedUser.email, amountNum, description || 'Transfert d\'argent');
    if (success) {
      setAmount('');
      setDescription('');
      setSearchQuery('');
      setSelectedUser(null);
    }
  };

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('fr-FR').format(balance);
  };

  const maxTransfer = profile?.balance || 0;

  return (
    <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-lg border-2 border-green-400/50 shadow-xl">
      <CardHeader className="text-center pb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Send className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-xl text-white font-bold">Transfert d'argent VIP</CardTitle>
        <p className="text-green-300 text-sm font-medium">
          Solde disponible: {formatBalance(maxTransfer)} FCFA
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search" className="text-white font-medium">Destinataire (email ou nom)</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 w-4 h-4" />
            <Input
              id="search"
              type="text"
              placeholder="Rechercher par email ou nom..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedUser(null);
              }}
              className="pl-10 bg-slate-700/70 border-green-400/50 text-white placeholder:text-gray-300 focus:border-green-300 focus:ring-green-300/30"
            />
            {searchLoading && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-300 w-4 h-4 animate-spin" />
            )}
          </div>
          
          {searchResults.length > 0 && (
            <div className="bg-slate-800/90 rounded-lg border border-green-400/30 max-h-40 overflow-y-auto shadow-lg">
              {searchResults.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleUserSelect(user)}
                  className="w-full text-left p-3 hover:bg-green-500/20 transition-colors border-b border-slate-600/50 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500/30 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-green-200" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{user.full_name || 'Nom non renseigné'}</p>
                      <p className="text-green-200 text-sm">{user.email}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount" className="text-white font-medium">Montant (FCFA)</Label>
          <Input
            id="amount"
            type="number"
            placeholder="Montant à envoyer"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            max={maxTransfer}
            className="bg-slate-700/70 border-green-400/50 text-white placeholder:text-gray-300 focus:border-green-300 focus:ring-green-300/30"
          />
          <p className="text-green-200 text-xs font-medium">
            Maximum: {formatBalance(maxTransfer)} FCFA
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-white font-medium">Description (optionnel)</Label>
          <Textarea
            id="description"
            placeholder="Motif du transfert..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-slate-700/70 border-green-400/50 text-white placeholder:text-gray-300 resize-none focus:border-green-300 focus:ring-green-300/30"
            rows={2}
          />
        </div>

        <Button
          onClick={handleTransfer}
          disabled={loading || !selectedUser || !amount || parseInt(amount) <= 0 || parseInt(amount) > maxTransfer}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 transition-all duration-200 shadow-lg"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Transfert en cours...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Envoyer {amount ? `${parseInt(amount).toLocaleString()} FCFA` : ''}
            </>
          )}
        </Button>

        {selectedUser && (
          <div className="bg-slate-800/70 rounded-lg p-3 border border-green-400/30 shadow-md">
            <p className="text-green-100 text-sm font-medium">
              <strong className="text-white">Destinataire sélectionné:</strong> {selectedUser.name}
            </p>
            <p className="text-green-200 text-xs">{selectedUser.email}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
