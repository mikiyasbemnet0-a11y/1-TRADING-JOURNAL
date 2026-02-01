// ===== GLOBAL VARIABLES =====
let trades = [];
let dreams = [];
let equityChart = null;
let winRateChart = null;
let winLossChart = null;
let profitFactorChart = null;
let accountBalance = 10000;
let startingBalance = 10000;
let currentCalendarMonth = new Date().getMonth();
let currentCalendarYear = new Date().getFullYear();

// ===== LOADING SCREEN HANDLING =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, starting initialization...');
    
    // Start loading animation
    simulateLoading();
});

// Simulate loading process
function simulateLoading() {
    let progress = 0;
    const progressBar = document.querySelector('.progress');
    const loader = document.getElementById('loader');
    
    // Simulate loading steps
    const loadingInterval = setInterval(() => {
        progress += 5;
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
        
        if (progress >= 100) {
            clearInterval(loadingInterval);
            // Hide loader and show main content
            setTimeout(() => {
                if (loader) {
                    loader.style.opacity = '0';
                    setTimeout(() => {
                        loader.style.display = 'none';
                        const mainContainer = document.getElementById('mainContainer');
                        if (mainContainer) {
                            mainContainer.style.display = 'block';
                        }
                        initializeApp();
                    }, 500);
                } else {
                    initializeApp();
                }
            }, 500);
        }
    }, 100);
}

// ===== INITIALIZATION =====
function initializeApp() {
    console.log('Initializing FX Miko Trading Dashboard...');
    
    try {
        // Load user data
        loadUserData();
        
        // Load data from localStorage
        loadTrades();
        loadDreams();
        loadAccountBalance();
        
        // Update UI elements
        updateCurrentDate();
        updateUserInfo();
        updateAccountBalanceDisplay();
        updateRecentTrades();
        updateAllTrades();
        updateStats();
        updateTradeLists();
        updateDreamsList();
        
        // Initialize charts
        setTimeout(() => {
            initializeCharts();
            updateCalendar();
        }, 100);
        
        // Setup event listeners
        setupEventListeners();
        
        // Set default date for trade entry
        const tradeDateInput = document.getElementById('tradeDate');
        if (tradeDateInput) {
            tradeDateInput.value = new Date().toISOString().split('T')[0];
        }
        
        // Load saved theme
        const savedTheme = localStorage.getItem('fxMikoTheme') || 'light';
        setTheme(savedTheme);
        
        console.log('Dashboard initialized successfully!');
    } catch (error) {
        console.error('Error initializing app:', error);
        showToast('Error initializing application', 'error');
    }
}

// ===== DATA LOADING FUNCTIONS =====

