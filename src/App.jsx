import React, { useEffect, useMemo, useState } from "react";

// --- Minimal UI primitives (Tailwind-based) ---
const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-2xl text-sm font-medium shadow-sm border transition hover:shadow ${
      active ? "bg-black text-white border-black" : "bg-white border-gray-200"
    }`}
  >
    {children}
  </button>
);

const Card = ({ title, actions, children }) => (
  <div className="bg-white rounded-2xl shadow p-5 border border-gray-100">
    <div className="flex items-center justify-between gap-4 mb-3">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="flex gap-2">{actions}</div>
    </div>
    <div>{children}</div>
  </div>
);

const Checkbox = ({ checked, onChange, label }) => (
  <label className="flex items-center gap-3 py-1 cursor-pointer">
    <input type="checkbox" className="w-5 h-5" checked={checked} onChange={onChange} />
    <span>{label}</span>
  </label>
);

const Pill = ({ children }) => (
  <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 border border-gray-200">{children}</span>
);

// --- Data: Weekly plan (egg-free, fish-free, cottage-cheese-free) ---
// Meals map to recipe slugs when available.
const WEEKLY_PLAN = [
  {
    day: "Day 1",
    items: [
      { meal: "Breakfast", name: "Greek yogurt bowl", recipe: "greek-yogurt-bowl" },
      { meal: "Snack", name: "Protein shake + banana", recipe: "protein-shake" },
      { meal: "Lunch", name: "Grilled chicken salad", recipe: "grilled-chicken-salad" },
      { meal: "Snack (pre-run)", name: "Rice cakes + PB + apple", recipe: "rice-cakes-pb" },
      { meal: "Dinner", name: "Turkey mince + sweet potato + broccoli", recipe: "turkey-sweet-potato-plate" },
    ],
  },
  {
    day: "Day 2",
    items: [
      { meal: "Breakfast", name: "Overnight oats (protein)", recipe: "overnight-oats-protein" },
      { meal: "Snack", name: "Edamame + cheese", recipe: "edamame-cheese" },
      { meal: "Lunch", name: "Turkey wrap + hummus", recipe: "turkey-wrap" },
      { meal: "Snack (post-run)", name: "Skyr + pineapple", recipe: "skyr-fruit" },
      { meal: "Dinner", name: "Beef stir fry + brown rice", recipe: "beef-stir-fry" },
    ],
  },
  {
    day: "Day 3",
    items: [
      { meal: "Breakfast", name: "Protein smoothie (greens)", recipe: "green-smoothie" },
      { meal: "Snack", name: "Nuts + mandarin", recipe: "nuts-fruit" },
      { meal: "Lunch", name: "Grilled chicken salad bowl", recipe: "grilled-chicken-salad" },
      { meal: "Snack (pre-run)", name: "Toast + almond butter + strawberries", recipe: "toast-almond-butter" },
      { meal: "Dinner", name: "Roast turkey thigh + quinoa + green beans", recipe: "roast-turkey-quinoa" },
    ],
  },
  {
    day: "Day 4",
    items: [
      { meal: "Breakfast", name: "Skyr + oats + blueberries", recipe: "skyr-oats" },
      { meal: "Snack", name: "Protein bar", recipe: "protein-bar" },
      { meal: "Lunch", name: "Lentil & chickpea soup", recipe: "lentil-chickpea-soup-deluxe" },
      { meal: "Snack (post-run)", name: "Banana + rice cakes + light cream cheese", recipe: "banana-rice-cakes-cream-cheese" },
      { meal: "Dinner", name: "Chicken breast + mash + roasted veg", recipe: "chicken-mash-veg" },
    ],
  },
  {
    day: "Day 5",
    items: [
      { meal: "Breakfast", name: "Protein pancakes + yogurt & berries", recipe: "protein-pancakes" },
      { meal: "Snack", name: "Turkey slices + carrots + hummus", recipe: "turkey-snack-hummus" },
      { meal: "Lunch", name: "Grilled chicken burrito bowl", recipe: "chicken-burrito-bowl" },
      { meal: "Snack (pre-run)", name: "Rice cake + PB + banana", recipe: "rice-cakes-pb" },
      { meal: "Dinner", name: "Lean beef chilli + rice", recipe: "beef-chilli" },
    ],
  },
  {
    day: "Day 6",
    items: [
      { meal: "Breakfast", name: "Chia pudding (protein)", recipe: "chia-pudding-protein" },
      { meal: "Snack", name: "Protein smoothie (mango-spinach)", recipe: "mango-smoothie" },
      { meal: "Lunch", name: "Turkey burger (no bun) + quinoa + roasted veg", recipe: "turkey-burger-plate" },
      { meal: "Snack (post-run)", name: "Greek yogurt + peach", recipe: "greek-yogurt-fruit" },
      { meal: "Dinner", name: "Grilled chicken + butternut + spinach", recipe: "chicken-butternut" },
    ],
  },
  {
    day: "Day 7",
    items: [
      { meal: "Breakfast", name: "Overnight oats (protein) + raspberries", recipe: "overnight-oats-protein" },
      { meal: "Snack", name: "Edamame + pumpkin seeds", recipe: "edamame-seeds" },
      { meal: "Lunch", name: "Chicken & quinoa salad", recipe: "chicken-quinoa-salad" },
      { meal: "Snack (pre-run)", name: "Rice cakes + nut butter + banana", recipe: "rice-cakes-pb" },
      { meal: "Dinner", name: "Lean steak + sweet potato mash + broccoli", recipe: "steak-sweetpotato" },
    ],
  },
];

// Shopping list grouped by category
const SHOPPING = {
  Proteins: [
    "Chicken breast/thigh – 1.4–1.6 kg",
    "Turkey breast slices – 400 g",
    "Turkey mince – 600 g",
    "Lean beef (mince/strips/steak) – 700 g",
    "Skyr or Greek yogurt (low-fat, plain) – ~1.6–1.8 kg",
    "Protein powder – ~200 g (7–8 scoops)",
    "Protein bars – 2",
    "Edamame beans – 400 g",
    "Light cream cheese or string cheese – 200 g",
    "Lentils (cooked/canned) – 250 g",
    "Chickpeas (cooked/canned) – 250 g",
  ],
  "Carbs & Grains": [
    "Oats – 300 g",
    "Quinoa (dry) – 400 g",
    "Brown rice (dry) – 500 g",
    "Sweet potatoes – 5 medium (~1 kg)",
    "Butternut squash – 1 medium (~600 g)",
    "White potatoes – 4 medium (~600 g)",
    "Whole wheat tortillas – 2–3",
    "Wholegrain bread – 6 slices",
    "Oatcakes – 4",
    "Rice cakes – 10",
    "Granola – 100 g",
    "Noodles (egg-free) – 100 g",
  ],
  "Fruits & Veggies": [
    "Bananas – 7–8",
    "Apples – 3–4",
    "Berries – 600 g",
    "Mango – 200 g",
    "Pineapple – 200 g",
    "Peaches – 2",
    "Mandarins – 2–3",
    "Spinach – 200 g",
    "Rocket/lettuce/mixed greens – 400 g",
    "Tomatoes – 6–7",
    "Cherry tomatoes – 200 g",
    "Cucumber – 2",
    "Green beans – 200 g",
    "Broccoli – 400 g",
    "Mixed stir-fry veg – 400 g",
    "Carrots – 2",
    "Avocados – 2",
  ],
  "Nuts, Seeds & Extras": [
    "Peanut or almond butter – 100 g",
    "Chia seeds – 60 g",
    "Flaxseed – 30 g",
    "Pumpkin seeds – 30 g",
    "Mixed nuts – 40 g",
  ],
  "Dairy & Alternatives": [
    "Almond milk (unsweetened) – 2–3 × 1L cartons",
  ],
  "Pantry / Condiments": [
    "Olive oil",
    "Balsamic vinegar",
    "Soy sauce",
    "Tomato passata/sauce – 400 g jar",
    "Light mayo – 1 jar",
    "Salsa – 1 jar",
    "Spices: chilli powder, cumin, paprika, cinnamon, salt, pepper",
    "Honey – 1–2 tbsp",
  ],
};

// Recipes (minimal set + full soup)
const RECIPES = {
  "greek-yogurt-bowl": {
    title: "Greek Yogurt Bowl",
    kcal: 320, protein: 25, servings: 1,
    ingredients: [
      "Greek yogurt (low-fat) – 200 g",
      "Mixed berries – 100 g",
      "Granola – 20 g",
      "Chia seeds – 1 tbsp",
    ],
    steps: [
      "Add yogurt to a bowl.",
      "Top with berries, granola, and chia seeds.",
    ],
  },
  "protein-shake": {
    title: "Protein Shake + Banana",
    kcal: 220, protein: 25, servings: 1,
    ingredients: [
      "Protein powder – 1 scoop",
      "Unsweetened almond milk – 250 ml",
      "Banana – 1 small",
    ],
    steps: ["Blend and serve cold."],
  },
  "grilled-chicken-salad": {
    title: "Grilled Chicken Salad",
    kcal: 400, protein: 40, servings: 1,
    ingredients: [
      "Chicken breast – 120 g, grilled & sliced",
      "Mixed leaves",
      "Cherry tomatoes, cucumber",
      "Avocado – 1/2",
      "Olive oil – 1 tbsp",
      "Balsamic vinegar",
    ],
    steps: [
      "Assemble leaves & veg.",
      "Top with chicken & avocado; dress with oil + balsamic.",
    ],
  },
  "rice-cakes-pb": {
    title: "Rice Cakes with Nut Butter",
    kcal: 200, protein: 6, servings: 1,
    ingredients: [
      "Rice cakes – 2",
      "Peanut/almond butter – 1 tbsp",
      "Fruit slices (apple/banana)",
    ],
    steps: ["Spread nut butter on rice cakes and top with fruit."],
  },
  "turkey-sweet-potato-plate": {
    title: "Turkey Mince Plate with Sweet Potato & Broccoli",
    kcal: 600, protein: 38, servings: 1,
    ingredients: [
      "Lean turkey mince – 150 g",
      "Sweet potato – 150 g, roasted",
      "Broccoli – steamed",
      "Tomato passata – 1/2 cup",
      "Garlic, paprika, salt, pepper",
    ],
    steps: [
      "Brown turkey with spices.",
      "Add passata; simmer 5–8 min.",
      "Serve with roasted sweet potato and broccoli.",
    ],
  },
  "overnight-oats-protein": {
    title: "Overnight Oats (Protein)",
    kcal: 350, protein: 28, servings: 1,
    ingredients: [
      "Oats – 40 g",
      "Protein powder – 1 scoop",
      "Chia/flax – 1 tbsp",
      "Unsweetened almond milk – 200 ml",
      "Fruit to top",
    ],
    steps: ["Mix all except fruit, chill overnight, top with fruit."],
  },
  "edamame-cheese": {
    title: "Edamame + Light Cheese",
    kcal: 170, protein: 17, servings: 1,
    ingredients: ["Edamame (shelled) – 100 g", "Light cheese – 1"],
    steps: ["Steam edamame; season lightly; serve with cheese."],
  },
  "turkey-wrap": {
    title: "Turkey Wrap with Hummus",
    kcal: 350, protein: 35, servings: 1,
    ingredients: [
      "Whole-wheat tortilla – 1",
      "Turkey breast slices – 100 g",
      "Hummus – 1–2 tbsp",
      "Lettuce, tomato",
    ],
    steps: ["Layer ingredients on tortilla, roll, and slice."],
  },
  "skyr-fruit": {
    title: "Skyr + Pineapple",
    kcal: 180, protein: 20, servings: 1,
    ingredients: ["Skyr – 150 g", "Pineapple chunks – 100–150 g"],
    steps: ["Combine in a bowl."],
  },
  "beef-stir-fry": {
    title: "Beef Stir-Fry + Brown Rice",
    kcal: 700, protein: 38, servings: 1,
    ingredients: [
      "Lean beef strips – 120 g",
      "Mixed stir-fry veg – 200 g",
      "Cooked brown rice – 100 g",
      "Soy sauce – 1 tbsp",
      "Sesame oil – 1 tsp",
    ],
    steps: ["Stir-fry beef, add veg and sauces, serve over rice."],
  },
  "green-smoothie": {
    title: "Protein Green Smoothie",
    kcal: 320, protein: 28, servings: 1,
    ingredients: [
      "Protein powder – 1 scoop",
      "Almond milk – 200 ml",
      "Banana – 1/2",
      "Spinach – 1 handful",
      "Nut butter – 1 tbsp",
    ],
    steps: ["Blend until smooth."],
  },
  "nuts-fruit": {
    title: "Nuts + Mandarin",
    kcal: 160, protein: 5, servings: 1,
    ingredients: ["Mixed nuts – 20 g", "Mandarin – 1"],
    steps: ["Snack as is."],
  },
  "toast-almond-butter": {
    title: "Toast + Almond Butter + Strawberries",
    kcal: 180, protein: 6, servings: 1,
    ingredients: [
      "Wholegrain bread – 1 slice",
      "Almond butter – 1 tbsp",
      "Strawberries – sliced",
    ],
    steps: ["Toast bread, spread almond butter, top with strawberries."],
  },
  "roast-turkey-quinoa": {
    title: "Roast Turkey Thigh + Quinoa + Green Beans",
    kcal: 700, protein: 42, servings: 1,
    ingredients: ["Roast turkey thigh – 150 g", "Cooked quinoa – 100 g", "Green beans – 150 g"],
    steps: ["Reheat turkey, steam beans, serve with quinoa."],
  },
  "skyr-oats": {
    title: "Skyr + Oats + Blueberries",
    kcal: 350, protein: 28, servings: 1,
    ingredients: ["Skyr – 200 g", "Dry oats – 40 g", "Blueberries – 80 g", "Honey – 1 tsp"],
    steps: ["Combine in a bowl."],
  },
  "protein-bar": {
    title: "Protein Bar",
    kcal: 200, protein: 20, servings: 1,
    ingredients: ["Any ~20 g protein bar"],
    steps: ["Unwrap and enjoy."],
  },
  "lentil-chickpea-soup-deluxe": {
    title: "Deluxe Lentil & Chickpea Soup (Umami-Rich)",
    kcal: 360, protein: 21, servings: 4,
    ingredients: [
      "Olive oil – 1 tbsp",
      "Onion – 1, diced",
      "Carrots – 2, diced",
      "Celery – 2 (optional)",
      "Garlic – 3 cloves, minced",
      "Anchovy paste – 1/2 tsp (or fish sauce 1 tsp)",
      "Red lentils – 150 g",
      "Chickpeas – 1 can (400 g)",
      "Chopped tomatoes – 1 can (400 g)",
      "Stock – 1 L",
      "Roasted red pepper – 1",
      "Smoked paprika – 1 tsp, cumin – 1 tsp",
      "Chilli flakes – pinch",
      "Soy sauce – 1 tsp",
      "Spinach – 80 g",
      "Lemon – 1/2",
    ],
    steps: [
      "Sauté veg in oil (5–7 min). Add garlic + anchovy; 1 min.",
      "Add spices, lentils, tomatoes, pepper, stock; simmer 20 min.",
      "Add chickpeas 5–7 min. Optional: blend half.",
      "Stir in spinach; finish with soy + lemon.",
    ],
  },
  "banana-rice-cakes-cream-cheese": {
    title: "Banana + Rice Cakes + Light Cream Cheese",
    kcal: 220, protein: 15, servings: 1,
    ingredients: ["Rice cakes – 2", "Light cream cheese – 2 tbsp", "Banana – 1"],
    steps: ["Spread cream cheese, top with banana slices."],
  },
  "chicken-mash-veg": {
    title: "Chicken Breast + Mash + Roasted Veg",
    kcal: 650, protein: 38, servings: 1,
    ingredients: ["Chicken breast – 150 g", "Potatoes – 150 g, mashed", "Roasted veg – 200 g"],
    steps: ["Roast/grill chicken, boil & mash potatoes, roast veg; plate up."],
  },
  "protein-pancakes": {
    title: "Protein Pancakes",
    kcal: 350, protein: 30, servings: 1,
    ingredients: [
      "Oat flour – 40 g",
      "Protein powder – 1 scoop",
      "Almond milk – 150–200 ml",
      "Greek yogurt – 2 tbsp (topping)",
      "Berries – 80 g",
    ],
    steps: ["Blend batter, cook small pancakes on non-stick pan, top with yogurt & berries."],
  },
  "turkey-snack-hummus": {
    title: "Turkey Slices + Carrots + Hummus",
    kcal: 200, protein: 20, servings: 1,
    ingredients: ["Turkey slices – 80 g", "Carrots – sticks", "Hummus – 2 tbsp"],
    steps: ["Serve turkey with carrots dipped in hummus."],
  },
  "chicken-burrito-bowl": {
    title: "Grilled Chicken Burrito Bowl",
    kcal: 550, protein: 40, servings: 1,
    ingredients: [
      "Chicken breast – 120 g, grilled",
      "Brown rice – 100 g cooked",
      "Black beans – 1/2 cup (120 g)",
      "Salsa – 2 tbsp",
      "Lettuce/mixed greens",
      "Avocado – 1/4 (optional)",
      "Lime, coriander (optional)",
    ],
    steps: [
      "Add warm rice to bowl.",
      "Top with chicken, beans, lettuce, salsa (and avocado).",
      "Season with lime/coriander.",
    ],
  },
  "beef-chilli": {
    title: "Lean Beef Chilli + Rice",
    kcal: 600, protein: 35, servings: 1,
    ingredients: [
      "Lean beef mince – 150 g",
      "Kidney/black beans – 1/2 cup",
      "Chopped tomatoes – 200 g",
      "Onion, garlic, chilli, cumin, paprika",
      "Cooked rice – 100 g",
    ],
    steps: ["Brown beef, add spices & tomatoes, simmer; serve with rice."],
  },
  "chia-pudding-protein": {
    title: "Chia Pudding (Protein)",
    kcal: 350, protein: 28, servings: 1,
    ingredients: [
      "Chia seeds – 3 tbsp",
      "Protein powder – 1 scoop",
      "Almond milk – 250 ml",
      "Raspberries – to top",
    ],
    steps: ["Mix chia + milk + protein, chill 4+ hrs, top with fruit."],
  },
  "mango-smoothie": {
    title: "Protein Smoothie (Mango-Spinach)",
    kcal: 200, protein: 25, servings: 1,
    ingredients: [
      "Protein powder – 1 scoop",
      "Almond milk – 200 ml",
      "Frozen mango – 150 g",
      "Spinach – handful",
    ],
    steps: ["Blend until smooth."],
  },
  "turkey-burger-plate": {
    title: "Turkey Burger (No Bun) + Quinoa + Roasted Veg",
    kcal: 400, protein: 40, servings: 1,
    ingredients: [
      "Turkey mince patty – 120 g",
      "Cooked quinoa – 100 g",
      "Roasted veg – 200 g",
    ],
    steps: ["Pan-sear patty, roast veg, serve with quinoa."],
  },
  "greek-yogurt-fruit": {
    title: "Greek Yogurt + Peach",
    kcal: 180, protein: 20, servings: 1,
    ingredients: ["Greek yogurt – 150 g", "Peach – 1, sliced"],
    steps: ["Combine in a bowl."],
  },
  "chicken-butternut": {
    title: "Grilled Chicken + Butternut + Spinach",
    kcal: 650, protein: 38, servings: 1,
    ingredients: ["Chicken breast – 150 g", "Roasted butternut – 200 g", "Spinach – sautéed"],
    steps: ["Grill chicken, roast butternut, wilt spinach; plate up."],
  },
  "edamame-seeds": {
    title: "Edamame + Pumpkin Seeds",
    kcal: 180, protein: 15, servings: 1,
    ingredients: ["Edamame – 100 g", "Pumpkin seeds – 1 tbsp"],
    steps: ["Steam edamame; sprinkle seeds."],
  },
  "chicken-quinoa-salad": {
    title: "Chicken & Quinoa Salad",
    kcal: 400, protein: 40, servings: 1,
    ingredients: [
      "Chicken breast – 120 g",
      "Cooked quinoa – 100 g",
      "Spinach, cucumber, tomato",
      "Olive oil – 1 tsp, lemon",
    ],
    steps: ["Mix quinoa with veg, top with sliced chicken, drizzle oil + lemon."],
  },
  "steak-sweetpotato": {
    title: "Lean Steak + Sweet Potato Mash + Broccoli",
    kcal: 650, protein: 38, servings: 1,
    ingredients: ["Lean steak – 120 g", "Sweet potato – 200 g, mashed", "Broccoli – 200 g"],
    steps: ["Pan-sear steak, mash sweet potato, steam broccoli."],
  },
};

// --- Utilities ---
const useLocalStorage = (key, initial) => {
  const [val, setVal] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {}
  }, [key, val]);
  return [val, setVal];
};

const downloadJSON = (filename, data) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

export default function RunnersMealPlanApp() {
  const [tab, setTab] = useState("plan");
  const [checked, setChecked] = useLocalStorage("shopping-checked-v1", {});

  const toggleItem = (cat, item) => {
    const key = `${cat}::${item}`;
    setChecked((s) => ({ ...s, [key]: !s[key] }));
  };

  const clearChecks = () => setChecked({});

  const exportAll = () => {
    downloadJSON("meal-plan-export.json", {
      plan: WEEKLY_PLAN,
      shopping: SHOPPING,
      recipes: RECIPES,
      checked,
    });
  };

  const ShoppingView = () => (
    <div className="space-y-6">
      {Object.entries(SHOPPING).map(([cat, items]) => (
        <Card key={cat} title={cat} actions={
          <button className="text-sm underline" onClick={() => items.forEach(i => toggleItem(cat, i))}>
            Toggle all
          </button>
        }>
          <div className="grid md:grid-cols-2 gap-2">
            {items.map((item) => {
              const key = `${cat}::${item}`;
              return (
                <Checkbox
                  key={key}
                  checked={!!checked[key]}
                  onChange={() => toggleItem(cat, item)}
                  label={item}
                />
              );
            })}
          </div>
        </Card>
      ))}
      <div className="flex gap-3">
        <button onClick={clearChecks} className="px-3 py-2 rounded-xl border">Clear checks</button>
        <button onClick={exportAll} className="px-3 py-2 rounded-xl border bg-black text-white">Export JSON</button>
        <button onClick={() => window.print()} className="px-3 py-2 rounded-xl border">Print</button>
      </div>
    </div>
  );

  const PlanView = () => (
    <div className="space-y-4">
      {WEEKLY_PLAN.map(({ day, items }) => (
        <Card key={day} title={day}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="py-2">Meal</th>
                  <th className="py-2">What</th>
                  <th className="py-2">Recipe</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="py-2 align-top whitespace-nowrap"><Pill>{it.meal}</Pill></td>
                    <td className="py-2 align-top">{it.name}</td>
                    <td className="py-2 align-top">
                      {it.recipe && RECIPES[it.recipe] ? (
                        <button
                          className="text-blue-600 underline"
                          onClick={() => setTab(`recipe:${it.recipe}`)}
                        >
                          View
                        </button>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ))}
    </div>
  );

  const RecipesIndex = () => (
    <div className="grid md:grid-cols-2 gap-4">
      {Object.entries(RECIPES).map(([slug, r]) => (
        <Card key={slug} title={r.title} actions={<Pill>{r.kcal} kcal • {r.protein}g protein</Pill>}>
          <div className="flex flex-wrap gap-2 mb-3 text-xs text-gray-500">
            <Pill>Servings: {r.servings}</Pill>
          </div>
          <div className="flex gap-3 mt-2">
            <button className="px-3 py-2 rounded-xl border" onClick={() => setTab(`recipe:${slug}`)}>Open</button>
            <button
              className="px-3 py-2 rounded-xl border"
              onClick={() => downloadJSON(`${slug}.json`, r)}
            >
              Export
            </button>
          </div>
        </Card>
      ))}
    </div>
  );

  const RecipeView = ({ slug }) => {
    const r = RECIPES[slug];
    if (!r) return <div className="text-gray-500">Recipe not found.</div>;
    return (
      <div className="space-y-4">
        <Card title={r.title} actions={<Pill>{r.kcal} kcal • {r.protein}g protein • Serves {r.servings}</Pill>}>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Ingredients</h4>
              <ul className="list-disc ml-5 space-y-1">
                {r.ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Steps</h4>
              <ol className="list-decimal ml-5 space-y-1">
                {r.steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button className="px-3 py-2 rounded-xl border" onClick={() => setTab("recipes")}>All recipes</button>
            <button className="px-3 py-2 rounded-xl border" onClick={() => window.print()}>Print</button>
          </div>
        </Card>
      </div>
    );
  };

  const PrepGuide = () => (
    <div className="space-y-4">
      <Card title="Sunday (Main Prep)" actions={<Pill>~1.5 hrs</Pill>}>
        <ul className="list-disc ml-5 space-y-1">
          <li>Cook 4–5 chicken breasts; slice for salads/wraps.</li>
          <li>Cook 400 g turkey mince (garlic, herbs, paprika).</li>
          <li>Cook 300 g beef mince into chilli; chill/freeze.</li>
          <li>Cook 300 g brown rice; 200 g quinoa.</li>
          <li>Roast 3–4 sweet potatoes (whole or chunks).</li>
          <li>Chop cucumber, tomatoes, carrots; wash berries.</li>
          <li>Make 3 jars overnight oats; portion nuts & seeds.</li>
        </ul>
      </Card>
      <Card title="Wednesday (Mini Prep)" actions={<Pill>~30 mins</Pill>}>
        <ul className="list-disc ml-5 space-y-1">
          <li>Cook 2 chicken breasts + 200 g turkey mince.</li>
          <li>Roast butternut + extra broccoli/peppers.</li>
          <li>Make 2 more jars overnight oats.</li>
        </ul>
      </Card>
      <Card title="Daily Quick Tasks" actions={<Pill>5–10 mins</Pill>}>
        <ul className="list-disc ml-5 space-y-1">
          <li>Breakfast: grab oats or make a smoothie.</li>
          <li>Lunch: assemble from prepped proteins & carbs.</li>
          <li>Snacks: edamame, yogurt, nuts (pre-portioned).</li>
          <li>Dinner: reheat protein + carb + veg or quick stir fry.</li>
        </ul>
      </Card>
      <Card title="Storage Tips">
        <ul className="list-disc ml-5 space-y-1">
          <li>Cooked chicken/turkey: fridge 3–4 days; freeze 2 months.</li>
          <li>Rice/quinoa: fridge 4 days.</li>
          <li>Roasted potatoes/squash: fridge 4 days (reheat in oven/air fryer).</li>
          <li>Overnight oats: fridge 3–4 days.</li>
          <li>Pre-chopped veg: up to 3 days (store crunchy veg in water).</li>
        </ul>
      </Card>
    </div>
  );

  const activeRecipeSlug = useMemo(() => (tab.startsWith("recipe:") ? tab.split(":")[1] : null), [tab]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Runner’s Weekly Meal Planner</h1>
          <p className="text-gray-600 mt-1">Meal plan • Shopping list • Prep guide • Recipes — all in one place.</p>
        </header>

        <div className="flex flex-wrap gap-2 mb-6">
          <TabButton active={tab === "plan"} onClick={() => setTab("plan")}>Meal Plan</TabButton>
          <TabButton active={tab === "shopping"} onClick={() => setTab("shopping")}>Shopping List</TabButton>
          <TabButton active={tab === "prep"} onClick={() => setTab("prep")}>Prep Guide</TabButton>
          <TabButton active={tab === "recipes"} onClick={() => setTab("recipes")}>Recipes</TabButton>
          {activeRecipeSlug && (
            <TabButton active onClick={() => setTab(`recipe:${activeRecipeSlug}`)}>Recipe: {RECIPES[activeRecipeSlug]?.title || "Open"}</TabButton>
          )}
        </div>

        <main className="space-y-6">
          {tab === "plan" && <PlanView />}
          {tab === "shopping" && <ShoppingView />}
          {tab === "prep" && <PrepGuide />}
          {tab === "recipes" && <RecipesIndex />}
          {activeRecipeSlug && <RecipeView slug={activeRecipeSlug} />}
        </main>

        <footer className="mt-10 flex flex-wrap gap-3">
          <button onClick={exportAll} className="px-4 py-2 rounded-2xl border bg-black text-white">Export All as JSON</button>
          <button onClick={() => window.print()} className="px-4 py-2 rounded-2xl border">Print This Page</button>
        </footer>
      </div>
    </div>
  );
}
