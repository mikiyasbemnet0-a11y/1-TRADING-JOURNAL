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
        // Check authentication
        if (!isAuthenticated()) {
            window.location.href = 'index.html';
            return;
        }
        
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
        
        // Set default time
        const tradeTimeInput = document.getElementById('tradeTime');
        if (tradeTimeInput) {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            tradeTimeInput.value = `${hours}:${minutes}`;
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

// ===== AUTHENTICATION =====
function isAuthenticated() {
    return localStorage.getItem('fxMikoCurrentUser') !== null;
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
        const startingBalanceElement = document.getElementById('startingBalance');
        const startingBalanceDisplay = document.getElementById('startingBalanceDisplay');
        const startingBalanceDisplay2 = document.getElementById('startingBalanceDisplay2');
        const currentBalance = document.getElementById('currentBalance');
        const currentBalanceDisplay = document.getElementById('currentBalanceDisplay');
        const totalGrowthElement = document.getElementById('totalGrowth');
        const totalGrowth2Element = document.getElementById('totalGrowth2');
        const growthPercentageElement = document.getElementById('growthPercentage');
        const growthPercentage2Element = document.getElementById('growthPercentage2');
        
        if (balanceElement) {
            balanceElement.textContent = formatCurrency(accountBalance);
        }
        
        if (startingBalanceElement) {
            startingBalanceElement.textContent = formatCurrency(startingBalance);
        }
        
        if (startingBalanceDisplay) {
            startingBalanceDisplay.textContent = formatCurrency(startingBalance);
        }
        
        if (startingBalanceDisplay2) {
            startingBalanceDisplay2.textContent = formatCurrency(startingBalance);
        }
        
        if (currentBalance) {
            currentBalance.textContent = formatCurrency(accountBalance);
        }
        
        if (currentBalanceDisplay) {
            currentBalanceDisplay.textContent = formatCurrency(accountBalance);
        }
        
        if (totalGrowthElement) {
            const growth = accountBalance - startingBalance;
            totalGrowthElement.textContent = formatCurrency(growth);
            totalGrowthElement.className = `stat-value ${growth >= 0 ? 'profit' : 'loss'}`;
        }
        
        if (totalGrowth2Element) {
            const growth = accountBalance - startingBalance;
            totalGrowth2Element.textContent = formatCurrency(growth);
            totalGrowth2Element.className = `stat-value ${growth >= 0 ? 'profit' : 'loss'}`;
        }
        
        if (growthPercentageElement) {
            const growthPercentage = startingBalance > 0 ? ((accountBalance - startingBalance) / startingBalance) * 100 : 0;
            growthPercentageElement.textContent = `${growthPercentage >= 0 ? '+' : ''}${growthPercentage.toFixed(1)}%`;
            growthPercentageElement.className = `stat-value ${growthPercentage >= 0 ? 'profit' : 'loss'}`;
        }
        
        if (growthPercentage2Element) {
            const growthPercentage = startingBalance > 0 ? ((accountBalance - startingBalance) / startingBalance) * 100 : 0;
            growthPercentage2Element.textContent = `${growthPercentage >= 0 ? '+' : ''}${growthPercentage.toFixed(1)}%`;
            growthPercentage2Element.className = `stat-value ${growthPercentage >= 0 ? 'profit' : 'loss'}`;
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
        
        // Update analytics metrics
        updateAnalyticsMetrics();
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
        const winRateDisplay = document.getElementById('winRateDisplay');
        const winningTradesElement = document.getElementById('winningTrades');
        const losingTradesElement = document.getElementById('losingTrades');
        
        if (winRateElement) {
            winRateElement.textContent = `${winRate.toFixed(1)}%`;
        }
        
        if (winRateDisplay) {
            winRateDisplay.textContent = `${winRate.toFixed(1)}%`;
        }
        
        if (winningTradesElement) {
            winningTradesElement.textContent = winningTrades;
        }
        
        if (losingTradesElement) {
            losingTradesElement.textContent = losingTrades;
        }
        
        // Update profit factor
        const totalProfit = trades.filter(t => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0);
        const totalLoss = Math.abs(trades.filter(t => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0));
        const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? 999 : 0;
        
        const profitFactorElement = document.getElementById('profitFactorValue');
        const profitFactorDisplay = document.getElementById('profitFactorDisplay');
        
        if (profitFactorElement) {
            profitFactorElement.textContent = profitFactor.toFixed(2);
        }
        
        if (profitFactorDisplay) {
            profitFactorDisplay.textContent = profitFactor.toFixed(2);
        }
    } catch (error) {
        console.error('Error updating win rate:', error);
    }
}

function updateAnalyticsMetrics() {
    try {
        const totalTrades = trades.length;
        const winningTrades = trades.filter(t => t.pnl > 0);
        const losingTrades = trades.filter(t => t.pnl < 0);
        
        // Total trades
        const totalTradesElement = document.getElementById('totalTrades');
        if (totalTradesElement) totalTradesElement.textContent = totalTrades;
        
        // Average win
        const avgWin = winningTrades.length > 0 ? 
            winningTrades.reduce((sum, t) => sum + t.pnl, 0) / winningTrades.length : 0;
        const avgWinElement = document.getElementById('averageWin');
        if (avgWinElement) avgWinElement.textContent = formatCurrency(avgWin);
        
        // Average loss
        const avgLoss = losingTrades.length > 0 ? 
            Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0)) / losingTrades.length : 0;
        const avgLossElement = document.getElementById('averageLoss');
        if (avgLossElement) avgLossElement.textContent = formatCurrency(avgLoss);
        
        // Best trade
        const bestTrade = trades.length > 0 ? Math.max(...trades.map(t => t.pnl)) : 0;
        const bestTradeElement = document.getElementById('bestTrade');
        if (bestTradeElement) bestTradeElement.textContent = formatCurrency(bestTrade);
        
        // Worst trade
        const worstTrade = trades.length > 0 ? Math.min(...trades.map(t => t.pnl)) : 0;
        const worstTradeElement = document.getElementById('worstTrade');
        if (worstTradeElement) worstTradeElement.textContent = formatCurrency(worstTrade);
    } catch (error) {
        console.error('Error updating analytics metrics:', error);
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
            const activePeriod = document.querySelector('.period-btn.active')?.getAttribute('data-period') || '7d';
            equityChart.data = getEquityData(activePeriod);
            equityChart.update();
        }
        
        if (winRateChart) {
            winRateChart.data = getWinRateData();
            winRateChart.update();
        }
        
        if (winLossChart) {
            winLossChart.data = getWinLossData();
            winLossChart.update();
        }
        
        if (profitFactorChart) {
            profitFactorChart.data = getProfitFactorData();
            profitFactorChart.update();
        }
        
        // Update calendar
        updateCalendar();
        
        // Reset form
        const pnlInput = document.getElementById('pnlAmount');
        const notesInput = document.getElementById('tradeNotes');
        
        if (pnlInput) pnlInput.value = '';
        if (notesInput) notesInput.value = '';
        
        // Reset trade number to next available
        const today = new Date().toISOString().split('T')[0];
        const todayTradesCount = trades.filter(t => t.date === today).length;
        const tradeNumberInput = document.getElementById('tradeNumber');
        if (tradeNumberInput) {
            tradeNumberInput.value = Math.min(todayTradesCount + 1, 4);
        }
        
        showToast('Trade saved successfully!', 'success');
        return true;
    } catch (error) {
        console.error('Error saving trade:', error);
        showToast('Error saving trade', 'error');
        return false;
    }
}

