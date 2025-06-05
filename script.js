// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');
  
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function() {
      nav.classList.toggle('active');
      this.querySelector('i').classList.toggle('fa-times');
      this.querySelector('i').classList.toggle('fa-bars');
    });
  }

  // Initialize animations
  animateElements();
  
  // Initialize swap functionality if on buy tokens page
  if (document.getElementById('connectWalletBtn')) {
    initSwapInterface();
  }
});

// Animate elements when they come into view
function animateElements() {
  const elements = document.querySelectorAll('.card, .token-card, .timeline-item');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('slide-up');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  elements.forEach(el => {
    observer.observe(el);
  });
}

// Swap Interface Functions
async function initSwapInterface() {
  // Load token info
  await loadTokenInfo();
  
  // Setup wallet connection
  setupWalletConnection();
  
  // Setup form interactions
  setupFormInteractions();
}

async function loadTokenInfo() {
  try {
    // Token details
    document.getElementById('vnstPrice').textContent = '0.09 USDT';
    document.getElementById('availableVNST').textContent = '992,007.70 VNST';
    document.getElementById('minBuyAmount').textContent = '100 VNST';
    document.getElementById('vnstContract').textContent = '0xF9Bbb00436B384b57A52D1DfeA8Ca43fC7F11527';
  } catch (error) {
    console.error('Error loading token info:', error);
    showMessage('Error loading token information', 'error');
  }
}

function setupWalletConnection() {
  const connectBtn = document.getElementById('connectWalletBtn');
  const walletOptions = document.getElementById('walletOptions');
  
  if (connectBtn) {
    connectBtn.addEventListener('click', function() {
      walletOptions.style.display = walletOptions.style.display === 'block' ? 'none' : 'block';
    });
  }
  
  // Setup wallet buttons
  const walletButtons = document.querySelectorAll('.wallet-btn');
  walletButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const walletType = this.getAttribute('data-wallet');
      connectWallet(walletType);
    });
  });
}

async function connectWallet(walletType) {
  try {
    // Check if Web3 is injected
    if (typeof window.ethereum === 'undefined') {
      showMessage('Please install MetaMask or another Web3 wallet', 'error');
      return;
    }

    // Request account access
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    
    // Display connected wallet
    document.getElementById('walletOptions').style.display = 'none';
    document.getElementById('walletConnected').style.display = 'block';
    document.getElementById('walletAddress').textContent = account;
    
    // Enable buttons
    document.getElementById('approveBtn').disabled = false;
    document.getElementById('buyBtn').disabled = true;
    
    // Listen for account changes
    window.ethereum.on('accountsChanged', (accounts) => {
      if (accounts.length === 0) {
        // Wallet disconnected
        document.getElementById('walletConnected').style.display = 'none';
        document.getElementById('approveBtn').disabled = true;
        document.getElementById('buyBtn').disabled = true;
      } else {
        // Account changed
        document.getElementById('walletAddress').textContent = accounts[0];
      }
    });
    
    showMessage(`Successfully connected with ${walletType}!`, 'success');
  } catch (error) {
    console.error('Wallet connection error:', error);
    showMessage('Failed to connect wallet: ' + error.message, 'error');
  }
}

function setupFormInteractions() {
  // VNST amount calculation
  const vnstAmountInput = document.getElementById('vnstAmount');
  if (vnstAmountInput) {
    vnstAmountInput.addEventListener('input', function() {
      const vnstAmount = parseFloat(this.value) || 0;
      const usdtAmount = vnstAmount * 0.09; // 0.09 USDT per VNST
      document.getElementById('usdtAmount').textContent = usdtAmount.toFixed(2);
      
      // Validate minimum amount
      if (vnstAmount >= 100) {
        document.getElementById('approveBtn').disabled = false;
      } else {
        document.getElementById('approveBtn').disabled = true;
        document.getElementById('buyBtn').disabled = true;
      }
    });
  }
  
  // Copy contract address
  const copyBtn = document.querySelector('.copy-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', copyContractAddress);
  }
  
  // Approve USDT button
  document.getElementById('approveBtn')?.addEventListener('click', async function() {
    const vnstAmount = parseFloat(document.getElementById('vnstAmount').value);
    if (!vnstAmount || vnstAmount < 100) {
      showMessage('Please enter a valid amount (minimum 100 VNST)', 'error');
      return;
    }
    
    try {
      showMessage('Approving USDT...', 'status');
      
      // Simulate approval (replace with actual contract call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      document.getElementById('approveBtn').disabled = true;
      document.getElementById('buyBtn').disabled = false;
      showMessage('USDT approved successfully!', 'success');
    } catch (error) {
      showMessage('Approval failed: ' + error.message, 'error');
    }
  });
  
  // Buy VNST button
  document.getElementById('buyBtn')?.addEventListener('click', async function() {
    const vnstAmount = parseFloat(document.getElementById('vnstAmount').value);
    if (!vnstAmount || vnstAmount < 100) {
      showMessage('Please enter a valid amount (minimum 100 VNST)', 'error');
      return;
    }
    
    if (!document.getElementById('walletAddress').textContent) {
      showMessage('Please connect your wallet first', 'error');
      return;
    }
    
    try {
      showMessage('Processing VNST purchase...', 'status');
      
      // Simulate purchase (replace with actual contract call)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      showMessage(`Successfully purchased ${vnstAmount} VNST tokens!`, 'success');
    } catch (error) {
      showMessage('Purchase failed: ' + error.message, 'error');
    }
  });
}

function copyContractAddress() {
  const contractAddress = '0xF9Bbb00436B384b57A52D1DfeA8Ca43fC7F11527';
  navigator.clipboard.writeText(contractAddress)
    .then(() => {
      const copyBtn = document.querySelector('.copy-btn');
      copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
      setTimeout(() => {
        copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Address';
      }, 2000);
    })
    .catch(err => {
      console.error('Failed to copy: ', err);
      showMessage('Failed to copy address', 'error');
    });
}

function showMessage(message, type) {
  const statusDiv = document.getElementById('statusMessages');
  if (!statusDiv) return;
  
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  messageElement.classList.add('message', `${type}-message`);
  statusDiv.appendChild(messageElement);
  
  setTimeout(() => {
    messageElement.remove();
  }, 5000);
}
