import React, { useEffect, useState } from "react";
import { fetchRecentTransactions, truncateAddress } from "@/lib/stellar";

interface Tx {
  hash: string;
  createdAt: string;
  successful: boolean;
  feeCharged: string;
}

interface RecentTxProps {
  publicKey: string;
  refreshTrigger: number;
}

export default function RecentTransactions({ publicKey, refreshTrigger }: RecentTxProps) {
  const [txs, setTxs] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!publicKey) return;
    setLoading(true);
    fetchRecentTransactions(publicKey)
      .then(setTxs)
      .finally(() => setLoading(false));
  }, [publicKey, refreshTrigger]);

  if (loading) {
    return (
      <div className="tx-loading">
        <span className="spinner" />
        <span>Loading transactions...</span>
        <style jsx>{`
          .tx-loading { display: flex; align-items: center; gap: 10px; padding: 20px 0; color: var(--text-dim); font-size: 12px; }
          .spinner { width: 14px; height: 14px; border: 2px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (txs.length === 0) {
    return (
      <div className="tx-empty">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="14" stroke="var(--border)" strokeWidth="1.5" strokeDasharray="3 2" />
          <path d="M10 16h12M16 10v12" stroke="var(--text-dim)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <p>No transactions yet</p>
        <style jsx>{`
          .tx-empty { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 24px 0; color: var(--text-dim); font-size: 12px; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="tx-list">
      {txs.map((tx, i) => (
        <div key={tx.hash} className="tx-item animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
          <div className={`tx-dot ${tx.successful ? "success" : "fail"}`} />
          <div className="tx-info">
            <span className="tx-hash">{truncateAddress(tx.hash, 8)}</span>
            <span className="tx-date">{new Date(tx.createdAt).toLocaleString()}</span>
          </div>
          <div className="tx-right">
            <span className={`tx-status ${tx.successful ? "success" : "fail"}`}>
              {tx.successful ? "✓" : "✗"}
            </span>
            <a
              href={`https://stellar.expert/explorer/testnet/tx/${tx.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="tx-link"
              title="View on explorer"
            >
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M5 1h5v5M2 9l8-8M1 6v4h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      ))}

      <style jsx>{`
        .tx-list { display: flex; flex-direction: column; gap: 2px; }
        .tx-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 8px;
          background: rgba(0,0,0,0.2);
          border: 1px solid transparent;
          transition: border-color 0.2s;
          animation: slideUp 0.3s ease both;
        }
        .tx-item:hover { border-color: var(--border); }
        .tx-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .tx-dot.success { background: var(--success); box-shadow: 0 0 6px var(--success); }
        .tx-dot.fail { background: var(--error); }
        .tx-info { flex: 1; min-width: 0; }
        .tx-hash { display: block; font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); }
        .tx-date { display: block; font-size: 10px; color: var(--text-dim); margin-top: 2px; }
        .tx-right { display: flex; align-items: center; gap: 8px; }
        .tx-status { font-size: 12px; }
        .tx-status.success { color: var(--success); }
        .tx-status.fail { color: var(--error); }
        .tx-link { color: var(--text-dim); text-decoration: none; padding: 3px; transition: color 0.2s; }
        .tx-link:hover { color: var(--accent); }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
