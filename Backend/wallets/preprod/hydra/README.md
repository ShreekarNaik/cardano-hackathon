
# Hydra Keys Generation

To run the Hydra node, you need to generate Cardano and Hydra keys and place them in this directory.

Since `cardano-cli` and `hydra-node` are required for key generation, please run the following commands in an environment where they are available (e.g., inside the `hydra-node` container if you can run it interactively, or on a machine with `cardano-cli`).

## 1. Generate Cardano Keys

```bash
cardano-cli address key-gen \
    --verification-key-file cardano.vk \
    --signing-key-file cardano.sk
```

## 2. Generate Hydra Keys

```bash
# If you have hydra-node installed:
hydra-node gen-hydra-key --output-file hydra
# This creates hydra.sk and hydra.vk
```

## 3. Protocol Parameters (Optional)

The node can query these from the network, but you can also save them:

```bash
cardano-cli query protocol-parameters \
    --testnet-magic 1 \
    --out-file protocol-parameters.json
```

Ensure `cardano.sk`, `cardano.vk`, `hydra.sk`, and `hydra.vk` are in this directory (`wallets/preprod/hydra`).
