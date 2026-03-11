# Swedbank Loan Application Wizard

A multi-step loan application wizard with a built-in payment calculator, built with vanilla HTML, CSS, and JavaScript.

## Setup

No build tools or dependencies required. Simply open `index.html` in a modern browser (Chrome or Firefox).

```bash
# Option 1: Open directly
open index.html

# Option 2: Use a local server (optional, for development)
npx serve .
# or
python3 -m http.server 8000
```

## Structure

| File              | Description                                  |
|-------------------|----------------------------------------------|
| `index.html`      | Application markup and layout                |
| `style.css`       | Swedbank-inspired styling                    |
| `app.js`          | Wizard navigation, validation, and UI logic  |
| `calculator.js`   | Pure function for annuity loan calculation    |

## Application Flow

1. **Intro** – Welcome screen with a start button
2. **Step 1** – Employment status selection (radio buttons)
3. **Step 2** – Income range, loan amount slider, period, interest rate, and live monthly payment calculation
4. **Step 3** – Consent checkboxes (Terms & Conditions required)
5. **Step 4** – Free-text additional information (min 10 characters)
6. **Summary** – Review all entered data before submission
7. **Confirmation** – Success screen (no data is actually sent)

## Loan Calculation

The monthly payment uses the standard annuity formula:

```
M = P × [r(1+r)^n] / [(1+r)^n – 1]
```

Where **P** = principal, **r** = monthly interest rate, **n** = number of months.

The calculation lives in `calculator.js` as a standalone pure function that can be tested or reused independently.
