
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
    // Ici vous pourrez intégrer la logique d'authentification
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <span className="text-black font-bold text-3xl">P</span>
          </div>
          <h1 className="text-white font-bold text-4xl mb-2">PAYWIN</h1>
          <p className="text-white/80 text-lg">
            {isLogin ? 'Connectez-vous à votre compte' : 'Créez votre compte'}
          </p>
        </div>

        {/* Formulaire */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white font-medium">
                  Nom complet
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Votre nom complet"
                    className="pl-12 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-yellow-400 focus:ring-yellow-400"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="votre@email.com"
                  className="pl-12 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-yellow-400 focus:ring-yellow-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white font-medium">
                Mot de passe
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Votre mot de passe"
                  className="pl-12 pr-12 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-yellow-400 focus:ring-yellow-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white font-medium">
                  Confirmer le mot de passe
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirmez votre mot de passe"
                    className="pl-12 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-yellow-400 focus:ring-yellow-400"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-4 text-lg rounded-2xl shadow-xl transform transition-all duration-200 hover:scale-105"
            >
              {isLogin ? 'Se connecter' : "S'inscrire"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/80">
              {isLogin ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"}
            </p>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-yellow-400 font-semibold hover:text-yellow-300 transition-colors mt-2"
            >
              {isLogin ? "Créer un compte" : "Se connecter"}
            </button>
          </div>
        </div>

        {/* Méthodes alternatives */}
        <div className="mt-6 space-y-3">
          <Button
            variant="outline"
            className="w-full bg-black/80 border-white/20 text-white hover:bg-black/90 py-4 rounded-2xl"
          >
            Continuer avec Apple
          </Button>
          
          <Button
            variant="outline"
            className="w-full bg-white/90 border-white/20 text-black hover:bg-white py-4 rounded-2xl"
          >
            Continuer avec Google
          </Button>
          
          <Button
            variant="outline"
            className="w-full bg-blue-600/80 border-white/20 text-white hover:bg-blue-600/90 py-4 rounded-2xl"
          >
            Continuer avec Facebook
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
