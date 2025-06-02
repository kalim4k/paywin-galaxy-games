
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { History, Calendar, CreditCard, MapPin, CheckCircle, User, AtSign } from 'lucide-react';
import { useWithdrawals } from '@/hooks/useWithdrawals';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export const WithdrawalHistory = () => {
  const { withdrawals, loading } = useWithdrawals();

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M FCFA`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}k FCFA`;
    }
    return `${amount} FCFA`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentMethodName = (method: string) => {
    const methods: { [key: string]: string } = {
      'moov': 'Moov Money',
      'mtn': 'MTN Money',
      'orange': 'Orange Money',
      'wave': 'Wave',
      'mix': 'Mix by Yass',
      'paypal': 'PayPal',
      'ton': 'TON'
    };
    return methods[method] || method;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Card className="bg-black/20 backdrop-blur-md border border-white/10 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-400">
          <History className="w-5 h-5" />
          Historique des retraits
        </CardTitle>
      </CardHeader>
      <CardContent>
        {withdrawals.length === 0 ? (
          <div className="text-center py-8 text-white/60 text-sm">
            Aucun retrait effectué
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-white/70">Utilisateur</TableHead>
                  <TableHead className="text-white/70">Email</TableHead>
                  <TableHead className="text-white/70">Montant</TableHead>
                  <TableHead className="text-white/70">Date</TableHead>
                  <TableHead className="text-white/70">Moyen</TableHead>
                  <TableHead className="text-white/70">Adresse</TableHead>
                  <TableHead className="text-white/70">Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawals.map((withdrawal) => (
                  <TableRow key={withdrawal.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="text-white/80">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span className="text-sm">{withdrawal.full_name || 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-white/80">
                      <div className="flex items-center gap-1">
                        <AtSign className="w-3 h-3" />
                        <span className="text-sm">{withdrawal.email || 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-emerald-400 font-semibold">
                      {formatAmount(withdrawal.amount)}
                    </TableCell>
                    <TableCell className="text-white/80 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(withdrawal.created_at)}
                      </div>
                    </TableCell>
                    <TableCell className="text-white/80">
                      <div className="flex items-center gap-1">
                        <CreditCard className="w-3 h-3" />
                        {getPaymentMethodName(withdrawal.payment_method)}
                      </div>
                    </TableCell>
                    <TableCell className="text-white/80 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate max-w-32">{withdrawal.payment_address}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-green-400">
                        <CheckCircle className="w-3 h-3" />
                        <span className="text-sm font-medium">{withdrawal.status}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
