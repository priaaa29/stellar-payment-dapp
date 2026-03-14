import React from "react";
import { truncateAddress } from "@/lib/stellar";

interface WalletPanelProps {
  publicKey: string | null;
  balance: string | null;
  isConnecting: boolean;
  isLoadingBalance: boolean;
  error: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  onRefreshBalance: () => void;
}

export default function WalletPanel({
  publicKey,
  balance,
  isConnecting,
  isLoadingBalance,
  error,
  onConnect,
  onDisconnect,
  onRefreshBalance,
}: WalletPanelProps) {
  const [copied, setCopied] = React.useState(false);

  const copyAddress = async () => {
    if (!publicKey) return;
    await navigator.clipboard.writeText(publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!publicKey) {
    return (
      <div className="wallet-card disconnected">
        <div className="wallet-icon">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="19" stroke="var(--border-bright)" strokeWidth="1.5" strokeDasharray="4 2" />
            <path d="M12 20h16M20 12v16" stroke="var(--text-dim)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <p className="wallet-hint">Connect your Freighter wallet to get started</p>

        {error && (
          <div className="error-box">
            <span className="error-icon">⚠</span>
            <span>{error}</span>
          </div>
        )}

        <button
          className="btn-primary"
          onClick={onConnect}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <span className="spinner" />
              Connecting...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 8a6 6 0 1012 0A6 6 0 002 8z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Connect Freighter
            </>
          )}
        </button>

        <p className="install-hint">
          Don&apos;t have Freighter?{" "}
          <a href="https://freighter.app" target="_blank" rel="noopener noreferrer">
            Install here →
          </a>
        </p>

        <style jsx>{`
          .wallet-card.disconnected {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
            padding: 40px 32px;
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 16px;
            text-align: center;
          }
          .wallet-hint {
            color: var(--text-muted);
            font-size: 13px;
            max-width: 240px;
            line-height: 1.6;
          }
          .error-box {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            background: var(--error-dim);
            border: 1px solid rgba(255, 77, 109, 0.3);
            border-radius: 8px;
            padding: 12px 16px;
            color: var(--error);
            font-size: 12px;
            text-align: left;
            max-width: 320px;
            line-height: 1.5;
          }
          .error-icon { flex-shrink: 0; margin-top: 1px; }
          .btn-primary {
            display: flex;
            align-items: center;
            gap: 8px;
            background: var(--accent);
            color: var(--bg);
            border: none;
            border-radius: 8px;
            padding: 12px 24px;
            font-family: var(--font-mono);
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
            letter-spacing: 0.02em;
          }
          .btn-primary:hover:not(:disabled) {
            background: #33ddff;
            transform: translateY(-1px);
            box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4);
          }
          .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
          .spinner {
            width: 14px; height: 14px;
            border: 2px solid rgba(0,0,0,0.2);
            border-top-color: var(--bg);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          .install-hint {
            font-size: 11px;
            color: var(--text-dim);
          }
          .install-hint a {
            color: var(--accent);
            text-decoration: none;
          }
          .install-hint a:hover { text-decoration: underline; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="wallet-card connected">
      <div className="wallet-header">
        <div className="status-dot" />
        <span className="status-label">CONNECTED · TESTNET</span>
        <button className="btn-disconnect" onClick={onDisconnect}>
          Disconnect
        </button>
      </div>

      <div className="address-row">
        <span className="address-label">ADDRESS</span>
        <div className="address-value">
          <span className="mono">{truncateAddress(publicKey, 8)}</span>
          <button className="copy-btn" onClick={copyAddress} title="Copy full address">
            {copied ? "✓" : (
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                <path d="M1 9V2a1 1 0 011-1h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="balance-section">
        <span className="balance-label">BALANCE</span>
        <div className="balance-row">
          {isLoadingBalance ? (
            <span className="balance-loading">Loading...</span>
          ) : (
            <span className="balance-amount">
              {balance ?? "—"}
              <span className="balance-unit">XLM</span>
            </span>
          )}
          <button
            className="refresh-btn"
            onClick={onRefreshBalance}
            disabled={isLoadingBalance}
            title="Refresh balance"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className={isLoadingBalance ? "spin" : ""}
            >
              <path
                d="M12 7A5 5 0 112 7a5 5 0 015-5v0a5 5 0 014.5 2.8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path d="M11.5 2l1 2.8-2.8-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        .wallet-card.connected {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 20px;
          animation: pulse-glow 4s ease-in-out infinite;
        }
        .wallet-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }
        .status-dot {
          width: 8px; height: 8px;
          background: var(--success);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--success);
          animation: twinkle 2s ease infinite;
        }
        .status-label {
          font-size: 10px;
          letter-spacing: 0.1em;
          color: var(--success);
          flex: 1;
        }
        .btn-disconnect {
          background: none;
          border: 1px solid var(--border);
          border-radius: 6px;
          color: var(--text-muted);
          padding: 4px 10px;
          font-family: var(--font-mono);
          font-size: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-disconnect:hover {
          border-color: var(--error);
          color: var(--error);
        }
        .address-row, .balance-section {
          margin-bottom: 16px;
        }
        .address-label, .balance-label {
          display: block;
          font-size: 9px;
          letter-spacing: 0.12em;
          color: var(--text-dim);
          margin-bottom: 6px;
        }
        .address-value {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0,0,0,0.3);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 8px 12px;
        }
        .mono {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--accent);
          flex: 1;
          letter-spacing: 0.05em;
        }
        .copy-btn {
          background: none;
          border: none;
          color: var(--text-dim);
          cursor: pointer;
          padding: 2px;
          transition: color 0.2s;
          font-size: 12px;
        }
        .copy-btn:hover { color: var(--accent); }
        .balance-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .balance-amount {
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 800;
          color: var(--text);
          letter-spacing: -0.02em;
        }
        .balance-unit {
          font-family: var(--font-mono);
          font-size: 13px;
          font-weight: 400;
          color: var(--accent);
          margin-left: 8px;
        }
        .balance-loading {
          font-size: 14px;
          color: var(--text-muted);
        }
        .refresh-btn {
          background: none;
          border: 1px solid var(--border);
          border-radius: 6px;
          color: var(--text-muted);
          padding: 6px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
        }
        .refresh-btn:hover:not(:disabled) {
          border-color: var(--accent);
          color: var(--accent);
        }
        .refresh-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .spin { animation: spin 0.8s linear infinite; }
        @keyframes twinkle {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 rgba(0,212,255,0); }
          50% { box-shadow: 0 0 24px rgba(0,212,255,0.06); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
