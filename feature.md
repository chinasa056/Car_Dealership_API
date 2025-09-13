# Features Planning and documenatation

<details>
<summary><strng> Installmental Payment </strong></summary>

Perfect — installmental purchase will make your project stand out a lot more 👌. Let’s plan it step by step so you can document it well and then implement.

---

## 📌 Installmental Purchase Plan

### 1. **Concept**
 
Instead of paying the full price of a car at once, users can split the payment into smaller installments over **3 months, 6 months, or 12 months (1 year)**.

* Users make an initial deposit (e.g. first installment) when confirming the purchase.
* The remaining installments are auto-tracked and must be completed to finalize ownership.
* If payments are defaulted, rules apply (e.g. revoke booking, refund part, penalties).

---

### 2. **User Flow**

1. User selects a car.
2. At checkout → user chooses **Payment Type**:

   * Full payment
   * Installmental (3, 6, 12 months)
3. System generates an **installment plan** with:

   * Total price
   * Number of months
   * Amount per installment
   * Due dates
4. User pays the **first installment immediately**.
5. System updates purchase record → “In-progress Installment Purchase”.
6. Cron job / scheduled task monitors **upcoming due dates**.
7. Once all installments are completed → car is marked as fully purchased.

---

### 3. **Business Rules**

* **Down Payment**: User must pay at least the first installment upfront.
* **Due Dates**: Fixed schedule based on plan (monthly cycle).
* **Missed Payments**:

  * Grace period (e.g. 7 days).
  * After grace → purchase is marked as defaulted.
* **Completion**: Ownership only transfers after the last installment is cleared.

---

### 4. **Database Design**

We’ll need **two models** tied together:

#### `InstallmentPlan` (per purchase)

* `id`
* `purchaseId` (FK to Purchase)
* `userId`
* `totalAmount`
* `installmentCount` (3, 6, 12)
* `installmentAmount`
* `status` ("active", "completed", "defaulted")

#### `InstallmentPayment` (individual records)

* `id`
* `installmentPlanId` (FK)
* `dueDate`
* `amount`
* `isPaid`
* `paymentDate` (nullable)

---

### 5. **Controller Workflow**

* **Purchase Controller** → When user selects installment, create both `InstallmentPlan` + first `InstallmentPayment` as paid.
* **Payment Controller** → Handles installment payments for subsequent months.
* **Cron Job** → Runs daily/weekly to check due dates, send reminders, and update defaulted plans.

---

### 6. **Features to Document**

* Flexible payment options (full or installment).
* Auto-generated payment schedule.
* Automatic status updates (active → completed or defaulted).
* Grace period handling.
* Email/notification reminders for upcoming dues.

---

### 7. **Tech Stack Fit**

* **Backend**: Node.js + Express + TypeScript
* **DB**: MongoDB/Mongoose (relations via `purchaseId` and `installmentPlanId`)
* **Payments**: Integration with your existing provider (KoraPay or similar).
* **Cron**: `node-cron` or external scheduler for due checks.

---

👉 With this, you’ll have a **clear roadmap** for installment purchases that you can both document and start implementing step by step.

Do you want me to **draft a schema design (Mongoose + TypeScript interfaces)** for `InstallmentPlan` and `InstallmentPayment` so you have a concrete base before coding?


Perfect — you’re already thinking about this the **right way** 👌. Let’s align and refine so the flow is airtight before we move on to implementation.

---

## 🔄 Walkthrough of the Installmental Purchase Flow

### 1. **User Journey**

* **Step 1:** User picks a car.
* **Step 2:** User chooses installment option → **3, 6, or 12 months**.
* **Step 3:** System calculates:

  * **Installment amount = Car Price ÷ Number of months**
  * Returns breakdown (amount per month, total duration, first payment due now).
* **Step 4:** User pays the **first installment (down payment)** immediately.
* **Step 5:** Payment schedule begins — **next due date = 30 days after first payment**.
* **Step 6:** Each month, user pays → we deduct from remaining balance and show updated balance.
* **Step 7:** Once last installment is paid → system marks car as **Fully Purchased** and transfers ownership.

---

### 2. **Default Handling**

* **Due Date Missed** → Grace period of **7 days**.
* If payment not made within grace period →

  * Apply **0.3% of remaining balance** as penalty.
  * New balance = Remaining + Penalty.
* **If default continues until end of plan** → Two options:

  1. **Request Extension:** Extend timeline with additional penalty interest.
  2. **Refund Request:** Refund amount already paid, but deduct **5–10% of car amount** as cancellation fee.

---

### 3. **At Each Payment**

* Deduct installment amount from remaining balance.
* Update `remainingBalance`.
* If `remainingBalance = 0` → Status = **Completed**, Car = **Unavailable**.
* Return updated plan details (paid so far, remaining, next due date).

---

### 4. **Notifications**

