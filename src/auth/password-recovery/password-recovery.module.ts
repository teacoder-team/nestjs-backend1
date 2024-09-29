import { Module } from '@nestjs/common'
import { UserService } from 'src/user/user.service'

import { MailService } from '@/libs/mail/mail.service'

import { PasswordRecoveryController } from './password-recovery.controller'
import { PasswordRecoveryService } from './password-recovery.service'

@Module({
	controllers: [PasswordRecoveryController],
	providers: [PasswordRecoveryService, MailService, UserService]
})
export class PasswordRecoveryModule {}
