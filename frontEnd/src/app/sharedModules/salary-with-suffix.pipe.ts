import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'salaryWithSuffix'
})
export class SalaryWithSuffixPipe implements PipeTransform {
  transform(salary: number): string {
    if (!salary) {
      return 'Salary not available'; 
    }

    const formattedSalary = (salary / 1000).toFixed(0);
    return `${formattedSalary}K`;
  }
}