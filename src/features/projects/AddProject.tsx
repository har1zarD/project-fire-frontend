import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { Employee, Employees, ProjectStatus } from 'src/types';
import { getProjectColorAndStatus } from 'src/helpers';
import { chevronDown, chevronLeft, cancel } from 'assets/media';
import { useGetEmployeesQuery } from 'store/slices/employeesApiSlice';
import { useCreateProjectMutation } from 'store/slices/projectsApiSlice';
import LoadingSpinner from 'components/utils/LoadingSpinner';
import SideDrawer from 'components/navigation/SideDrawer';
import Footer from 'components/layout/Footer';
import InputField from 'components/formElements/InputField';
import DateInputs from 'components/formElements/DateInputs';

type Props = {
	closeAddProjectSideDrawer: () => void;
};

const AddProject = ({ closeAddProjectSideDrawer }: Props) => {
	const [isEmployeesMenuOpen, setIsEmployeesMenuOpen] = useState(false);
	const [isProjectStatusMenuOpen, setIsProjectStatusMenuOpen] = useState(false);
	const [openPartTimeMenus, setOpenPartTimeMenus] = useState<string[]>([]);
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [startDate, setStartDate] = useState<Date | null>(new Date(new Date().getFullYear(), 0, 1));
	const [endDate, setEndDate] = useState<Date | null>(new Date(new Date().getFullYear(), 11, 31));
	const [projectType, setProjectType] = useState('Fixed');
	const [hourlyRate, setHourlyRate] = useState('');
	const [projectValueBAM, setProjectValueBAM] = useState('');
	const [salesChannel, setSalesChannel] = useState('Online');
	const [projectStatus, setProjectStatus] = useState('');
	const [selectedEmployees, setSelectedEmployees] = useState<Employees[]>([]);

	const {
		isLoading,
		isFetching,
		isSuccess: isEmployeesSuccess,
		data,
	} = useGetEmployeesQuery(
		{
			searchTerm: '',
			isEmployed: 'true',
			orderByField: '',
			orderDirection: '',
			employeesPerPage: '',
			currentPage: '',
		},
		{
			pollingInterval: 60000,
			refetchOnFocus: true,
			refetchOnReconnect: true,
		}
	);
	const [createProject, { isSuccess: isCreateSuccess }] = useCreateProjectMutation();

	const addProject = async (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		const employees = selectedEmployees.map(({ partTime, employee }) => ({
			partTime,
			employeeId: employee.id,
		}));
		await createProject({
			name,
			description,
			startDate,
			endDate,
			projectType,
			hourlyRate: Number(hourlyRate),
			projectValueBAM: Number(projectValueBAM),
			salesChannel,
			projectStatus,
			employees,
		});
	};

	useEffect(() => {
		if (isCreateSuccess) closeAddProjectSideDrawer();
	}, [isCreateSuccess]);

	useEffect(() => {
		if (data) {
			setSelectedEmployees(
				selectedEmployees.filter(({ employee: selectedEmployee }) =>
					data.employees.some((employee: Employee) => employee.id === selectedEmployee.id)
				)
			);
			setOpenPartTimeMenus(
				openPartTimeMenus.filter(employeeId => data.employees.some((employee: Employee) => employee.id === employeeId))
			);
		}
	}, [data]);

	const children = (
		<motion.div
			initial={{ opacity: 0, x: '100%' }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.4, ease: 'easeInOut' }}
			className='fixed right-0 top-0 z-20 flex min-h-full w-[496px] flex-col bg-frosty-mint px-6 pt-[27px]'
		>
			<header className='flex flex-col gap-[13px]'>
				<div className='flex cursor-pointer items-center gap-[3px]' onClick={closeAddProjectSideDrawer}>
					<img className='h-4 w-4' src={chevronLeft} alt='Back icon' />
					<span className='font-inter-semi-bold text-base font-semibold tracking-[-0.015em] text-evergreen'>Back</span>
				</div>
				<h2 className='rounded-lg bg-white px-6 py-4 font-gilroy-bold text-[21px] font-bold leading-6 text-midnight-grey'>
					Add New Project
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
						label='Name'
						htmlFor='name'
						id='name'
						name='name'
						placeholder='Project name'
						value={name}
						handleInput={name => setName(name)}
					/>
					<InputField
						containerClassName='gap-1'
						labelClassName='leading-[22px]'
						inputClassName='border-misty-moonstone px-4 py-2 text-sm leading-[22px] text-slate-mist focus:border-misty-moonstone'
						required
						type='text'
						label='Description'
						htmlFor='description'
						id='description'
						name='description'
						placeholder='Project description'
						value={description}
						handleInput={description => setDescription(description)}
					/>
					<InputField
						containerClassName='gap-1'
						labelClassName='leading-[22px]'
						inputContainerClassName='flex gap-2 w-full'
						inputClassName='border-misty-moonstone px-4 py-2 text-sm leading-[22px] text-slate-mist focus:border-misty-moonstone'
						required
						type='number'
						label='Hourly Rate'
						htmlFor='hourlyRate'
						id='hourlyRate'
						name='hourlyRate'
						min={0}
						step={0.01}
						placeholder='Enter the amount'
						value={hourlyRate}
						handleInput={hourlyRate => setHourlyRate(hourlyRate)}
					/>
					<InputField
						containerClassName='gap-1'
						labelClassName='leading-[22px]'
						inputContainerClassName='flex gap-2 w-full'
						inputClassName='border-misty-moonstone px-4 py-2 text-sm leading-[22px] text-slate-mist focus:border-misty-moonstone'
						required
						type='number'
						label='Project Value (BAM)'
						htmlFor='projectValueBAM'
						id='projectValueBAM'
						name='projectValueBAM'
						min={0}
						step={0.01}
						placeholder='Enter the amount in BAM'
						value={projectValueBAM}
						handleInput={projectValueBAM => setProjectValueBAM(projectValueBAM)}
					/>
					<DateInputs
						startDate={startDate}
						endDate={endDate}
						handleStartDateInput={startDate => setStartDate(startDate)}
						handleEndDateInput={endDate => setEndDate(endDate)}
					/>
					<div className='flex flex-col gap-1'>
						<span className='font-gilroy-medium text-base font-medium leading-[22px] text-midnight-grey'>
							Assign developers
						</span>
						<div className='relative rounded-md border border-misty-moonstone px-4 py-2 focus:outline-none'>
							<div
								className='flex cursor-pointer items-center justify-between'
								onClick={() => setIsEmployeesMenuOpen(!isEmployeesMenuOpen)}
							>
								<span className='font-gilroy-regular text-sm font-normal leading-[22px] text-slate-mist'>
									Select team members working on this project
								</span>
								<img
									className={`transition ${isEmployeesMenuOpen ? 'rotate-180' : ''}`}
									src={chevronDown}
									alt='Down icon'
								/>
							</div>
							{isEmployeesMenuOpen && (
								<div className='absolute left-0 top-10 z-20 flex max-h-[128px] w-[400px] flex-col overflow-y-scroll rounded-md border border-t-0 border-misty-moonstone bg-white py-2 scrollbar-thin scrollbar-track-ashen-grey scrollbar-thumb-misty-moonstone scrollbar-track-rounded-full scrollbar-thumb-rounded-full'>
									{isLoading || isFetching ? (
										<LoadingSpinner size={50} />
									) : (
										isEmployeesSuccess &&
										data.employees.map((employee: Employee, index: number) => (
											<div key={employee.id} className='flex items-center gap-2 px-4 py-1'>
												<input
													className='h-[15px] w-[15px] appearance-none rounded-sm border-2 border-slate-mist text-evergreen focus:ring-transparent'
													type='checkbox'
													id={`employee${index + 1}`}
													name={`employee${index + 1}`}
													checked={selectedEmployees.some(
														selectedEmployee => selectedEmployee.employee.id === employee.id
													)}
													onChange={event => {
														setSelectedEmployees(
															event.target.checked
																? [...selectedEmployees, { partTime: false, employee }]
																: selectedEmployees.filter(
																		selectedEmployee => selectedEmployee.employee.id !== employee.id
																  )
														);
														setOpenPartTimeMenus(
															!event.target.checked
																? openPartTimeMenus.filter(employeeId => employeeId !== employee.id)
																: openPartTimeMenus
														);
													}}
												/>
												<label
													className='font-gilroy-regular text-sm font-normal text-slate-mist'
													htmlFor='administration'
												>
													{employee.firstName + ' ' + employee.lastName}
												</label>
											</div>
										))
									)}
								</div>
							)}
						</div>
						{!isEmployeesMenuOpen && selectedEmployees.length > 0 && (
							<div className='flex max-h-[154px] flex-col overflow-y-scroll p-4 scrollbar-thin scrollbar-track-ashen-grey scrollbar-thumb-misty-moonstone scrollbar-track-rounded-full scrollbar-thumb-rounded-full'>
								{selectedEmployees.map(({ partTime, employee }, index: number) => (
									<div
										key={employee.id}
										className={`flex items-center justify-between gap-2 ${
											index < selectedEmployees.length - 1 ? 'border-b border-ashen-grey pb-3' : ''
										} ${index > 0 ? 'pt-3' : ''}`}
									>
										<span className='font-gilroy-regular text-sm font-normal leading-[22px] text-inky-twilight'>
											{employee.firstName + ' ' + employee.lastName}
										</span>
										<div className='flex items-center gap-[10px]'>
											<div className='relative min-w-[90px] rounded-md border border-misty-moonstone px-2 py-1 focus:outline-none'>
												<div
													className='flex cursor-pointer items-center justify-between gap-2'
													onClick={() =>
														setOpenPartTimeMenus(
															openPartTimeMenus.includes(employee.id)
																? openPartTimeMenus.filter(employeeId => employeeId !== employee.id)
																: [...openPartTimeMenus, employee.id]
														)
													}
												>
													{openPartTimeMenus.includes(employee.id) && (
														<div className='flex items-center gap-2'>
															<div
																className='rounded-md px-2 font-gilroy-regular text-xs font-normal text-evergreen hover:bg-misty-moonstone'
																onClick={() => {
																	setOpenPartTimeMenus(
																		openPartTimeMenus.filter(employeeId => employeeId !== employee.id)
																	);
																	setSelectedEmployees(
																		selectedEmployees.map(selectedEmployee =>
																			selectedEmployee.employee.id === employee.id
																				? { partTime: false, employee }
																				: selectedEmployee
																		)
																	);
																}}
															>
																Full time
															</div>
															<div
																className='rounded-md px-2 font-gilroy-regular text-xs font-normal text-evergreen hover:bg-misty-moonstone'
																onClick={() => {
																	[...openPartTimeMenus, employee.id];
																	setSelectedEmployees(
																		selectedEmployees.map(selectedEmployee =>
																			selectedEmployee.employee.id === employee.id
																				? { partTime: true, employee }
																				: selectedEmployee
																		)
																	);
																}}
															>
																Part time
															</div>
														</div>
													)}
													<span className='font-gilroy-regular text-xs font-normal text-evergreen'>
														{!openPartTimeMenus.includes(employee.id) ? (!partTime ? 'Full time' : 'Part time') : ''}
													</span>
													<img
														className={`transition ${
															openPartTimeMenus.find(employeeId => employeeId === employee.id) ? 'rotate-180' : ''
														}`}
														src={chevronDown}
														alt='Down icon'
													/>
												</div>
											</div>
											<img
												className='transition hover:scale-125 hover:cursor-pointer'
												src={cancel}
												alt='Cancel icon'
												onClick={() => {
													setSelectedEmployees(
														selectedEmployees.filter(
															({ employee: selectedEmployee }) => selectedEmployee.id !== employee.id
														)
													);
													setOpenPartTimeMenus(openPartTimeMenus.filter(employeeId => employeeId !== employee.id));
												}}
											/>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
					<div className='flex flex-col gap-1'>
						<span className='font-gilroy-medium text-base font-medium leading-[22px] text-midnight-grey'>Status</span>
						<div className='relative rounded-md border border-misty-moonstone px-4 py-2 focus:outline-none'>
							<div
								className='flex cursor-pointer items-center justify-between'
								onClick={() => setIsProjectStatusMenuOpen(!isProjectStatusMenuOpen)}
							>
								<span className='font-gilroy-regular text-sm font-normal leading-[22px] text-slate-mist'>
									{projectStatus
										? getProjectColorAndStatus(projectStatus as ProjectStatus)?.status
										: 'Select project status'}
								</span>
								<img
									className={`transition ${isProjectStatusMenuOpen ? 'rotate-180' : ''}`}
									src={chevronDown}
									alt='Down icon'
								/>
							</div>
							{isProjectStatusMenuOpen && (
								<div className='absolute left-0 top-10 z-20 flex max-h-[128px] w-[400px] flex-col rounded-md border border-t-0 border-misty-moonstone bg-white py-2'>
									<div className='flex items-center gap-2 px-4 py-1'>
										<input
											className='h-[15px] w-[15px] appearance-none border-2 border-slate-mist text-evergreen focus:ring-transparent'
											type='radio'
											id='active'
											name='active'
											checked={projectStatus === 'Active'}
											onChange={event => {
												setProjectStatus(event.target.checked ? 'Active' : '');
												setIsProjectStatusMenuOpen(false);
											}}
										/>
										<label className='font-gilroy-regular text-sm font-normal text-slate-mist' htmlFor='active'>
											Active
										</label>
									</div>
									<div className='flex items-center gap-2 px-4 py-1'>
										<input
											className='h-[15px] w-[15px] appearance-none border-2 border-slate-mist text-evergreen focus:ring-transparent'
											type='radio'
											id='onHold'
											name='onHold'
											checked={projectStatus === 'OnHold'}
											onChange={event => {
												setProjectStatus(event.target.checked ? 'OnHold' : '');
												setIsProjectStatusMenuOpen(false);
											}}
										/>
										<label className='font-gilroy-regular text-sm font-normal text-slate-mist' htmlFor='fullstack'>
											On hold
										</label>
									</div>
									<div className='flex items-center gap-2 px-4 py-1'>
										<input
											className='h-[15px] w-[15px] appearance-none border-2 border-slate-mist text-evergreen  focus:ring-transparent'
											type='radio'
											id='inactive'
											name='inactive'
											checked={projectStatus === 'Inactive'}
											onChange={event => {
												setProjectStatus(event.target.checked ? 'Inactive' : '');
												setIsProjectStatusMenuOpen(false);
											}}
										/>
										<label className='font-gilroy-regular text-sm font-normal text-slate-mist' htmlFor='backend'>
											Inactive
										</label>
									</div>
									<div className='flex items-center gap-2 px-4 py-1'>
										<input
											className='h-[15px] w-[15px] appearance-none border-2 border-slate-mist text-evergreen focus:ring-transparent'
											type='radio'
											id='completed'
											name='completed'
											checked={projectStatus === 'Completed'}
											onChange={event => {
												setProjectStatus(event.target.checked ? 'Completed' : '');
												setIsProjectStatusMenuOpen(false);
											}}
										/>
										<label className='font-gilroy-regular text-sm font-normal text-slate-mist' htmlFor='frontend'>
											Completed
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
				secondButtonText='Add Project'
				handleFirstButtonClick={closeAddProjectSideDrawer}
				handleSecondButtonClick={addProject}
			/>
		</motion.div>
	);

	return <SideDrawer onClick={closeAddProjectSideDrawer}>{children}</SideDrawer>;
};

export default AddProject;