* **Email/SMS reminders**:

  * **7 days before due date** → "Upcoming installment due soon".
  * **On due date** → "Payment due today".
  * **During grace period** → "You have X days left to pay before penalty applies".

---

### 5. **Database Design (Your Proposal is Solid ✅)**

#### `InstallmentPlan`

* `id`
* `purchaseId` (FK to Purchase)
* `userId`
* `totalAmount`
* `remainingBalance`
* `installmentCount` (3, 6, 12)
* `installmentAmount`
* `status` ("active", "completed", "defaulted", "extended")
* `startDate`
* `endDate`

#### `InstallmentPayment`

* `id`
* `installmentPlanId` (FK)
* `dueDate`
* `amount`
* `isPaid` (boolean)
* `paymentDate` (nullable)
* `penaltyApplied` (boolean)

---

### 6. **Controller Workflow**

* **Purchase Controller**

  * Creates InstallmentPlan.
  * Marks first payment as paid.
* **Payment Controller**

  * Processes recurring installment payments.
  * Updates remaining balance + status.
* **Cron Job**

  * Runs daily.
  * Checks overdue payments.
  * Applies penalties after grace.
  * Sends reminders.
  * Marks defaulted plans.

---
```bash
Features  Documentation

* Multiple payment options (full or installments).
* Auto-calculated monthly installment plans.
* Grace period with penalty for late payments.
* Refund and extension options for defaulted plans.
* Automatic reminders for upcoming due dates.
* Real-time remaining balance tracking.
* Automatic car unavailability once fully paid.
```

</details>

<details>
 break the process into steps and endpoints, saving state as I go, so that when I finally hit checkout/payment I'll only need `purchaseId + purchaseAmount` because everything else is already collected.

 break it down clearly for **implementation planning**:

---

## 🛒 Purchase Flow (Full vs Installment)

### **Step 1: Start Purchase**
```firstPart
* Endpoint: `POST /purchase/start`
* Input: `{ carId, buyerId, quantity, paymentOption: "full" | "installment" }`
* Logic:

  * Validate car availability, decrement stock, mark unavailable if out of stock.
  * Create a `Purchase` record with **status: "Pending"**.
  * If installment → also create an `InstallmentPlan` record (with schedule + first installment info).
  * Response: `{ purchaseId, totalAmount, paymentOption }`.
```
---

### **Step 2: (Only for Installment) Setup Installment Plan**
```secondPart
* Endpoint: `POST /purchase/:purchaseId/installment`
* Input: `{ months: 3 | 6 | 12 }`
* Logic:

  * Calculate `installmentAmount = totalAmount / months`.
  * Generate `InstallmentPlan` + `InstallmentPayments` schedule (due dates).
  * Save to DB.
  * Response: `{ installmentPlanId, breakdown, nextDueDate }`.
```
---

### **Step 3: Confirm Purchase Details**
```third
* Endpoint: `GET /purchase/:purchaseId`
* Logic:

  * Fetch all info: car, buyer, payment option, total amount, installment plan (if any).
  * User can review before checkout.
  * Response: `{ purchaseDetails }`.
```
---

### **Step 4: Checkout (Payment Initialization)**

* Endpoint: `POST /payment/initialize`
* Input: `{ purchaseId }`
* Logic:

  * Fetch purchase (and installment if applicable).
  * Get current **due amount** (full price or first installment).
  * Call Paystack initialize API.
  * Save `Payment` record with `status: Pending`.
  * Return `authorization_url` to frontend.

---

### **Step 5: Verify Payment**

* Endpoint: `GET /payment/verify/:reference`
* Logic:

  * Verify with Paystack.
  * If full purchase → mark `Purchase.status = Completed`.
  * If installment → mark installment payment as `Paid`, update `remainingBalance`.

    * If balance left → `InstallmentPlan.status = Active`.
    * If all paid → `InstallmentPlan.status = Completed`, `Purchase.status = Completed`.
  * Save and return final status.

---

### **Step 6: Cron Jobs (Background Jobs)**

* Runs daily:

  * Check due dates of installment payments.
  * Send reminders.
  * Apply penalties if overdue after grace.
  * Mark defaulted if unpaid beyond grace + plan duration.

---

## Key Benefits of This Flow

* Every endpoint does **one job only**, 
* All data is **saved step by step**, so by checkout you just need `purchaseId`.
* Clean separation between:

  * **Purchase logic** (car availability, buyer, plan setup).
  * **Payment logic** (Paystack, statuses, verification).
  * **Installment logic** (schedule, penalties, balances).
* Easy to extend in future (add new payment providers, add loan options, etc.).

---

⚡ So in the design, **`/purchase/start` handles car + buyer + payment option**,
and **`/payment/initialize` only needs `purchaseId`** because all other details (price, plan, buyer) are already linked in DB.

</details>