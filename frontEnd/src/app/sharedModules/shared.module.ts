import { NgModule } from '@angular/core';
import { SalaryWithSuffixPipe } from './salary-with-suffix.pipe';

@NgModule({
  declarations: [SalaryWithSuffixPipe],
  exports: [SalaryWithSuffixPipe]
})
export class SharedModule {}