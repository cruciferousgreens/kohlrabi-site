// assets/examples/programs/mentzer-heavy-duty.js
// Mentzer Heavy Duty - program + its 4 workout(s).
// Just fill in the fields below. Detail pages are generated automatically -
// no HTML files needed. Add this file's path to ../manifest.js to include it.

exampleProgram(({
    id: "mentzer-heavy-duty",
    pageSlug: "mentzer-heavy-duty",
    title: "Mentzer Heavy Duty",
    share: "https://kohlrabi.us/s/lVtKoCfB",
    blurb: "Four workouts separated by 96 hours (add rest as you get stronger), one set to failure per exercise.",
    schedule: "Four workouts, each separated by 96 hours of rest - add extra rest days as you get stronger and recovery demands grow. Every exercise is one all-out set to failure, often with intensifiers like forced reps.",
    progression: "Beat the logbook: more weight or more reps than last session, every session. When progress stalls, the answer is more rest between workouts, not more sets."
  }));

// --- Workout 1: Mentzer Heavy Duty - Chest & Back (Day 1) (workouts/mentzer-heavy-duty-day-1.html) ---
exampleWorkout(({
    program: "mentzer-heavy-duty",
    title: "Mentzer Heavy Duty - Chest & Back (Day 1)",
    slug: "mentzer-heavy-duty-day-1",
    share: "https://kohlrabi.us/s/8BqcgNMd",
    desc: "Chest and back. One all-out set to failure per exercise, 4 total working sets.",
    tags: "strength upper",
    tagLabel: "Upper",
    exercises: [
      ["Pec deck (to failure)", "1 × 6-12"],
      ["Incline press, superset (to failure)", "1 × 6-12"],
      ["Close-grip palms-up pulldown", "1 × 6-12"],
      ["Deadlift (near failure)", "1 × 6-12"]
    ],
    attr: "Adapted from <a href=\"https://mikementzer.org/mike-mentzers-ideal-routine-a-heavy-duty-blueprint/\" target=\"_blank\" rel=\"noopener\">Mentzer’s Ideal Routine on mikementzer.org</a>."
  }));

// --- Workout 2: Mentzer Heavy Duty - Legs (Day 2) (workouts/mentzer-heavy-duty-day-2.html) ---
exampleWorkout(({
    program: "mentzer-heavy-duty",
    title: "Mentzer Heavy Duty - Legs (Day 2)",
    slug: "mentzer-heavy-duty-day-2",
    share: "https://kohlrabi.us/s/zZWKJeaB",
    desc: "Legs. Pre-exhaust the quads with leg extensions supersetted into the leg press (or squat), then calves. 3 total working sets.",
    tags: "strength lower",
    tagLabel: "Lower",
    exercises: [
      ["Leg extension (superset)", "1 × 6-12"],
      ["Leg press (or squat)", "1 × 6-12"],
      ["Standing calf raise", "1 × 6-12"]
    ],
    attr: "Adapted from <a href=\"https://mikementzer.org/mike-mentzers-ideal-routine-a-heavy-duty-blueprint/\" target=\"_blank\" rel=\"noopener\">Mentzer’s Ideal Routine on mikementzer.org</a>."
  }));

// --- Workout 3: Mentzer Heavy Duty - Delts & Arms (Day 3) (workouts/mentzer-heavy-duty-day-3.html) ---
exampleWorkout(({
    program: "mentzer-heavy-duty",
    title: "Mentzer Heavy Duty - Delts & Arms (Day 3)",
    slug: "mentzer-heavy-duty-day-3",
    share: "https://kohlrabi.us/s/8nNFY5Ln",
    desc: "Delts and arms. Laterals and rear delts, then curls and a pressdown/dip superset. 5 total working sets, every one to failure.",
    tags: "strength upper",
    tagLabel: "Upper",
    exercises: [
      ["Dumbbell lateral raise", "1 × 6-12"],
      ["Rear delt raise", "1 × 6-12"],
      ["Barbell curl", "1 × 6-12"],
      ["Triceps pressdown (superset)", "1 × 6-12"],
      ["Dip (or negatives)", "1 × 6-12"]
    ],
    attr: "Adapted from <a href=\"https://mikementzer.org/mike-mentzers-ideal-routine-a-heavy-duty-blueprint/\" target=\"_blank\" rel=\"noopener\">Mentzer’s Ideal Routine on mikementzer.org</a>."
  }));

// --- Workout 4: Mentzer Heavy Duty - Legs, Advanced (Day 4) (workouts/mentzer-heavy-duty-day-4.html) ---
exampleWorkout(({
    program: "mentzer-heavy-duty",
    title: "Mentzer Heavy Duty - Legs, Advanced (Day 4)",
    slug: "mentzer-heavy-duty-day-4",
    share: "https://kohlrabi.us/s/ZQck5q6J",
    desc: "The advanced leg day. Leg extensions supersetted into squats, then calves. 3 total working sets.",
    tags: "strength lower",
    tagLabel: "Lower",
    exercises: [
      ["Leg extension (superset)", "1 × 6-12"],
      ["Squat", "1 × 6-12"],
      ["Standing calf raise", "1 × 6-12"]
    ],
    attr: "Adapted from <a href=\"https://mikementzer.org/mike-mentzers-ideal-routine-a-heavy-duty-blueprint/\" target=\"_blank\" rel=\"noopener\">Mentzer’s Ideal Routine on mikementzer.org</a>."
  }));
