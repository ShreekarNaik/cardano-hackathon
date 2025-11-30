use cardano/transaction.{OutputReference, Transaction}

// Data Ingestion Datum
pub type DataDatum {
  data_hash: ByteArray,
  payment_amount: Int,
}

// Data Ingestion Redeemer
pub type DataRedeemer {
  Submit
  Claim
}

validator data_ingestion {
  spend(
    datum_opt: Option<DataDatum>,
    redeemer: DataRedeemer,
    _own_ref: OutputReference,
    _tx: Transaction,
  ) {
    when datum_opt is {
      Some(datum) ->
        when redeemer is {
          Submit -> datum.payment_amount > 0
          Claim -> True
        }
      None -> False
    }
  }

  else(_) {
    fail
  }
}
