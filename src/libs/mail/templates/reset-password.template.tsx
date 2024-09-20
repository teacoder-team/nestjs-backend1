import { Body, Heading, Hr, Link, Text } from "@react-email/components";
import { Html } from "@react-email/html";
import { Tailwind } from "@react-email/tailwind";
import * as React from 'react';

interface ResetPasswordTemplateProps {
	url: string
	token: string
}

export function ResetPasswordTemplate({ url, token }: ResetPasswordTemplateProps) {
	return (
		<Tailwind>
			<Html>
				<Body className='font-sans text-base text-black'>
					<Heading className='text-2xl font-bold'>
						Сброс пароля 🔑
					</Heading>
					<Text>
						Здравствуйте! 😊 Вы получили это письмо, потому что запросили сброс пароля для вашей учетной записи.
					</Text>
					<Hr className='my-4' />
					<div>
						<Text>
							Чтобы создать новый пароль, пожалуйста, нажмите на кнопку ниже:
						</Text>
						<Link
							href={`${url}/auth/new-password?token=${token}`}
							className='inline-block bg-sky-700 text-white py-2 px-4 rounded mt-2'
						>
							Подтвердить сброс пароля
						</Link>
					</div>
					<Hr className='my-4' />
					<Text className='mt-4'>
						Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо. ❌
					</Text>
					<Text className='mt-2'>
						C уважением,<br />
						TeaCoder Team 👩‍💻👨‍💻
					</Text>
				</Body>
			</Html>
		</Tailwind>
	)
}
