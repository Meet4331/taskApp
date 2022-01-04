const User = require('../model/user')
const Account = require('../model/account')

module.exports.openAccount = async (req, res) => {
  try {
    const { firstName, lastName, accountType, amount, phone } = req.body;
    const findUser = await User.findOne({ phone: phone });
    if (!findUser) {
      const saveUser = await User.create({ firstName, lastName, phone });
      const saveAccount = await Account.create({ accountType, amount, userId: saveUser._id });
      return res.status(200).json(saveAccount);
    } else {
      const findAccount = await Account.findOne({ userId: findUser._id }).populate('userId');
      console.log("////////",findAccount);
      if (findUser && findAccount.accountType === accountType) {
        return res.send('Same account type exists..!')
      }
      if (findUser) {
        const saveAccount = await Account.create({ accountType, amount, phone, userId: findUser._id });
        return res.status(200).json(saveAccount);
      }
    }

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}

module.exports.transaction = async (req, res) => {
  try {
    const sourceAcc = req.body.fromAccountId;
    const destAcc = req.body.toAccountId;
    const amount = (req.body.amount) / 100;
    if (sourceAcc !== destAcc) {
      console.log("insdie accout /////////");
      const findSourceAcc = await Account.findOne({ _id: sourceAcc });
      const findDestAcc = await Account.findOne({ _id: destAcc });

      if (findSourceAcc.userId !== findDestAcc.userId) {

        const validAmount = findSourceAcc.amount - amount;
        if (validAmount > 0) {
          console.log("inside validate///////");
          const amountToDecrease = (findSourceAcc.amount) - amount;
          const amountToIncrease = (findDestAcc.amount) + amount;

          if (findDestAcc.accountType === 'BasicSaving' && amountToIncrease > 50000) {
            return res.send('Balance in BasicSavings account type should never exceed 50000')
          }

          await Account.updateOne({ _id: sourceAcc }, { amount: amountToDecrease }, { new: true })
          await Account.updateOne({ _id: destAcc }, { amount: amountToIncrease }, { new: true })
          //await Account.updateOne({ _id: destAcc})

          const acc = await Account.findOne({ _id: destAcc });
          const findAllAcc = await Account.find({ userId: acc.userId })
          let sum = 0;
          for await (const i of findAllAcc) {
            sum += i.amount;
          }
          return res.send({
            newSrcBalance: acc.amount,
            totalDestBalance: sum,
            transactionAt: acc.updatedAt
          })
        } else {
          return res.send('Not Enough amount to proceed transaction.')
        }
      } else {
        return res.send('Not Enough amount to proceed transaction.')
      }
    } else {
      return res.send('Both Account is same, Please provide different account.')
    }
  } catch (error) {
    return res.send(error)
  }
}
