import React, { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';

import { Employee } from 'src/types';
import { getEmployeeTechStack } from 'src/helpers';
import { chevronDown, chevronLeft } from 'assets/media';
import { useUpdateEmployeeMutation } from 'store/slices/employeesApiSlice';
import SideDrawer from 'components/navigation/SideDrawer';
import Footer from 'components/layout/Footer';
import InputField from 'components/formElements/InputField';
import ImageUpload from 'components/formElements/ImageUpload';

type Props = {
	employee: Employee;
	closeEditEmployeeSideDrawer: () => void;
};

const EditEmployee = ({ employee, closeEditEmployeeSideDrawer }: Props) => {
	const salaryRef = useRef<HTMLInputElement | null>(null);
	const currencyRef = useRef<HTMLDivElement | null>(null);
	const [currencyContainerWidth, setCurrencyContainerWidth] = useState(0);
	const [salaryInputFieldHeight, setSalaryInputFieldHeight] = useState(0);
	const [isDepartmentMenuOpen, setIsDepartmentMenuOpen] = useState(false);
	const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
	const [isTechStackMenuOpen, setIsTechStackMenuOpen] = useState(false);
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [image, setImage] = useState<File | undefined>();
	const [department, setDepartment] = useState('');
	const [salary, setSalary] = useState('');
	const [currency, setCurrency] = useState('');
	const [techStack, setTechStack] = useState('');

	const [updateEmployee, { isSuccess }] = useUpdateEmployeeMutation();

	const fetchImage = useCallback(async () => {
		if (employee?.image) {
			const response = await fetch(employee.image);
			const blob = await response.blob();
			const imageFile = new File([blob], 'profile-image.jpg', { type: 'image/jpeg' });
			setImage(imageFile);
		}
	}, [employee]);

	useEffect(() => {
		if (employee) {
			setFirstName(employee.firstName);
			setLastName(employee.lastName);
			setDepartment(employee.department);
			setSalary(employee.salary.toString());
			setCurrency(employee.currency);
			setTechStack(employee.techStack);
			fetchImage();
		}
	}, [employee]);

	const editEmployee = async (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		const formData = new FormData();
		formData.append('firstName', firstName);
		formData.append('lastName', lastName);
		if (image) formData.append('image', image);
		formData.append('department', department);
		formData.append('salary', salary);
		formData.append('currency', currency);
		formData.append('techStack', techStack);
		await updateEmployee({ employeeId: employee.id, data: formData });
	};

	useEffect(() => {
		if (isSuccess) closeEditEmployeeSideDrawer();
	}, [isSuccess]);

	useEffect(() => {
		if (!isSuccess) {
			if (department === 'Administration' && techStack === 'MgmtNA') setTechStack('AdminNA');
			else if (department === 'Management' && techStack === 'AdminNA') setTechStack('MgmtNA');
		}
	}, [department]);

	useLayoutEffect(() => {
		setSalaryInputFieldHeight(salaryRef.current?.offsetHeight ?? 0);
		setCurrencyContainerWidth(currencyRef.current?.offsetWidth ?? 0);
	}, []);

	const children = (
		<motion.div
			initial={{ opacity: 0, x: '100%' }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.4, ease: 'easeInOut' }}
			className='fixed right-0 top-0 z-20 flex min-h-full w-[496px] flex-col bg-frosty-mint px-6 pt-[27px]'
		>
			<div className='flex cursor-pointer items-center gap-[3px]' onClick={closeEditEmployeeSideDrawer}>
				<img className='h-4 w-4' src={chevronLeft} alt='Back icon' />
				<span className='font-inter-semi-bold text-base font-semibold tracking-[-0.015em] text-evergreen'>Back</span>
			</div>
			{employee && (
				<>
					<header className='mt-[13px]'>
						<h2 className='rounded-lg bg-white px-6 py-4 font-gilroy-bold text-[21px] font-bold leading-6 text-midnight-grey'>
							Edit Employee
						</h2>
					</header>
					<main className='mt-4 rounded-lg bg-white p-6'>
						<form className='flex flex-col gap-4'>
							<InputField
								containerClassName='gap-1'
								labelClassName='leading-[22px]'
								inputClassName='border-misty-moonstone px-4 py-2 text-sm leading-[22px] text-slate-mist focus:border-misty-moonstone'
								required
								type='text'
								label='First Name'
								htmlFor='firstName'
								id='firstName'
								name='firstName'
								placeholder='First Name'
								value={firstName}
								handleInput={firstName => setFirstName(firstName)}
							/>
							<InputField
								containerClassName='gap-1'
								labelClassName='leading-[22px]'
								inputClassName='border-misty-moonstone px-4 py-2 text-sm leading-[22px] text-slate-mist focus:border-misty-moonstone'
								required
								type='text'
								label='Last Name'
								htmlFor='lastName'
								id='lastName'
								name='lastName'
								placeholder='Last Name'
								value={lastName}
								handleInput={lastName => setLastName(lastName)}
							/>
							<ImageUpload
								containerClassName='gap-1'
								labelClassName='leading-[22px]'
								inputClassName='h-[104px] w-[104px] border-ashen-grey bg-frosty-mint'
								label='Profile Image'
								image={image}
								handleImageUpload={file => setImage(file)}
							/>
							<div className='flex flex-col gap-1'>
								<span className='font-gilroy-medium text-base font-medium leading-[22px] text-midnight-grey'>
									Department
								</span>
								<div className='relative rounded-md border border-misty-moonstone px-4 py-2 focus:outline-none'>
									<div
										className='flex cursor-pointer items-center justify-between'
										onClick={() => setIsDepartmentMenuOpen(!isDepartmentMenuOpen)}
									>
										<span className='font-gilroy-regular text-sm font-normal leading-[22px] text-slate-mist'>
											{!department ? 'Select employee department' : department}
										</span>
										<img
											className={`transition ${isDepartmentMenuOpen ? 'rotate-180' : ''}`}
											src={chevronDown}
											alt='Down icon'
										/>
									</div>
									{isDepartmentMenuOpen && (
										<div className='absolute left-0 top-10 z-10 flex w-[400px] flex-col rounded-md border border-t-0 border-misty-moonstone bg-white py-2'>
											<div className='flex items-center gap-2 px-4 py-1'>
												<input
													className='h-[15px] w-[15px] appearance-none rounded-sm border-2 border-slate-mist text-evergreen focus:ring-transparent'
													type='checkbox'
													id='administration'
													name='administration'
													checked={department === 'Administration'}
													onChange={event => {
														setDepartment(event.target.checked ? 'Administration' : '');
														setIsDepartmentMenuOpen(false);
													}}
												/>
												<label
													className='font-gilroy-regular text-sm font-normal text-slate-mist'
													htmlFor='administration'
												>
													Administration
												</label>
											</div>
											<div className='flex items-center gap-2 px-4 py-1'>
												<input
													className='h-[15px] w-[15px] appearance-none rounded-sm border-2 border-slate-mist text-evergreen  focus:ring-transparent'
													type='checkbox'
													id='management'
													name='management'
													checked={department === 'Management'}
													onChange={event => {
														setDepartment(event.target.checked ? 'Management' : '');
														setIsDepartmentMenuOpen(false);
													}}
												/>
												<label className='font-gilroy-regular text-sm font-normal text-slate-mist' htmlFor='management'>
													Management
												</label>
											</div>
											<div className='flex items-center gap-2 px-4 py-1'>
												<input
													className='h-[15px] w-[15px] appearance-none rounded-sm border-2 border-slate-mist text-evergreen focus:ring-transparent'
													type='checkbox'
													id='development'
													name='development'
													checked={department === 'Development'}
													onChange={event => {
														setDepartment(event.target.checked ? 'Development' : '');
														setIsDepartmentMenuOpen(false);
													}}
												/>
												<label
													className='font-gilroy-regular text-sm font-normal text-slate-mist'
													htmlFor='development'
												>
													Development
												</label>
											</div>
											<div className='flex items-center gap-2 px-4 py-1'>
												<input
													className='h-[15px] w-[15px] appearance-none rounded-sm border-2 border-slate-mist text-evergreen  focus:ring-transparent'
													type='checkbox'
													id='design'
													name='design'
													checked={department === 'Design'}
													onChange={event => {
														setDepartment(event.target.checked ? 'Design' : '');
														setIsDepartmentMenuOpen(false);
													}}
												/>
												<label className='font-gilroy-regular text-sm font-normal text-slate-mist' htmlFor='design'>
													Design
												</label>
											</div>
										</div>
									)}
								</div>
							</div>
							<div className='flex gap-2'>
								<InputField
									ref={salaryRef}
									containerClassName='gap-1'
									labelClassName='leading-[22px]'
									inputContainerClassName='flex gap-2 w-full'
									inputClassName='border-misty-moonstone px-4 py-2 text-sm leading-[22px] text-slate-mist focus:border-misty-moonstone'
									required
									type='number'
									label='Monthly Salary'
									htmlFor='salary'
									id='salary'
									name='salary'
									min={0}
									step={0.01}
									placeholder='Enter the amount'
									value={salary}
									handleInput={salary => setSalary(salary)}
								/>
								<div
									ref={currencyRef}
									className='relative flex cursor-pointer items-center justify-between gap-2 self-end rounded-md border border-misty-moonstone px-4 py-2 focus:outline-none'
									style={{ height: salaryInputFieldHeight }}
									onClick={() => setIsCurrencyMenuOpen(!isCurrencyMenuOpen)}
								>
									<span className='font-gilroy-regular text-sm font-normal leading-[22px] text-slate-mist'>
										{currency}
									</span>
									<img
										className={`transition ${isCurrencyMenuOpen ? 'rotate-180' : ''}`}
										src={chevronDown}
										alt='Down icon'
									/>
									{isCurrencyMenuOpen && (
										<div
											className='absolute left-0 top-10 z-10 flex flex-col overflow-hidden rounded-md border border-t-0 border-misty-moonstone bg-white text-center'
											style={{ width: currencyContainerWidth }}
										>
											<div
												className='py-2 font-gilroy-regular text-sm font-normal text-slate-mist hover:bg-misty-moonstone'
												onClick={() => setCurrency('USD')}
											>
												USD
											</div>
											<div
												className='py-2 font-gilroy-regular text-sm font-normal text-slate-mist hover:bg-misty-moonstone'
												onClick={() => setCurrency('EUR')}
											>
												EUR
											</div>
											<div
												className='py-2 font-gilroy-regular text-sm font-normal text-slate-mist hover:bg-misty-moonstone'
												onClick={() => setCurrency('BAM')}
											>
												BAM
											</div>
										</div>
									)}
								</div>
							</div>
							<div className='flex flex-col gap-1'>
								<span className='font-gilroy-medium text-base font-medium leading-[22px] text-midnight-grey'>
									Tech Stack
								</span>
								<div className='relative rounded-md border border-misty-moonstone px-4 py-2 focus:outline-none'>
									<div
										className='flex cursor-pointer items-center justify-between'
										onClick={() => setIsTechStackMenuOpen(!isTechStackMenuOpen)}
									>
										<span className='font-gilroy-regular text-sm font-normal leading-[22px] text-slate-mist'>
											{!techStack ? 'Select stack' : getEmployeeTechStack(employee.techStack)}
										</span>
										<img
											className={`transition ${isTechStackMenuOpen ? 'rotate-180' : ''}`}
											src={chevronDown}
											alt='Down icon'
										/>
									</div>
									{isTechStackMenuOpen && (
										<div className='absolute left-0 top-10 flex w-[400px] flex-col rounded-md border border-t-0 border-misty-moonstone bg-white py-2'>
											<div className='flex items-center gap-2 px-4 py-1'>
												<input
													className='h-[15px] w-[15px] appearance-none rounded-sm border-2 border-slate-mist text-evergreen focus:ring-transparent'
													type='checkbox'
													id='na'
													name='na'
													checked={techStack === 'AdminNA' || techStack === 'MgmtNA'}
													onChange={event => {
														setTechStack(
															event.target.checked ? (department === 'Administration' ? 'AdminNA' : 'MgmtNA') : ''
														);
														setIsTechStackMenuOpen(false);
													}}
												/>
												<label className='font-gilroy-regular text-sm font-normal text-slate-mist' htmlFor='na'>
													N/A
												</label>
											</div>
											<div className='flex items-center gap-2 px-4 py-1'>
												<input
													className='h-[15px] w-[15px] appearance-none rounded-sm border-2 border-slate-mist text-evergreen  focus:ring-transparent'
													type='checkbox'
													id='fullstack'
													name='fullstack'
													checked={techStack === 'FullStack'}
													onChange={event => {
														setTechStack(event.target.checked ? 'FullStack' : '');
														setIsTechStackMenuOpen(false);
													}}
												/>
												<label className='font-gilroy-regular text-sm font-normal text-slate-mist' htmlFor='fullstack'>
													Full Stack
												</label>
											</div>
											<div className='flex items-center gap-2 px-4 py-1'>
												<input
													className='h-[15px] w-[15px] appearance-none rounded-sm border-2 border-slate-mist text-evergreen  focus:ring-transparent'
													type='checkbox'
													id='backend'
													name='backend'
													checked={techStack === 'Backend'}
													onChange={event => {
														setTechStack(event.target.checked ? 'Backend' : '');
														setIsTechStackMenuOpen(false);
													}}
												/>
												<label className='font-gilroy-regular text-sm font-normal text-slate-mist' htmlFor='backend'>
													Back End
												</label>
											</div>
											<div className='flex items-center gap-2 px-4 py-1'>
												<input
													className='h-[15px] w-[15px] appearance-none rounded-sm border-2 border-slate-mist text-evergreen focus:ring-transparent'
													type='checkbox'
													id='frontend'
													name='frontend'
													checked={techStack === 'Frontend'}
													onChange={event => {
														setTechStack(event.target.checked ? 'Frontend' : '');
														setIsTechStackMenuOpen(false);
													}}
												/>
												<label className='font-gilroy-regular text-sm font-normal text-slate-mist' htmlFor='frontend'>
													Front End
												</label>
											</div>
											<div className='flex items-center gap-2 px-4 py-1'>
												<input
													className='h-[15px] w-[15px] appearance-none rounded-sm border-2 border-slate-mist text-evergreen focus:ring-transparent'
													type='checkbox'
													id='uxui'
													name='uxui'
													checked={techStack === 'UXUI'}
													onChange={event => {
														setTechStack(event.target.checked ? 'UXUI' : '');
														setIsTechStackMenuOpen(false);
													}}
												/>
												<label className='font-gilroy-regular text-sm font-normal text-slate-mist' htmlFor='uxui'>
													UX/UI
												</label>
											</div>
										</div>
									)}
								</div>
							</div>
						</form>
					</main>
					<Footer
						firstButtonClassName='border border-deep-teal text-evergreen'
						secondButtonClassName='bg-deep-teal text-white'
						firstButtonText='Cancel'
						secondButtonText='Edit Employee'
						handleFirstButtonClick={closeEditEmployeeSideDrawer}
						handleSecondButtonClick={editEmployee}
					/>
				</>
			)}
		</motion.div>
	);

	return <SideDrawer onClick={closeEditEmployeeSideDrawer}>{children}</SideDrawer>;
};

export default EditEmployee;
