// Comprehensive automated test suite for Salary & Expense Saving Calculator
const BASE_URL = 'http://localhost:5173';

async function req(path, method = 'GET', body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, data };
}

async function runTests() {
  console.log('=== STARTING SUITE: Salary & Expense Saving Calculator ===\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  const phoneA = '9876543210';
  const phoneB = '9123456789';

  // TEST 1: New User A Login & Empty State
  console.log('\n--- TEST 1: New User A Registration & Empty State ---');
  const loginA = await req('/api/auth/login', 'POST', { name: 'Arun Kumar', phone: phoneA });
  assert(loginA.status === 200 && loginA.data?.token, 'User A logs in successfully with Name and Phone');
  const tokenA = loginA.data?.token;
  const userA = loginA.data?.user;
  assert(userA?.name === 'Arun Kumar' && userA?.phone === phoneA, 'User A profile contains correct name and phone');

  const resDataA = await req('/api/data', 'GET', null, tokenA);
  assert(resDataA.status === 200, 'User A data fetched successfully');
  const fullDataA = resDataA.data?.data;
  assert(fullDataA?.user?.monthly_income === 0, 'New user starts with ₹0 monthly income');
  assert(fullDataA?.categories?.length === 0, 'New user starts with 0 budget categories');
  assert(fullDataA?.savingsCategories?.length === 0, 'New user starts with 0 savings categories');
  assert(fullDataA?.savingsTransactions?.length === 0, 'New user starts with 0 savings transactions');
  assert(fullDataA?.dreamGoals?.length === 0, 'New user starts with 0 dream goals');
  assert(fullDataA?.shoppingItems?.length === 0, 'New user starts with empty shopping list');
  assert(fullDataA?.bills?.length === 0, 'New user starts with 0 bills');

  // TEST 2: Update Monthly Salary & Add Categories (Salary Split)
  console.log('\n--- TEST 2: Salary Split - Set Salary & Create Allocation Categories ---');
  const updateIncA = await req('/api/income', 'POST', { monthlyIncome: 80000, currency: 'INR' }, tokenA);
  assert(updateIncA.status === 200 && updateIncA.data?.monthlyIncome === 80000, 'Monthly income updated to ₹80,000');

  const cat1 = await req('/api/categories', 'POST', {
    name: 'Rent & Living',
    allocated_amount: 25000,
    percentage: 31.25,
    color: '#7557E8',
    icon: 'home',
    type: 'needs'
  }, tokenA);
  assert(cat1.status === 200 && cat1.data?.category?.name === 'Rent & Living', 'Added category Rent & Living (₹25,000)');

  const cat2 = await req('/api/categories', 'POST', {
    name: 'Groceries & Food',
    allocated_amount: 15000,
    percentage: 18.75,
    color: '#00C896',
    icon: 'shopping-cart',
    type: 'needs'
  }, tokenA);
  assert(cat2.status === 200 && cat2.data?.category?.name === 'Groceries & Food', 'Added category Groceries & Food (₹15,000)');

  // TEST 3: Add & Manage Bills (Syncs to Expenses)
  console.log('\n--- TEST 3: Bills & Subscriptions - Add Bill & Mark Paid ---');
  const bill1 = await req('/api/bills', 'POST', {
    title: 'Electricity Bill',
    amount: 3200,
    due_date: '2026-11-15',
    category: 'Utilities',
    is_paid: 1
  }, tokenA);
  assert(bill1.status === 200 && bill1.data?.bill?.title === 'Electricity Bill', 'Added bill Electricity Bill (₹3,200, Paid: 1)');

  const bill2 = await req('/api/bills', 'POST', {
    title: 'Internet Fiber',
    amount: 1200,
    due_date: '2026-11-20',
    category: 'Utilities',
    is_paid: 0
  }, tokenA);
  assert(bill2.status === 200 && bill2.data?.bill?.is_paid === 0, 'Added unpaid bill Internet Fiber (₹1,200, Paid: 0)');

  // TEST 4: My Savings - Month-by-month Contributions
  console.log('\n--- TEST 4: My Savings - Custom Category & Month-by-Month Tracking ---');
  const saveCat1 = await req('/api/savings/categories', 'POST', {
    name: 'House Saving',
    target_amount: 500000,
    monthly_commitment: 5000,
    color: '#4B35A8',
    icon: 'home'
  }, tokenA);
  assert(saveCat1.status === 200 && saveCat1.data?.category?.id, 'Created savings category "House Saving"');
  const houseCatId = saveCat1.data?.category?.id;

  // Jan contribution: 5,000
  const tx1 = await req('/api/savings/transactions', 'POST', {
    savings_category_id: houseCatId,
    amount: 5000,
    month: 'January 2026',
    date: '2026-01-10',
    note: 'Jan contribution'
  }, tokenA);
  assert(tx1.status === 200, 'Recorded January contribution ₹5,000 for House Saving');

  // Feb contribution: 5,000
  const tx2 = await req('/api/savings/transactions', 'POST', {
    savings_category_id: houseCatId,
    amount: 5000,
    month: 'February 2026',
    date: '2026-02-10',
    note: 'Feb contribution'
  }, tokenA);
  assert(tx2.status === 200, 'Recorded February contribution ₹5,000 for House Saving');

  // March contribution: 5,000
  const tx3 = await req('/api/savings/transactions', 'POST', {
    savings_category_id: houseCatId,
    amount: 5000,
    month: 'March 2026',
    date: '2026-03-10',
    note: 'March contribution'
  }, tokenA);
  assert(tx3.status === 200, 'Recorded March contribution ₹5,000 for House Saving');

  // Check cumulative savings for House Saving
  const refreshedDataA = await req('/api/data', 'GET', null, tokenA);
  const houseCat = refreshedDataA.data?.data?.savingsCategories?.find(c => c.id === houseCatId);
  assert(houseCat?.current_balance === 15000, `House Saving accumulated balance is exactly ₹15,000 (actual: ₹${houseCat?.current_balance})`);

  // TEST 5: Dream Goals Integration & No Double-Counting
  console.log('\n--- TEST 5: Dream Goals Integration & Zero Double-Counting ---');
  const goal1 = await req('/api/goals', 'POST', {
    name: 'Buy a House',
    target_amount: 1000000,
    target_date: '2030-12-31',
    category: 'house'
  }, tokenA);
  assert(goal1.status === 200 && goal1.data?.goal?.id, 'Created Dream Goal "Buy a House" with target ₹10,00,000');
  const goalId = goal1.data?.goal?.id;

  // Add savings contribution assigned to Dream Goal
  const txGoal = await req('/api/savings/transactions', 'POST', {
    savings_category_id: houseCatId,
    goal_id: goalId,
    amount: 5000,
    month: 'April 2026',
    date: '2026-04-10',
    note: 'April contribution assigned to House Dream Goal'
  }, tokenA);
  assert(txGoal.status === 200, 'Added ₹5,000 savings contribution assigned to "Buy a House" Dream Goal');

  const afterGoalData = await req('/api/data', 'GET', null, tokenA);
  const updatedGoal = afterGoalData.data?.data?.dreamGoals?.find(g => g.id === goalId);
  assert(updatedGoal?.current_balance === 5000, `Dream Goal balance updated to ₹5,000 (actual: ₹${updatedGoal?.current_balance})`);
  
  // Verify House Saving category also has total 20,000 (15,000 + 5,000)
  const updatedHouseCat = afterGoalData.data?.data?.savingsCategories?.find(c => c.id === houseCatId);
  assert(updatedHouseCat?.current_balance === 20000, `House Saving category balance is ₹20,000 (actual: ₹${updatedHouseCat?.current_balance})`);
  
  // Total savings across all transactions is 5000 * 4 = 20,000 (NOT 25,000 - no double counting)
  const totalTxSum = afterGoalData.data?.data?.savingsTransactions?.reduce((sum, t) => sum + t.amount, 0);
  assert(totalTxSum === 20000, `Total savings transactions sum is ₹20,000 with NO double counting (actual: ₹${totalTxSum})`);

  // TEST 6: Smart Pantry - Empty Start & Add Items
  console.log('\n--- TEST 6: Smart Pantry Shopping List ---');
  const item1 = await req('/api/shopping', 'POST', {
    name: 'Basmati Rice 5kg',
    quantity: '1 bag',
    estimated_cost: 650,
    is_purchased: 0,
    category: 'Pantry'
  }, tokenA);
  assert(item1.status === 200 && item1.data?.item?.name === 'Basmati Rice 5kg', 'Added shopping item "Basmati Rice 5kg"');

  const toggleItem = await req(`/api/shopping/${item1.data.item.id}`, 'PUT', {
    is_purchased: 1
  }, tokenA);
  assert(toggleItem.status === 200 && toggleItem.data?.item?.is_purchased === 1, 'Marked shopping item as purchased');

  // TEST 7: Multi-User Data Isolation (User B)
  console.log('\n--- TEST 7: Multi-User Data Isolation - User B Login ---');
  const loginB = await req('/api/auth/login', 'POST', { name: 'Priya Sharma', phone: phoneB });
  assert(loginB.status === 200 && loginB.data?.token, 'User B logs in successfully');
  const tokenB = loginB.data?.token;

  const resDataB = await req('/api/data', 'GET', null, tokenB);
  const fullDataB = resDataB.data?.data;
  assert(fullDataB?.user?.name === 'Priya Sharma', 'User B sees their own name');
  assert(fullDataB?.user?.monthly_income === 0, 'User B has ₹0 monthly income (isolated from User A ₹80,000)');
  assert(fullDataB?.categories?.length === 0, 'User B has 0 categories (isolated from User A categories)');
  assert(fullDataB?.savingsCategories?.length === 0, 'User B has 0 savings categories (isolated from User A House Saving)');
  assert(fullDataB?.dreamGoals?.length === 0, 'User B has 0 dream goals (isolated from User A Buy a House)');
  assert(fullDataB?.shoppingItems?.length === 0, 'User B has 0 shopping items (isolated from User A pantry)');
  assert(fullDataB?.bills?.length === 0, 'User B has 0 bills (isolated from User A bills)');

  // TEST 8: Server-Side Authorization Security Check
  console.log('\n--- TEST 8: Server-Side Authorization Security Check ---');
  // User B attempts to access User A's data directly
  const unauthorizedCheck = await req(`/api/users/${userA.id}/data`, 'GET', null, tokenB);
  assert(unauthorizedCheck.status === 403, `User B blocked from accessing User A data: status code ${unauthorizedCheck.status} Forbidden`);

  // TEST 9: Session Persistence & Re-login for Existing User A
  console.log('\n--- TEST 9: Session Persistence & Existing User Data Retrieval ---');
  // Re-login User A using same phone number
  const reloginA = await req('/api/auth/login', 'POST', { name: 'Arun Kumar', phone: phoneA });
  assert(reloginA.status === 200 && reloginA.data?.user?.id === userA.id, 'User A re-login matches existing user ID');
  const existingResA = await req('/api/data', 'GET', null, reloginA.data?.token);
  const existingDataA = existingResA.data?.data;
  assert(existingDataA?.user?.monthly_income === 80000, 'User A income correctly retrieved as ₹80,000');
  assert(existingDataA?.categories?.length === 2, 'User A categories intact (2 categories)');
  assert(existingDataA?.savingsCategories?.length === 1, 'User A savings categories intact (1 category)');
  assert(existingDataA?.dreamGoals?.length === 1, 'User A dream goals intact (1 goal)');
  assert(existingDataA?.bills?.length === 2, 'User A bills intact (2 bills)');
  assert(existingDataA?.shoppingItems?.length === 1, 'User A shopping items intact (1 item)');

  // TEST 10: Explicit Logout
  console.log('\n--- TEST 10: Explicit Logout ---');
  const logoutRes = await req('/api/auth/logout', 'POST', {}, tokenA);
  assert(logoutRes.status === 200, 'User A logged out successfully');
  const meAfterLogout = await req('/api/auth/me', 'GET', null, tokenA);
  assert(meAfterLogout.status === 401, `Session invalidated after logout: status code ${meAfterLogout.status} Unauthorized`);

  console.log(`\n========================================`);
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution failed with error:', err);
  process.exit(1);
});