function loadUserData() {
    try {
        const currentUser = JSON.parse(localStorage.getItem('fxMikoCurrentUser') || '{}');
        if (currentUser.name) {
            const userNameElement = document.getElementById('userName');
            const userEmailElement = document.getElementById('userEmail');
            
            if (userNameElement) userNameElement.textContent = currentUser.name;
            if (userEmailElement) userEmailElement.textContent = currentUser.email;
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

function loadTrades() {
    try {
        const savedTrades = localStorage.getItem('fxMikoTrades');
        if (savedTrades) {
            trades = JSON.parse(savedTrades);
            console.log(`Loaded ${trades.length} trades from storage`);
        } else {
            trades = [];
            console.log('No trades found, starting fresh');
        }
    } catch (error) {
        console.error('Error loading trades:', error);
        trades = [];
    }
}

function loadDreams() {
    try {
        const savedDreams = localStorage.getItem('fxMikoDreams');
        if (savedDreams) {
            dreams = JSON.parse(savedDreams);
            console.log(`Loaded ${dreams.length} dreams from storage`);
        } else {
            dreams = [];
            console.log('No dreams found, starting fresh');
        }
    } catch (error) {
        console.error('Error loading dreams:', error);
        dreams = [];
    }
}

function loadAccountBalance() {
    try {
        const savedBalance = localStorage.getItem('fxMikoAccountBalance');
        const savedStartingBalance = localStorage.getItem('fxMikoStartingBalance');
        
        if (savedBalance) accountBalance = parseFloat(savedBalance);
        if (savedStartingBalance) startingBalance = parseFloat(savedStartingBalance);
        
        console.log(`Account balance: ${accountBalance}, Starting balance: ${startingBalance}`);
    } catch (error) {
        console.error('Error loading account balance:', error);
        accountBalance = 10000;
        startingBalance = 10000;
    }
}

// ===== DATA SAVING FUNCTIONS =====

function saveTrades() {
    try {
        localStorage.setItem('fxMikoTrades', JSON.stringify(trades));
        console.log(`Saved ${trades.length} trades`);
    } catch (error) {
        console.error('Error saving trades:', error);
        showToast('Error saving trades data', 'error');
    }
}

function saveDreams() {
    try {
        localStorage.setItem('fxMikoDreams', JSON.stringify(dreams));
        console.log(`Saved ${dreams.length} dreams`);
    } catch (error) {
        console.error('Error saving dreams:', error);
        showToast('Error saving dreams data', 'error');
    }
}

function saveAccountBalance() {
    try {
        localStorage.setItem('fxMikoAccountBalance', accountBalance.toString());
        localStorage.setItem('fxMikoStartingBalance', startingBalance.toString());
        console.log(`Saved account balance: ${accountBalance}`);
    } catch (error) {
        console.error('Error saving account balance:', error);
        showToast('Error saving account balance', 'error');
    }
}

// ===== UI UPDATE FUNCTIONS =====

function updateCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = now.toLocaleDateString('en-US', options);
    }
}

function updateUserInfo() {
    const currentUser = JSON.parse(localStorage.getItem('fxMikoCurrentUser') || '{}');
    if (currentUser.name) {
        const userNameElement = document.getElementById('userName');
        const userEmailElement = document.getElementById('userEmail');
        
        if (userNameElement) userNameElement.textContent = currentUser.name;
        if (userEmailElement) userEmailElement.textContent = currentUser.email;
    }
}

function updateAccountBalanceDisplay() {
    try {
        // Calculate account balance from trades
        const calculatedBalance = startingBalance + trades.reduce((sum, trade) => sum + trade.pnl, 0);
        accountBalance = calculatedBalance;
        
        // Update all balance displays
        const balanceElement = document.getElementById('accountBalance');
        const currentBalanceInput = document.getElementById('currentBalanceInput');
        const startingBalanceElement = document.getElementById('startingBalance');
        const totalGrowthElement = document.getElementById('totalGrowth');
        const growthPercentageElement = document.getElementById('growthPercentage');
        
        if (balanceElement) {
            balanceElement.textContent = formatCurrency(accountBalance);
        }
        
        if (currentBalanceInput) {
            currentBalanceInput.value = accountBalance;
        }
        
        if (startingBalanceElement) {
            startingBalanceElement.textContent = formatCurrency(startingBalance);
        }
        
        if (totalGrowthElement) {
            const growth = accountBalance - startingBalance;
            totalGrowthElement.textContent = formatCurrency(growth);
            totalGrowthElement.className = `stat-value ${growth >= 0 ? 'profit' : 'loss'}`;
        }
        
        if (growthPercentageElement) {
            const growthPercentage = startingBalance > 0 ? ((accountBalance - startingBalance) / startingBalance) * 100 : 0;
            growthPercentageElement.textContent = `${growthPercentage >= 0 ? '+' : ''}${growthPercentage.toFixed(1)}%`;
            growthPercentageElement.className = `stat-value ${growthPercentage >= 0 ? 'profit' : 'loss'}`;
        }
        
        // Save updated balance
        saveAccountBalance();
    } catch (error) {
        console.error('Error updating account balance display:', error);
    }
}

function updateRecentTrades() {
    const tableBody = document.getElementById('recentTradesTable');
    if (!tableBody) return;
    
    try {
        // Get 5 most recent trades
        const recentTrades = [...trades]
            .sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time))
            .slice(0, 5);
        
        if (recentTrades.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="no-trades">
                        <i class="fas fa-chart-line"></i>
                        <p>No trades recorded yet. Start trading to see your history here.</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        tableBody.innerHTML = recentTrades.map(trade => `
            <tr>
                <td>${formatDate(trade.date)} ${trade.time}</td>
                <td>${trade.tradeNumber}</td>
                <td>${trade.pair}</td>
                <td>${trade.strategy}</td>
                <td class="${trade.pnl >= 0 ? 'profit' : 'loss'}">${formatCurrencyWithSign(trade.pnl)}</td>
                <td><span class="status-badge ${trade.pnl >= 0 ? 'profit' : 'loss'}">${trade.pnl >= 0 ? 'WIN' : 'LOSS'}</span></td>
                <td>
                    <button class="action-btn edit-btn" onclick="editTrade(${trade.id})" title="Edit Trade">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteTrade(${trade.id})" title="Delete Trade">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error updating recent trades:', error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="no-trades">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Error loading trades. Please refresh the page.</p>
                </td>
            </tr>
        `;
    }
}

function updateAllTrades() {
    const tableBody = document.getElementById('allTradesTable');
    if (!tableBody) return;
    
    try {
        // Sort by date (newest first)
        const allTrades = [...trades].sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time));
        
        if (allTrades.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="no-trades">
                        <i class="fas fa-chart-line"></i>
                        <p>No trades recorded yet. Start trading to see your journal here.</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        tableBody.innerHTML = allTrades.map(trade => `
            <tr>
                <td>${formatDate(trade.date)} ${trade.time}</td>
                <td>${trade.tradeNumber}</td>
                <td>${trade.pair}</td>
                <td>${trade.strategy}</td>
                <td class="${trade.pnl >= 0 ? 'profit' : 'loss'}">${formatCurrencyWithSign(trade.pnl)}</td>
                <td>${trade.notes || 'No notes'}</td>
                <td><span class="status-badge ${trade.pnl >= 0 ? 'profit' : 'loss'}">${trade.pnl >= 0 ? 'WIN' : 'LOSS'}</span></td>
                <td>
                    <button class="action-btn edit-btn" onclick="editTrade(${trade.id})" title="Edit Trade">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteTrade(${trade.id})" title="Delete Trade">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error updating all trades:', error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="no-trades">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Error loading trades. Please refresh the page.</p>
                </td>
            </tr>
        `;
    }
}

function updateStats() {
    try {
        const today = new Date().toISOString().split('T')[0];
        const todayTrades = trades.filter(t => t.date === today);
        const todayPnl = todayTrades.reduce((sum, trade) => sum + trade.pnl, 0);
        
        // Update Today's P&L
        const todayPnlElement = document.getElementById('todayPnl');
        if (todayPnlElement) {
            todayPnlElement.textContent = formatCurrencyWithSign(todayPnl);
            todayPnlElement.className = `stat-value ${todayPnl >= 0 ? 'profit' : 'loss'}`;
        }
        
        // Update Today's Trades Count
        const todayTradesCount = document.getElementById('todayTradesCount');
        if (todayTradesCount) {
            todayTradesCount.textContent = `${todayTrades.length}/4`;
        }
        
        // Update progress bar
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            const progress = (todayTrades.length / 4) * 100;
            progressFill.style.width = `${progress}%`;
        }
        
        // Update Weekly Performance (last 7 days)
        const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
        const weeklyTrades = trades.filter(t => t.date >= weekAgo);
        const weeklyPnl = weeklyTrades.reduce((sum, trade) => sum + trade.pnl, 0);
        
        const weeklyPnlElement = document.getElementById('weeklyPnl');
        if (weeklyPnlElement) {
            weeklyPnlElement.textContent = formatCurrencyWithSign(weeklyPnl);
            weeklyPnlElement.className = `stat-value ${weeklyPnl >= 0 ? 'profit' : 'loss'}`;
        }
        
        // Update Monthly Performance (last 30 days)
        const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
        const monthlyTrades = trades.filter(t => t.date >= monthAgo);
        const monthlyPnl = monthlyTrades.reduce((sum, trade) => sum + trade.pnl, 0);
        
        const monthlyPnlElement = document.getElementById('monthlyPnl');
        if (monthlyPnlElement) {
            monthlyPnlElement.textContent = formatCurrencyWithSign(monthlyPnl);
            monthlyPnlElement.className = `stat-value ${monthlyPnl >= 0 ? 'profit' : 'loss'}`;
        }
        
        // Update win rate
        updateWinRate();
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

function updateWinRate() {
    try {
        const winningTrades = trades.filter(t => t.pnl > 0).length;
        const losingTrades = trades.filter(t => t.pnl < 0).length;
        const totalTrades = winningTrades + losingTrades;
        const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
        
        const winRateElement = document.getElementById('winRateValue');
        if (winRateElement) {
            winRateElement.textContent = `${winRate.toFixed(1)}%`;
        }
        
        // Update profit factor
        const totalProfit = trades.filter(t => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0);
        const totalLoss = Math.abs(trades.filter(t => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0));
        const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? 999 : 0;
        
        const profitFactorElement = document.getElementById('profitFactorValue');
        if (profitFactorElement) {
            profitFactorElement.textContent = profitFactor.toFixed(2);
        }
    } catch (error) {
        console.error('Error updating win rate:', error);
    }
}

function updateTradeLists() {
    try {
        const today = new Date().toISOString().split('T')[0];
        const todayTrades = trades.filter(t => t.date === today);
        const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
        const weeklyTrades = trades.filter(t => t.date >= weekAgo);
        const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
        const monthlyTrades = trades.filter(t => t.date >= monthAgo);
        
        updateTradeList('todayTradesList', todayTrades);
        updateTradeList('weeklyTradesList', weeklyTrades);
        updateTradeList('monthlyTradesList', monthlyTrades);
    } catch (error) {
        console.error('Error updating trade lists:', error);
    }
}

function updateTradeList(elementId, tradeList) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    try {
        if (tradeList.length === 0) {
            element.innerHTML = '<p class="no-trades">No trades recorded</p>';
            return;
        }
        
        const list = tradeList.slice(0, 3).map(trade => `
            <div class="trade-item">
                <span>${formatDate(trade.date)} ${trade.time}</span>
                <span>${trade.pair}</span>
                <span class="${trade.pnl >= 0 ? 'profit' : 'loss'}">${formatCurrencyWithSign(trade.pnl)}</span>
            </div>
        `).join('');
        
        element.innerHTML = list;
    } catch (error) {
        console.error(`Error updating trade list ${elementId}:`, error);
        element.innerHTML = '<p class="no-trades">Error loading trades</p>';
    }
}

function updateDreamsList() {
    const dreamsList = document.getElementById('dreamsList');
    if (!dreamsList) return;
    
    try {
        if (dreams.length === 0) {
            dreamsList.innerHTML = `
                <div class="no-dreams">
                    <i class="fas fa-cloud"></i>
                    <p>No dreams recorded yet. Write your first trading dream!</p>
                </div>
            `;
            return;
        }
        
        // Sort by date (newest first)
        const sortedDreams = [...dreams].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        dreamsList.innerHTML = sortedDreams.map(dream => `
            <div class="dream-card">
                <div class="dream-header">
                    <span class="dream-date">${formatDate(dream.date)}</span>
                    <div class="dream-actions">
                        <button class="action-btn edit-btn" onclick="editDream(${dream.id})" title="Edit Dream">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="deleteDream(${dream.id})" title="Delete Dream">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="dream-content">${dream.content}</div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error updating dreams list:', error);
        dreamsList.innerHTML = `
            <div class="no-dreams">
                <i class="fas fa-exclamation-circle"></i>
                <p>Error loading dreams. Please refresh the page.</p>
            </div>
        `;
    }
}

// ===== CHART FUNCTIONS =====

function initializeCharts() {
    console.log('Initializing charts...');
    
    try {
        // Equity Chart
        const equityCtx = document.getElementById('equityChart');
        if (equityCtx) {
            const equityData = getEquityData('7d');
            
            equityChart = new Chart(equityCtx, {
                type: 'line',
                data: equityData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            callbacks: {
                                label: function(context) {
                                    return `Balance: $${context.parsed.y.toLocaleString()}`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            ticks: {
                                callback: function(value) {
                                    return '$' + value.toLocaleString();
                                }
                            },
                            grid: { color: 'rgba(0, 0, 0, 0.05)' }
                        },
                        x: {
                            grid: { color: 'rgba(0, 0, 0, 0.05)' }
                        }
                    }
                }
            });
            console.log('Equity chart created');
        }
        
        // Win Rate Chart
        const winRateCtx = document.getElementById('winRateChart');
        if (winRateCtx) {
            const winRateData = getWinRateData();
            
            winRateChart = new Chart(winRateCtx, {
                type: 'doughnut',
                data: winRateData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: { legend: { position: 'bottom' } }
                }
            });
            console.log('Win rate chart created');
        }
        
        // Win Loss Chart
        const winLossCtx = document.getElementById('winLossChart');
        if (winLossCtx) {
            const winLossData = getWinLossData();
            
            winLossChart = new Chart(winLossCtx, {
                type: 'pie',
                data: winLossData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom' } }
                }
            });
            console.log('Win loss chart created');
        }
        
        // Profit Factor Chart
        const profitFactorCtx = document.getElementById('profitFactorChart');
        if (profitFactorCtx) {
            const profitFactorData = getProfitFactorData();
            
            profitFactorChart = new Chart(profitFactorCtx, {
                type: 'bar',
                data: profitFactorData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true } }
                }
            });
            console.log('Profit factor chart created');
        }
        
    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}

function getEquityData(period = '7d') {
    let filteredTrades = [...trades];
    const now = new Date();
    
    // Filter trades based on period
    switch(period.toLowerCase()) {
        case '1m':
            const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
            filteredTrades = trades.filter(t => new Date(t.date) >= oneMonthAgo);
            break;
        case '12m':
            const twelveMonthsAgo = new Date(now.setMonth(now.getMonth() - 12));
            filteredTrades = trades.filter(t => new Date(t.date) >= twelveMonthsAgo);
            break;
        case '7d':
        default:
            const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
            filteredTrades = trades.filter(t => new Date(t.date) >= sevenDaysAgo);
            break;
    }
    
    // Sort trades by date and time
    filteredTrades.sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));
    
    // Start with initial balance
    let balance = startingBalance;
    const data = [balance];
    const labels = ['Starting Balance'];
    
    // Process each trade
    filteredTrades.forEach((trade, index) => {
        balance += trade.pnl;
        data.push(balance);
        
        // Format label with date and time
        const dateObj = new Date(trade.date);
        const formattedDate = dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
        
        // Add time to label
        const label = `${formattedDate} ${trade.time}`;
        labels.push(label);
    });
    
    // If no trades in period, just show starting balance
    if (filteredTrades.length === 0) {
        return {
            labels: ['Starting Balance'],
            datasets: [{
                label: 'Account Balance',
                data: [startingBalance],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        };
    }
    
    return {
        labels: labels,
        datasets: [{
            label: 'Account Balance',
            data: data,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4
        }]
    };
}

function getWinRateData() {
    const winningTrades = trades.filter(t => t.pnl > 0).length;
    const losingTrades = trades.filter(t => t.pnl < 0).length;
    const breakEvenTrades = trades.filter(t => t.pnl === 0).length;
    
    return {
        labels: ['Winning Trades', 'Losing Trades', 'Break Even'],
        datasets: [{
            data: [winningTrades, losingTrades, breakEvenTrades],
            backgroundColor: ['#10b981', '#ef4444', '#94a3b8'],
            borderWidth: 0
        }]
    };
}

function getWinLossData() {
    const winningTrades = trades.filter(t => t.pnl > 0);
    const losingTrades = trades.filter(t => t.pnl < 0);
    
    const totalProfit = winningTrades.reduce((sum, t) => sum + t.pnl, 0);
    const totalLoss = Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0));
    
    return {
        labels: ['Total Profit', 'Total Loss'],
        datasets: [{
            data: [totalProfit, totalLoss],
            backgroundColor: ['#10b981', '#ef4444'],
            borderWidth: 0
        }]
    };
}

function getProfitFactorData() {
    const months = getLast6Months();
    const data = [];
    
    months.forEach(month => {
        const monthTrades = trades.filter(t => {
            try {
                const tradeDate = new Date(t.date);
                return tradeDate.getMonth() === month.month && tradeDate.getFullYear() === month.year;
            } catch (e) {
                return false;
            }
        });
        
        const totalProfit = monthTrades.filter(t => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0);
        const totalLoss = Math.abs(monthTrades.filter(t => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0));
        const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? 999 : 0;
        
        data.push(profitFactor);
    });
    
    return {
        labels: months.map(m => m.label),
        datasets: [{
            label: 'Profit Factor',
            data: data,
            backgroundColor: '#3b82f6',
            borderColor: '#1d4ed8',
            borderWidth: 1
        }]
    };
}

function getLast6Months() {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({
            month: date.getMonth(),
            year: date.getFullYear(),
            label: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
        });
    }
    
    return months;
}

// ===== CALENDAR FUNCTIONS =====

function updateCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const calendarMonth = document.getElementById('calendarMonth');
    
    if (!calendarGrid || !calendarMonth) return;
    
    try {
        // Update month display
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                          'July', 'August', 'September', 'October', 'November', 'December'];
        calendarMonth.textContent = `${monthNames[currentCalendarMonth]} ${currentCalendarYear}`;
        
        // Get first day of month and number of days
        const firstDay = new Date(currentCalendarYear, currentCalendarMonth, 1);
        const lastDay = new Date(currentCalendarYear, currentCalendarMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        
        // Create calendar header
        let calendarHTML = `
            <div class="calendar-header">Sun</div>
            <div class="calendar-header">Mon</div>
            <div class="calendar-header">Tue</div>
            <div class="calendar-header">Wed</div>
            <div class="calendar-header">Thu</div>
            <div class="calendar-header">Fri</div>
            <div class="calendar-header">Sat</div>
        `;
        
        // Add empty cells for days before the first day of month
        for (let i = 0; i < startingDay; i++) {
            calendarHTML += '<div class="calendar-day empty"></div>';
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${currentCalendarYear}-${String(currentCalendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayTrades = trades.filter(t => t.date === dateStr);
            const dayPnl = dayTrades.reduce((sum, t) => sum + t.pnl, 0);
            
            let dayClass = 'calendar-day';
            let pnlClass = '';
            let pnlText = '';
            
            if (dayTrades.length > 0) {
                dayClass += dayPnl >= 0 ? ' profit' : ' loss';
                pnlClass = dayPnl >= 0 ? 'profit' : 'loss';
                pnlText = formatCurrencyWithSign(dayPnl);
            }
            
            calendarHTML += `
                <div class="${dayClass}" onclick="viewDayTrades('${dateStr}')">
                    <div class="calendar-date">${day}</div>
                    ${dayTrades.length > 0 ? `
                        <div class="calendar-pnl ${pnlClass}">${pnlText}</div>
                        <div class="calendar-trades">${dayTrades.length} trade(s)</div>
                    ` : ''}
                </div>
            `;
        }
        
        calendarGrid.innerHTML = calendarHTML;
    } catch (error) {
        console.error('Error updating calendar:', error);
    }
}

function changeCalendarMonth(direction) {
    currentCalendarMonth += direction;
    
    if (currentCalendarMonth < 0) {
        currentCalendarMonth = 11;
        currentCalendarYear--;
    } else if (currentCalendarMonth > 11) {
        currentCalendarMonth = 0;
        currentCalendarYear++;
    }
    
    updateCalendar();
}

function viewDayTrades(dateStr) {
    const dayTrades = trades.filter(t => t.date === dateStr);
    
    if (dayTrades.length === 0) {
        showToast('No trades on this date', 'info');
        return;
    }
    
    const date = new Date(dateStr);
    const dateFormatted = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const totalPnl = dayTrades.reduce((sum, t) => sum + t.pnl, 0);
    
    let tradesHTML = dayTrades.map(trade => `
        <div class="day-trade-item">
            <strong>Trade ${trade.tradeNumber} (${trade.time})</strong>
            <span>${trade.pair} - ${trade.strategy}</span>
            <span class="${trade.pnl >= 0 ? 'profit' : 'loss'}">${formatCurrencyWithSign(trade.pnl)}</span>
        </div>
    `).join('');
    
    showModal(`
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-calendar-day"></i> Trades on ${dateFormatted}</h3>
                <button class="close-modal" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="day-summary">
                    <div class="summary-item">
                        <span>Total Trades:</span>
                        <strong>${dayTrades.length}</strong>
                    </div>
                    <div class="summary-item">
                        <span>Daily P&L:</span>
                        <strong class="${totalPnl >= 0 ? 'profit' : 'loss'}">${formatCurrencyWithSign(totalPnl)}</strong>
                    </div>
                </div>
                <div class="day-trades-list">
                    ${tradesHTML}
                </div>
                <div class="modal-actions">
                    <button class="btn-outline" onclick="closeModal()">Close</button>
                </div>
            </div>
        </div>
    `);
}

// ===== TRADE FUNCTIONS =====

function saveTrade() {
    try {
        const date = document.getElementById('tradeDate')?.value;
        const time = document.getElementById('tradeTime')?.value;
        const tradeNumber = parseInt(document.getElementById('tradeNumber')?.value);
        let strategy = document.getElementById('strategy')?.value;
        const customStrategy = document.getElementById('customStrategy')?.value;
        const pair = document.getElementById('currencyPair')?.value;
        const pnl = parseFloat(document.getElementById('pnlAmount')?.value);
        const notes = document.getElementById('tradeNotes')?.value;
        
        // Validation
        if (!date || !time || !tradeNumber || !strategy || !pair || isNaN(pnl)) {
            showToast('Please fill all required fields', 'error');
            return false;
        }
        
        // Check max 4 trades per day
        const todayTrades = trades.filter(t => t.date === date);
        if (todayTrades.length >= 4) {
            showToast('Maximum 4 trades per day reached!', 'error');
            return false;
        }
        
        // Use custom strategy if provided
        if (customStrategy && document.getElementById('customStrategy').style.display !== 'none') {
            strategy = customStrategy;
        }
        
        // Create trade object
        const trade = {
            id: Date.now(),
            date,
            time,
            tradeNumber,
            pair,
            strategy,
            pnl,
            notes: notes || 'No notes provided'
        };
        
        // Add to trades array
        trades.unshift(trade);
        
        // Save data
        saveTrades();
        
        // Update UI
        updateAccountBalanceDisplay();
        updateRecentTrades();
        updateAllTrades();
        updateStats();
        updateTradeLists();
        
        // Update charts
        if (equityChart) {
            const activePeriod = document.querySelector('.period-btn.active')?.getAttribute('data-period') || '7d
