"""
Tests for Hydra Layer 2
"""

import pytest
import asyncio
from src.hydra_layer2 import HydraLayer2, HydraHead


class TestHydraHeadModel:
    """Test Hydra Head model"""
    
    def test_hydra_head_creation(self):
        """Test creating a Hydra head instance"""
        participants = ["addr1", "addr2", "addr3"]
        head = HydraHead("test-head-001", participants)
        
        assert head.head_id == "test-head-001"
        assert head.participants == participants
        assert head.status == "initializing"
        assert len(head.utxos) == 0
        assert len(head.transactions) == 0
    
    def test_hydra_head_to_dict(self):
        """Test converting head to dictionary"""
        head = HydraHead("test-head-001", ["addr1", "addr2"])
        head_dict = head.to_dict()
        
        assert head_dict["head_id"] == "test-head-001"
        assert head_dict["participants"] == ["addr1", "addr2"]
        assert head_dict["status"] == "initializing"
        assert "created_at" in head_dict


class TestHydraLayer2Initialization:
    """Test Hydra Layer 2 initialization"""
    
    def test_init_with_defaults(self):
        """Test initialization with default parameters"""
        hydra = HydraLayer2()
        
        assert hydra.hydra_node_url == "http://localhost:4001"
        assert hydra.cardano_node_socket == "/tmp/cardano-node.socket"
        assert len(hydra.heads) == 0
    
    def test_init_with_custom_params(self):
        """Test initialization with custom parameters"""
        hydra = HydraLayer2(
            hydra_node_url="http://custom:5001",
            cardano_node_socket="/custom/socket"
        )
        
        assert hydra.hydra_node_url == "http://custom:5001"
        assert hydra.cardano_node_socket == "/custom/socket"
    
    @pytest.mark.asyncio
    async def test_initialize_session(self):
        """Test HTTP session initialization"""
        hydra = HydraLayer2()
        
        await hydra.initialize()
        assert hydra.session is not None
        
        await hydra.cleanup()
        assert hydra.session is None


class TestHydraHeadLifecycle:
    """Test Hydra head lifecycle management"""
    
    @pytest.mark.asyncio
    async def test_create_head(self):
        """Test creating a Hydra head"""
        hydra = HydraLayer2()
        participants = ["addr1", "addr2", "addr3"]
        
        head_id = await hydra.create_head(participants)
        
        assert head_id.startswith("hydra-head-")
        assert head_id in hydra.heads
        assert hydra.heads[head_id].participants == participants
        assert hydra.heads[head_id].status == "initialized"
        
        await hydra.cleanup()
    
    @pytest.mark.asyncio
    async def test_create_head_with_utxos(self):
        """Test creating head with initial UTXOs"""
        hydra = HydraLayer2()
        participants = ["addr1", "addr2"]
        initial_utxos = {"utxo1": {"value": 1000}}
        
        head_id = await hydra.create_head(participants, initial_utxos)
        
        assert hydra.heads[head_id].utxos == initial_utxos
        
        await hydra.cleanup()
    
    @pytest.mark.asyncio
    async def test_open_head(self):
        """Test opening a Hydra head"""
        hydra = HydraLayer2()
        participants = ["addr1", "addr2"]
        
        head_id = await hydra.create_head(participants)
        success = await hydra.open_head(head_id)
        
        assert success is True
        assert hydra.heads[head_id].status == "open"
        
        await hydra.cleanup()
    
    @pytest.mark.asyncio
    async def test_open_nonexistent_head(self):
        """Test opening a head that doesn't exist"""
        hydra = HydraLayer2()
        
        with pytest.raises(ValueError, match="Head not found"):
            await hydra.open_head("nonexistent-head")
        
        await hydra.cleanup()
    
    @pytest.mark.asyncio
    async def test_close_head(self):
        """Test closing a Hydra head"""
        hydra = HydraLayer2()
        participants = ["addr1", "addr2"]
        
        head_id = await hydra.create_head(participants)
        await hydra.open_head(head_id)
        
        result = await hydra.close_head(head_id)
        
        assert result["status"] == "settled"
        assert result["head_id"] == head_id
        assert "settlement_tx" in result
        assert hydra.heads[head_id].status == "closed"
        
        await hydra.cleanup()


class TestHydraTransactions:
    """Test Hydra transaction processing"""
    
    @pytest.mark.asyncio
    async def test_submit_transaction(self):
        """Test submitting transaction to Hydra head"""
        hydra = HydraLayer2()
        participants = ["addr1", "addr2"]
        
        head_id = await hydra.create_head(participants)
        await hydra.open_head(head_id)
        
        transaction = {"from": "addr1", "to": "addr2", "amount": 100}
        result = await hydra.submit_transaction(head_id, transaction)
        
        assert result["status"] == "confirmed"
        assert result["head_id"] == head_id
        assert "tx_id" in result
        assert result["confirmation_time"] == "instant"
        
        # Verify transaction was recorded
        assert len(hydra.heads[head_id].transactions) == 1
        
        await hydra.cleanup()
    
    @pytest.mark.asyncio
    async def test_submit_to_closed_head(self):
        """Test submitting transaction to closed head fails"""
        hydra = HydraLayer2()
        participants = ["addr1", "addr2"]
        
        head_id = await hydra.create_head(participants)
        # Don't open the head
        
        transaction = {"from": "addr1", "to": "addr2", "amount": 100}
        
        with pytest.raises(ValueError, match="Head not open"):
            await hydra.submit_transaction(head_id, transaction)
        
        await hydra.cleanup()
    
    @pytest.mark.asyncio
    async def test_multiple_transactions(self):
        """Test submitting multiple transactions"""
        hydra = HydraLayer2()
        participants = ["addr1", "addr2", "addr3"]
        
        head_id = await hydra.create_head(participants)
        await hydra.open_head(head_id)
        
        # Submit 5 transactions
        for i in range(5):
            tx = {"from": "addr1", "to": "addr2", "amount": 100 + i}
            await hydra.submit_transaction(head_id, tx)
        
        assert len(hydra.heads[head_id].transactions) == 5
        
        await hydra.cleanup()


