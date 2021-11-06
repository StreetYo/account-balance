import {SubstrateEvent} from "@subql/types";
import {Account, BalanceSum} from "../types";
import {Balance} from "@polkadot/types/interfaces";

export async function handleEvent(event: SubstrateEvent): Promise<void> {
    await addBalance(event);
    await addBalanceSum(event);
}

async function addBalance(event: SubstrateEvent) {
    const {event: {data: [account, balance]}} = event;

    let record = new Account(event.extrinsic.block.block.header.hash.toString());

    record.account = account.toString();
    record.balance = (balance as Balance).toBigInt();

    await record.save();
}

async function addBalanceSum(event: SubstrateEvent) {
    const {event: {data: [account, balance]}} = event;

    let accountBalance = await BalanceSum.get(account.toString());

    if(accountBalance === undefined) {
        accountBalance = new BalanceSum(event.extrinsic.block.block.header.hash.toString());
        accountBalance.account = account.toString();
        accountBalance.balance = 0;
    }

    accountBalance.balance += (balance as Balance).toBigInt();

    await accountBalance.save();
}
