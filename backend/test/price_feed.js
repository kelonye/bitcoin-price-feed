const PriceFeed = artifacts.require("PriceFeed")

contract("PriceFeed", accounts => {
  it("should work", async function () {
    const instance = await PriceFeed.deployed()
    assert.equal(await instance.bitcoinPrice.call(), 0, "price feed != 0")
    await instance.requestUpdate.call({
      value: web3.utils.toWei("0.1", "ether"),
    })
    await instance.requestUpdate.call({
      value: web3.utils.toWei("0.1", "ether"),
    })
    assert.equal(await instance.pending.call(), true, "is not pending")
    assert.ok(await instance.lastRequestId.call(), "request id not set")
    // await instance.completeUpdate.call()
    assert.notEqual(await instance.bitcoinPrice.call(), 0, "price feed != 0")
  })
})