function saveAndDownloadTrade() {
    const success = saveTrade();
    if (success) {
        // Download the latest trade as PDF
        setTimeout(() => {
            if (trades.length > 0) {
                downloadTradePDF(trades[0]);
            }
        }, 500);
    }
}

function editTrade(tradeId) {
    const tradeIndex = trades.findIndex(t => t.id === tradeId);
    if (tradeIndex === -1) {
        showToast('Trade not found', 'error');
        return;
    }
    
    const trade = trades[tradeIndex];
    
    // Open edit modal
    document.getElementById('editTradesModal').style.display = 'flex';
    
    // Populate edit form
    const editList = document.getElementById('todayTradesEditList');
    editList.innerHTML = `
        <div class="edit-trade-form">
            <div class="form-group">
                <label>Trade #</label>
                <input type="number" id="editTradeNumber" class="form-input" value="${trade.tradeNumber}" min="1" max="4">
            </div>
            <div class="form-group">
                <label>Currency Pair</label>
                <input type="text" id="editPair" class="form-input" value="${trade.pair}">
            </div>
            <div class="form-group">
                <label>Strategy</label>
                <input type="text" id="editStrategy" class="form-input" value="${trade.strategy}">
            </div>
            <div class="form-group">
                <label>P&L ($)</label>
                <input type="number" id="editPnl" class="form-input" value="${trade.pnl}" step="0.01">
            </div>
            <div class="form-group">
                <label>Time</label>
                <input type="time" id="editTime" class="form-input" value="${trade.time}">
            </div>
            <div class="form-group">
                <label>Notes</label>
                <textarea id="editNotes" class="form-input">${trade.notes}</textarea>
            </div>
            <input type="hidden" id="editTradeId" value="${trade.id}">
        </div>
    `;
}

function saveEditedTrades() {
    try {
        const tradeId = parseInt(document.getElementById('editTradeId').value);
        const tradeIndex = trades.findIndex(t => t.id === tradeId);
        
        if (tradeIndex === -1) {
            showToast('Trade not found', 'error');
            return;
        }
        
        // Update trade
        trades[tradeIndex] = {
            ...trades[tradeIndex],
            tradeNumber: parseInt(document.getElementById('editTradeNumber').value),
            pair: document.getElementById('editPair').value,
            strategy: document.getElementById('editStrategy').value,
            pnl: parseFloat(document.getElementById('editPnl').value),
            time: document.getElementById('editTime').value,
            notes: document.getElementById('editNotes').value
        };
        
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
            const activePeriod = document.querySelector('.period-btn.active')?.getAttribute('data-period') || '7d';
            equityChart.data = getEquityData(activePeriod);
            equityChart.update();
        }
        
        if (winRateChart) {
            winRateChart.data = getWinRateData();
            winRateChart.update();
        }
        
        closeEditTradesModal();
        showToast('Trade updated successfully!', 'success');
    } catch (error) {
        console.error('Error saving edited trade:', error);
        showToast('Error updating trade', 'error');
    }
}

