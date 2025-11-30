use cardano/transaction.{OutputReference, Transaction}

// Analysis Results Datum
pub type ResultDatum {
  result_hash: ByteArray,
  confidence_score: Int,
  verified: Bool,
}

// Analysis Results Redeemer
pub type ResultRedeemer {
  Submit
  Verify
  Finalize
}

validator analysis_results {
  spend(
    datum_opt: Option<ResultDatum>,
    redeemer: ResultRedeemer,
    _own_ref: OutputReference,
    _tx: Transaction,
  ) {
    when datum_opt is {
      Some(datum) ->
        when redeemer is {
          Submit ->
            datum.confidence_score >= 0 && datum.confidence_score <= 100
          Verify -> True
          Finalize -> datum.verified
        }
      None -> False
    }
  }

  else(_) {
    fail
  }
}
