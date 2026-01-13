export interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  defaultValue?: string;
}

export interface APIFunction {
  id: string;
  name: string;
  description: string;
  category: "core" | "payment" | "query" | "terminal" | "session";
  signature: string;
  parameters: Parameter[];
  example: string;
  returnType?: string;
  notes?: string[];
}

export const apiFunctions: APIFunction[] = [
  // Core Functions
  {
    id: "initiate",
    name: "initiate",
    description: "Initialize the EdfaPay SDK with credentials. This must be called before any other SDK operations. Supports both token-based and dialog-based authentication flows.",
    category: "core",
    signature: `fun initiate(
    context: FragmentActivity,
    credentials: EdfaPayCredentials,
    onSuccess: (EP, sessionId: String?) -> Unit,
    onError: (Throwable) -> Unit
)`,
    parameters: [
      { name: "context", type: "FragmentActivity", required: true, description: "The activity context for displaying UI elements" },
      { name: "credentials", type: "EdfaPayCredentials", required: true, description: "SDK credentials containing environment and authentication details" },
      { name: "onSuccess", type: "(EP, String?) -> Unit", required: true, description: "Callback invoked on successful initialization with EP instance and session ID" },
      { name: "onError", type: "(Throwable) -> Unit", required: true, description: "Callback invoked when initialization fails" },
    ],
    example: `val credentials = EdfaPayCredentials(
    environment = Environment.SANDBOX,
    token = "your-auth-token"
)

EdfaPayPlugin.initiate(
    context = this,
    credentials = credentials,
    onSuccess = { ep, sessionId ->
        Log.d("EdfaPay", "Initialized with session: $sessionId")
    },
    onError = { error ->
        Log.e("EdfaPay", "Init failed: \${error.message}")
    }
)`,
    returnType: "Unit",
    notes: [
      "Must be called on the main thread",
      "Token-based login bypasses the login dialog",
      "Session ID can be used for session management",
    ],
  },
  {
    id: "terminalInfo",
    name: "terminalInfo",
    description: "Retrieve information about the current terminal configuration and status.",
    category: "core",
    signature: `fun terminalInfo(
    onSuccess: (TerminalInfo) -> Unit,
    onError: ((Throwable) -> Unit)?
)`,
    parameters: [
      { name: "onSuccess", type: "(TerminalInfo) -> Unit", required: true, description: "Callback with terminal information" },
      { name: "onError", type: "((Throwable) -> Unit)?", required: false, description: "Optional error callback" },
    ],
    example: `EdfaPayPlugin.terminalInfo(
    onSuccess = { info ->
        Log.d("Terminal", "TSN: \${info.tsn}")
        Log.d("Terminal", "Merchant: \${info.merchantName}")
    },
    onError = { error ->
        Log.e("Terminal", "Failed: \${error.message}")
    }
)`,
    returnType: "Unit",
  },

  // Payment Operations
  {
    id: "purchase",
    name: "purchase",
    description: "Process a purchase transaction. This is the primary method for charging a customer's card.",
    category: "payment",
    signature: `fun purchase(
    activity: FragmentActivity,
    flowType: FlowType = FlowType.DETAIL,
    txnParams: TxnParams,
    onRequestTimerEnd: TimeOutCallBack,
    onCardScanTimerEnd: TimeOutCallBack,
    onError: OnErrorCallBack,
    onPaymentProcessComplete: ProcessCompleteCallback,
    onCancelByUser: CancelByUserCallBack,
    presentationType: PresentationType = presentType
)`,
    parameters: [
      { name: "activity", type: "FragmentActivity", required: true, description: "The activity context" },
      { name: "flowType", type: "FlowType", required: false, description: "UI flow type for the transaction", defaultValue: "FlowType.DETAIL" },
      { name: "txnParams", type: "TxnParams", required: true, description: "Transaction parameters including amount and currency" },
      { name: "onRequestTimerEnd", type: "() -> Unit", required: true, description: "Called when the request timer expires" },
      { name: "onCardScanTimerEnd", type: "() -> Unit", required: true, description: "Called when card scan timer expires" },
      { name: "onError", type: "(Throwable) -> Unit", required: true, description: "Error callback" },
      { name: "onPaymentProcessComplete", type: "ProcessCompleteCallback", required: true, description: "Called when payment processing completes" },
      { name: "onCancelByUser", type: "() -> Unit", required: true, description: "Called when user cancels the transaction" },
      { name: "presentationType", type: "PresentationType", required: false, description: "How to present the payment UI" },
    ],
    example: `val txnParams = TxnParams(
    amount = 100.00,
    currency = "AED",
    description = "Product Purchase"
)

EdfaPayPlugin.purchase(
    activity = this,
    flowType = FlowType.DETAIL,
    txnParams = txnParams,
    onRequestTimerEnd = { showTimeoutDialog() },
    onCardScanTimerEnd = { showCardTimeoutDialog() },
    onError = { error -> handleError(error) },
    onPaymentProcessComplete = { status, code, txn, isComplete ->
        if (status) {
            showSuccessScreen(txn)
        } else {
            showFailureScreen(code)
        }
    },
    onCancelByUser = { showCancellationMessage() }
)`,
    returnType: "Unit",
    notes: [
      "Amount should be in the currency's standard unit (e.g., AED, not fils)",
      "The ProcessCompleteCallback provides transaction details on success",
    ],
  },
  {
    id: "authorize",
    name: "authorize",
    description: "Authorize a transaction without capturing funds. Use capture() to complete the transaction later.",
    category: "payment",
    signature: `fun authorize(
    activity: FragmentActivity,
    flowType: FlowType = FlowType.DETAIL,
    txnParams: TxnParams,
    onRequestTimerEnd: TimeOutCallBack,
    onCardScanTimerEnd: TimeOutCallBack,
    onError: OnErrorCallBack,
    onPaymentProcessComplete: ProcessCompleteCallback,
    onCancelByUser: CancelByUserCallBack,
    presentationType: PresentationType = presentType
)`,
    parameters: [
      { name: "activity", type: "FragmentActivity", required: true, description: "The activity context" },
      { name: "flowType", type: "FlowType", required: false, description: "UI flow type", defaultValue: "FlowType.DETAIL" },
      { name: "txnParams", type: "TxnParams", required: true, description: "Transaction parameters" },
      { name: "onRequestTimerEnd", type: "() -> Unit", required: true, description: "Request timeout callback" },
      { name: "onCardScanTimerEnd", type: "() -> Unit", required: true, description: "Card scan timeout callback" },
      { name: "onError", type: "(Throwable) -> Unit", required: true, description: "Error callback" },
      { name: "onPaymentProcessComplete", type: "ProcessCompleteCallback", required: true, description: "Completion callback" },
      { name: "onCancelByUser", type: "() -> Unit", required: true, description: "User cancellation callback" },
    ],
    example: `EdfaPayPlugin.authorize(
    activity = this,
    txnParams = TxnParams(amount = 500.00, currency = "AED"),
    onRequestTimerEnd = { /* handle timeout */ },
    onCardScanTimerEnd = { /* handle timeout */ },
    onError = { error -> /* handle error */ },
    onPaymentProcessComplete = { status, code, txn, isComplete ->
        // Store txn.id for later capture
        saveAuthorizationId(txn?.id)
    },
    onCancelByUser = { /* handle cancel */ }
)`,
    returnType: "Unit",
    notes: [
      "Funds are held but not captured",
      "Must call capture() within the authorization validity period",
      "Useful for hotel bookings, car rentals, etc.",
    ],
  },
  {
    id: "capture",
    name: "capture",
    description: "Capture a previously authorized transaction. Completes the fund transfer.",
    category: "payment",
    signature: `fun capture(
    activity: FragmentActivity,
    flowType: FlowType = FlowType.DETAIL,
    txnParams: TxnParams,
    onRequestTimerEnd: TimeOutCallBack,
    onCardScanTimerEnd: TimeOutCallBack,
    onError: OnErrorCallBack,
    onPaymentProcessComplete: ProcessCompleteCallback,
    onCancelByUser: CancelByUserCallBack,
    presentationType: PresentationType = presentType
)`,
    parameters: [
      { name: "activity", type: "FragmentActivity", required: true, description: "The activity context" },
      { name: "txnParams", type: "TxnParams", required: true, description: "Must include the original authorization transaction ID" },
      { name: "onPaymentProcessComplete", type: "ProcessCompleteCallback", required: true, description: "Completion callback" },
      { name: "onError", type: "(Throwable) -> Unit", required: true, description: "Error callback" },
    ],
    example: `val captureParams = TxnParams(
    originalTransactionId = "auth_txn_id_12345",
    amount = 450.00,  // Can be less than or equal to auth amount
    currency = "AED"
)

EdfaPayPlugin.capture(
    activity = this,
    txnParams = captureParams,
    onRequestTimerEnd = { },
    onCardScanTimerEnd = { },
    onError = { error -> showError(error) },
    onPaymentProcessComplete = { status, _, txn, _ ->
        if (status) showCaptureSuccess(txn)
    },
    onCancelByUser = { }
)`,
    returnType: "Unit",
    notes: [
      "Capture amount can be less than or equal to the authorized amount",
      "Cannot capture more than the authorized amount",
    ],
  },
  {
    id: "refund",
    name: "refund",
    description: "Process a refund for a completed transaction. Returns funds to the customer's card.",
    category: "payment",
    signature: `fun refund(
    activity: FragmentActivity,
    flowType: FlowType = FlowType.DETAIL,
    txnParams: TxnParams,
    onRequestTimerEnd: TimeOutCallBack,
    onCardScanTimerEnd: TimeOutCallBack,
    onError: OnErrorCallBack,
    onPaymentProcessComplete: ProcessCompleteCallback,
    onCancelByUser: CancelByUserCallBack,
    presentationType: PresentationType = presentType
)`,
    parameters: [
      { name: "activity", type: "FragmentActivity", required: true, description: "The activity context" },
      { name: "txnParams", type: "TxnParams", required: true, description: "Refund parameters including original transaction reference" },
      { name: "onPaymentProcessComplete", type: "ProcessCompleteCallback", required: true, description: "Completion callback" },
      { name: "onError", type: "(Throwable) -> Unit", required: true, description: "Error callback" },
    ],
    example: `val refundParams = TxnParams(
    originalTransactionId = "original_txn_id",
    amount = 50.00,  // Partial refund
    currency = "AED",
    description = "Customer refund request"
)

EdfaPayPlugin.refund(
    activity = this,
    txnParams = refundParams,
    onRequestTimerEnd = { },
    onCardScanTimerEnd = { },
    onError = { error -> handleRefundError(error) },
    onPaymentProcessComplete = { status, code, txn, _ ->
        if (status) {
            notifyCustomerRefundComplete(txn)
        }
    },
    onCancelByUser = { }
)`,
    returnType: "Unit",
    notes: [
      "Supports partial refunds",
      "Total refunds cannot exceed original transaction amount",
      "Refund processing time depends on the issuing bank",
    ],
  },
  {
    id: "void",
    name: "void",
    description: "Void a transaction that hasn't been settled yet. Cancels the transaction entirely.",
    category: "payment",
    signature: `fun void(
    activity: FragmentActivity,
    transaction: Transaction?,
    onSuccess: (TxnResponse) -> Unit,
    onError: OnErrorCallBack
)`,
    parameters: [
      { name: "activity", type: "FragmentActivity", required: true, description: "The activity context" },
      { name: "transaction", type: "Transaction?", required: true, description: "The transaction to void" },
      { name: "onSuccess", type: "(TxnResponse) -> Unit", required: true, description: "Success callback with response" },
      { name: "onError", type: "(Throwable) -> Unit", required: true, description: "Error callback" },
    ],
    example: `// Get transaction from history or recent purchase
val transaction = getRecentTransaction()

EdfaPayPlugin.void(
    activity = this,
    transaction = transaction,
    onSuccess = { response ->
        Log.d("Void", "Transaction voided: \${response.txnId}")
        updateTransactionStatus(transaction.id, "VOIDED")
    },
    onError = { error ->
        Log.e("Void", "Void failed: \${error.message}")
    }
)`,
    returnType: "Unit",
    notes: [
      "Only works for unsettled transactions",
      "After settlement, use refund instead",
      "Void is typically available same-day before batch close",
    ],
  },
  {
    id: "reverse",
    name: "reverse",
    description: "Reverse a specific transaction. Use for immediate transaction cancellation.",
    category: "payment",
    signature: `fun reverse(
    activity: FragmentActivity,
    transaction: Transaction,
    onSuccess: (TxnResponse) -> Unit,
    onError: OnErrorCallBack
)`,
    parameters: [
      { name: "activity", type: "FragmentActivity", required: true, description: "The activity context" },
      { name: "transaction", type: "Transaction", required: true, description: "The transaction to reverse" },
      { name: "onSuccess", type: "(TxnResponse) -> Unit", required: true, description: "Success callback" },
      { name: "onError", type: "(Throwable) -> Unit", required: true, description: "Error callback" },
    ],
    example: `EdfaPayPlugin.reverse(
    activity = this,
    transaction = failedTransaction,
    onSuccess = { response ->
        showReversalConfirmation(response)
    },
    onError = { error ->
        showReversalError(error)
    }
)`,
    returnType: "Unit",
  },
  {
    id: "reverseLastTransaction",
    name: "reverseLastTransaction",
    description: "Convenience method to reverse the most recent transaction without needing to provide the transaction object.",
    category: "payment",
    signature: `fun reverseLastTransaction(
    activity: FragmentActivity,
    onSuccess: (TxnResponse) -> Unit,
    onError: OnErrorCallBack
)`,
    parameters: [
      { name: "activity", type: "FragmentActivity", required: true, description: "The activity context" },
      { name: "onSuccess", type: "(TxnResponse) -> Unit", required: true, description: "Success callback" },
      { name: "onError", type: "(Throwable) -> Unit", required: true, description: "Error callback" },
    ],
    example: `EdfaPayPlugin.reverseLastTransaction(
    activity = this,
    onSuccess = { response ->
        Toast.makeText(this, "Last transaction reversed", Toast.LENGTH_SHORT).show()
    },
    onError = { error ->
        if (error.message?.contains("not exist") == true) {
            Toast.makeText(this, "No transaction to reverse", Toast.LENGTH_SHORT).show()
        }
    }
)`,
    returnType: "Unit",
    notes: [
      "Throws error if no recent transaction exists",
      "Only reverses transactions that are eligible for reversal",
    ],
  },

  // Transaction Queries
  {
    id: "txnHistory",
    name: "txnHistory",
    description: "Retrieve transaction history with optional pagination support.",
    category: "query",
    signature: `fun txnHistory(
    pagination: Pagination? = null,
    onSuccess: (List<Transaction>) -> Unit,
    onError: OnErrorCallBack
)`,
    parameters: [
      { name: "pagination", type: "Pagination?", required: false, description: "Pagination parameters (page, limit)" },
      { name: "onSuccess", type: "(List<Transaction>) -> Unit", required: true, description: "Success callback with transaction list" },
      { name: "onError", type: "(Throwable) -> Unit", required: true, description: "Error callback" },
    ],
    example: `// Get first page of transactions
EdfaPayPlugin.txnHistory(
    pagination = Pagination(page = 1, limit = 20),
    onSuccess = { transactions ->
        transactionAdapter.submitList(transactions)
    },
    onError = { error ->
        showErrorMessage(error.message)
    }
)

// Get all transactions (no pagination)
EdfaPayPlugin.txnHistory(
    onSuccess = { transactions ->
        displayAllTransactions(transactions)
    },
    onError = { handleError(it) }
)`,
    returnType: "Unit",
  },
  {
    id: "txnDetail",
    name: "txnDetail",
    description: "Get detailed information about a specific transaction by its ID.",
    category: "query",
    signature: `fun txnDetail(
    txnId: String,
    onSuccess: (Transaction) -> Unit,
    onError: OnErrorCallBack
)`,
    parameters: [
      { name: "txnId", type: "String", required: true, description: "The transaction ID to look up" },
      { name: "onSuccess", type: "(Transaction) -> Unit", required: true, description: "Success callback with transaction details" },
      { name: "onError", type: "(Throwable) -> Unit", required: true, description: "Error callback" },
    ],
    example: `EdfaPayPlugin.txnDetail(
    txnId = "txn_abc123xyz",
    onSuccess = { transaction ->
        displayTransactionDetails(
            amount = transaction.amount,
            status = transaction.status,
            cardLast4 = transaction.cardLast4,
            timestamp = transaction.createdAt
        )
    },
    onError = { error ->
        showTransactionNotFound()
    }
)`,
    returnType: "Unit",
  },

  // Reconciliation
  {
    id: "reconcile",
    name: "reconcile",
    description: "Initiate a reconciliation process to settle transactions with the payment processor.",
    category: "query",
    signature: `fun reconcile(
    onSuccess: (Reconcile) -> Unit,
    onError: OnErrorCallBack
)`,
    parameters: [
      { name: "onSuccess", type: "(Reconcile) -> Unit", required: true, description: "Success callback with reconciliation result" },
      { name: "onError", type: "(Throwable) -> Unit", required: true, description: "Error callback" },
    ],
    example: `EdfaPayPlugin.reconcile(
    onSuccess = { reconcile ->
        Log.d("Reconcile", "Batch ID: \${reconcile.batchId}")
        Log.d("Reconcile", "Total: \${reconcile.totalAmount}")
        Log.d("Reconcile", "Count: \${reconcile.transactionCount}")
        showReconciliationSuccess(reconcile)
    },
    onError = { error ->
        showReconciliationError(error)
    }
)`,
    returnType: "Unit",
    notes: [
      "Typically performed at end of business day",
      "Settles all pending transactions",
    ],
  },
  {
    id: "reconciliationHistory",
    name: "reconciliationHistory",
    description: "Retrieve the history of past reconciliations for the current terminal.",
    category: "query",
    signature: `fun reconciliationHistory(
    onSuccess: (List<ReconciliationHistory>) -> Unit,
    onError: OnErrorCallBack
)`,
    parameters: [
      { name: "onSuccess", type: "(List<ReconciliationHistory>) -> Unit", required: true, description: "Success callback with reconciliation history" },
      { name: "onError", type: "(Throwable) -> Unit", required: true, description: "Error callback" },
    ],
    example: `EdfaPayPlugin.reconciliationHistory(
    onSuccess = { history ->
        history.forEach { record ->
            Log.d("History", "Date: \${record.date}, Amount: \${record.totalAmount}")
        }
        reconciliationAdapter.submitList(history)
    },
    onError = { error ->
        showError(error)
    }
)`,
    returnType: "Unit",
  },
  {
    id: "reconciliationDetail",
    name: "reconciliationDetail",
    description: "Get detailed information about a specific reconciliation by its ID.",
    category: "query",
    signature: `fun reconciliationDetail(
    id: String,
    onSuccess: (ReconciliationDetail) -> Unit,
    onError: OnErrorCallBack
)`,
    parameters: [
      { name: "id", type: "String", required: true, description: "The reconciliation ID" },
      { name: "onSuccess", type: "(ReconciliationDetail) -> Unit", required: true, description: "Success callback with details" },
      { name: "onError", type: "(Throwable) -> Unit", required: true, description: "Error callback" },
    ],
    example: `EdfaPayPlugin.reconciliationDetail(
    id = "recon_12345",
    onSuccess = { detail ->
        showReconciliationBreakdown(
            purchases = detail.purchaseTotal,
            refunds = detail.refundTotal,
            net = detail.netAmount
        )
    },
    onError = { handleError(it) }
)`,
    returnType: "Unit",
  },
  {
    id: "reconciliationReceipt",
    name: "reconciliationReceipt",
    description: "Generate and retrieve a printable receipt for a reconciliation.",
    category: "query",
    signature: `fun reconciliationReceipt(
    id: String,
    onSuccess: (ReconciliationReceipt) -> Unit,
    onError: OnErrorCallBack
)`,
    parameters: [
      { name: "id", type: "String", required: true, description: "The reconciliation ID" },
      { name: "onSuccess", type: "(ReconciliationReceipt) -> Unit", required: true, description: "Success callback with receipt data" },
      { name: "onError", type: "(Throwable) -> Unit", required: true, description: "Error callback" },
    ],
    example: `EdfaPayPlugin.reconciliationReceipt(
    id = "recon_12345",
    onSuccess = { receipt ->
        printReceipt(receipt.formattedText)
        // or
        displayReceiptPreview(receipt)
    },
    onError = { error ->
        showReceiptError(error)
    }
)`,
    returnType: "Unit",
  },

  // Terminal Management
  {
    id: "activateTerminal",
    name: "activateTerminal",
    description: "Activate the terminal for accepting payments. Required before processing transactions.",
    category: "terminal",
    signature: `fun activateTerminal(
    password: String? = null,
    onSuccess: () -> Unit,
    onError: OnErrorCallBack
)`,
    parameters: [
      { name: "password", type: "String?", required: false, description: "Optional activation password" },
      { name: "onSuccess", type: "() -> Unit", required: true, description: "Success callback" },
      { name: "onError", type: "(Throwable) -> Unit", required: true, description: "Error callback" },
    ],
    example: `EdfaPayPlugin.activateTerminal(
    password = "terminal_password",
    onSuccess = {
        Log.d("Terminal", "Terminal activated successfully")
        enablePaymentButtons()
    },
    onError = { error ->
        Log.e("Terminal", "Activation failed: \${error.message}")
        showActivationError()
    }
)`,
    returnType: "Unit",
  },
  {
    id: "deActivateTerminal",
    name: "deActivateTerminal",
    description: "Deactivate the terminal. Prevents further transactions until reactivated.",
    category: "terminal",
    signature: `fun deActivateTerminal(
    password: String? = null,
    onSuccess: () -> Unit,
    onError: OnErrorCallBack
)`,
    parameters: [
      { name: "password", type: "String?", required: false, description: "Optional deactivation password" },
      { name: "onSuccess", type: "() -> Unit", required: true, description: "Success callback" },
      { name: "onError", type: "(Throwable) -> Unit", required: true, description: "Error callback" },
    ],
    example: `EdfaPayPlugin.deActivateTerminal(
    onSuccess = {
        disablePaymentFeatures()
        showTerminalDeactivatedMessage()
    },
    onError = { error ->
        showDeactivationError(error)
    }
)`,
    returnType: "Unit",
  },
  {
    id: "syncTerminal",
    name: "syncTerminal",
    description: "Synchronize terminal configuration and settings with the server.",
    category: "terminal",
    signature: `fun syncTerminal(
    onSuccess: () -> Unit,
    onError: OnErrorCallBack
)`,
    parameters: [
      { name: "onSuccess", type: "() -> Unit", required: true, description: "Success callback" },
      { name: "onError", type: "(Throwable) -> Unit", required: true, description: "Error callback" },
    ],
    example: `EdfaPayPlugin.syncTerminal(
    onSuccess = {
        Log.d("Terminal", "Terminal synced with server")
        refreshTerminalDisplay()
    },
    onError = { error ->
        Log.e("Terminal", "Sync failed: \${error.message}")
        showSyncRetryOption()
    }
)`,
    returnType: "Unit",
    notes: [
      "Recommended to call after network reconnection",
      "Updates terminal parameters and configurations",
    ],
  },

  // Session Management
  {
    id: "getSessionList",
    name: "getSessionList",
    description: "Retrieve the list of all stored sessions for the current device.",
    category: "session",
    signature: `fun getSessionList(context: Context): List<Session>`,
    parameters: [
      { name: "context", type: "Context", required: true, description: "Application or activity context" },
    ],
    example: `val sessions = EdfaPayPlugin.getSessionList(context)
sessions.forEach { session ->
    Log.d("Session", "ID: \${session.id}, Merchant: \${session.merchantName}")
}

// Display in UI
sessionAdapter.submitList(sessions)`,
    returnType: "List<Session>",
  },
  {
    id: "logoutCurrentSession",
    name: "logoutCurrentSession",
    description: "Log out from the currently active session.",
    category: "session",
    signature: `fun logoutCurrentSession(
    context: Context,
    completion: (Throwable?, Boolean) -> Unit
)`,
    parameters: [
      { name: "context", type: "Context", required: true, description: "Application or activity context" },
      { name: "completion", type: "(Throwable?, Boolean) -> Unit", required: true, description: "Completion callback with error (if any) and success status" },
    ],
    example: `EdfaPayPlugin.logoutCurrentSession(context) { error, success ->
    if (success) {
        navigateToLoginScreen()
    } else {
        Log.e("Logout", "Failed: \${error?.message}")
        showLogoutError(error)
    }
}`,
    returnType: "Unit",
  },
  {
    id: "logoutSession",
    name: "logoutSession",
    description: "Log out from a specific session by its session ID.",
    category: "session",
    signature: `fun logoutSession(
    context: Context,
    sessionId: String,
    completion: (Throwable?, Boolean) -> Unit
)`,
    parameters: [
      { name: "context", type: "Context", required: true, description: "Application or activity context" },
      { name: "sessionId", type: "String", required: true, description: "The ID of the session to logout" },
      { name: "completion", type: "(Throwable?, Boolean) -> Unit", required: true, description: "Completion callback" },
    ],
    example: `// Logout from a specific session (e.g., from session management screen)
EdfaPayPlugin.logoutSession(
    context = this,
    sessionId = "session_xyz789",
    completion = { error, success ->
        if (success) {
            removeSessionFromList("session_xyz789")
            showSessionRemovedMessage()
        } else {
            showError(error)
        }
    }
)`,
    returnType: "Unit",
  },
];
