import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FUSION_PAY_API_URL = "https://www.pay.moneyfusion.net/Paywin/86d5817d1b7ba39e/pay/";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, userId, userEmail, userName } = await req.json();

    if (!amount || !userId) {
      return new Response(
        JSON.stringify({ error: 'Amount and userId are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const origin = req.headers.get('origin') || 'https://preview--paywin.lovable.app';
    
    const paymentData = {
      totalPrice: amount,
      article: [
        {
          "Recharge Paywin": amount,
        },
      ],
      personal_Info: [
        {
          userId: userId,
          amount: amount,
        },
      ],
      numeroSend: "00000000",
      nomclient: userName || userEmail || "Client Paywin",
      return_url: `${origin}/withdrawal?payment=success`,
      webhook_url: `https://dtlgcbqufokwfwdphlig.supabase.co/functions/v1/payment-webhook`,
    };

    console.log('Initiating payment with data:', JSON.stringify(paymentData));

    const response = await fetch(FUSION_PAY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    const result = await response.json();
    console.log('FusionPay response:', JSON.stringify(result));

    if (result.statut && result.url) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          paymentUrl: result.url,
          token: result.token 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      console.error('FusionPay error:', result.message);
      return new Response(
        JSON.stringify({ error: result.message || 'Payment initiation failed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error initiating payment:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
