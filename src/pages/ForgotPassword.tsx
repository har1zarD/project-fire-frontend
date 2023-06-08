import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

import LoadingSpinner from 'src/components/shared/utils/LoadingSpinner';
import InputField from 'src/components/shared/form-elements/InputField';

const ForgotPassword = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState('');

	const baseUrl = import.meta.env.VITE_BASE_URL;

	const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsLoading(true);
		try {
			const response = await axios.post(
				`${baseUrl}/api/users/reset-password`,
				{
					email,
				},
				{
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			toast.success(response.data.message);
		} catch (error: any) {
			toast.error(axios.isAxiosError(error) ? error.response?.data.error : `Unexpected error: ${error}`);
		}
		setIsLoading(false);
	};

	return (
		<>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<div className='flex h-screen flex-col items-center justify-center gap-4'>
					<div className='w-full max-w-3xl p-10 text-center md:w-5/6 lg:w-4/6'>
						<h1 className='mb-10 font-gilroy-semi-bold text-[32px] font-semibold leading-10 text-midnight-grey'>
							Forgot Password
						</h1>
						<form className='flex flex-col items-center justify-center text-base' onSubmit={handleFormSubmit}>
							<InputField
								className='mb-[34px]'
								label='Email'
								htmlFor='email'
								required
								type='email'
								id='email'
								value={email}
								placeholder='Enter your email'
								handleInput={email => setEmail(email)}
							/>
							<button
								className='w-full rounded-md bg-deep-teal px-[10px] py-3 font-gilroy-semi-bold font-semibold text-white hover:saturate-[400%]'
								type='submit'
							>
								Send Reset Code
							</button>
						</form>
					</div>
					<div className='font-gilroy-medium font-medium tracking-[-0.015em] text-deep-teal'>
						Oh, you remembered your password?{' '}
						<Link to='/login'>
							<span className='font-gilroy-bold font-bold hover:cursor-pointer hover:underline'>Go back.</span>
						</Link>
					</div>
				</div>
			)}
		</>
	);
};

export default ForgotPassword;
