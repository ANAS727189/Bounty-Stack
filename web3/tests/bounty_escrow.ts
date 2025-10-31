import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { BountyEscrow } from "../target/types/bounty_escrow";
import { assert } from "chai";

describe("bounty_escrow", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.BountyEscrow as Program<BountyEscrow>;
  const asker = provider.wallet as anchor.Wallet;

  // The Web2 ID for our question
  const questionId = "q_12345";

  // The bounty amount (0.5 SOL)
  const bountyAmount = new anchor.BN(0.5 * anchor.web3.LAMPORTS_PER_SOL);

  // We can "find" the PDA address before it's created!
  const [bountyPda, bountyBump] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("bounty"),
      Buffer.from(questionId)
    ],
    program.programId
  );

  it("Can post a new bounty!", async () => {
    // Get the asker's balance *before*
    const balanceBefore = await provider.connection.getBalance(asker.publicKey);

    // Call the `post_bounty` instruction
    const tx = await program.methods
      .postBounty(questionId, bountyAmount)
      .accounts({
        bountyAccount: bountyPda,
        asker: asker.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Your transaction signature", tx);

    // --- Check 1: Did the PDA get created with the right data? ---
    const bountyAccount = await program.account.bountyAccount.fetch(bountyPda);

    assert.equal(bountyAccount.asker.toBase58(), asker.publicKey.toBase58());
    assert.equal(bountyAccount.questionId, questionId);
    assert.ok(bountyAccount.bountyAmount.eq(bountyAmount));
    assert.ok(bountyAccount.state.hasOwnProperty("open")); // Check state is 'Open'

    // --- Check 2: Did the SOL leave the asker's wallet? ---
    const balanceAfter = await provider.connection.getBalance(asker.publicKey);
    // (Note: balanceAfter will be < (balanceBefore - bountyAmount) due to gas)
    assert.isTrue(balanceAfter < balanceBefore - bountyAmount.toNumber());

    // --- Check 3: Is the SOL now in the PDA? ---
    const pdaBalance = await provider.connection.getBalance(bountyPda);
    // (PDA balance = bounty + rent-exemption)
    assert.isTrue(pdaBalance >= bountyAmount.toNumber());

    console.log("Bounty PDA:", bountyAccount);
    console.log("PDA Balance (lamports):", pdaBalance);
  });

  // --- TEST AWARD BOUNTY ---
  it("Can award the bounty!", async () => {
    // Create a new wallet to be the winner
    const winner = anchor.web3.Keypair.generate();

    // Get winner's balance before
    const winnerBalanceBefore = await provider.connection.getBalance(winner.publicKey);
    // Get asker's balance before (to check rent refund)
    const askerBalanceBefore = await provider.connection.getBalance(asker.publicKey);

    // Call the award_bounty instruction
    const tx = await program.methods
      .awardBounty(questionId) // Only need questionId here
      .accounts({
        bountyAccount: bountyPda, // The PDA we are awarding from
        asker: asker.publicKey, // The asker must sign
        winner: winner.publicKey, // The recipient of the bounty
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Award bounty transaction signature", tx);

    // --- Check 1: Did the PDA get closed? ---
    // Fetching a closed account should return null or throw an error
    try {
        await program.account.bountyAccount.fetch(bountyPda);
        assert.fail("Bounty account should be closed, but it was fetched.");
    } catch (error) {
        // We expect an error when fetching a closed account
        assert.include(error.message, "Account does not exist or has no data");
        console.log("Bounty PDA successfully closed.");
    }


    // --- Check 2: Did the winner receive the SOL? ---
    const winnerBalanceAfter = await provider.connection.getBalance(winner.publicKey);
    assert.equal(winnerBalanceAfter, winnerBalanceBefore + bountyAmount.toNumber());

    // --- Check 3: Did the asker get the rent back? ---
    // This is harder to check precisely due to transaction fees,
    // but the asker's balance should increase slightly.
    const askerBalanceAfter = await provider.connection.getBalance(asker.publicKey);
    // We expect askerBalanceAfter > askerBalanceBefore - (small tx fee)
    // For simplicity, we'll just check it's greater than before minus the fee allowance
    const maxFee = 0.01 * anchor.web3.LAMPORTS_PER_SOL; // Generous fee allowance
    assert.isTrue(askerBalanceAfter > askerBalanceBefore - maxFee);
    console.log("Winner received bounty, asker received rent refund.");
  });

  // --- TEST CANCEL BOUNTY ---
  // Note: To test cancel, we need to post *another* bounty first,
  // because the previous one was closed by the award test.
  const questionIdForCancel = "q_cancel_test";
  const bountyAmountForCancel = new anchor.BN(0.2 * anchor.web3.LAMPORTS_PER_SOL);
  const [bountyPdaForCancel, _] = anchor.web3.PublicKey.findProgramAddressSync(
    [ Buffer.from("bounty"), Buffer.from(questionIdForCancel) ],
    program.programId
  );

  it("Can post a second bounty for cancel test", async () => {
    await program.methods
      .postBounty(questionIdForCancel, bountyAmountForCancel)
      .accounts({
        bountyAccount: bountyPdaForCancel,
        asker: asker.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    // Verify it exists and has the correct amount
    const bountyAccount = await program.account.bountyAccount.fetch(bountyPdaForCancel);
    assert.ok(bountyAccount.bountyAmount.eq(bountyAmountForCancel));
    assert.ok(bountyAccount.state.hasOwnProperty("open"));
  });

  it("Can cancel the bounty!", async () => {
    // Get asker's balance before cancelling
    const askerBalanceBefore = await provider.connection.getBalance(asker.publicKey);

    // Call the cancel_bounty instruction
    const tx = await program.methods
      .cancelBounty(questionIdForCancel)
      .accounts({
        bountyAccount: bountyPdaForCancel, // The PDA we are cancelling
        asker: asker.publicKey, // The asker must sign
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Cancel bounty transaction signature", tx);

    // --- Check 1: Did the PDA get closed? ---
     try {
        await program.account.bountyAccount.fetch(bountyPdaForCancel);
        assert.fail("Bounty account should be closed, but it was fetched.");
    } catch (error) {
        assert.include(error.message, "Account does not exist or has no data");
        console.log("Bounty PDA successfully closed.");
    }

    // --- Check 2: Did the asker receive the bounty SOL + rent back? ---
    const askerBalanceAfter = await provider.connection.getBalance(asker.publicKey);
    const maxFee = 0.01 * anchor.web3.LAMPORTS_PER_SOL; // Generous fee allowance
    // Asker should get the bounty back, plus rent, minus the tx fee.
    // So, balance after should be roughly balance before + bounty amount - fee.
    assert.isTrue(askerBalanceAfter > askerBalanceBefore + bountyAmountForCancel.toNumber() - maxFee);
    console.log("Asker received bounty refund and rent refund.");

  });

  // --- OPTIONAL: Test failure cases ---
  // it("Cannot award an already awarded bounty", async () => { ... });
  // it("Cannot cancel an already awarded bounty", async () => { ... });
  // it("Non-asker cannot award bounty", async () => { ... });
  // it("Non-asker cannot cancel bounty", async () => { ... });
});

