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
  
  // Initialize wallet connection if on buy tokens page
  if (document.getElementById('connectWalletBtn')) {
    initWalletConnection();
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

// Wallet Connection Functions
function initWalletConnection() {
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
  
  // VNST amount calculation
  const vnstAmountInput = document.getElementById('vnstAmount');
  if (vnstAmountInput) {
    vnstAmountInput.addEventListener('input', function() {
      const vnstAmount = parseFloat(this.value) || 0;
      const usdtAmount = vnstAmount * 0.09; // 0.09 USDT per VNST
      document.getElementById('usdtAmount').textContent = usdtAmount.toFixed(2);
    });
  }
  
  // Copy contract address
  const copyBtn = document.querySelector('.copy-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', copyContractAddress);
  }
}

// Connect to wallet
async function connectWallet(walletType) {
  try {
    // Check if Web3 is injected
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask or another Web3 wallet');
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
    document.getElementById('buyBtn').disabled = false;
    
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
    
    alert(`Successfully connected with ${walletType}!`);
  } catch (error) {
    console.error('Wallet connection error:', error);
    alert('Failed to connect wallet: ' + error.message);
  }
}

// Copy contract address
function copyContractAddress() {
  const contractAddress = '0xF9Bbb00436B384b57A52D1DfeA8Ca43fC7F11527';
  navigator.clipboard.writeText(contractAddress)
    .then(() => {
      const copyBtn = document.querySelector('.copy-btn');
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = 'Copy Address';
      }, 2000);
    })
    .catch(err => console.error('Failed to copy: ', err));
}

// Buy VNST functionality
document.getElementById('approveBtn')?.addEventListener('click', function() {
  const vnstAmount = parseFloat(document.getElementById('vnstAmount').value);
  if (!vnstAmount || vnstAmount < 100) {
    alert('Please enter a valid amount (minimum 100 VNST)');
    return;
  }
  
  alert('USDT approval transaction initiated. Please confirm in your wallet.');
});

document.getElementById('buyBtn')?.addEventListener('click', function() {
  const vnstAmount = parseFloat(document.getElementById('vnstAmount').value);
  if (!vnstAmount || vnstAmount < 100) {
    alert('Please enter a valid amount (minimum 100 VNST)');
    return;
  }
  
  if (!document.getElementById('walletAddress').textContent) {
    alert('Please connect your wallet first');
    return;
  }
  
  alert(`Buying ${vnstAmount} VNST tokens. Please confirm the transaction in your wallet.`);
});

// GitHub swap integration
document.getElementById('githubSwapBtn')?.addEventListener('click', function() {
  // This would be replaced with actual GitHub swap integration
  alert('Connecting to GitHub swap repository...');
});
