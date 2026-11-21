import { EscrowStatus } from '../escrow/escrow.service';

export enum DriftType {
  STATUS_MISMATCH = 'status_mismatch',
  AMOUNT_MISMATCH = 'amount_mismatch',
  MISSING_IN_DB = 'missing_in_db',
  MISSING_ON_CHAIN = 'missing_on_chain',
  /** The chain returned data that failed validation; nothing was written to the database. */
  INVALID_CHAIN_DATA = 'invalid_chain_data',
}

/** Canonical on-chain view of a single escrow, as read by an EscrowChainStateClient. */
export interface ChainEscrowRecord {
  contractEscrowId: string;
  depositor: string;
  beneficiary: string;
  amountXLM: string;
  status: EscrowStatus;
}

export interface DriftRecord {
  contractEscrowId: string;
  driftType: DriftType;
  dbValue?: Partial<ChainEscrowRecord>;
  chainValue?: Partial<ChainEscrowRecord>;
  repaired: boolean;
  repairError?: string;
  detectedAt: string;
  /**
   * Direct link to this escrow's admin detail page (#991), so a responder triaging a drift
   * alert doesn't have to manually copy the ID and navigate to it themselves. Omitted when
   * `ADMIN_DASHBOARD_URL` isn't configured.
   */
  adminUrl?: string;
  /**
   * Number of consecutive reconciliation sweeps on which field-level drift (STATUS_MISMATCH
   * or AMOUNT_MISMATCH) has been detected for this escrow (#865 reorg debounce).
   * Not set for structural drifts (MISSING_ON_CHAIN, MISSING_IN_DB, INVALID_CHAIN_DATA).
   * The alert webhook is withheld until this reaches DEFAULT_DRIFT_CONFIRMATION_THRESHOLD.
   */
  consecutiveDriftCount?: number;
}

export interface ReconciliationError {
  contractEscrowId: string;
  message: string;
  occurredAt: string;
}

export interface ReconciliationRun {
  runId: string;
  startedAt: string;
  completedAt: string;
  /** Number of escrows diffed against chain state during this run. */
  checked: number;
  driftCount: number;
  repairedCount: number;
  drifts: DriftRecord[];
  errorCount: number;
  errors: ReconciliationError[];
}

/** Webhook events emitted by the reconciler. */
export const RECONCILIATION_EVENTS = {
  DRIFT_DETECTED: 'escrow_reconciliation.drift_detected',
  ESCROW_BACKFILLED: 'escrow_reconciliation.escrow_backfilled',
} as const;

export const DEFAULT_ESCROW_RECONCILIATION_SWEEP_INTERVAL_MS = 10 * 60 * 1000;
export const DEFAULT_ESCROW_RECONCILIATION_SWEEP_CONCURRENCY = 8;

/**
 * Minimum number of consecutive reconciliation sweeps on which field-level drift
 * (STATUS_MISMATCH / AMOUNT_MISMATCH) must be observed before the DRIFT_DETECTED
 * webhook alert is dispatched (#865 — reorg debounce).
 *
 * Set to 2 so a single transient mismatch caused by a Soroban ledger reorg does
 * not produce a noisy false-positive alert, while persistent real drift is still
 * surfaced after the second sweep (typically within 20 minutes at the default
 * 10-minute sweep interval).
 */
export const DEFAULT_DRIFT_CONFIRMATION_THRESHOLD = 2;
