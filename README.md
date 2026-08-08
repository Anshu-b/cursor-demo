# Cursor modes demo — Bean Counter Café

A tiny static café ordering site for walking through **Ask**, **Debug**, **Plan**, and **Agent** mode in Cursor.

## Run it

```bash
# from this folder
python3 -m http.server 5173
```

Open [http://localhost:5173](http://localhost:5173).

Or open `index.html` directly in a browser.

## Tip selector

The cart includes a tip selector (**No tip / 15% / 20%**, default 15%). Tip is calculated on the pre-tax subtotal and updates the Tip line and Total before checkout.

## The intentional bug

Cart totals break once you add **two different drinks**.

- One item often looks fine
- Two items produce a nonsense subtotal (string concatenation), then tax/tip/total show `—`
- Checkout prints an error pointing at `calculateSubtotal()`

The bug lives in `app.js` inside `calculateSubtotal()`.

## Suggested demo script

### 1. Ask mode — explore without changing code

Prompts:

- “How does the cart total get calculated?”
- “Where is the menu filter implemented?”
- “What files make up this app?”

Use this to show read-only Q&A over the codebase.

### 2. Debug mode — reproduce and find the bug

1. Run the site and add two drinks.
2. Switch to Debug mode.
3. Prompt: “The cart total breaks after I add a second drink. Find and explain the bug.”

Expected finding: `calculateSubtotal()` concatenates strings instead of summing numbers.

### 3. Plan mode — design a small feature

Prompt (if tip is not yet built):

> “Plan adding a tip selector (0%, 15%, 20%) that updates the order total before checkout. Don’t implement yet.”

Or plan a follow-on:

> “Plan a custom tip amount field next to the preset percentages.”

Good for showing tradeoffs, file touch list, and UI placement before coding.

### 4. Agent mode — fix or build

Prompts:

- “Fix the cart total bug in `calculateSubtotal()`.”
- Or: “Implement the tip selector from the plan.” / “Add a custom tip amount field.”

## Project layout

```text
index.html   # page structure
styles.css   # layout + café styling
app.js       # menu, cart, totals (includes the demo bug)
```
