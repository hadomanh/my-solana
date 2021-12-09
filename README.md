# Solana Tutorial

### Reference:
- [Solana Installation](https://docs.solana.com/cli/install-solana-cli-tools)
- [Anchor Documentation](https://project-serum.github.io/anchor/getting-started/introduction.html)
- [solana/web3.js](https://docs.solana.com/developing/clients/javascript-api)
- [Rust Documentation](https://doc.rust-lang.org/reference/introduction.html)
- [Rust Tutorial](https://learning-rust.github.io/docs/index.html)
- [Rust x Anchor](https://docs.rs/anchor-lang/latest/anchor_lang/prelude/index.html)
- [The Complete Guide to Full Stack Solana Development with React, Anchor, Rust, and Phantom](https://dev.to/dabit3/the-complete-guide-to-full-stack-solana-development-with-react-anchor-rust-and-phantom-3291)

### Solana CLI:
- Reference: https://docs.solana.com/cli/
- Start local network:
    ```
    $ solana-test-validator
    ```

- Check current cluster:
    ```
    $ solana config get
    ```

- Change cluster:
    ```
    $ solana config set --url devnet
    ```

- Create wallet:
    ```
    $ solana-keygen new --outfile my_solana_wallet.json
    $ solana-keygen new --no-passphrase --no-outfile
    ```
- Show Public Key:
    ```
    $ solana-keygen pubkey <File System Wallet Keypair as JSON>
    ```

- Check current account:
    ```
    $ solana address
    $ solana account <address>
    ```

- Airdrop tokens:
    ```
    $ solana airdrop 1000
    $ solana airdrop 1000 <address>
    ```
- Check balance:
    ```
    $ solana balance
    $ solana balance <address>
    ```

### Anchor:
- CLI:
    ```
    $ anchor init my-solana --javascript # default: typescript
    $ anchor build
    $ anchor deploy
    $ anchor test
    ```
- Keypair file location: ```./target/deploy/<project_name>-keypair.json```
- Show program id:
    ```
    $ solana-keygen pubkey <keypair file>
    # or
    $ solana address -k <keypair file>
    ```
- Update program id in ```Anchor.toml``` and ```lib.rs```

- Convention:
    - Project name: kebab-case (i.e. my-solana)
    - Rust program, Anchor.toml: camel_case (i.e. increase_amount, system_program, my_solana)
    - Web3 method: camelCase (i.e. MySolana, increaseAmount)

### Rust:
- Explaination [here](https://project-serum.github.io/anchor/tutorials/tutorial-0.html)
