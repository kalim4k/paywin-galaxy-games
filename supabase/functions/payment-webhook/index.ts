import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting: max requests per minute per IP
const RATE_LIMIT_WINDOW_MS = 60000;
const MAX_REQUESTS_PER_WINDOW = 10;
const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = ipRequestCounts.get(ip);
  
  if (!record || now > record.resetTime) {
    ipRequestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  
  record.count++;
  return false;
}

// Validate UUID format
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

// Validate amount
function isValidAmount(amount: unknown): amount is number {
  return typeof amount === 'number' && 
         Number.isFinite(amount) && 
         amount > 0 && 
         amount <= 10000000 && // Max 10M FCFA
         Number.isInteger(amount);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Get client IP for rate limiting and logging
  const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                   req.headers.get('x-real-ip') || 
                   'unknown';

  // Rate limiting check
  if (isRateLimited(clientIP)) {
    console.warn(`Rate limited request from IP: ${clientIP}`);
    return new Response(
      JSON.stringify({ error: 'Too many requests' }),
      { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const rawBody = await req.text();
    let payload;
    
    try {
      payload = JSON.parse(rawBody);
    } catch {
      console.error('Invalid JSON payload');
      return new Response(
        JSON.stringify({ error: 'Invalid JSON' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Webhook received from IP:', clientIP);

    const { event, tokenPay, personal_Info, Montant, statut } = payload;

    // Validate required fields exist
    if (!event || !tokenPay || typeof tokenPay !== 'string') {
      console.error('Missing required webhook fields');
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize tokenPay - only allow alphanumeric and hyphens
    const sanitizedTokenPay = tokenPay.replace(/[^a-zA-Z0-9-_]/g, '').substring(0, 100);
    if (sanitizedTokenPay !== tokenPay || sanitizedTokenPay.length < 10) {
      console.error('Invalid tokenPay format');
      return new Response(
        JSON.stringify({ error: 'Invalid token format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Only process completed payments
    if (event !== 'payin.session.completed' || statut !== 'paid') {
      console.log('Payment not completed, ignoring:', event, statut);
      return new Response(
        JSON.stringify({ message: 'Payment not completed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!personal_Info || !Array.isArray(personal_Info) || personal_Info.length === 0) {
      console.error('No personal_Info in webhook');
      return new Response(
        JSON.stringify({ error: 'Invalid webhook data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = personal_Info[0]?.userId;
    const amount = personal_Info[0]?.amount || Montant;

    // Validate userId is a valid UUID
    if (!userId || typeof userId !== 'string' || !isValidUUID(userId)) {
      console.error('Invalid userId format:', userId);
      return new Response(
        JSON.stringify({ error: 'Invalid user ID format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate amount
    if (!isValidAmount(amount)) {
      console.error('Invalid amount:', amount);
      return new Response(
        JSON.stringify({ error: 'Invalid amount' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if this token was already processed (anti-replay using dedicated table)
    const { data: existingWebhook, error: webhookCheckError } = await supabase
      .from('processed_webhooks')
      .select('id')
      .eq('token_pay', sanitizedTokenPay)
      .maybeSingle();

    if (webhookCheckError) {
      console.error('Error checking processed webhooks:', webhookCheckError);
      return new Response(
        JSON.stringify({ error: 'Database error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (existingWebhook) {
      console.log('Token already processed:', sanitizedTokenPay);
      return new Response(
        JSON.stringify({ message: 'Transaction already processed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Also check transactions table as secondary verification
    const { data: existingTransaction } = await supabase
      .from('transactions')
      .select('id')
      .eq('description', `Recharge MoneyFusion: ${sanitizedTokenPay}`)
      .maybeSingle();

    if (existingTransaction) {
      console.log('Transaction already exists:', sanitizedTokenPay);
      return new Response(
        JSON.stringify({ message: 'Transaction already processed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify user exists before proceeding
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, balance')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      console.error('User not found:', userId, profileError);
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Record the webhook token FIRST to prevent race conditions
    const { error: insertWebhookError } = await supabase
      .from('processed_webhooks')
      .insert({
        token_pay: sanitizedTokenPay,
        user_id: userId,
        amount: amount,
        ip_address: clientIP
      });

    if (insertWebhookError) {
      // If insert fails due to unique constraint, another request already processed this
      if (insertWebhookError.code === '23505') {
        console.log('Token already being processed by another request:', sanitizedTokenPay);
        return new Response(
          JSON.stringify({ message: 'Transaction already processed' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      console.error('Error recording webhook:', insertWebhookError);
      return new Response(
        JSON.stringify({ error: 'Failed to record webhook' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
      // Try to clean up the processed_webhooks entry on failure
      await supabase.from('processed_webhooks').delete().eq('token_pay', sanitizedTokenPay);
      return new Response(
        JSON.stringify({ error: 'Failed to update balance' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log the transaction
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        type: 'recharge',
        amount: amount,
        description: `Recharge MoneyFusion: ${sanitizedTokenPay}`,
        status: 'completed'
      });

    if (transactionError) {
      console.error('Error logging transaction:', transactionError);
      // Transaction log failed but balance was updated - log for manual review
    }

    console.log('Payment processed successfully for user:', userId, 'amount:', amount, 'token:', sanitizedTokenPay);

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