function deleteTrade(tradeId) {
    if (!confirm('Are you sure you want to delete this trade?')) return;
    
    const tradeIndex = trades.findIndex(t => t.id === tradeId);
    if (tradeIndex === -1) return;
    
    try {
        // Remove trade
        trades.splice(tradeIndex, 1);
        
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
            const activePeriod = document.querySelector('.period-btn.active')?.getAttribute('data-period') || '7d';
            equityChart.data = getEquityData(activePeriod);
            equityChart.update();
        }
        
        if (winRateChart) {
            winRateChart.data = getWinRateData();
            winRateChart.update();
        }
        
        // Update calendar
        updateCalendar();
        
        showToast('Trade deleted successfully!', 'success');
    } catch (error) {
        console.error('Error deleting trade:', error);
        showToast('Error deleting trade', 'error');
    }
}

function editTodayTrades() {
    const today = new Date().toISOString().split('T')[0];
    const todayTrades = trades.filter(t => t.date === today);
    
    if (todayTrades.length === 0) {
        showToast('No trades to edit today', 'warning');
        return;
    }
    
    // Open edit modal
    document.getElementById('editTradesModal').style.display = 'flex';
    
    // Populate edit list
    const editList = document.getElementById('todayTradesEditList');
    editList.innerHTML = todayTrades.map(trade => `
        <div class="edit-trade-item">
            <div class="trade-info">
                <strong>Trade ${trade.tradeNumber} (${trade.time})</strong>
                <span>${trade.pair} - ${trade.strategy}</span>
                <span class="${trade.pnl >= 0 ? 'profit' : 'loss'}">${formatCurrencyWithSign(trade.pnl)}</span>
            </div>
            <div class="trade-actions">
                <button class="action-btn edit-btn" onclick="editTrade(${trade.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" onclick="deleteTrade(${trade.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function closeEditTradesModal() {
    document.getElementById('editTradesModal').style.display = 'none';
}

function showCustomStrategy() {
    const strategySelect = document.getElementById('strategy');
    const customStrategy = document.getElementById('customStrategy');
    
    if (strategySelect && customStrategy) {
        if (strategySelect.value === 'other') {
            customStrategy.style.display = 'block';
            customStrategy.focus();
        } else {
            customStrategy.style.display = 'none';
        }
    }
}

// ===== DREAM FUNCTIONS =====
function saveDream() {
    const dreamInput = document.getElementById('dreamInput');
    const content = dreamInput?.value.trim();
    
    if (!content) {
        showToast('Please write your dream first', 'error');
        return;
    }
    
    try {
        const dream = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            content: content
        };
        
        dreams.unshift(dream);
        saveDreams();
        updateDreamsList();
        
        if (dreamInput) dreamInput.value = '';
        showToast('Dream saved successfully!', 'success');
    } catch (error) {
        console.error('Error saving dream:', error);
        showToast('Error saving dream', 'error');
    }
}

function clearDream() {
    const dreamInput = document.getElementById('dreamInput');
    if (dreamInput) dreamInput.value = '';
}

function editDream(dreamId) {
    const dream = dreams.find(d => d.id === dreamId);
    if (!dream) {
        showToast('Dream not found', 'error');
        return;
    }
    
    const dreamInput = document.getElementById('dreamInput');
    if (dreamInput) dreamInput.value = dream.content;
    
    try {
        // Remove the dream from list
        dreams = dreams.filter(d => d.id !== dreamId);
        saveDreams();
        updateDreamsList();
        
        showToast('Dream loaded for editing', 'info');
    } catch (error) {
        console.error('Error editing dream:', error);
        showToast('Error loading dream for editing', 'error');
    }
}

function deleteDream(dreamId) {
    if (!confirm('Are you sure you want to delete this dream?')) return;
    
    try {
        dreams = dreams.filter(d => d.id !== dreamId);
        saveDreams();
        updateDreamsList();
        
        showToast('Dream deleted successfully!', 'success');
    } catch (error) {
        console.error('Error deleting dream:', error);
        showToast('Error deleting dream', 'error');
    }
}

// ===== BALANCE FUNCTIONS =====
function editStartingBalance() {
    const startingBalanceInput = document.getElementById('startingBalanceInput');
    const startingBalanceText = document.getElementById('startingBalanceText');
    const saveBalanceBtn = document.getElementById('saveBalanceBtn');
    const cancelBalanceBtn = document.getElementById('cancelBalanceBtn');
    
    if (!startingBalanceInput || !startingBalanceText) return;
    
    // Show input, hide text
    startingBalanceText.style.display = 'none';
    startingBalanceInput.style.display = 'block';
    saveBalanceBtn.style.display = 'flex';
    cancelBalanceBtn.style.display = 'flex';
    
    // Set input value to current starting balance
    startingBalanceInput.value = startingBalance;
    
    // Focus on input and select all text
    setTimeout(() => {
        startingBalanceInput.focus();
        startingBalanceInput.select();
    }, 100);
}

function saveStartingBalance() {
    const startingBalanceInput = document.getElementById('startingBalanceInput');
    const newStartingBalance = parseFloat(startingBalanceInput.value);
    
    if (isNaN(newStartingBalance) || newStartingBalance <= 0) {
        showToast('Please enter a valid starting balance (greater than 0)', 'error');
        startingBalanceInput.focus();
        return;
    }
    
    // Update starting balance
    startingBalance = newStartingBalance;
    
    // Save to localStorage
    saveAccountBalance();
    
    // Update display
    updateAccountBalanceDisplay();
    
    // Update charts
    if (equityChart) {
        const activePeriod = document.querySelector('.period-btn.active')?.getAttribute('data-period') || '7d';
        equityChart.data = getEquityData(activePeriod);
        equityChart.update();
    }
    
    // Show success message
    showToast(`Starting balance updated to ${formatCurrency(startingBalance)}`, 'success');
    
    // Hide edit mode
    hideEditMode();
}

function cancelStartingBalanceEdit() {
    hideEditMode();
}

function hideEditMode() {
    const startingBalanceInput = document.getElementById('startingBalanceInput');
    const startingBalanceText = document.getElementById('startingBalanceText');
    const saveBalanceBtn = document.getElementById('saveBalanceBtn');
    const cancelBalanceBtn = document.getElementById('cancelBalanceBtn');
    
    if (startingBalanceInput) startingBalanceInput.style.display = 'none';
    if (startingBalanceText) startingBalanceText.style.display = 'block';
    if (saveBalanceBtn) saveBalanceBtn.style.display = 'none';
    if (cancelBalanceBtn) cancelBalanceBtn.style.display = 'none';
}

function openEditBalanceModal() {
    const modal = document.getElementById('editBalanceModal');
    const newBalanceInput = document.getElementById('newBalanceInput');
    
    if (modal) modal.style.display = 'flex';
    if (newBalanceInput) newBalanceInput.value = accountBalance;
}

function closeEditBalanceModal() {
    const modal = document.getElementById('editBalanceModal');
    if (modal) modal.style.display = 'none';
}

function confirmBalanceUpdate() {
    const newBalanceInput = document.getElementById('newBalanceInput');
    const newBalance = parseFloat(newBalanceInput?.value);
    
    if (isNaN(newBalance) || newBalance <= 0) {
        showToast('Please enter a valid balance', 'error');
        return;
    }
    
    try {
        // Adjust starting balance instead of current balance
        startingBalance = newBalance;
        saveAccountBalance();
        updateAccountBalanceDisplay();
        
        // Update charts
        if (equityChart) {
            const activePeriod = document.querySelector('.period-btn.active')?.getAttribute('data-period') || '7d';
            equityChart.data = getEquityData(activePeriod);
            equityChart.update();
        }
        
        closeEditBalanceModal();
        showToast('Starting balance updated successfully!', 'success');
    } catch (error) {
        console.error('Error updating balance:', error);
        showToast('Error updating balance', 'error');
    }
}

// ===== PDF EXPORT FUNCTIONS =====
function generatePDF({ title, content, filename }) {
    try {
        // Create a simple text-based PDF
        const blob = new Blob([`${title}\n\nGenerated: ${new Date().toLocaleDateString()}\n\n${content}`], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast(`PDF "${filename}" downloaded successfully!`, 'success');
    } catch (error) {
        console.error('Error generating PDF:', error);
        showToast('Error generating PDF. Please try again.', 'error');
    }
}

function downloadTodayStats() {
    const today = new Date().toISOString().split('T')[0];
    const todayTrades = trades.filter(t => t.date === today);
    const todayPnl = todayTrades.reduce((sum, t) => sum + t.pnl, 0);
    
    const content = `
ACCOUNT SUMMARY:
Current Balance: ${formatCurrency(accountBalance)}
Starting Balance: ${formatCurrency(startingBalance)}
Today's P&L: ${formatCurrencyWithSign(todayPnl)}
Today's Trades: ${todayTrades.length}/4

TRADES TODAY:
${todayTrades.length > 0 ? todayTrades.map(t => `
Trade ${t.tradeNumber} (${t.time}):
Pair: ${t.pair}
Strategy: ${t.strategy}
P&L: ${formatCurrencyWithSign(t.pnl)}
Notes: ${t.notes || 'No notes'}
`).join('\n') : 'No trades recorded today.'}

PERFORMANCE METRICS:
Winning Trades: ${todayTrades.filter(t => t.pnl > 0).length}
Losing Trades: ${todayTrades.filter(t => t.pnl < 0).length}
Break Even: ${todayTrades.filter(t => t.pnl === 0).length}
Win Rate: ${todayTrades.length > 0 ? ((todayTrades.filter(t => t.pnl > 0).length / todayTrades.length) * 100).toFixed(1) : 0}%
    `;
    
    generatePDF({
        title: `Today's Trading Stats - ${today}`,
        content: content,
        filename: `today-stats-${today}.txt`
    });
}

