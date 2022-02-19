const Users = require('../models/users');
const Loans = require('../models/loans');
const jwt = require('jsonwebtoken');

exports.LoansController = {
    async askLoan(req, res) {
        try {
            const user = req.user;
            const { descritpion, loan, email } = req.body;
            if (!(descritpion && loan)) {
                res.status(400).send('All input are required');
            }
            const userLoan = await Users.findOne({
                email: email,
            }).lean();
            console.log(userLoan)
            if (!userLoan)
                return res.status(400).send({
                    email: 'Incorrect user for take loan',
                });
            console.log(userLoan)
            const token = jwt.sign(
                { user_id: user._id, email: user.email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: '2h',
                }
            );
            const loanId = await Loans.findOne().sort('-id');
            const newLoans = await Loans.create({
                id: loanId ? loanId.id + 1 : 1,
                descritpion: descritpion,
                loan: loan,
                idUser: user.id,
                fromIdUser: userLoan.id,
            });
            res.status(201).json({ token });
        } catch (error) {
            res.send(`Error Getting user from db:${err}`);
        }
    },
};