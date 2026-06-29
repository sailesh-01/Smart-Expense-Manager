class DatabaseService {
  /**
   * Interface for Database operations
   * If we switch to MongoDB, we just write a new class extending this.
   */
  async getUserByUsername(username) {
    throw new Error('Not implemented');
  }

  async createUser(user) {
    throw new Error('Not implemented');
  }

  async getUserByToken(token) {
    throw new Error('Not implemented');
  }

  async updateToken(userId, token) {
    throw new Error('Not implemented');
  }

  async getExpenses(userId) {
    throw new Error('Not implemented');
  }

  async addExpense(userId, expense) {
    throw new Error('Not implemented');
  }

  async deleteExpense(userId, expenseId) {
    throw new Error('Not implemented');
  }

  async getBudgets(userId) {
    throw new Error('Not implemented');
  }

  async updateBudget(userId, category, amount) {
    throw new Error('Not implemented');
  }

  async resetUserData(userId) {
    throw new Error('Not implemented');
  }

  async deleteUserAccount(userId) {
    throw new Error('Not implemented');
  }
}

module.exports = DatabaseService;
