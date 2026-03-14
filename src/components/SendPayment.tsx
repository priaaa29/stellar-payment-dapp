import React, { useState } from "react";
import { useTransaction } from "@/hooks/useTransaction";
import { TESTNET_HORIZON } from "@/lib/stellar";

interface SendPaymentProps {
  publicKey: string;
  onSuccess: () => void;
}

export default function SendPayment({ publicKey, onSuccess }: SendPaymentProps) {
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const { isSending, result, error, send, reset } = useTransaction();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !amount) return;

    try {
      await send(publicKey, destination, amount, memo);
      onSuccess();
    } catch {
      // error is captured in the hook
    }
  };

  const handleReset = () => {
    reset();
    setDestination("");
    setAmount("");
    setMemo("");
  };

  if (result?.success) {
    return (
      <div className="success-panel animate-slide-up">
        <div className="success-icon">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="22" stroke="var(--success)" strokeWidth="1.5" />
            <path d="M14 24l7 7 13-14" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h3 className="success-title">Transaction Sent!</h3>
        <p className="success-sub">Your XLM is on its way</p>

        <div className="tx-hash-box">
          <span className="tx-label">TRANSACTION HASH</span>
          <div className="hash-row">
            <span className="hash-value">{result.hash.slice(0, 16)}...{result.hash.slice(-16)}</span>
            <button
              className="copy-btn"
              onClick={() => navigator.clipboard.writeText(result.hash)}
              title="Copy full hash"
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                <path d="M1 9V2a1 1 0 011-1h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="action-row">
          <a
            className="btn-explorer"
            href={`${TESTNET_HORIZON}/transactions/${result.hash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M7 1h5v5M5 8L12 1M1 7v5h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            View on Stellar Expert
          </a>
          <button className="btn-new" onClick={handleReset}>
            Send Another
          </button>
        </div>

        <style jsx>{`
          .success-panel {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
            padding: 36px 24px;
            text-align: center;
            background: var(--success-dim);
            border: 1px solid rgba(0, 255, 157, 0.2);
            border-radius: 16px;
            animation: success-flash 2s ease;
          }
          .success-title {
            font-family: var(--font-display);
            font-size: 22px;
            font-weight: 800;
            color: var(--success);
          }
          .success-sub {
            font-size: 12px;
            color: var(--text-muted);
            margin-top: -8px;
          }
          .tx-hash-box {
            background: rgba(0,0,0,0.3);
            border: 1px solid var(--border);
            border-radius: 10px;
            padding: 12px 16px;
            width: 100%;
          }
          .tx-label {
            display: block;
            font-size: 9px;
            letter-spacing: 0.12em;
            color: var(--text-dim);
            margin-bottom: 6px;
          }
          .hash-row {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .hash-value {
            font-family: var(--font-mono);
            font-size: 11px;
            color: var(--text-muted);
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .copy-btn {
            background: none; border: none;
            color: var(--text-dim); cursor: pointer;
            padding: 2px; transition: color 0.2s; flex-shrink: 0;
          }
          .copy-btn:hover { color: var(--accent); }
          .action-row {
            display: flex;
            gap: 10px;
            width: 100%;
          }
          .btn-explorer {
            display: flex;
            align-items: center;
            gap: 6px;
            flex: 1;
            justify-content: center;
            background: none;
            border: 1px solid var(--border);
            border-radius: 8px;
            color: var(--text-muted);
            padding: 10px;
            font-family: var(--font-mono);
            font-size: 11px;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.2s;
          }
          .btn-explorer:hover {
            border-color: var(--accent);
            color: var(--accent);
          }
          .btn-new {
            flex: 1;
            background: var(--success);
            border: none;
            border-radius: 8px;
            color: var(--bg);
            padding: 10px;
            font-family: var(--font-mono);
            font-size: 11px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
          }
          .btn-new:hover {
            background: #33ffb8;
            transform: translateY(-1px);
          }
          @keyframes success-flash {
            0% { background: rgba(0,255,157,0.05); }
            30% { background: rgba(0,255,157,0.2); }
            100% { background: var(--success-dim); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <form className="send-form" onSubmit={handleSubmit}>
      <div className="field-group">
        <label className="field-label">DESTINATION ADDRESS</label>
        <input
          className="field-input"
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="G..."
          spellCheck={false}
          required
        />
      </div>

      <div className="field-row">
        <div className="field-group flex1">
          <label className="field-label">AMOUNT (XLM)</label>
          <div className="amount-input-wrap">
            <input
              className="field-input"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0.0000001"
              step="any"
              required
            />
            <span className="input-unit">XLM</span>
          </div>
        </div>

        <div className="field-group flex1">
          <label className="field-label">MEMO (OPTIONAL)</label>
          <input
            className="field-input"
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="Payment for..."
            maxLength={28}
          />
        </div>
      </div>

      {error && (
        <div className="error-box animate-fade-in">
          <span className="error-icon">⚠</span>
          <span>{error.message}</span>
        </div>
      )}

      <div className="fee-note">
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M5.5 5v3M5.5 3.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        Network fee: ~0.00001 XLM · Testnet only
      </div>

      <button
        type="submit"
        className="btn-send"
        disabled={isSending || !destination || !amount}
      >
        {isSending ? (
          <>
            <span className="spinner" />
            Sending...
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Send XLM
          </>
        )}
      </button>

      <style jsx>{`
        .send-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .field-group.flex1 { flex: 1; }
        .field-row {
          display: flex;
          gap: 12px;
        }
        .field-label {
          font-size: 9px;
          letter-spacing: 0.12em;
          color: var(--text-dim);
        }
        .field-input {
          background: rgba(0,0,0,0.3);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text);
          font-family: var(--font-mono);
          font-size: 13px;
          padding: 10px 12px;
          width: 100%;
          transition: border-color 0.2s;
          outline: none;
          -moz-appearance: textfield;
        }
        .field-input::-webkit-outer-spin-button,
        .field-input::-webkit-inner-spin-button { -webkit-appearance: none; }
        .field-input::placeholder { color: var(--text-dim); }
        .field-input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 2px var(--accent-dim);
        }
        .amount-input-wrap { position: relative; }
        .amount-input-wrap .field-input { padding-right: 44px; }
        .input-unit {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 10px;
          color: var(--accent);
          letter-spacing: 0.05em;
          pointer-events: none;
        }
        .error-box {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          background: var(--error-dim);
          border: 1px solid rgba(255,77,109,0.3);
          border-radius: 8px;
          padding: 10px 14px;
          color: var(--error);
          font-size: 12px;
          line-height: 1.5;
        }
        .error-icon { flex-shrink: 0; margin-top: 1px; }
        .fee-note {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          color: var(--text-dim);
        }
        .btn-send {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: var(--accent);
          border: none;
          border-radius: 10px;
          color: var(--bg);
          font-family: var(--font-mono);
          font-size: 14px;
          font-weight: 700;
          padding: 14px;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.03em;
        }
        .btn-send:hover:not(:disabled) {
          background: #33ddff;
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(0,212,255,0.35);
        }
        .btn-send:disabled { opacity: 0.5; cursor: not-allowed; }
        .spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(0,0,0,0.2);
          border-top-color: var(--bg);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); to: transform: rotate(360deg); }
        }
      `}</style>
    </form>
  );
}
