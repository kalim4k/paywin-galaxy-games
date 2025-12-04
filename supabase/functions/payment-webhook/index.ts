import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    console.log('Webhook received:', JSON.stringify(payload));

    const { event, tokenPay, personal_Info, Montant, statut } = payload;

    // Only process completed payments
    if (event !== 'payin.session.completed' && statut !== 'paid') {
      console.log('Payment not completed, ignoring:', event, statut);
      return new Response(
        JSON.stringify({ message: 'Payment not completed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!personal_Info || personal_Info.length === 0) {
      console.error('No personal_Info in webhook');
      return new Response(
        JSON.stringify({ error: 'Invalid webhook data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = personal_Info[0].userId;
    const amount = personal_Info[0].amount || Montant;

    if (!userId || !amount) {
      console.error('Missing userId or amount');
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if this transaction was already processed
    const { data: existingTransaction } = await supabase
      .from('transactions')
      .select('id')
      .eq('description', `Recharge MoneyFusion: ${tokenPay}`)
      .single();

    if (existingTransaction) {
      console.log('Transaction already processed:', tokenPay);
      return new Response(
        JSON.stringify({ message: 'Transaction already processed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get current user balance
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('balance')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      console.error('User not found:', profileError);
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update user balance
    const newBalance = profile.balance + amount;
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        balance: newBalance,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating balance:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update balance' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log the transaction
    await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        type: 'recharge',
        amount: amount,
        description: `Recharge MoneyFusion: ${tokenPay}`,
        status: 'completed'
      });

    console.log('Payment processed successfully for user:', userId, 'amount:', amount);

    return new Response(
      JSON.stringify({ success: true, message: 'Payment processed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
