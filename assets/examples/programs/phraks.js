// assets/examples/programs/phraks.js
// Phrak's Greyskull LP - program + its 2 workout(s).
// Just fill in the fields below. Detail pages are generated automatically -
// no HTML files needed. Add this file's path to ../manifest.js to include it.

exampleProgram(({
    id: "phraks",
    pageSlug: "phraks-greyskull-lp",
    title: "Phrak's Greyskull LP",
    share: "https://kohlrabi.us/s/W88Xdncu",
    blurb: "Two alternating full-body days (A and B), three days a week - add weight to each lift every session.",
    schedule: "Train three nonconsecutive days a week, alternating Day A and Day B. Each day is three compound lifts: 3 sets of 5, with the last set as many reps as possible.",
    progression: "Add 2.5 lb to upper-body lifts and 5 lb to lower-body lifts every session. When you stall on a lift, drop the weight 10% and build back up."
  }));

// --- Workout 1: r/Fitness Beginner Routine - A (workouts/phraks-gslp-a.html) ---
exampleWorkout(({
    program: "phraks",
    title: "r/Fitness Beginner Routine - A",
    slug: "phraks-gslp-a",
    share: "https://kohlrabi.us/s/HO1YOGXc",
    desc: "Barbell row, bench press, and squat. Three lifts, add a little weight every session.",
    tags: "strength beginner full-body",
    tagLabel: "Strength",
    exercises: [
      ["Barbell row", "3 × 5+"],
      ["Bench press", "3 × 5+"],
      ["Squat", "3 × 5+"]
    ],
    attr: "Adapted from <a href=\"https://thefitness.wiki/routines/r-fitness-basic-beginner-routine/\" target=\"_blank\" rel=\"noopener\">Phrak's Greyskull LP</a> on the Fitness Wiki."
  }));

// --- Workout 2: r/Fitness Beginner Routine - B (workouts/phraks-gslp-b.html) ---
exampleWorkout(({
    program: "phraks",
    title: "r/Fitness Beginner Routine - B",
    slug: "phraks-gslp-b",
    share: "https://kohlrabi.us/s/NAhhghuB",
    desc: "Chin-up, overhead press, and deadlift. Three lifts, add a little weight every session.",
    tags: "strength beginner full-body",
    tagLabel: "Strength",
    exercises: [
      ["Chin-up", "3 × 5+"],
      ["Overhead press", "3 × 5+"],
      ["Deadlift", "3 × 5+"]
    ],
    attr: "Adapted from <a href=\"https://thefitness.wiki/routines/r-fitness-basic-beginner-routine/\" target=\"_blank\" rel=\"noopener\">Phrak's Greyskull LP</a> on the Fitness Wiki."
  }));
