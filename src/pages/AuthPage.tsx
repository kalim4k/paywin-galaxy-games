
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo et titre */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl border-4 border-white/30">
            <span className="text-white font-bold text-4xl">P</span>
          </div>
          <h1 className="text-white font-bold text-5xl mb-3 tracking-tight">PAYWIN</h1>
          <p className="text-white/90 text-xl font-medium">
            {isLogin ? 'Connectez-vous' : 'Créez votre compte'}
          </p>
        </div>

        {/* Formulaire */}
        <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-3">
                <Label htmlFor="name" className="text-white font-semibold text-lg">
                  Nom complet
                </Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 w-6 h-6" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Votre nom complet"
                    className="pl-14 h-14 bg-white/25 border-white/40 text-white placeholder:text-white/70 focus:border-yellow-300 focus:ring-yellow-300 text-lg rounded-2xl"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Label htmlFor="email" className="text-white font-semibold text-lg">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 w-6 h-6" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="votre@email.com"
                  className="pl-14 h-14 bg-white/25 border-white/40 text-white placeholder:text-white/70 focus:border-yellow-300 focus:ring-yellow-300 text-lg rounded-2xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" className="text-white font-semibold text-lg">
                Mot de passe
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 w-6 h-6" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Votre mot de passe"
                  className="pl-14 pr-14 h-14 bg-white/25 border-white/40 text-white placeholder:text-white/70 focus:border-yellow-300 focus:ring-yellow-300 text-lg rounded-2xl"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-3">
                <Label htmlFor="confirmPassword" className="text-white font-semibold text-lg">
                  Confirmer le mot de passe
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 w-6 h-6" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirmez votre mot de passe"
                    className="pl-14 h-14 bg-white/25 border-white/40 text-white placeholder:text-white/70 focus:border-yellow-300 focus:ring-yellow-300 text-lg rounded-2xl"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-bold h-14 text-xl rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-yellow-300/50"
            >
              {isLogin ? 'Se connecter' : "S'inscrire"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/90 text-lg mb-4">
              {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
            </p>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-yellow-300 font-bold text-lg hover:text-yellow-200 transition-colors duration-200 underline decoration-2 underline-offset-4"
            >
              {isLogin ? "Créer un compte" : "Se connecter"}
            </button>
          </div>
        </div>

        {/* Footer avec mentions légales */}
        <div className="mt-8 text-center">
          <p className="text-white/70 text-sm">
            En continuant, vous acceptez nos{' '}
            <span className="text-yellow-300 underline cursor-pointer">
              conditions d'utilisation
            </span>{' '}
            et notre{' '}
            <span className="text-yellow-300 underline cursor-pointer">
              politique de confidentialité
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
