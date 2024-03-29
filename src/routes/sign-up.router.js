// src/routes/sign-up.router.js

import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import bcrypt from 'bcrypt';
import { signUpSchema } from '../../middlewares/validation/Validation.js';


const router = express.Router();

/** 사용자 회원가입 API 트랜잭션 **/
router.post('/sign-up', async (req, res, next) => {
    try {
        const { nickname, password, usertype } = await signUpSchema.validateAsync(req.body);

        // 중복된 닉네임 검사
        const isExistNickname = await prisma.users.findFirst({
            where: {nickname},
        });
        if (isExistNickname){
            throw new Error('DuplicateUserError')
        }
        
        // 비밀번호 암호화
        const hashedPassword = await bcrypt.hash(password, 10);

        // 사용자 생성
        const user = await prisma.users.create({
            data: {
                nickname,
                password: hashedPassword,
                usertype: usertype === 'OWNER' ? 'OWNER' : 'CUSTOMER'
            }
        })
        return res.status(201).json({message: '회원가입이 완료되었습니다.'});
    } catch(err){
        next(err);
    }
  });

  export default router;