function downloadWeeklyStats() {
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
    const weeklyTrades = trades.filter(t => t.date >= weekAgo);
    const weeklyPnl = weeklyTrades.reduce((sum, t) => sum + t.pnl, 0);
    
    const content = `
WEEKLY REPORT (Last 7 Days)
Period: ${weekAgo} to ${new Date().toISOString().split('T')[0]}

ACCOUNT PERFORMANCE:
Current Balance: ${formatCurrency(accountBalance)}
Starting Balance: ${formatCurrency(startingBalance)}
Weekly P&L: ${formatCurrencyWithSign(weeklyPnl)}
Total Trades: ${weeklyTrades.length}

WEEKLY TRADES:
${weeklyTrades.length > 0 ? weeklyTrades.map(t => `
${t.date} ${t.time} - Trade ${t.tradeNumber}:
Pair: ${t.pair}
Strategy: ${t.strategy}
P&L: ${formatCurrencyWithSign(t.pnl)}
Status: ${t.pnl >= 0 ? 'WIN' : 'LOSS'}
`).join('\n') : 'No trades recorded this week.'}

WEEKLY METRICS:
Winning Trades: ${weeklyTrades.filter(t => t.pnl > 0).length}
Losing Trades: ${weeklyTrades.filter(t => t.pnl < 0).length}
Win Rate: ${weeklyTrades.length > 0 ? ((weeklyTrades.filter(t => t.pnl > 0).length / weeklyTrades.length) * 100).toFixed(1) : 0}%
Average Daily P&L: ${weeklyTrades.length > 0 ? formatCurrency(weeklyPnl / 7) : '$0.00'}
    `;
    
    generatePDF({
        title: 'Weekly Trading Performance Report',
        content: content,
        filename: `weekly-stats-${new Date().toISOString().split('T')[0]}.txt`
    });
}

