const anchor = require("@project-serum/anchor");
const { expect } = require("chai");
const {
  SystemProgram,
  Keypair,
  Transaction,
  sendAndConfirmTransaction,
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL
} = anchor.web3;

// 1 sol = 10^9 lamports
// 1 ether = 10^9 gwei

// Import Private Key
const secretKey = Uint8Array.from([
  95,137,83,85,192,108,118,84,95,64,172,108,58,55,17,129,
  86,187,252,54,11,62,132,229,249,113,49,69,246,215,81,85,
  70,10,218,12,51,232,18,230,58,220,112,98,137,65,21,220,
  11,126,230,1,187,17,47,247,100,39,137,225,76,155,49,139
]);

const keyPair = Keypair.fromSecretKey(secretKey);
console.log("Public Key:", keyPair.publicKey.toString());

// testnet | mainnet-beta | devnet
// const connection = new Connection(clusterApiUrl('testnet'));
const connection = new Connection('http://localhost:8899');

// Create and set provider
const provider = anchor.Provider.env();
anchor.setProvider(provider);
const program = anchor.workspace.MySolana;

describe("my-solana", () => {

  it('should airdrop', async () => {

    const alice = Keypair.generate();

    const before = await connection.getBalance(alice.publicKey);

    const txSignature = await connection.requestAirdrop(alice.publicKey, LAMPORTS_PER_SOL);

    await connection.confirmTransaction(txSignature);

    const after = await connection.getBalance(alice.publicKey);

    expect(after - before).equal(LAMPORTS_PER_SOL);
  })

  it('should send lamports', async () => {
      
      const alice = Keypair.generate();
      const bob = Keypair.generate();

      // Send airdrop
      const before = LAMPORTS_PER_SOL

      const airdropSignature = await connection.requestAirdrop(alice.publicKey, before);
      await connection.confirmTransaction(airdropSignature);

      const txAmount = 10000;
      const txFee = 5000; // 5 * 10^-6 SOL per signature

      // +---------+--------------+------------------------------------+
      // | Cluster | Epoch Length | Rent fee per byte-epoch (lamports) | 
      // +---------+--------------+------------------------------------+
      // | devnet  | 54m36s       |          0.3608183131797095        |
      // | testnet | 2days        |          19.055441478439427        |
      // | mainnet | 2days        |          19.055441478439427        |
      // +---------+--------------+------------------------------------+
      //
      // Minimum account size = 128 bytes
      const rentFee = 2439
  
      // Send lamports
      const transaction = new Transaction()
      transaction.add(SystemProgram.transfer({
        fromPubkey: alice.publicKey,
        toPubkey: bob.publicKey,
        lamports: txAmount,
      }));
      await sendAndConfirmTransaction(connection, transaction, [ alice ]);
  
      const after = await connection.getBalance(alice.publicKey);
      const bobBalance = await connection.getBalance(bob.publicKey);

      expect(before - after).equal(txAmount + txFee);
      expect(bobBalance).equal(txAmount - rentFee);
  })

  it("should update counter", async () => {
    // Generate keypair
    const alice = Keypair.generate();
    const bob = Keypair.generate();

    // Create alice and bob accounts via RPC
    await program.rpc.create(
    {
      name: "alice",
      count: new anchor.BN(0),
    },
    {
      accounts: {
        baseAccount: alice.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [ alice ],
    });

    await program.rpc.create(
    {
      name: "bob",
      count: new anchor.BN(0),
    },
    {
      accounts: {
        baseAccount: bob.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [ bob ],
    });
    
    // Increase counter
    await program.rpc.increase({
      accounts: {
        baseAccount: alice.publicKey,
      },
    })

    await program.rpc.increaseAmount(new anchor.BN(5), {
      accounts: {
        baseAccount: bob.publicKey,
      },
    })

    // Fetch all accounts
    const aliceAccount = await program.account.baseAccount.fetch(alice.publicKey);
    const bobAccount = await program.account.baseAccount.fetch(bob.publicKey);

    // Check all counter
    const aliceCounter = await aliceAccount.count.toString()
    const bobCounter = bobAccount.count.toString()

    expect(aliceCounter).equal('1')
    expect(bobCounter).equal('5')
  });

});
