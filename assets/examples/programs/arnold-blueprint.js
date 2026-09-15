// assets/examples/programs/arnold-blueprint.js
// Arnold Blueprint to Mass — program + its 3 workout(s).
// Just fill in the fields below. Detail pages are generated automatically —
// no HTML files needed. Add this file's path to ../manifest.js to include it.

exampleProgram(({
    id: "arnold-blueprint",
    pageSlug: "arnold-blueprint-to-mass",
    title: "Arnold Blueprint to Mass",
    share: "https://kohlrabi.us/s/EfvB0Rt1",
    blurb: "An 8-week mass program, six days a week, Phase 1 (weeks 1–4) then Phase 2 (weeks 5–8).",
    schedule: "Six days a week for 8 weeks. Phase 1 (weeks 1–4) builds the base with high-volume pyramid sets; Phase 2 (weeks 5–8) pushes heavier. Most exercises run 5 × 30/12/10/8/6 pyramids with 45 seconds rest.",
    progression: "Increase the weight on the pyramid each week while keeping the rep targets. The short rests are part of the progression — don’t lengthen them to chase load.",
    attr: "Adapted from <a href=\"https://www.sixpacksmackdown.com/b/sixpacksmackdown/posts/arnold-blueprint-for-mass-day-1\" target=\"_blank\" rel=\"noopener\">Blueprint to Mass on SixPackSmackdown</a>."
  }));

// --- Workout 1: Arnold Blueprint to Mass — Chest & Back (Day 1) (workouts/arnold-blueprint-mass-day-1.html) ---
exampleWorkout(({
    program: "arnold-blueprint",
    title: "Arnold Blueprint to Mass — Chest & Back (Day 1)",
    slug: "arnold-blueprint-mass-day-1",
    share: "https://kohlrabi.us/s/M1C9hdME",
    desc: "Chest and back, built on 5 × 30/12/10/8/6 pyramid sets with 45 seconds rest.",
    tags: "strength upper",
    tagLabel: "Upper",
    exercises: [
      ["Flat barbell bench press", "5 × 30, 12, 10, 8, 6"],
      ["Low-angle incline barbell bench press", "5 × 30, 12, 10, 8, 6"],
      ["Dumbbell fly (superset)", "5 × 30, 12, 10, 8, 6"],
      ["Straight-arm dumbbell pullover (superset)", "5 × 30, 12, 10, 8, 6"],
      ["Wide-grip chin-up", "4 × 6+"],
      ["Bent-over barbell row (superset)", "5 × 30, 12, 10, 8, 6"],
      ["Bent-over two-dumbbell row (superset)", "5 × 30, 12, 10, 8, 6"],
      ["Hanging leg raise", "5 × 25"]
    ],
    attr: "Adapted from <a href=\"https://www.sixpacksmackdown.com/b/sixpacksmackdown/posts/arnold-blueprint-for-mass-day-1\" target=\"_blank\" rel=\"noopener\">Blueprint to Mass Day 1 on SixPackSmackdown</a>."
  }));

// --- Workout 2: Arnold Blueprint to Mass — Shoulders & Arms (Day 2) (workouts/arnold-blueprint-mass-day-2.html) ---
exampleWorkout(({
    program: "arnold-blueprint",
    title: "Arnold Blueprint to Mass — Shoulders & Arms (Day 2)",
    slug: "arnold-blueprint-mass-day-2",
    share: "https://kohlrabi.us/s/2xdRHMKX",
    desc: "Shoulders, arms, and abs, built on 5 × 30/12/10/8/6 pyramid sets with 45 seconds rest.",
    tags: "strength upper",
    tagLabel: "Upper",
    exercises: [
      ["Clean and press", "5 × 5"],
      ["Standing dumbbell press (superset)", "5 × 30, 12, 10, 8, 6"],
      ["Front dumbbell raise (superset)", "5 × 30, 12, 10, 8, 6"],
      ["Side lateral raise (superset)", "5 × 30, 12, 10, 8, 6"],
      ["Upright barbell row (superset)", "5 × 30, 12, 10, 8, 6"],
      ["Barbell curl", "5 × 30, 12, 10, 8, 6"],
      ["Incline dumbbell curl (superset)", "5 × 30, 12, 10, 8, 6"],
      ["Concentration curl (superset)", "5 × 30, 12, 10, 8, 6"],
      ["Close-grip bench press", "5 × 30, 12, 10, 8, 6"],
      ["Skull crusher (superset)", "5 × 30, 12, 10, 8, 6"],
      ["One-arm dumbbell triceps extension (superset)", "5 × 30, 12, 10, 8, 6"],
      ["Palms-up barbell wrist curl (superset)", "5 × 30, 12, 10, 8, 6"],
      ["Palms-down wrist curl (superset)", "5 × 30, 12, 10, 8, 6"],
      ["Decline sit-up", "5 × 25"]
    ],
    attr: "Adapted from <a href=\"https://www.sixpacksmackdown.com/b/sixpacksmackdown/posts/arnold-blueprint-to-mass-day-2\" target=\"_blank\" rel=\"noopener\">Blueprint to Mass Day 2 on SixPackSmackdown</a>."
  }));

// --- Workout 3: Arnold Blueprint to Mass — Legs (Day 3) (workouts/arnold-blueprint-mass-day-3.html) ---
exampleWorkout(({
    program: "arnold-blueprint",
    title: "Arnold Blueprint to Mass — Legs (Day 3)",
    slug: "arnold-blueprint-mass-day-3",
    share: "https://kohlrabi.us/s/F3q7ci0Q",
    desc: "Legs, built on 5 × 30/12/10/8/6 pyramid sets with 45 seconds rest.",
    tags: "strength lower",
    tagLabel: "Lower",
    exercises: [
      ["Barbell squat", "5 × 30, 12, 10, 8, 6"],
      ["Stiff-legged barbell deadlift", "5 × 30, 12, 10, 8, 6"],
      ["Good morning", "5 × 30, 12, 10, 8, 6"],
      ["Barbell lunge", "5 × 30, 12, 10, 8, 6"],
      ["Leg extension (superset)", "5 × 30, 12, 10, 8, 6"],
      ["Seated leg curl (superset)", "5 × 30, 12, 10, 8, 6"],
      ["Standing calf raise (superset)", "5 × 30, 12, 10, 8, 6"],
      ["Seated calf raise (superset)", "5 × 30, 12, 10, 8, 6"],
      ["Cable crunch", "5 × 25"]
    ],
    attr: "Adapted from <a href=\"https://www.sixpacksmackdown.com/b/sixpacksmackdown/posts/arnold-blueprint-to-mass-day-1\" target=\"_blank\" rel=\"noopener\">Blueprint to Mass on SixPackSmackdown</a> (Day 3 — legs, same pyramid scheme as Days 1–2)."
  }));
