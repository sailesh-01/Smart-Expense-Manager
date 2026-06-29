const express = require('express');
const cors = require('cors');
const path = require('path');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const FileAdapter = require('./db/FileAdapter');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database Service (can swap to MongoAdapter later)
const dbService = new FileAdapter();

app.use(cors());
app.use(express.json());

// --- AUTHENTICATION ENDPOINTS ---

app.post('/api/register', [
  body('username').isString().notEmpty().trim(),
  body('password').isString().isLength({ min: 4 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { username, password } = req.body;

    const existingUser = await dbService.getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const newUser = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      username,
      password: await bcrypt.hash(password, 10), // Encrypted password
      token: crypto.randomBytes(32).toString('hex')
    };

    await dbService.createUser(newUser);

    res.status(201).json({ token: newUser.token, username: newUser.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to register' });
  }
});

app.post('/api/login', [
  body('username').isString().notEmpty().trim(),
  body('password').isString().notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { username, password } = req.body;

    const user = await dbService.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Refresh token on login
    const newToken = crypto.randomBytes(32).toString('hex');
    await dbService.updateToken(user.id, newToken);

    res.json({ token: newToken, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// --- AUTH MIDDLEWARE ---
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const user = await dbService.getUserByToken(token);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    
    req.userId = user.id;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Auth failed' });
  }
};

// Protect all routes below this point
app.use('/api', authMiddleware);

// --- EXPENSE ENDPOINTS ---

app.get('/api/expenses', async (req, res) => {
  try {
    const { month, category } = req.query;
    let expenses = await dbService.getExpenses(req.userId);

    if (month) expenses = expenses.filter(e => e.date.startsWith(month));
    if (category) expenses = expenses.filter(e => e.category === category);
    
    expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to read expenses' });
  }
});

app.post('/api/expenses', [
  body('amount').isNumeric(),
  body('category').isString().notEmpty(),
  body('date').isISO8601(),
  body('notes').optional().isString()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const newExpense = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      ...req.body
    };
    
    await dbService.addExpense(req.userId, newExpense);
    res.status(201).json(newExpense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add expense' });
  }
});

app.delete('/api/expenses/:id', async (req, res) => {
  try {
    const deleted = await dbService.deleteExpense(req.userId, req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Expense not found' });
    
    res.json(deleted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

// --- BUDGET ENDPOINTS ---

app.get('/api/budget', async (req, res) => {
  try {
    const userBudgets = await dbService.getBudgets(req.userId);
    res.json(userBudgets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to read budgets' });
  }
});

app.post('/api/budget', async (req, res) => {
  try {
    const { category, amount } = req.body;
    if (!category || typeof amount !== 'number') {
      return res.status(400).json({ error: 'Invalid payload' });
    }
    
    const updatedBudgets = await dbService.updateBudget(req.userId, category, amount);
    res.json(updatedBudgets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update budget' });
  }
});

// --- USER DATA DELETION ENDPOINTS ---

app.delete('/api/user/data', async (req, res) => {
  try {
    await dbService.resetUserData(req.userId);
    res.json({ message: 'User data has been completely reset' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to reset user data' });
  }
});

app.delete('/api/user/account', async (req, res) => {
  try {
    await dbService.deleteUserAccount(req.userId);
    res.json({ message: 'User account has been completely deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete user account' });
  }
});

// --- REPORTS ENDPOINTS ---

app.get('/api/reports/monthly', async (req, res) => {
  try {
    const { month } = req.query;
    if (!month) return res.status(400).json({ error: 'Month query param required (YYYY-MM)' });
    
    const allExpenses = await dbService.getExpenses(req.userId);
    const expenses = allExpenses.filter(e => e.date.startsWith(month));
    
    let total = 0;
    const categoryTotals = {};
    
    expenses.forEach(e => {
      total += e.amount;
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });
    
    let topCategory = null;
    let maxSpent = 0;
    for (const [cat, amt] of Object.entries(categoryTotals)) {
      if (amt > maxSpent) {
        maxSpent = amt;
        topCategory = cat;
      }
    }
    
    const daysInMonth = new Date(parseInt(month.split('-')[0]), parseInt(month.split('-')[1]), 0).getDate();
    const avgDaily = total / daysInMonth;

    res.json({ month, total, categoryTotals, topCategory, avgDaily });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

app.get('/api/alerts', async (req, res) => {
  try {
    const { month } = req.query;
    if (!month) return res.status(400).json({ error: 'Month required' });

    const allExpenses = await dbService.getExpenses(req.userId);
    const expenses = allExpenses.filter(e => e.date.startsWith(month));
    const userBudgets = await dbService.getBudgets(req.userId);
    
    const categoryTotals = {};
    expenses.forEach(e => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });

    const alerts = [];
    for (const [category, budget] of Object.entries(userBudgets)) {
      const spent = categoryTotals[category] || 0;
      const percentage = budget > 0 ? (spent / budget) * 100 : 0;
      
      let level = 'ok';
      if (percentage >= 100) level = 'danger';
      else if (percentage >= 80) level = 'warning';

      if (level === 'warning' || level === 'danger') {
        alerts.push({
          category, budget, spent,
          percentage: parseFloat(percentage.toFixed(2)),
          level, message: '' // Handle messages purely on frontend
        });
      }
    }

    res.json(alerts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
