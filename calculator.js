/**
 * Calculates monthly loan payment using the annuity formula.
 *
 * Formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
 * where P = principal, r = monthly interest rate, n = number of months.
 *
 * @param {number} principal - Loan amount in euros
 * @param {number} annualRate - Annual interest rate as percentage (e.g. 5.5)
 * @param {number} months - Loan period in months
 * @returns {number} Monthly payment rounded to 2 decimal places
 */
function calculateMonthlyPayment(principal, annualRate, months) {
  if (principal <= 0 || months <= 0) return 0;
  if (annualRate === 0) return Math.round((principal / months) * 100) / 100;

  const r = annualRate / 100 / 12;
  const factor = Math.pow(1 + r, months);
  const payment = principal * (r * factor) / (factor - 1);

  return Math.round(payment * 100) / 100;
}
