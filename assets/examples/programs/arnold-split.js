// assets/examples/programs/arnold-split.js
// Arnold Split - program + its 3 workout(s).
// Just fill in the fields below. Detail pages are generated automatically -
// no HTML files needed. Add this file's path to ../manifest.js to include it.

exampleProgram(({
    id: "arnold-split",
    pageSlug: "arnold-split",
    title: "Arnold Split",
    share: "https://kohlrabi.us/s/zRADOKzb",
    blurb: "The six-day double split: chest/back, shoulders/arms, legs/lower back - repeat, rest day 7, every muscle trained twice a week.",
    schedule: "Six training days: chest & back, shoulders & arms, legs & lower back - then repeat the rotation and rest on day 7. High volume throughout, around 3-4 sets per exercise.",
    progression: "Push each working set close to failure around 10 reps, then add weight when you can exceed the target across all sets. This is a volume program - progress comes from adding reps first, then load."
  }));

// --- Workout 1: Arnold Split - Chest & Back (Day 1) (workouts/arnold-split-chest-back.html) ---
exampleWorkout(({
    program: "arnold-split",
    title: "Arnold Split - Chest & Back (Day 1)",
    slug: "arnold-split-chest-back",
    share: "https://kohlrabi.us/s/RuWJF0Ai",
    desc: "Chest and back. Work to failure in the 6-12 rep range on each exercise.",
    tags: "strength upper",
    tagLabel: "Upper",
    exercises: [
      ["Bench press", "4 × 6-12"],
      ["Incline bench press", "3 × 6-12"],
      ["Dumbbell pullover", "3 × 6-12"],
      ["Chin-up", "3 × 6-12"],
      ["Bent-over row", "3 × 6-12"],
      ["Deadlift", "3 × 6-12"],
      ["Crunch", "5 × 6-12"]
    ],
    attr: "Adapted from <a href=\"https://www.muscleandstrength.com/workouts/arnold-schwarzenegger-volume-workout-routines\" target=\"_blank\" rel=\"noopener\">Arnold’s volume routines on Muscle & Strength</a>."
  }));

// --- Workout 2: Arnold Split - Shoulders & Arms (Day 2) (workouts/arnold-split-shoulders-arms.html) ---
exampleWorkout(({
    program: "arnold-split",
    title: "Arnold Split - Shoulders & Arms (Day 2)",
    slug: "arnold-split-shoulders-arms",
    share: "https://kohlrabi.us/s/WFgZMvKZ",
    desc: "Shoulders and arms. 4 × 10 on the clean and press, 3 × 10 on everything else.",
    tags: "strength upper",
    tagLabel: "Upper",
    exercises: [
      ["Clean and press", "4 × 10"],
      ["Dumbbell lateral raise", "3 × 10"],
      ["Upright barbell row", "3 × 10"],
      ["Standing military press", "3 × 10"],
      ["Wide-grip standing barbell curl", "3 × 10"],
      ["Seated dumbbell curl", "3 × 10"],
      ["Close-grip barbell bench press", "3 × 10"],
      ["Standing overhead barbell triceps extension", "3 × 10"],
      ["Palms-up barbell wrist curl", "3 × 10"],
      ["Palms-down wrist curl", "3 × 10"],
      ["Reverse crunch", "5 × 25"]
    ],
    attr: "Adapted from <a href=\"https://www.muscleandstrength.com/workouts/arnold-schwarzenegger-volume-workout-routines\" target=\"_blank\" rel=\"noopener\">Arnold’s volume routines on Muscle & Strength</a>."
  }));

// --- Workout 3: Arnold Split - Legs & Lower Back (Day 3) (workouts/arnold-split-legs-lower-back.html) ---
exampleWorkout(({
    program: "arnold-split",
    title: "Arnold Split - Legs & Lower Back (Day 3)",
    slug: "arnold-split-legs-lower-back",
    share: "https://kohlrabi.us/s/GmKIeT61",
    desc: "Legs and lower back. 4 × 10 on the squat, 3 × 10 on everything else.",
    tags: "strength lower",
    tagLabel: "Lower",
    exercises: [
      ["Barbell squat", "4 × 10"],
      ["Barbell lunge", "3 × 10"],
      ["Lying leg curl", "3 × 10"],
      ["Stiff-legged barbell deadlift", "3 × 10"],
      ["Good morning", "3 × 10"],
      ["Standing calf raise", "3 × 10"],
      ["Crunch", "5 × 25"]
    ],
    attr: "Adapted from <a href=\"https://www.muscleandstrength.com/workouts/arnold-schwarzenegger-volume-workout-routines\" target=\"_blank\" rel=\"noopener\">Arnold’s volume routines on Muscle & Strength</a>."
  }));