function downloadMonthlyStats() {
    const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
    const monthlyTrades = trades.filter(t => t.date >= monthAgo);
    const monthlyPnl = monthlyTrades.reduce((sum, t) => sum + t.pnl, 0);
    
    const content = `
MONTHLY REPORT (Last 30 Days)
Period: ${monthAgo} to ${new Date().toISOString().split('T')[0]}

ACCOUNT PERFORMANCE:
Current Balance: ${formatCurrency(accountBalance)}
Starting Balance: ${formatCurrency(startingBalance)}
Monthly P&L: ${formatCurrencyWithSign(monthlyPnl)}
Total Growth: ${formatCurrency(accountBalance - startingBalance)}
Growth %: ${((accountBalance - startingBalance) / startingBalance * 100).toFixed(1)}%
Total Trades: ${monthlyTrades.length}

TRADE SUMMARY:
Winning Trades: ${monthlyTrades.filter(t => t.pnl > 0).length}
Losing Trades: ${monthlyTrades.filter(t => t.pnl < 0).length}
Win Rate: ${monthlyTrades.length > 0 ? ((monthlyTrades.filter(t => t.pnl > 0).length / monthlyTrades.length) * 100).toFixed(1) : 0}%
Total Profit: ${formatCurrency(monthlyTrades.filter(t => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0))}
Total Loss: ${formatCurrency(Math.abs(monthlyTrades.filter(t => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0)))}

RECENT TRADES (Last 10):
${monthlyTrades.slice(0, 10).map(t => `
${t.date} ${t.time} - Trade ${t.tradeNumber}:
${t.pair} | ${t.strategy} | P&L: ${formatCurrencyWithSign(t.pnl)}
`).join('\n')}

${monthlyTrades.length > 10 ? `... and ${monthlyTrades.length - 10} more trades` : ''}
    `;
    
    generatePDF({
        title: 'Monthly Trading Performance Report',
        content: content,
        filename: `monthly-stats-${new Date().toISOString().split('T')[0]}.txt`
    });
}

function downloadTradePDF(trade) {
    const content = `
TRADE DETAILS:
Date: ${formatDate(trade.date)}
Time: ${trade.time}
Trade Number: ${trade.tradeNumber}
Currency Pair: ${trade.pair}
Strategy: ${trade.strategy}
P&L: ${formatCurrencyWithSign(trade.pnl)}
Notes: ${trade.notes}

ACCOUNT INFORMATION:
Current Balance: ${formatCurrency(accountBalance)}
Starting Balance: ${formatCurrency(startingBalance)}
Total Growth: ${formatCurrency(accountBalance - startingBalance)}
Growth %: ${((accountBalance - startingBalance) / startingBalance * 100).toFixed(1)}%

PERFORMANCE SUMMARY:
Total Trades: ${trades.length}
Winning Trades: ${trades.filter(t => t.pnl > 0).length}
Losing Trades: ${trades.filter(t => t.pnl < 0).length}
Win Rate: ${trades.length > 0 ? ((trades.filter(t => t.pnl > 0).length / trades.length) * 100).toFixed(1) : 0}%

TRADE ANALYSIS:
This trade represents ${Math.abs((trade.pnl / accountBalance) * 100).toFixed(2)}% of current account balance.
${trade.pnl >= 0 ? 'Successful trade!' : 'Learning opportunity - review what happened.'}
    `;
    
    generatePDF({
        title: `Trade Details - ${trade.pair} - ${formatDate(trade.date)}`,
        content: content,
        filename: `trade-${trade.id}-${trade.date}.txt`
    });
}

function exportJournalPDF() {
    const winningTrades = trades.filter(t => t.pnl > 0);
    const losingTrades = trades.filter(t => t.pnl < 0);
    const winRate = trades.length > 0 ? (winningTrades.length / trades.length * 100).toFixed(1) : 0;
    
    const content = `
COMPLETE TRADING JOURNAL

ACCOUNT SUMMARY:
Current Balance: ${formatCurrency(accountBalance)}
Starting Balance: ${formatCurrency(startingBalance)}
Total Growth: ${formatCurrency(accountBalance - startingBalance)}
Growth %: ${((accountBalance - startingBalance) / startingBalance * 100).toFixed(1)}%
Total Trades: ${trades.length}

PERFORMANCE METRICS:
Winning Trades: ${winningTrades.length}
Losing Trades: ${losingTrades.length}
Break Even Trades: ${trades.filter(t => t.pnl === 0).length}
Win Rate: ${winRate}%
Total Profit: ${formatCurrency(winningTrades.reduce((sum, t) => sum + t.pnl, 0))}
Total Loss: ${formatCurrency(Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0)))}
Net Profit: ${formatCurrency(trades.reduce((sum, t) => sum + t.pnl, 0))}
Profit Factor: ${losingTrades.reduce((sum, t) => sum + t.pnl, 0) !== 0 ? 
    (winningTrades.reduce((sum, t) => sum + t.pnl, 0) / Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0))).toFixed(2) : 'N/A'}

ALL TRADES (${trades.length} Total):
${trades.map(t => `
${t.date} ${t.time} | Trade ${t.tradeNumber} | ${t.pair} | ${t.strategy} | 
P&L: ${formatCurrencyWithSign(t.pnl)} | Notes: ${t.notes || 'No notes'}
`).join('\n')}

JOURNAL NOTES:
Generated on: ${new Date().toLocaleDateString()}
This journal contains your complete trading history.
Review regularly to identify patterns and improve performance.
    `;
    
    generatePDF({
        title: 'Complete Trading Journal - All Trades',
        content: content,
        filename: `trading-journal-${new Date().toISOString().split('T')[0]}.txt`
    });
}

