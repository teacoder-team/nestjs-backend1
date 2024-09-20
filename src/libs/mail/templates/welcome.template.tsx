import {
	Body,
	Heading,
	Hr,
	Img,
	Link,
	Tailwind,
	Text
} from '@react-email/components'
import { Html } from '@react-email/html'
import * as React from 'react'

interface WelcomeTemplateProps {
	username: string
}

export function WelcomeTemplate({ username }: WelcomeTemplateProps) {
	return (
		<Tailwind>
			<Html>
				<Body className='font-sans text-base text-black'>
					<Heading className='text-2xl font-bold'>
						Здравствуйте, {username}! 👋
					</Heading>
					<Text className='mt-4 mb-6'>
						Благодарим вас за регистрацию на образовательной платформе TeaCoder!
						🎉
						<br />
						<br />
						Вы сделали первый шаг к новым знаниям и навыкам в сфере
						веб-разработки. 🚀
					</Text>
					<Hr className='my-4' />
					<Text className='mb-4'>
						Вот несколько дополнительных советов, чтобы получить максимальную
						отдачу от обучения на платформе TeaCoder:
					</Text>
					<div className='mb-6'>
						<Heading as='h3' className='text-xl font-semibold'>
							Совет №1: Отслеживайте свой прогресс, проходя курсы 📈
						</Heading>
						<Text className='leading-relaxed'>
							Курсы на нашей платформе разделены на главы, которые вы можете
							проходить последовательно. За каждую пройденную главу вы будете
							получать очки, отражающие ваш прогресс в обучении. Регулярно
							отслеживайте свои достижения, чтобы оставаться мотивированным и
							сосредоточенным на ваших целях. 💪
						</Text>
						<Img
							src='https://teacoder.ru/uploads/email/543d96d9-email-1.png'
							width='28%'
							className='rounded-lg mt-4'
						/>
					</div>
					<Hr className='my-4' />
					<div className='mb-6'>
						<Heading as='h3' className='text-xl font-semibold'>
							Совет №2: Соревнуйтесь с другими в таблице лидеров 🏆
						</Heading>
						<Text className='leading-relaxed'>
							В этой таблице представлены самые прогрессивные пользователи на
							платформе. Вы можете увидеть, кто из студентов достиг наибольших
							успехов и набрал больше всего очков за пройденные главы курсов.
							Соревнуйтесь с другими и стремитесь занять одно из первых мест! 🎯
						</Text>
						<Img
							src='https://teacoder.ru/uploads/email/007b0adb-email-2.png'
							width='32%'
							className='rounded-lg mt-4'
						/>
					</div>
					<Hr className='my-4' />
					<div>
						<Text className='leading-relaxed mb-4'>
							Если у вас возникли вопросы, не стесняйтесь обращаться к нам. Мы
							всегда готовы помочь вам на вашем пути к обучению! 🤗
						</Text>
						<Link
							href='https://teacoder.ru/?utm_source=email&utm_medium=email&utm_campaign=help@teacoder.ru&utm_content=email_content'
							className='inline-block bg-sky-700 text-white py-2 px-4 rounded mt-2'
						>
							Перейти на TeaCoder
						</Link>
					</div>
					<Hr className='my-4' />
					<Text className='mt-2'>
						C уважением,<br />
						TeaCoder Team 👩‍💻👨‍💻
					</Text>
				</Body>
			</Html>
		</Tailwind>
	)
}
