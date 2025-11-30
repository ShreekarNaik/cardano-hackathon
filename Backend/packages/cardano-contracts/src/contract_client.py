"""
Real Cardano Smart Contract Client

Executes REAL transactions on Cardano blockchain using pycardano
"""

import os
import json
from pathlib import Path
from typing import Dict, Optional
from loguru import logger

try:
    from pycardano import (
        BlockFrostChainContext,
        TransactionBuilder,
        TransactionOutput,
        Address,
        PaymentSigningKey,
        PaymentVerificationKey,
        PlutusV2Script,
        plutus_script_hash,
        Redeemer,
        datum_hash
    )
    PYCARDANO_AVAILABLE = True
except ImportError:
    PYCARDANO_AVAILABLE = False
    logger.warning("pycardano not available - using simulation mode")


class RealCardanoContractClient:
    """
    Real Cardano Smart Contract Client
    
    Executes actual transactions on Cardano blockchain
    """
    
    def __init__(self, network: str = "local"):
        """
        Initialize with real Cardano connection
        
        Args:
            network: 'local', 'preprod', or 'mainnet'
        """
        self.network = network
        self.context = None
        
        if network == "local":
            # Connect to local Yaci DevKit
            self.api_url = os.getenv('CARDANO_NODE_URL', 'http://localhost:8080/api/v1')
        elif network == "preprod":
            # Connect to preprod testnet
            self.api_url = "https://cardano-preprod.blockfrost.io/api/v0"
        else:
            self.api_url = "https://cardano-mainnet.blockfrost.io/api/v0"
        
        logger.info(f"Real Cardano client initialized: {network}")
    
    def initialize_context(self, project_id: Optional[str] = None):
        """Initialize blockchain context"""
        if not PYCARDANO_AVAILABLE:
            logger.warning("pycardano not available")
            return
        
        try:
            if self.network == "local":
                # For local development
                self.context = BlockFrostChainContext(
                    project_id=project_id or "local",
                    base_url=self.api_url
                )
            else:
                # For testnet/mainnet
                self.context = BlockFrostChainContext(
                    project_id=project_id or os.getenv('BLOCKFROST_PROJECT_ID'),
                    base_url=self.api_url
                )
            logger.info("Blockchain context initialized")
        except Exception as e:
            logger.error(f"Failed to initialize context: {e}")
    
    def load_wallet(self) -> tuple:
        """Load wallet keys"""
        cardano_dir = Path.home() / "cardano" / "preprod"
        
        try:
            with open(cardano_dir / "payment.skey") as f:
                skey_data = json.load(f)
                payment_skey = PaymentSigningKey.from_cbor(
                    bytes.fromhex(skey_data['cborHex'])
                )
            
            payment_vkey = PaymentVerificationKey.from_signing_key(payment_skey)
            
            with open(cardano_dir / "payment.addr") as f:
                address = Address.from_primitive(f.read().strip())
            
            logger.info(f"Wallet loaded: {address}")
            return payment_skey, payment_vkey, address
            
        except Exception as e:
            logger.error(f"Failed to load wallet: {e}")
            return None, None, None
    
    def submit_to_contract(
        self,
        contract_addr: str,
        datum: Dict,
        redeemer: str,
        amount: int = 5_000_000
    ) -> Dict:
        """
        Submit REAL transaction to smart contract
        
        Args:
            contract_addr: Contract address
            datum: Datum for the contract
            redeemer: Redeemer action
            amount: Amount in lovelace
            
        Returns:
            Transaction result
        """
        logger.info(f"Submitting REAL transaction to contract: {contract_addr}")
        
        if not self.context:
            logger.warning("Context not initialized - using simulation")
            return {
                "status": "simulated",
                "txHash": f"sim-tx-{hash(str(datum))}"
            }
        
        try:
            payment_skey, payment_vkey, from_address = self.load_wallet()
            
            if not payment_skey:
                raise Exception("Wallet not loaded")
            
            # Build transaction
            builder = TransactionBuilder(self.context)
            builder.add_input_address(from_address)
            
            # Add output to contract
            builder.add_output(
                TransactionOutput(
                    Address.from_primitive(contract_addr),
                    amount
                )
            )
            
            # Sign and submit
            signed_tx = builder.build_and_sign(
                [payment_skey],
                change_address=from_address
            )
            
            tx_hash = self.context.submit_tx(signed_tx)
            
            logger.info(f"Real transaction submitted: {tx_hash}")
            
            return {
                "status": "submitted",
                "txHash": str(tx_hash),
                "network": self.network
            }
            
        except Exception as e:
            logger.error(f"Transaction failed: {e}")
            return {
                "status": "failed",
                "error": str(e)
            }
    
    def get_balance(self, address: Optional[str] = None) -> int:
        """Get wallet balance in lovelace"""
        if not self.context:
            return 0
        
        try:
            _, _, addr = self.load_wallet()
            if not addr:
                return 0
            
            utxos = self.context.utxos(addr)
            balance = sum(utxo.output.amount.coin for utxo in utxos)
            
            logger.info(f"Balance: {balance / 1_000_000} ADA")
            return balance
            
        except Exception as e:
            logger.error(f"Failed to get balance: {e}")
            return 0