function exportAnalyticsPDF() {
    const winningTrades = trades.filter(t => t.pnl > 0);
    const losingTrades = trades.filter(t => t.pnl < 0);
    const totalProfit = winningTrades.reduce((sum, t) => sum + t.pnl, 0);
    const totalLoss = Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0));
    const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? 999 : 0;
    const winRate = trades.length > 0 ? (winningTrades.length / trades.length * 100).toFixed(1) : 0;
    
    const content = `
TRADING ANALYTICS REPORT

PERFORMANCE OVERVIEW:
Total Trades: ${trades.length}
Winning Trades: ${winningTrades.length}
Losing Trades: ${losingTrades.length}
Win Rate: ${winRate}%
Profit Factor: ${profitFactor.toFixed(2)}

PROFIT ANALYSIS:
Total Profit: ${formatCurrency(totalProfit)}
Total Loss: ${formatCurrency(totalLoss)}
Net Profit: ${formatCurrency(totalProfit - totalLoss)}
Average Win: ${formatCurrency(winningTrades.length > 0 ? totalProfit / winningTrades.length : 0)}
Average Loss: ${formatCurrency(losingTrades.length > 0 ? totalLoss / losingTrades.length : 0)}
Win/Loss Ratio: ${losingTrades.length > 0 && totalLoss > 0 ? (totalProfit / winningTrades.length) / (totalLoss / losingTrades.length) : 'N/A'}

ACCOUNT GROWTH:
Starting Balance: ${formatCurrency(startingBalance)}
Current Balance: ${formatCurrency(accountBalance)}
Total Growth: ${formatCurrency(accountBalance - startingBalance)}
Growth %: ${((accountBalance - startingBalance) / startingBalance * 100).toFixed(1)}%

RECOMMENDATIONS:
1. ${trades.length < 10 ? 'Need more trades for accurate analysis (minimum 10 trades recommended)' : 'Sufficient trade history for analysis'}
2. ${winRate < 40 ? 'Focus on improving win rate through better trade selection' : 'Good win rate! Maintain consistency'}
3. ${profitFactor < 1.5 ? 'Work on improving profit factor through better risk management' : 'Good profit factor!'}
    `;
    
    generatePDF({
        title: 'Trading Analytics Report',
        content: content,
        filename: `analytics-report-${new Date().toISOString().split('T')[0]}.txt`
    });
}

function exportNotebookPDF() {
    const content = `
TRADING DREAMS NOTEBOOK

DREAM STATISTICS:
Total Dreams: ${dreams.length}
First Dream: ${dreams.length > 0 ? formatDate(dreams[dreams.length - 1].date) : 'N/A'}
Latest Dream: ${dreams.length > 0 ? formatDate(dreams[0].date) : 'N/A'}

ALL DREAMS:
${dreams.map(d => `
${formatDate(d.date)}:
${d.content}

`).join('\n')}

DREAM ANALYSIS:
Dreams are powerful tools for manifesting trading success.
Review these regularly to stay aligned with your goals.
Use these dreams as motivation during challenging times.
    `;
    
    generatePDF({
        title: 'Trading Dreams Notebook',
        content: content,
        filename: `dreams-notebook-${new Date().toISOString().split('T')[0]}.txt`
    });
}

function exportAllDataPDF() {
    const winningTrades = trades.filter(t => t.pnl > 0);
    const losingTrades = trades.filter(t => t.pnl < 0);
    const winRate = trades.length > 0 ? (winningTrades.length / trades.length * 100).toFixed(1) : 0;
    
    const content = `
COMPLETE TRADING DATA EXPORT

ACCOUNT INFORMATION:
Current Balance: ${formatCurrency(accountBalance)}
Starting Balance: ${formatCurrency(startingBalance)}
Total Growth: ${formatCurrency(accountBalance - startingBalance)}
Growth %: ${((accountBalance - startingBalance) / startingBalance * 100).toFixed(1)}%

PERFORMANCE SUMMARY:
Total Trades: ${trades.length}
Winning Trades: ${winningTrades.length}
Losing Trades: ${losingTrades.length}
Win Rate: ${winRate}%
Total Profit: ${formatCurrency(winningTrades.reduce((sum, t) => sum + t.pnl, 0))}
Total Loss: ${formatCurrency(Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0)))}
Net Profit: ${formatCurrency(trades.reduce((sum, t) => sum + t.pnl, 0))}

ALL TRADES:
${trades.map(t => `
${t.date} ${t.time} | Trade ${t.tradeNumber} | ${t.pair} | ${t.strategy} | 
P&L: ${formatCurrencyWithSign(t.pnl)} | Notes: ${t.notes || 'No notes'}
`).join('\n')}

TRADING DREAMS (${dreams.length} Total):
${dreams.map(d => `
${formatDate(d.date)}: ${d.content}
`).join('\n')}

EXPORT DETAILS:
Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
Total Records: ${trades.length + dreams.length}
File Format: TXT
Software: FX Miko Trading Dashboard

IMPORTANT NOTES:
This is your complete trading data. Keep this file safe.
You can import this data back into the system if needed.
Regular backups are recommended for data security.
    `;
    
    generatePDF({
        title: 'Complete Trading Data Backup',
        content: content,
        filename: `complete-trading-data-${new Date().toISOString().split('T')[0]}.txt`
    });
}

