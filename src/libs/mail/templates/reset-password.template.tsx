import { Body } from "@react-email/components";
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
				<Body className='font-sans p-10 px-20 text-base text-black'>
					Reset Password
				</Body>
			</Html>
		</Tailwind>
	)
}
