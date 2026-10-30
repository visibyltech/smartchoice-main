export function formatNaira(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₦0';
  }
  return '₦' + Math.round(amount).toLocaleString('en-NG');
}

export function generateRef(prefix: string = 'SC'): string {
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  const timePart = Date.now().toString().slice(-4);
  return `${prefix}-${timePart}${randomPart}`;
}

import { InstallmentScheduleItem } from '../types';

export function calculateSaveToBuy(
  productPrice: number,
  durationMonths: 1 | 2 | 3 | 4,
  frequency: 'weekly' | 'monthly' = 'monthly'
) {
  // Durations & exact interest rates:
  // 1 month: 3%
  // 2 months: 5%
  // 3 months: 7%
  // 4 months: 7%
  let interestRatePercent = 3;
  if (durationMonths === 1) interestRatePercent = 3;
  else if (durationMonths === 2) interestRatePercent = 5;
  else if (durationMonths === 3) interestRatePercent = 7;
  else if (durationMonths === 4) interestRatePercent = 7;

  const interestAmount = Math.round((productPrice * interestRatePercent) / 100);
  const totalPayable = productPrice + interestAmount;

  const totalInstallments = frequency === 'weekly' ? durationMonths * 4 : durationMonths;
  const installmentAmount = Math.ceil(totalPayable / totalInstallments);

  // Generate payment schedule dates
  const schedule: InstallmentScheduleItem[] = [];
  const now = new Date();
  const intervalDays = frequency === 'weekly' ? 7 : 30;

  for (let i = 1; i <= totalInstallments; i++) {
    const dueDate = new Date(now.getTime() + i * intervalDays * 24 * 60 * 60 * 1000);
    schedule.push({
      installmentNumber: i,
      dueDate: dueDate.toISOString().split('T')[0],
      amountDue: i === totalInstallments ? (totalPayable - installmentAmount * (totalInstallments - 1)) : installmentAmount,
      amountPaid: 0,
      status: (i === 1 ? 'due' : 'pending') as 'pending' | 'due' | 'paid' | 'overdue'
    });
  }

  return {
    interestRatePercent,
    interestAmount,
    totalPayable,
    totalInstallments,
    installmentAmount,
    schedule
  };
}
