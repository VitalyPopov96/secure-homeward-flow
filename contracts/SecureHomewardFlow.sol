// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract SecureHomewardFlow is SepoliaConfig {
    using FHE for *;
    
    struct RemittanceTransaction {
        euint32 transactionId;
        euint32 amount;
        euint32 fee;
        euint32 exchangeRate;
        bool isActive;
        bool isVerified;
        bool isCompleted;
        string recipientName;
        string recipientCountry;
        string purpose;
        address sender;
        address recipient;
        uint256 timestamp;
        uint256 completionTime;
    }
    
    struct ExchangeRate {
        euint32 rate;
        euint32 timestamp;
        bool isActive;
    }
    
    struct ComplianceCheck {
        euint32 checkId;
        bool isApproved;
        bool isKYCVerified;
        bool isAMLVerified;
        string complianceHash;
        address verifier;
        uint256 timestamp;
    }
    
    mapping(uint256 => RemittanceTransaction) public transactions;
    mapping(string => ExchangeRate) public exchangeRates;
    mapping(uint256 => ComplianceCheck) public complianceChecks;
    mapping(address => euint32) public userReputation;
    mapping(address => euint32) public transactionCount;
    
    uint256 public transactionCounter;
    uint256 public complianceCounter;
    
    address public owner;
    address public complianceVerifier;
    address public feeCollector;
    
    euint32 public totalVolume;
    euint32 public totalFees;
    
    event TransactionCreated(uint256 indexed transactionId, address indexed sender, string recipientCountry);
    event TransactionVerified(uint256 indexed transactionId, bool isVerified);
    event TransactionCompleted(uint256 indexed transactionId, address indexed recipient);
    event ExchangeRateUpdated(string indexed currencyPair, uint32 rate);
    event ComplianceCheckCompleted(uint256 indexed transactionId, bool isApproved);
    event ReputationUpdated(address indexed user, uint32 reputation);
    
    constructor(address _complianceVerifier, address _feeCollector) {
        owner = msg.sender;
        complianceVerifier = _complianceVerifier;
        feeCollector = _feeCollector;
    }
    
    function createRemittance(
        externalEuint32 amount,
        externalEuint32 fee,
        string memory recipientName,
        string memory recipientCountry,
        string memory purpose,
        address recipient,
        bytes calldata inputProof
    ) public payable returns (uint256) {
        require(bytes(recipientName).length > 0, "Recipient name cannot be empty");
        require(bytes(recipientCountry).length > 0, "Recipient country cannot be empty");
        require(recipient != address(0), "Invalid recipient address");
        require(msg.value > 0, "Must send ETH for transaction");
        
        uint256 transactionId = transactionCounter++;
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalAmount = FHE.fromExternal(amount, inputProof);
        euint32 internalFee = FHE.fromExternal(fee, inputProof);
        
        // Get current exchange rate for the currency pair
        string memory currencyPair = string(abi.encodePacked("ETH-", recipientCountry));
        euint32 currentRate = exchangeRates[currencyPair].rate;
        
        transactions[transactionId] = RemittanceTransaction({
            transactionId: FHE.asEuint32(0), // Will be set properly later
            amount: internalAmount,
            fee: internalFee,
            exchangeRate: currentRate,
            isActive: true,
            isVerified: false,
            isCompleted: false,
            recipientName: recipientName,
            recipientCountry: recipientCountry,
            purpose: purpose,
            sender: msg.sender,
            recipient: recipient,
            timestamp: block.timestamp,
            completionTime: 0
        });
        
        // Update user transaction count
        transactionCount[msg.sender] = FHE.add(transactionCount[msg.sender], FHE.asEuint32(1));
        
        // Update total volume and fees
        totalVolume = FHE.add(totalVolume, internalAmount);
        totalFees = FHE.add(totalFees, internalFee);
        
        emit TransactionCreated(transactionId, msg.sender, recipientCountry);
        return transactionId;
    }
    
    function verifyTransaction(uint256 transactionId, bool isVerified) public {
        require(msg.sender == complianceVerifier, "Only compliance verifier can verify");
        require(transactions[transactionId].sender != address(0), "Transaction does not exist");
        require(transactions[transactionId].isActive, "Transaction is not active");
        
        transactions[transactionId].isVerified = isVerified;
        
        // Create compliance check record
        uint256 checkId = complianceCounter++;
        complianceChecks[checkId] = ComplianceCheck({
            checkId: FHE.asEuint32(0), // Will be set properly later
            isApproved: isVerified,
            isKYCVerified: isVerified,
            isAMLVerified: isVerified,
            complianceHash: string(abi.encodePacked("check_", transactionId)),
            verifier: msg.sender,
            timestamp: block.timestamp
        });
        
        emit TransactionVerified(transactionId, isVerified);
        emit ComplianceCheckCompleted(transactionId, isVerified);
    }
    
    function completeTransaction(uint256 transactionId) public {
        require(transactions[transactionId].sender != address(0), "Transaction does not exist");
        require(transactions[transactionId].isActive, "Transaction is not active");
        require(transactions[transactionId].isVerified, "Transaction must be verified");
        require(msg.sender == transactions[transactionId].recipient, "Only recipient can complete");
        
        transactions[transactionId].isCompleted = true;
        transactions[transactionId].isActive = false;
        transactions[transactionId].completionTime = block.timestamp;
        
        // Update user reputation
        userReputation[msg.sender] = FHE.add(userReputation[msg.sender], FHE.asEuint32(10));
        userReputation[transactions[transactionId].sender] = FHE.add(userReputation[transactions[transactionId].sender], FHE.asEuint32(5));
        
        emit TransactionCompleted(transactionId, msg.sender);
    }
    
    function updateExchangeRate(
        string memory currencyPair,
        externalEuint32 rate,
        bytes calldata inputProof
    ) public {
        require(msg.sender == owner, "Only owner can update exchange rates");
        require(bytes(currencyPair).length > 0, "Currency pair cannot be empty");
        
        euint32 internalRate = FHE.fromExternal(rate, inputProof);
        
        exchangeRates[currencyPair] = ExchangeRate({
            rate: internalRate,
            timestamp: FHE.asEuint32(uint32(block.timestamp)),
            isActive: true
        });
        
        emit ExchangeRateUpdated(currencyPair, 0); // Rate will be decrypted off-chain
    }
    
    function updateUserReputation(address user, euint32 reputation) public {
        require(msg.sender == complianceVerifier, "Only compliance verifier can update reputation");
        require(user != address(0), "Invalid user address");
        
        userReputation[user] = reputation;
        emit ReputationUpdated(user, 0); // FHE.decrypt(reputation) - will be decrypted off-chain
    }
    
    function getTransactionInfo(uint256 transactionId) public view returns (
        string memory recipientName,
        string memory recipientCountry,
        string memory purpose,
        address sender,
        address recipient,
        uint8 amount,
        uint8 fee,
        uint8 exchangeRate,
        bool isActive,
        bool isVerified,
        bool isCompleted,
        uint256 timestamp,
        uint256 completionTime
    ) {
        RemittanceTransaction storage transaction = transactions[transactionId];
        return (
            transaction.recipientName,
            transaction.recipientCountry,
            transaction.purpose,
            transaction.sender,
            transaction.recipient,
            0, // FHE.decrypt(transaction.amount) - will be decrypted off-chain
            0, // FHE.decrypt(transaction.fee) - will be decrypted off-chain
            0, // FHE.decrypt(transaction.exchangeRate) - will be decrypted off-chain
            transaction.isActive,
            transaction.isVerified,
            transaction.isCompleted,
            transaction.timestamp,
            transaction.completionTime
        );
    }
    
    function getUserReputation(address user) public view returns (uint8) {
        return 0; // FHE.decrypt(userReputation[user]) - will be decrypted off-chain
    }
    
    function getUserTransactionCount(address user) public view returns (uint8) {
        return 0; // FHE.decrypt(transactionCount[user]) - will be decrypted off-chain
    }
    
    function getTotalVolume() public view returns (uint8) {
        return 0; // FHE.decrypt(totalVolume) - will be decrypted off-chain
    }
    
    function getTotalFees() public view returns (uint8) {
        return 0; // FHE.decrypt(totalFees) - will be decrypted off-chain
    }
    
    function withdrawFees() public {
        require(msg.sender == feeCollector, "Only fee collector can withdraw");
        require(address(this).balance > 0, "No fees to withdraw");
        
        uint256 balance = address(this).balance;
        payable(feeCollector).transfer(balance);
    }
    
    function emergencyPause() public {
        require(msg.sender == owner, "Only owner can pause");
        // Implementation for emergency pause functionality
    }
    
    function emergencyUnpause() public {
        require(msg.sender == owner, "Only owner can unpause");
        // Implementation for emergency unpause functionality
    }
}
