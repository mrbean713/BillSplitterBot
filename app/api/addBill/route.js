export async function POST(req) {
    const body = await req.json();
    const { billAmount, payer, splitWith } = body;
  
    if (!billAmount || !payer || splitWith.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid data' }), { status: 400 });
    }
  
    const splitAmount = billAmount / splitWith.length;
    const summary = splitWith
      .filter((person) => person !== payer)
      .map((person) => `${person} owes ${payer} $${splitAmount.toFixed(2)}`);
  
    console.log("Summary Array:", summary);  // Debug log to ensure it's an array
  
    return new Response(JSON.stringify(summary), { status: 200 });
  }
  