function exportDashboardPDF() {
    const today = new Date().toISOString().split('T')[0];
    const todayTrades = trades.filter(t => t.date === today);
    const todayPnl = todayTrades.reduce((sum, t) => sum + t.pnl, 0);
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
    const weeklyTrades = trades.filter(t => t.date >= weekAgo);
    const weeklyPnl = weeklyTrades.reduce((sum, t) => sum + t.pnl, 0);
    const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
    const monthlyTrades = trades.filter(t => t.date >= monthAgo);
    const monthlyPnl = monthlyTrades.reduce((sum, t) => sum + t.pnl, 0);
    
    const content = `
PROFESSIONAL TRADING DASHBOARD REPORT

DASHBOARD SNAPSHOT:
Report Date: ${new Date().toLocaleDateString()}
Account Name: ${JSON.parse(localStorage.getItem('fxMikoCurrentUser') || '{}').name || 'Trader'}
Trading Period: Active

ACCOUNT OVERVIEW:
Current Balance: ${formatCurrency(accountBalance)}
Starting Balance: ${formatCurrency(startingBalance)}
Total Growth: ${formatCurrency(accountBalance - startingBalance)}
Growth %: ${((accountBalance - startingBalance) / startingBalance * 100).toFixed(1)}%

DAILY PERFORMANCE:
Today's P&L: ${formatCurrencyWithSign(todayPnl)}
Today's Trades: ${todayTrades.length}/4
Daily Target Progress: ${(todayTrades.length / 4 * 100).toFixed(0)}%

WEEKLY PERFORMANCE:
Weekly P&L: ${formatCurrencyWithSign(weeklyPnl)}
Weekly Trades: ${weeklyTrades.length}
Average Daily P&L: ${weeklyTrades.length > 0 ? formatCurrency(weeklyPnl / 7) : '$0.00'}

MONTHLY PERFORMANCE:
Monthly P&L: ${formatCurrencyWithSign(monthlyPnl)}
Monthly Trades: ${monthlyTrades.length}
Average Daily P&L: ${monthlyTrades.length > 0 ? formatCurrency(monthlyPnl / 30) : '$0.00'}

TRADING METRICS:
Total Trades: ${trades.length}
Win Rate: ${trades.length > 0 ? ((trades.filter(t => t.pnl > 0).length / trades.length) * 100).toFixed(1) : 0}%
Profit Factor: ${getProfitFactor().toFixed(2)}
Best Trade: ${trades.length > 0 ? formatCurrency(Math.max(...trades.map(t => t.pnl))) : 'N/A'}
Worst Trade: ${trades.length > 0 ? formatCurrency(Math.min(...trades.map(t => t.pnl))) : 'N/A'}

RECENT ACTIVITY:
Last 5 Trades:
${trades.slice(0, 5).map((t, i) => `${i+1}. ${t.date} ${t.time} - ${t.pair} - ${formatCurrencyWithSign(t.pnl)}`).join('\n')}

RECOMMENDATIONS:
1. ${todayTrades.length < 4 ? 'You have trades remaining for today. Consider your strategy.' : 'Daily trade limit reached. Good discipline!'}
2. ${weeklyPnl < 0 ? 'Weekly performance negative. Review recent trades for improvement.' : 'Weekly performance positive. Keep it up!'}
3. ${trades.length < 20 ? 'Build more trading history for better analytics.' : 'Good trading history established.'}

DASHBOARD SUMMARY:
This report generated from your FX Miko Trading Dashboard.
Review regularly to track progress and improve performance.
    `;
    
    generatePDF({
        title: 'Trading Dashboard Report',
        content: content,
        filename: `dashboard-report-${new Date().toISOString().split('T')[0]}.txt`
    });
}

function getProfitFactor() {
    const totalProfit = trades.filter(t => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0);
    const totalLoss = Math.abs(trades.filter(t => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0));
    return totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? 999 : 0;
}

// ===== HELPER FUNCTIONS =====
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(amount);
}

function formatCurrencyWithSign(amount) {
    const sign = amount >= 0 ? '+' : '';
    return `${sign}${formatCurrency(amount)}`;
}

function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    } catch (error) {
        return dateString;
    }
}

function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function showModal(content) {
    const modal = document.getElementById('modal');
    if (!modal) return;
    
    modal.innerHTML = content;
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) modal.style.display = 'none';
}

