import React, { useState } from 'react';

// Master Corporate Dashboard Component
function App() {
  // 1. State Hooks: Store user inputs and server responses
  const [metrics, setMetrics] = useState({
    monthly_spend: 100,
    tenure_months: 12,
    login_frequency: 15,
    support_tickets: 2,
    review_text: ""
  });
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // 2. Event Handler: Updates state dynamically as you move the sliders
  const handleChange = (e) => {
    setMetrics({ ...metrics, [e.target.name]: e.target.value });
  };

  // 3. API Handler: Sends the data packet to our FastAPI backend microservice
  const handleEvaluate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monthly_spend: parseFloat(metrics.monthly_spend),
          tenure_months: parseInt(metrics.tenure_months),
          login_frequency: parseInt(metrics.login_frequency),
          support_tickets: parseInt(metrics.support_tickets),
          review_text: metrics.review_text || "No feedback provided."
        })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("API Communication Failure:", error);
      alert("Could not connect to the backend server. Make sure your FastAPI terminal is running!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-6 md:p-12">
      
      {/* Executive Header */}
      <header className="max-w-6xl mx-auto mb-10 border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
          Churn & Sentiment Pulse
        </h1>
        <p className="text-slate-400 mt-2 text-sm">
          Enterprise Account Diagnostics • Real-Time Core AI Analytics Engine
        </p>
      </header>

      {/* Main Grid Split Layout */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Hand Column: Sliders and Form Inputs */}
        <section className="bg-slate-800/50 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
          <h2 className="text-xl font-bold mb-6 text-slate-200">Customer Diagnostics Input</h2>
          <form onSubmit={handleEvaluate} className="space-y-5">
            
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Monthly Financial Spend ($): <span className="text-teal-400 text-sm font-bold">{metrics.monthly_spend}</span>
              </label>
              <input type="range" name="monthly_spend" min="20" max="200" step="5" value={metrics.monthly_spend} onChange={handleChange} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-400" />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Account Tenure (Months): <span className="text-teal-400 text-sm font-bold">{metrics.tenure_months}</span>
              </label>
              <input type="range" name="tenure_months" min="1" max="60" value={metrics.tenure_months} onChange={handleChange} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-400" />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Monthly Login Frequency: <span className="text-teal-400 text-sm font-bold">{metrics.login_frequency}</span>
              </label>
              <input type="range" name="login_frequency" min="1" max="30" value={metrics.login_frequency} onChange={handleChange} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-400" />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Open Customer Support Tickets: <span className="text-teal-400 text-sm font-bold">{metrics.support_tickets}</span>
              </label>
              <input type="range" name="support_tickets" min="0" max="10" value={metrics.support_tickets} onChange={handleChange} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-400" />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Raw Text Feedback / Review Log</label>
              <textarea name="review_text" rows="3" value={metrics.review_text} onChange={handleChange} placeholder="Paste exact client communication records or system reviews here..." className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-200 text-sm focus:outline-none focus:border-teal-400 transition-colors resize-none" />
            </div>

            <button type="submit" disabled={loading} className="w-full py-3.5 px-4 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white font-bold rounded-xl transition-all shadow-lg disabled:opacity-50 tracking-wide text-sm uppercase">
              {loading ? "Processing Core AI Models..." : "Evaluate Account Health"}
            </button>
          </form>
        </section>

        {/* Right Hand Column: AI Analytics Visualizer */}
        <section className="flex flex-col justify-between space-y-6">
          {result ? (
            <div className="bg-slate-800/30 border border-slate-800 rounded-2xl p-6 shadow-xl flex-1 flex flex-col justify-between">
              
              {/* Top Card: ML Churn Risk Percentage */}
              <div>
                <h2 className="text-xl font-bold mb-6 text-slate-200">Calculated Risk Output</h2>
                <div className="text-center py-6 bg-slate-900/50 border border-slate-800 rounded-xl mb-6">
                  <span className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Algorithmic Churn Probability</span>
                  <span className={`text-6xl font-black ${result.churn_prediction.will_churn ? "text-rose-500" : "text-emerald-400"}`}>
                    {result.churn_prediction.risk_score}%
                  </span>
                  <span className={`inline-block mt-3 px-3 py-1 text-xs font-extrabold uppercase rounded-full ${result.churn_prediction.will_churn ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>
                    {result.churn_prediction.will_churn ? "Critical Action Required" : "Account Stable"}
                  </span>
                </div>
              </div>

              {/* Bottom Card: NLP Sentiment Analysis Output */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                <span className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">NLP Review Analytics</span>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                  <span className="text-sm text-slate-400">Classified Sentiment Label:</span>
                  <span className={`text-sm font-bold ${result.sentiment.label === 'Positive' ? 'text-emerald-400' : result.sentiment.label === 'Negative' ? 'text-rose-400' : 'text-amber-400'}`}>
                    {result.sentiment.label}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">VADER Intensity Score:</span>
                  <span className="text-sm font-mono bg-slate-800 px-2.5 py-1 rounded border border-slate-700 text-slate-300">
                    {result.sentiment.score}
                  </span>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-slate-800/10 border border-dashed border-slate-800 rounded-2xl p-8 text-center flex-1 flex flex-col items-center justify-center text-slate-500">
              <p className="max-w-xs text-sm">
                Adjust client diagnostic controls on the left and click "Evaluate" to query the system models.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;