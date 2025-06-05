// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
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
    const elements = document.querySelectorAll('.animated-image');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.8s ease-out';
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

function connectWallet(walletType) {
    // In a real implementation, this would connect to the actual wallet
    // For demo purposes, we'll simulate a connection
    document.getElementById('walletOptions').style.display = 'none';
    document.getElementById('walletConnected').style.display = 'block';
    
    // Generate a fake wallet address for demonstration
    const fakeAddress = '0x' + Math.random().toString(16).substr(2, 40);
    document.getElementById('walletAddress').textContent = fakeAddress;
    
    // Enable the purchase buttons
    document.getElementById('approveBtn').disabled = false;
    document.getElementById('buyBtn').disabled = false;
    
    alert(`Connected to ${walletType} wallet successfully!`);
}

function copyContractAddress() {
    const contractAddress = '0xF9Bbb00436B384b57A52D1DfeA8Ca43fC7F11527';
    navigator.clipboard.writeText(contractAddress)
        .then(() => alert('Contract address copied to clipboard!'))
        .catch(err => console.error('Failed to copy: ', err));
}

// Buy VNST functionality
document.getElementById('approveBtn')?.addEventListener('click', function() {
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