function setTheme(theme) {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${theme}-theme`);
    localStorage.setItem('fxMikoTheme', theme);
    
    // Update theme buttons
    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach(btn => {
        if (btn.textContent.includes(theme === 'dark' ? 'Dark' : 'Light')) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function toggleTheme() {
    const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    showToast(`Theme changed to ${newTheme} mode`, 'success');
}

// ===== PAGE NAVIGATION =====
function setupPageNavigation() {
    // Sidebar menu items
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Hide all pages
            pages.forEach(page => page.classList.remove('active'));
            
            // Show selected page
            const pageId = this.getAttribute('data-page');
            const selectedPage = document.getElementById(pageId);
            if (selectedPage) {
                selectedPage.classList.add('active');
            }
            
            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                document.getElementById('sidebar').classList.remove('active');
            }
        });
    });
}

// ===== EVENT LISTENERS SETUP =====
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Menu toggle
    const menuBtn = document.getElementById('menuBtn');
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.classList.toggle('active');
            }
        });
    }
    
    // Setup page navigation
    setupPageNavigation();
    
    // Strategy selection
    const strategySelect = document.getElementById('strategy');
    if (strategySelect) {
        strategySelect.addEventListener('change', showCustomStrategy);
    }
    
    // Trade submission
    const saveTradeBtn = document.getElementById('saveTradeBtn');
    if (saveTradeBtn) {
        saveTradeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            saveTrade();
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                // Clear current user session
                localStorage.removeItem('fxMikoCurrentUser');
                // Redirect to login page
                window.location.href = 'index.html';
            }
        });
    }
    
    // Period buttons for charts
    const periodButtons = document.querySelectorAll('.period-btn');
    periodButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            periodButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update equity chart with selected period
            if (equityChart) {
                const period = this.getAttribute('data-period');
                equityChart.data = getEquityData(period);
                equityChart.update();
            }
        });
    });
    
    // Calendar navigation
    const prevMonthBtn = document.querySelector('.calendar-controls button:first-child');
    const nextMonthBtn = document.querySelector('.calendar-controls button:last-child');
    
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => changeCalendarMonth(-1));
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => changeCalendarMonth(1));
    }
    
    // Edit trades modal
    const closeEditTradesModalBtn = document.getElementById('closeEditTradesModal');
    if (closeEditTradesModalBtn) {
        closeEditTradesModalBtn.addEventListener('click', closeEditTradesModal);
    }
    
    const saveEditedTradesBtn = document.getElementById('saveEditedTradesBtn');
    if (saveEditedTradesBtn) {
        saveEditedTradesBtn.addEventListener('click', saveEditedTrades);
    }
    
    // Close modals when clicking outside
    const modals = ['modal', 'editBalanceModal', 'editTradesModal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    if (modalId === 'editBalanceModal') closeEditBalanceModal();
                    else if (modalId === 'editTradesModal') closeEditTradesModal();
                    else closeModal();
                }
            });
        }
    });
    
    console.log('Event listeners setup complete');
}

// ===== CLEAR ALL DATA =====
function clearAllData() {
    if (confirm('Are you sure you want to clear ALL data? This action cannot be undone!')) {
        try {
            // Clear all data
            trades = [];
            dreams = [];
            startingBalance = 10000;
            accountBalance = 10000;
            
            // Clear localStorage
            localStorage.removeItem('fxMikoTrades');
            localStorage.removeItem('fxMikoDreams');
            localStorage.removeItem('fxMikoAccountBalance');
            localStorage.removeItem('fxMikoStartingBalance');
            
            // Save fresh data
            saveTrades();
            saveDreams();
            saveAccountBalance();
            
            // Update UI
            updateAccountBalanceDisplay();
            updateRecentTrades();
            updateAllTrades();
            updateStats();
            updateTradeLists();
            updateDreamsList();
            updateCalendar();
            
            // Reset charts
            if (equityChart) {
                equityChart.data = getEquityData('7d');
                equityChart.update();
            }
            
            if (winRateChart) {
                winRateChart.data = getWinRateData();
                winRateChart.update();
            }
            
            showToast('All data cleared successfully!', 'success');
        } catch (error) {
            console.error('Error clearing data:', error);
            showToast('Error clearing data', 'error');
        }
    }
}

// ===== GLOBAL FUNCTIONS =====
// Make functions available globally for HTML onclick attributes
window.saveTrade = saveTrade;
window.saveAndDownloadTrade = saveAndDownloadTrade;
window.editTrade = editTrade;
window.deleteTrade = deleteTrade;
window.saveDream = saveDream;
window.clearDream = clearDream;
window.editDream = editDream;
window.deleteDream = deleteDream;
window.editTodayTrades = editTodayTrades;
window.closeEditTradesModal = closeEditTradesModal;
window.saveEditedTrades = saveEditedTrades;
window.editStartingBalance = editStartingBalance;
window.saveStartingBalance = saveStartingBalance;
window.cancelStartingBalanceEdit = cancelStartingBalanceEdit;
window.openEditBalanceModal = openEditBalanceModal;
window.closeEditBalanceModal = closeEditBalanceModal;
window.confirmBalanceUpdate = confirmBalanceUpdate;
window.changeCalendarMonth = changeCalendarMonth;
window.viewDayTrades = viewDayTrades;
window.closeModal = closeModal;
window.showCustomStrategy = showCustomStrategy;
window.toggleTheme = toggleTheme;
window.setTheme = setTheme;
window.downloadTodayStats = downloadTodayStats;
window.downloadWeeklyStats = downloadWeeklyStats;
window.downloadMonthlyStats = downloadMonthlyStats;
window.downloadTradePDF = downloadTradePDF;
window.exportJournalPDF = exportJournalPDF;
window.exportAnalyticsPDF = exportAnalyticsPDF;
window.exportNotebookPDF = exportNotebookPDF;
window.exportAllDataPDF = exportAllDataPDF;
window.exportDashboardPDF = exportDashboardPDF;
window.clearAllData = clearAllData;

console.log('FX Miko Trading Dashboard loaded successfully!');
