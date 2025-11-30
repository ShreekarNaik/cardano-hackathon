use cardano/transaction.{OutputReference, Transaction}

// Agent Registry Datum
pub type AgentDatum {
  agent_id: ByteArray,
  reputation: Int,
  stake_amount: Int,
}

// Agent Registry Redeemer
pub type AgentRedeemer {
  Register
  UpdateReputation { new_reputation: Int }
  Deregister
}

validator agent_registry {
  spend(
    datum_opt: Option<AgentDatum>,
    redeemer: AgentRedeemer,
    _own_ref: OutputReference,
    _tx: Transaction,
  ) {
    when datum_opt is {
      Some(datum) ->
        when redeemer is {
          Register -> datum.stake_amount >= 1_000_000
          UpdateReputation { new_reputation } ->
            new_reputation >= 0 && new_reputation <= 100
          Deregister -> True
        }
      None -> False
    }
  }

  else(_) {
    fail
  }
}
