# EdfaPay Payment SDK

**Android SDK v1.0.5** | Complete API Reference

Complete API reference for integrating EdfaPay's payment processing capabilities into your Android application. Accept card payments, manage transactions, and handle reconciliation with ease.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [API Reference](#api-reference)
  - [Core Functions](#core-functions)
  - [Payment Operations](#payment-operations)
  - [Transaction Queries](#transaction-queries)
  - [Reconciliation](#reconciliation)
  - [Terminal Management](#terminal-management)
  - [Session Management](#session-management)

---

## Overview

The EdfaPay SDK provides a comprehensive set of tools for integrating payment processing into your Android application. The SDK supports:

- Card payments (NFC, chip, magnetic stripe)
- Transaction management (purchase, authorize, capture, refund, void)
- Reconciliation and settlement
- Terminal configuration and session management

---

## Features

### Fast Integration
Simple callback-based API that integrates seamlessly with your existing Android app.

### Secure by Design
PCI-DSS compliant SDK with encrypted communication and secure session management.

### NFC & EMV Ready
Support for contactless, chip, and magnetic stripe card reading on compatible devices.

---

## Installation

### 1. Add the dependency

Add the EdfaPay SDK to your app's `build.gradle` file:

```gradle
implementation 'com.edfapay:payment-sdk:1.0.5'
```

### 2. Configure ProGuard

If using ProGuard, add the following rules:

```proguard
-keep class com.edfapay.paymentcard.** { *; }
-dontwarn com.edfapay.paymentcard.**
```

### 3. Add Permissions

Add the required permissions to your `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.NFC" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

---

## API Reference

Complete reference for all public methods in the EdfaPayPlugin SDK.

---

## Core Functions

### initiate

Initialize the EdfaPay SDK with credentials. This must be called before any other SDK operations. Supports both token-based and dialog-based authentication flows.

**Signature:**
```kotlin
fun initiate(
    context: FragmentActivity,
    credentials: EdfaPayCredentials,
    onSuccess: (EP, sessionId: String?) -> Unit,
    onError: (Throwable) -> Unit
)
```

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| context | FragmentActivity | ✓ | The activity context for displaying UI elements |
| credentials | EdfaPayCredentials | ✓ | SDK credentials containing environment and authentication details |
| onSuccess | (EP, String?) -> Unit | ✓ | Callback invoked on successful initialization with EP instance and session ID |
| onError | (Throwable) -> Unit | ✓ | Callback invoked when initialization fails |

**Returns:** `Unit`

**Example:**
```kotlin
val credentials = EdfaPayCredentials(
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
        Log.e("EdfaPay", "Init failed: ${error.message}")
    }
)
```

**Notes:**
- Must be called on the main thread
- Token-based login bypasses the login dialog
- Session ID can be used for session management

---

### terminalInfo

Retrieve information about the current terminal configuration and status.

**Signature:**
```kotlin
fun terminalInfo(
    onSuccess: (TerminalInfo) -> Unit,
    onError: ((Throwable) -> Unit)?
)
```

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| onSuccess | (TerminalInfo) -> Unit | ✓ | Callback with terminal information |
| onError | ((Throwable) -> Unit)? | ✗ | Optional error callback |

**Returns:** `Unit`

**Example:**
```kotlin
EdfaPayPlugin.terminalInfo(
    onSuccess = { info ->
        Log.d("Terminal", "TSN: ${info.tsn}")
        Log.d("Terminal", "Merchant: ${info.merchantName}")
    },
    onError = { error ->
        Log.e("Terminal", "Failed: ${error.message}")
    }
)
```

---

## Payment Operations

### purchase

Process a purchase transaction. This is the primary method for charging a customer's card.

**Signature:**
```kotlin
fun purchase(
    activity: FragmentActivity,
    flowType: FlowType = FlowType.DETAIL,
    txnParams: TxnParams,
    onRequestTimerEnd: TimeOutCallBack,
    onCardScanTimerEnd: TimeOutCallBack,
    onError: OnErrorCallBack,
    onPaymentProcessComplete: ProcessCompleteCallback,
    onCancelByUser: CancelByUserCallBack,
    presentationType: PresentationType = presentType
)
```

**Parameters:**

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| activity | FragmentActivity | ✓ | - | The activity context |
| flowType | FlowType | ✗ | FlowType.DETAIL | UI flow type for the transaction |
| txnParams | TxnParams | ✓ | - | Transaction parameters including amount and currency |
| onRequestTimerEnd | () -> Unit | ✓ | - | Called when the request timer expires |
| onCardScanTimerEnd | () -> Unit | ✓ | - | Called when card scan timer expires |
| onError | (Throwable) -> Unit | ✓ | - | Error callback |
| onPaymentProcessComplete | ProcessCompleteCallback | ✓ | - | Called when payment processing completes |
| onCancelByUser | () -> Unit | ✓ | - | Called when user cancels the transaction |
| presentationType | PresentationType | ✗ | - | How to present the payment UI |

**Returns:** `Unit`

**Example:**
```kotlin
val txnParams = TxnParams(
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
)
```

**Notes:**
- Amount should be in the currency's standard unit (e.g., AED, not fils)
- The ProcessCompleteCallback provides transaction details on success

---

### authorize

Authorize a transaction without capturing funds. Use capture() to complete the transaction later.

**Signature:**
```kotlin
fun authorize(
    activity: FragmentActivity,
    flowType: FlowType = FlowType.DETAIL,
    txnParams: TxnParams,
    onRequestTimerEnd: TimeOutCallBack,
    onCardScanTimerEnd: TimeOutCallBack,
    onError: OnErrorCallBack,
    onPaymentProcessComplete: ProcessCompleteCallback,
    onCancelByUser: CancelByUserCallBack,
    presentationType: PresentationType = presentType
)
```

**Parameters:**

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| activity | FragmentActivity | ✓ | - | The activity context |
| flowType | FlowType | ✗ | FlowType.DETAIL | UI flow type |
| txnParams | TxnParams | ✓ | - | Transaction parameters |
| onRequestTimerEnd | () -> Unit | ✓ | - | Request timeout callback |
| onCardScanTimerEnd | () -> Unit | ✓ | - | Card scan timeout callback |
| onError | (Throwable) -> Unit | ✓ | - | Error callback |
| onPaymentProcessComplete | ProcessCompleteCallback | ✓ | - | Completion callback |
| onCancelByUser | () -> Unit | ✓ | - | User cancellation callback |

**Returns:** `Unit`

**Example:**
```kotlin
EdfaPayPlugin.authorize(
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
)
```

**Notes:**
- Funds are held but not captured
- Must call capture() within the authorization validity period
- Useful for hotel bookings, car rentals, etc.

---

### capture

Capture a previously authorized transaction. Completes the fund transfer.

**Signature:**
```kotlin
fun capture(
    activity: FragmentActivity,
    flowType: FlowType = FlowType.DETAIL,
    txnParams: TxnParams,
    onRequestTimerEnd: TimeOutCallBack,
    onCardScanTimerEnd: TimeOutCallBack,
    onError: OnErrorCallBack,
    onPaymentProcessComplete: ProcessCompleteCallback,
    onCancelByUser: CancelByUserCallBack,
    presentationType: PresentationType = presentType
)
```

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| activity | FragmentActivity | ✓ | The activity context |
| txnParams | TxnParams | ✓ | Must include the original authorization transaction ID |
| onPaymentProcessComplete | ProcessCompleteCallback | ✓ | Completion callback |
| onError | (Throwable) -> Unit | ✓ | Error callback |

**Returns:** `Unit`

**Example:**
```kotlin
val captureParams = TxnParams(
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
)
```

**Notes:**
- Capture amount can be less than or equal to the authorized amount
- Cannot capture more than the authorized amount

---

### refund

Process a refund for a completed transaction. Returns funds to the customer's card.

**Signature:**
```kotlin
fun refund(
    activity: FragmentActivity,
    flowType: FlowType = FlowType.DETAIL,
    txnParams: TxnParams,
    onRequestTimerEnd: TimeOutCallBack,
    onCardScanTimerEnd: TimeOutCallBack,
    onError: OnErrorCallBack,
    onPaymentProcessComplete: ProcessCompleteCallback,
    onCancelByUser: CancelByUserCallBack,
    presentationType: PresentationType = presentType
)
```

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| activity | FragmentActivity | ✓ | The activity context |
| txnParams | TxnParams | ✓ | Refund parameters including original transaction reference |
| onPaymentProcessComplete | ProcessCompleteCallback | ✓ | Completion callback |
| onError | (Throwable) -> Unit | ✓ | Error callback |

**Returns:** `Unit`

**Example:**
```kotlin
val refundParams = TxnParams(
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
)
```

**Notes:**
- Supports partial refunds
- Total refunds cannot exceed original transaction amount
- Refund processing time depends on the issuing bank

---

### void

Void a transaction that hasn't been settled yet. Cancels the transaction entirely.

**Signature:**
```kotlin
fun void(
    activity: FragmentActivity,
    transaction: Transaction?,
    onSuccess: (TxnResponse) -> Unit,
    onError: OnErrorCallBack
)
```

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| activity | FragmentActivity | ✓ | The activity context |
| transaction | Transaction? | ✓ | The transaction to void |
| onSuccess | (TxnResponse) -> Unit | ✓ | Success callback with response |
| onError | (Throwable) -> Unit | ✓ | Error callback |

**Returns:** `Unit`

**Example:**
```kotlin
// Get transaction from history or recent purchase
val transaction = getRecentTransaction()

EdfaPayPlugin.void(
    activity = this,
    transaction = transaction,
    onSuccess = { response ->
        Log.d("Void", "Transaction voided: ${response.txnId}")
        updateTransactionStatus(transaction.id, "VOIDED")
    },
    onError = { error ->
        Log.e("Void", "Void failed: ${error.message}")
    }
)
```

**Notes:**
- Only works for unsettled transactions
- After settlement, use refund instead
- Void is typically available same-day before batch close

---

### reverse

Reverse a specific transaction. Use for immediate transaction cancellation.

**Signature:**
```kotlin
fun reverse(
    activity: FragmentActivity,
    transaction: Transaction,
    onSuccess: (TxnResponse) -> Unit,
    onError: OnErrorCallBack
)
```

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| activity | FragmentActivity | ✓ | The activity context |
| transaction | Transaction | ✓ | The transaction to reverse |
| onSuccess | (TxnResponse) -> Unit | ✓ | Success callback |
| onError | (Throwable) -> Unit | ✓ | Error callback |

**Returns:** `Unit`

**Example:**
```kotlin
EdfaPayPlugin.reverse(
    activity = this,
    transaction = failedTransaction,
    onSuccess = { response ->
        showReversalConfirmation(response)
    },
    onError = { error ->
        showReversalError(error)
    }
)
```

---

### reverseLastTransaction

Convenience method to reverse the most recent transaction without needing to provide the transaction object.

**Signature:**
```kotlin
fun reverseLastTransaction(
    activity: FragmentActivity,
    onSuccess: (TxnResponse) -> Unit,
    onError: OnErrorCallBack
)
```

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| activity | FragmentActivity | ✓ | The activity context |
| onSuccess | (TxnResponse) -> Unit | ✓ | Success callback |
| onError | (Throwable) -> Unit | ✓ | Error callback |

**Returns:** `Unit`

**Example:**
```kotlin
EdfaPayPlugin.reverseLastTransaction(
    activity = this,
    onSuccess = { response ->
        Toast.makeText(this, "Last transaction reversed", Toast.LENGTH_SHORT).show()
    },
    onError = { error ->
        if (error.message?.contains("not exist") == true) {
            Toast.makeText(this, "No transaction to reverse", Toast.LENGTH_SHORT).show()
        }
    }
)
```

**Notes:**
- Throws error if no recent transaction exists
- Only reverses transactions that are eligible for reversal

---

## Transaction Queries

### txnHistory

Retrieve transaction history with optional pagination support.

**Signature:**
```kotlin
fun txnHistory(
    pagination: Pagination? = null,
    onSuccess: (List<Transaction>) -> Unit,
    onError: OnErrorCallBack
)
```

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| pagination | Pagination? | ✗ | Pagination parameters (page, limit) |
| onSuccess | (List<Transaction>) -> Unit | ✓ | Success callback with transaction list |
| onError | (Throwable) -> Unit | ✓ | Error callback |

**Returns:** `Unit`

**Example:**
```kotlin
// Get first page of transactions
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
)
```

---

### txnDetail

Get detailed information about a specific transaction by its ID.

**Signature:**
```kotlin
fun txnDetail(
    txnId: String,
    onSuccess: (Transaction) -> Unit,
    onError: OnErrorCallBack
)
```

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| txnId | String | ✓ | The transaction ID to look up |
| onSuccess | (Transaction) -> Unit | ✓ | Success callback with transaction details |
| onError | (Throwable) -> Unit | ✓ | Error callback |

**Returns:** `Unit`

**Example:**
```kotlin
EdfaPayPlugin.txnDetail(
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
)
```

---

## Reconciliation

### reconcile

Initiate a reconciliation process to settle transactions with the payment processor.

**Signature:**
```kotlin
fun reconcile(
    onSuccess: (Reconcile) -> Unit,
    onError: OnErrorCallBack
)
```

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| onSuccess | (Reconcile) -> Unit | ✓ | Success callback with reconciliation result |
| onError | (Throwable) -> Unit | ✓ | Error callback |

**Returns:** `Unit`

**Example:**
```kotlin
EdfaPayPlugin.reconcile(
    onSuccess = { reconcile ->
        Log.d("Reconcile", "Batch ID: ${reconcile.batchId}")
        Log.d("Reconcile", "Total: ${reconcile.totalAmount}")
        Log.d("Reconcile", "Count: ${reconcile.transactionCount}")
        showReconciliationSuccess(reconcile)
    },
    onError = { error ->
        showReconciliationError(error)
    }
)
```

**Notes:**
- Typically performed at end of business day
- Settles all pending transactions

---

### reconciliationHistory

Retrieve the history of past reconciliations for the current terminal.

**Signature:**
```kotlin
fun reconciliationHistory(
    onSuccess: (List<ReconciliationHistory>) -> Unit,
    onError: OnErrorCallBack
)
```

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| onSuccess | (List<ReconciliationHistory>) -> Unit | ✓ | Success callback with reconciliation history |
| onError | (Throwable) -> Unit | ✓ | Error callback |

**Returns:** `Unit`

**Example:**
```kotlin
EdfaPayPlugin.reconciliationHistory(
    onSuccess = { history ->
        history.forEach { record ->
            Log.d("History", "Date: ${record.date}, Amount: ${record.totalAmount}")
        }
        reconciliationAdapter.submitList(history)
    },
    onError = { error ->
        showError(error)
    }
)
```

---

### reconciliationDetail

Get detailed information about a specific reconciliation by its ID.

**Signature:**
```kotlin
fun reconciliationDetail(
    id: String,
    onSuccess: (ReconciliationDetail) -> Unit,
    onError: OnErrorCallBack
)
```

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | String | ✓ | The reconciliation ID |
| onSuccess | (ReconciliationDetail) -> Unit | ✓ | Success callback with details |
| onError | (Throwable) -> Unit | ✓ | Error callback |

**Returns:** `Unit`

**Example:**
```kotlin
EdfaPayPlugin.reconciliationDetail(
    id = "recon_12345",
    onSuccess = { detail ->
        showReconciliationBreakdown(
            purchases = detail.purchaseTotal,
            refunds = detail.refundTotal,
            net = detail.netAmount
        )
    },
    onError = { handleError(it) }
)
```

---

### reconciliationReceipt

Generate and retrieve a printable receipt for a reconciliation.

**Signature:**
```kotlin
fun reconciliationReceipt(
    id: String,
    onSuccess: (ReconciliationReceipt) -> Unit,
    onError: OnErrorCallBack
)
```

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | String | ✓ | The reconciliation ID |
| onSuccess | (ReconciliationReceipt) -> Unit | ✓ | Success callback with receipt data |
| onError | (Throwable) -> Unit | ✓ | Error callback |

**Returns:** `Unit`

**Example:**
```kotlin
EdfaPayPlugin.reconciliationReceipt(
    id = "recon_12345",
    onSuccess = { receipt ->
        printReceipt(receipt.formattedText)
        // or
        displayReceiptPreview(receipt)
    },
    onError = { error ->
        showReceiptError(error)
    }
)
```

---

## Terminal Management

### activateTerminal

Activate the terminal for accepting payments. Required before processing transactions.

**Signature:**
```kotlin
fun activateTerminal(
    password: String? = null,
    onSuccess: () -> Unit,
    onError: OnErrorCallBack
)
```

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| password | String? | ✗ | Optional activation password |
| onSuccess | () -> Unit | ✓ | Success callback |
| onError | (Throwable) -> Unit | ✓ | Error callback |

**Returns:** `Unit`

**Example:**
```kotlin
EdfaPayPlugin.activateTerminal(
    password = "terminal_password",
    onSuccess = {
        Log.d("Terminal", "Terminal activated successfully")
        enablePaymentButtons()
    },
    onError = { error ->
        Log.e("Terminal", "Activation failed: ${error.message}")
        showActivationError()
    }
)
```

---

### deActivateTerminal

Deactivate the terminal. Prevents further transactions until reactivated.

**Signature:**
```kotlin
fun deActivateTerminal(
    password: String? = null,
    onSuccess: () -> Unit,
    onError: OnErrorCallBack
)
```

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| password | String? | ✗ | Optional deactivation password |
| onSuccess | () -> Unit | ✓ | Success callback |
| onError | (Throwable) -> Unit | ✓ | Error callback |

**Returns:** `Unit`

**Example:**
```kotlin
EdfaPayPlugin.deActivateTerminal(
    onSuccess = {
        disablePaymentFeatures()
        showTerminalDeactivatedMessage()
    },
    onError = { error ->
        showDeactivationError(error)
    }
)
```

---

### syncTerminal

Synchronize terminal configuration and settings with the server.

**Signature:**
```kotlin
fun syncTerminal(
    onSuccess: () -> Unit,
    onError: OnErrorCallBack
)
```

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| onSuccess | () -> Unit | ✓ | Success callback |
| onError | (Throwable) -> Unit | ✓ | Error callback |

**Returns:** `Unit`

**Example:**
```kotlin
EdfaPayPlugin.syncTerminal(
    onSuccess = {
        Log.d("Terminal", "Terminal synced with server")
        refreshTerminalDisplay()
    },
    onError = { error ->
        Log.e("Terminal", "Sync failed: ${error.message}")
        showSyncRetryOption()
    }
)
```

**Notes:**
- Recommended to call after network reconnection
- Updates terminal parameters and configurations

---

## Session Management

### getSessionList

Retrieve the list of all stored sessions for the current device.

**Signature:**
```kotlin
fun getSessionList(context: Context): List<Session>
```

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| context | Context | ✓ | Application or activity context |

**Returns:** `List<Session>`

**Example:**
```kotlin
val sessions = EdfaPayPlugin.getSessionList(context)
sessions.forEach { session ->
    Log.d("Session", "ID: ${session.id}, Merchant: ${session.merchantName}")
}

// Display in UI
sessionAdapter.submitList(sessions)
```

---

### logoutCurrentSession

Log out from the currently active session.

**Signature:**
```kotlin
fun logoutCurrentSession(
    context: Context,
    completion: (Throwable?, Boolean) -> Unit
)
```

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| context | Context | ✓ | Application or activity context |
| completion | (Throwable?, Boolean) -> Unit | ✓ | Completion callback with error (if any) and success status |

**Returns:** `Unit`

**Example:**
```kotlin
EdfaPayPlugin.logoutCurrentSession(context) { error, success ->
    if (success) {
        navigateToLoginScreen()
    } else {
        Log.e("Logout", "Failed: ${error?.message}")
        showLogoutError(error)
    }
}
```

---

### logoutSession

Log out from a specific session by its session ID.

**Signature:**
```kotlin
fun logoutSession(
    context: Context,
    sessionId: String,
    completion: (Throwable?, Boolean) -> Unit
)
```

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| context | Context | ✓ | Application or activity context |
| sessionId | String | ✓ | The ID of the session to logout |
| completion | (Throwable?, Boolean) -> Unit | ✓ | Completion callback |

**Returns:** `Unit`

**Example:**
```kotlin
// Logout from a specific session (e.g., from session management screen)
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
)
```

---

## Support

EdfaPay SDK Documentation • Version 1.0.5

For support, contact the EdfaPay developer team.