class TestHydraQueries:
    """Test Hydra query operations"""
    
    @pytest.mark.asyncio
    async def test_get_head_status(self):
        """Test getting head status"""
        hydra = HydraLayer2()
        participants = ["addr1", "addr2"]
        
        head_id = await hydra.create_head(participants)
        status = await hydra.get_head_status(head_id)
        
        assert status["head_id"] == head_id
        assert status["participants"] == participants
        assert status["status"] == "initialized"
        
        await hydra.cleanup()
    
    @pytest.mark.asyncio
    async def test_get_head_utxos(self):
        """Test getting head UTXOs"""
        hydra = HydraLayer2()
        participants = ["addr1"]
        utxos = {"utxo1": {"value": 1000}}
        
        head_id = await hydra.create_head(participants, utxos)
        retrieved_utxos = await hydra.get_head_utxos(head_id)
        
        assert retrieved_utxos == utxos
        
        await hydra.cleanup()
    
    @pytest.mark.asyncio
    async def test_get_head_transactions(self):
        """Test getting head transactions"""
        hydra = HydraLayer2()
        participants = ["addr1", "addr2"]
        
        head_id = await hydra.create_head(participants)
        await hydra.open_head(head_id)
        
        # Submit transactions
        await hydra.submit_transaction(head_id, {"amount": 100})
        await hydra.submit_transaction(head_id, {"amount": 200})
        
        transactions = await hydra.get_head_transactions(head_id)
        
        assert len(transactions) == 2
        assert transactions[0]["transaction"]["amount"] == 100
        assert transactions[1]["transaction"]["amount"] == 200
        
        await hydra.cleanup()
    
    def test_list_heads(self):
        """Test listing all heads"""
        hydra = HydraLayer2()
        
        # Initially empty
        assert len(hydra.list_heads()) == 0
    
    @pytest.mark.asyncio
    async def test_list_multiple_heads(self):
        """Test listing multiple heads"""
        hydra = HydraLayer2()
        
        # Create 3 heads
        await hydra.create_head(["addr1", "addr2"])
        await hydra.create_head(["addr3", "addr4"])
        await hydra.create_head(["addr5", "addr6"])
        
        heads = hydra.list_heads()
        
        assert len(heads) == 3
        assert all("head_id" in head for head in heads)
        
        await hydra.cleanup()


class TestHydraMetrics:
    """Test Hydra metrics"""
    
    @pytest.mark.asyncio
    async def test_get_metrics_empty(self):
        """Test metrics with no heads"""
        hydra = HydraLayer2()
        metrics = hydra.get_metrics()
        
        assert metrics["total_heads"] == 0
        assert metrics["open_heads"] == 0
        assert metrics["total_transactions"] == 0
        
        await hydra.cleanup()
    
    @pytest.mark.asyncio
    async def test_get_metrics_with_heads(self):
        """Test metrics with active heads"""
        hydra = HydraLayer2()
        
        # Create and open 2 heads
        head1 = await hydra.create_head(["addr1", "addr2"])
        head2 = await hydra.create_head(["addr3", "addr4"])
        
        await hydra.open_head(head1)
        await hydra.open_head(head2)
        
        # Add transactions
        await hydra.submit_transaction(head1, {"amount": 100})
        await hydra.submit_transaction(head1, {"amount": 200})
        await hydra.submit_transaction(head2, {"amount": 300})
        
        metrics = hydra.get_metrics()
        
        assert metrics["total_heads"] == 2
        assert metrics["open_heads"] == 2
        assert metrics["total_transactions"] == 3
        assert metrics["average_tx_per_head"] == 1.5
        
        await hydra.cleanup()


class TestHydraTransactionRouting:
    """Test transaction routing"""
    
    @pytest.mark.asyncio
    async def test_route_transaction_least_loaded(self):
        """Test routing to least loaded head"""
        hydra = HydraLayer2()
        
        # Create 2 heads
        head1 = await hydra.create_head(["addr1", "addr2"])
        head2 = await hydra.create_head(["addr3", "addr4"])
        
        await hydra.open_head(head1)
        await hydra.open_head(head2)
        
        # Add transaction to head1
        await hydra.submit_transaction(head1, {"amount": 100})
        
        # Route new transaction (should go to head2 - least loaded)
        result = await hydra.route_transaction(
            {"amount": 200},
            routing_strategy="least_loaded"
        )
        
        assert result["selected_head"] == head2
        assert result["routing_strategy"] == "least_loaded"
        
        await hydra.cleanup()
    
    @pytest.mark.asyncio
    async def test_route_transaction_no_open_heads(self):
        """Test routing fails when no heads are open"""
        hydra = HydraLayer2()
        
        # Create head but don't open it
        await hydra.create_head(["addr1", "addr2"])
        
        with pytest.raises(ValueError, match="No open Hydra heads available"):
            await hydra.route_transaction({"amount": 100})
        
        await hydra.cleanup()


class TestHydraStatus:
    """Test Hydra status"""
    
    def test_get_status(self):
        """Test getting Hydra service status"""
        hydra = HydraLayer2()
        status = hydra.get_status()
        
        assert status["service"] == "Hydra Layer 2"
        assert "hydra_node_url" in status
        assert "heads" in status
        assert "metrics" in status


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
