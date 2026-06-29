const fs = require('fs/promises');
const path = require('path');
const DatabaseService = require('./DatabaseService');

class FileAdapter extends DatabaseService {
  constructor() {
    super();
    this.dataDir = path.join(__dirname, '..', 'data');
    this.usersPath = path.join(this.dataDir, 'users.json');
  }

  // --- Helpers ---

  async _readJson(filePath, defaultData) {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        await this._writeJson(filePath, defaultData);
        return defaultData;
      }
      throw error;
    }
  }

  async _writeJson(filePath, data) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  }

  _getUserDataPath(userId) {
    return path.join(this.dataDir, `user_data_${userId}.json`);
  }

  async _readUserData(userId) {
    const defaultData = {
      expenses: [],
      budgets: {
        Food: 300, Transport: 100, Books: 50, Rent: 800,
        Entertainment: 150, Health: 100, Clothing: 100, Others: 50
      }
    };
    return await this._readJson(this._getUserDataPath(userId), defaultData);
  }

  async _writeUserData(userId, data) {
    await this._writeJson(this._getUserDataPath(userId), data);
  }

  async _readUsers() {
    return await this._readJson(this.usersPath, []);
  }

  async _writeUsers(users) {
    await this._writeJson(this.usersPath, users);
  }

  // --- Interface Implementations ---

  async getUserByUsername(username) {
    const users = await this._readUsers();
    return users.find(u => u.username === username);
  }

  async getUserByToken(token) {
    const users = await this._readUsers();
    return users.find(u => u.token === token);
  }

  async createUser(user) {
    const users = await this._readUsers();
    users.push(user);
    await this._writeUsers(users);
    
    // Initialize their personal data file
    await this._readUserData(user.id);
  }

  async updateToken(userId, token) {
    const users = await this._readUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex].token = token;
      await this._writeUsers(users);
    }
  }

  async getExpenses(userId) {
    const userData = await this._readUserData(userId);
    return userData.expenses;
  }

  async addExpense(userId, expense) {
    const userData = await this._readUserData(userId);
    userData.expenses.push(expense);
    await this._writeUserData(userId, userData);
  }

  async deleteExpense(userId, expenseId) {
    const userData = await this._readUserData(userId);
    const index = userData.expenses.findIndex(e => e.id === expenseId);
    
    if (index === -1) return null;
    
    const deleted = userData.expenses.splice(index, 1);
    await this._writeUserData(userId, userData);
    return deleted[0];
  }

  async getBudgets(userId) {
    const userData = await this._readUserData(userId);
    return userData.budgets;
  }

  async updateBudget(userId, category, amount) {
    const userData = await this._readUserData(userId);
    userData.budgets[category] = amount;
    await this._writeUserData(userId, userData);
    return userData.budgets;
  }

  async resetUserData(userId) {
    const defaultData = {
      expenses: [],
      budgets: {
        Food: 300, Transport: 100, Books: 50, Rent: 800,
        Entertainment: 150, Health: 100, Clothing: 100, Others: 50
      }
    };
    await this._writeUserData(userId, defaultData);
  }

  async deleteUserAccount(userId) {
    const users = await this._readUsers();
    const filteredUsers = users.filter(u => u.id !== userId);
    await this._writeUsers(filteredUsers);
    
    try {
      await fs.unlink(this._getUserDataPath(userId));
    } catch(err) {
      // Ignore if file already missing
    }
  }
}

module.exports = FileAdapter;
