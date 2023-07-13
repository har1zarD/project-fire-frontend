import { EmployeeInfo, ExpensesInfo, ProjectsInfo } from "src/types";

import DataCard from "components/cards/DataCard";
import PlanCardItem from "features/home/PlanCardItem";

type Props = {
  selectedYear: string;
  projectsInfo: ProjectsInfo;
  employeesInfo: EmployeeInfo[];
  expensesInfo: ExpensesInfo[];
};

const Plan = ({ selectedYear, projectsInfo, employeesInfo, expensesInfo }: Props) => {
  const firstHeader = (
    <div className='flex items-center gap-[10px]'>
      <h2 className='font-gilroy-semi-bold text-lg font-semibold text-deep-forest'>
        Revenues & costs (per project) - per month
      </h2>
    </div>
  );
  const secondHeader = (
    <div className='flex items-center gap-[10px]'>
      <h2 className='font-gilroy-semi-bold text-lg font-semibold text-deep-forest'>Expenses</h2>
    </div>
  );
  return (
    <div className='flex flex-col gap-[30px]'>
      <DataCard className='rounded-[6px] border border-ashen-grey bg-white' header={firstHeader}>
        <div className='mt-[11px] flex flex-col gap-[5px]'>
          <PlanCardItem
            text='Development'
            amount={
              employeesInfo
                .reduce((total, employee) => total + employee.developmentCost, 0)
                .toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) + " KM"
            }
          />

          <PlanCardItem
            text='Design'
            amount={
              employeesInfo
                .reduce((total, employee) => total + employee.designCost, 0)
                .toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) + " KM"
            }
          />
          <PlanCardItem
            text='Other'
            amount={
              employeesInfo
                .reduce((total, employee) => total + employee.otherCost, 0)
                .toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) + " KM"
            }
          />
          <PlanCardItem
            text='Total revenue'
            amount={
              (
                employeesInfo.reduce((total, employee) => total + employee.totalCost, 0) + projectsInfo.totalValue
              ).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) + " KM"
            }
          />
          <PlanCardItem
            className='mx-[-20px] bg-winter-mint px-5 pb-[3px] pt-[6px]'
            text='NET PROFIT 2023'
            amount={
              (
                employeesInfo.reduce((total, employee) => total + employee.totalCost + employee.totalCost, 0) +
                projectsInfo.totalValue
              ).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) + " KM"
            }
            footer
          />
        </div>
      </DataCard>
      <DataCard className='rounded-[6px] border border-ashen-grey bg-white' header={secondHeader}>
        <div className='mt-[11px] flex flex-col gap-[5px]'>
          <PlanCardItem text='Direct' amount='as' />
          <PlanCardItem text='Indirect' amount='1,400,000.00 KM' />
          <PlanCardItem text='Marketing' amount='8,400,000.00 KM' />
          <PlanCardItem text='HR costs' amount='400,000.00 KM' />
          <PlanCardItem text='Office cost' amount='100,000.00 KM' />
          <PlanCardItem text='Sales costs' amount='50,000.00 KM' />
          <PlanCardItem text='Other costs' amount='800.00 KM' />
          <PlanCardItem
            className='mx-[-20px] bg-winter-mint px-5 pb-[3px] pt-[6px]'
            text='TOTAL EXPENSES'
            amount='91,800,000.00 KM'
            footer
          />
        </div>
      </DataCard>
    </div>
  );
};

export default Plan;
